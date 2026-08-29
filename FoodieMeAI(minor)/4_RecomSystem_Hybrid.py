import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split as surprise_split
import tkinter as tk
from tkinter import messagebox
from tkinter import ttk

# Step 1: Load Datasets
restaurant_data = pd.read_csv("BangaloreZomatoData_with_rest_id.csv")
user_data = pd.read_csv("UserOrdersData.csv")

# Preprocess Restaurant Data
restaurant_data['Cuisines'] = restaurant_data['Cuisines'].fillna('Unknown')
restaurant_data['KnownFor'] = restaurant_data['KnownFor'].fillna('Unknown')

# Combine relevant features for content-based filtering
restaurant_data['CombinedFeatures'] = restaurant_data['Cuisines'] + " " + restaurant_data['KnownFor']

# Vectorize features
vectorizer = TfidfVectorizer(stop_words='english')
feature_matrix = vectorizer.fit_transform(restaurant_data['CombinedFeatures'])

# Compute similarity matrix
similarity_matrix = cosine_similarity(feature_matrix)

# Function to shortlist restaurants
def get_similar_restaurants(rest_id, top_n=10):
    idx = restaurant_data[restaurant_data['rest_id'] == rest_id].index[0]
    similar_indices = similarity_matrix[idx].argsort()[::-1][1:top_n + 1]
    return restaurant_data.iloc[similar_indices]['rest_id'].tolist()

# Collaborative Filtering using Surprise
reader = Reader(rating_scale=(1, 5))
interaction_data = Dataset.load_from_df(user_data[['user_id', 'rest_id', 'rating']], reader)
trainset, testset = surprise_split(interaction_data, test_size=0.2, random_state=42)

# Train SVD model
svd_model = SVD()
svd_model.fit(trainset)

# Function to rank restaurants for a user
def rank_restaurants(user_id, shortlisted_restaurants):
    predictions = [svd_model.predict(user_id, rest_id) for rest_id in shortlisted_restaurants]
    ranked = sorted(predictions, key=lambda x: x.est, reverse=True)
    return [pred.iid for pred in ranked]

# Function to recommend restaurants
def recommend_restaurants(user_id, rest_id, top_n=5):
    shortlisted = get_similar_restaurants(rest_id, top_n)
    ranked = rank_restaurants(user_id, shortlisted)

    # Get restaurant details
    results = []
    for rest_id_rec in ranked:
        restaurant_info = restaurant_data[restaurant_data['rest_id'] == rest_id_rec]
        if not restaurant_info.empty:
            restaurant_name = restaurant_info['Name'].iloc[0]
            price = restaurant_info['AverageCost'].iloc[0]
            cuisines = restaurant_info['Cuisines'].iloc[0]
            results.append({'rest_id': rest_id_rec, 'RestaurantName': restaurant_name, 'price': price, 'cuisines': cuisines })
        else:
            results.append({'rest_id': rest_id_rec, 'RestaurantName': 'Not found', 'price': 'Not found', 'cuisines': 'Not found'})

    # Convert to DataFrame
    return pd.DataFrame(results)

# Tkinter App
def show_past_orders():
    try:
        user_id = user_id_entry.get()

        # Validate input
        if not user_id:
            messagebox.showerror("Input Error", "Please enter User ID")
            return

        # Display past orders for the user
        past_orders = user_data[user_data['user_id'] == user_id]
        if not past_orders.empty:
            past_orders_text = f"Past orders for user {user_id}:\n"
            for index, row in past_orders.iterrows():
                restaurant_info = restaurant_data[restaurant_data['rest_id'] == row['rest_id']]
                if not restaurant_info.empty:
                    cuisine = restaurant_info['Cuisines'].iloc[0]
                    past_orders_text += f"- Restaurant ID: {row['rest_id']}, Cuisine: {cuisine}\n"
                else:
                    past_orders_text += f"- Restaurant ID: {row['rest_id']}, Cuisine information not found.\n"
            past_orders_label.config(text=past_orders_text)
        else:
            past_orders_label.config(text=f"No past orders found for user {user_id}")

    except Exception as e:
        messagebox.showerror("Error", str(e))

def show_recommendations():
    try:
        user_id = user_id_entry.get()
        rest_id = rest_id_entry.get()

        # Validate input
        if not user_id or not rest_id:
            messagebox.showerror("Input Error", "Please enter both User ID and Restaurant ID")
            return

        recommendations_df = recommend_restaurants(user_id, rest_id)
        
        # Display recommendations in the Treeview
        for row in recommendations_df.itertuples():
            tree.insert("", "end", values=(row.RestaurantName, row.price, row.cuisines))
    except Exception as e:
        messagebox.showerror("Error", str(e))

# Create the main window
root = tk.Tk()
root.title("Restaurant Recommendation System HYBRID")

# User ID Entry
tk.Label(root, text="User ID:").grid(row=0, column=0, padx=10, pady=10)
user_id_entry = tk.Entry(root)
user_id_entry.grid(row=0, column=1, padx=10, pady=10)

# Button to show past orders
past_orders_button = tk.Button(root, text="Show Past Orders", command=show_past_orders)
past_orders_button.grid(row=1, column=0, columnspan=2, pady=10)

# Label to display past orders
past_orders_label = tk.Label(root, text="", justify="left")
past_orders_label.grid(row=2, column=0, columnspan=2, padx=10, pady=10)

# Restaurant ID Entry
tk.Label(root, text="Restaurant ID:").grid(row=3, column=0, padx=10, pady=10)
rest_id_entry = tk.Entry(root)
rest_id_entry.grid(row=3, column=1, padx=10, pady=10)

# Button to get recommendations
recommend_button = tk.Button(root, text="Get Recommendations", command=show_recommendations)
recommend_button.grid(row=4, column=0, columnspan=2, pady=10)

# Treeview to display recommendations
columns = ("Restaurant Name", "Price", "Cuisines")
tree = ttk.Treeview(root, columns=columns, show="headings")
tree.grid(row=5, column=0, columnspan=2, padx=10, pady=10)

# Define column headings
for col in columns:
    tree.heading(col, text=col)

# Run the Tkinter event loop
root.mainloop()
