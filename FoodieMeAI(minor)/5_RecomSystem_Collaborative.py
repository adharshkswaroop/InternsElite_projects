import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import tkinter as tk
from tkinter import messagebox
from tkinter import ttk

# Load the data (replace with your actual file paths or database queries)
usersorder_df = pd.read_excel(r"USER AND RESTRAUNT.xlsx")  # Contains columns: user_id, rest_id, cost, rating, location
restaurants_df = pd.read_csv(r"BangaloreZomatoData_with_rest_id.csv")

def get_previous_ratings(user_id, usersorder_df):
    # Filter restaurants rated by the user
    user_ratings = usersorder_df[usersorder_df['user_id'] == user_id]
    
    # Sort by rating in descending order
    user_rated_restaurants = user_ratings.sort_values(by='rating', ascending=False)
    
    return user_rated_restaurants

def recommend_restaurants(user_id, user_item_matrix, user_similarity_df, top_n=5):
    # Find similar users
    similar_users = user_similarity_df[user_id].sort_values(ascending=False).index[1:]  # Exclude the user itself
    
    # Get the ratings of similar users
    similar_users_ratings = user_item_matrix.loc[similar_users]
    
    # Weighted average of ratings (based on user similarity)
    weighted_ratings = similar_users_ratings.T.dot(user_similarity_df[user_id].loc[similar_users])
    weighted_ratings = weighted_ratings / user_similarity_df[user_id].loc[similar_users].sum()
    
    # Get restaurants the target user has not rated
    user_rated_restaurants = user_item_matrix.loc[user_id][user_item_matrix.loc[user_id] > 0].index
    recommendations = weighted_ratings.drop(user_rated_restaurants)
    
    # Return the top N recommendations
    return recommendations.sort_values(ascending=False).head(top_n)

def show_user_ratings():
    user_id = user_id_entry.get()
    if user_id in user_item_matrix.index:
        previous_ratings = get_previous_ratings(user_id, usersorder_df)
        
        # Clear previous table content
        for row in rated_tree.get_children():
            rated_tree.delete(row)
        
        for _, row in previous_ratings.iterrows():
            rated_tree.insert("", "end", values=(row['Name'], row['rating'], row['cost'], row['Cuisines']))
        
        # Get recommendations for the user
        recommendations = recommend_restaurants(user_id, user_item_matrix, user_similarity_df, top_n=5)
        
        # Clear previous recommendations table content
        for row in recommended_tree.get_children():
            recommended_tree.delete(row)
        
        for restaurant_name, score in recommendations.items():
            restaurant_details = usersorder_df[usersorder_df['Name'] == restaurant_name].iloc[0]
            recommended_tree.insert("", "end", values=(restaurant_name, restaurant_details['cost'], restaurant_details['Cuisines'], restaurant_details['rating']))
    else:
        messagebox.showerror("Error", f"User ID {user_id} not found.")

# Create a user-item matrix (rows: users, columns: restaurants, values: ratings)
user_item_matrix = usersorder_df.pivot_table(index='user_id', columns='Name', values='rating')
user_item_matrix = user_item_matrix.fillna(0)

# Compute the similarity between users (cosine similarity)
user_similarity = cosine_similarity(user_item_matrix)
user_similarity_df = pd.DataFrame(user_similarity, index=user_item_matrix.index, columns=user_item_matrix.index)

# Tkinter UI
root = tk.Tk()
root.title("Restaurant Recommendation System Collaborative")

# User ID input
user_id_label = tk.Label(root, text="Enter User ID:")
user_id_label.pack(pady=5)

user_id_entry = tk.Entry(root)
user_id_entry.pack(pady=5)

# Show button
show_button = tk.Button(root, text="Show Recommendations", command=show_user_ratings)
show_button.pack(pady=10)

# Frame for rated restaurants
rated_frame = tk.LabelFrame(root, text="Previously Rated Restaurants", padx=10, pady=10)
rated_frame.pack(padx=10, pady=5, fill="both", expand=True)

rated_tree = ttk.Treeview(rated_frame, columns=("Restaurant", "Rating", "Cost", "Cuisines"), show="headings")
rated_tree.heading("Restaurant", text="Restaurant")
rated_tree.heading("Rating", text="Rating")
rated_tree.heading("Cost", text="Cost")
rated_tree.heading("Cuisines", text="Cuisines")
rated_tree.pack(fill="both", expand=True)

# Frame for recommended restaurants
recommended_frame = tk.LabelFrame(root, text="Recommended Restaurants", padx=10, pady=10)
recommended_frame.pack(padx=10, pady=5, fill="both", expand=True)

recommended_tree = ttk.Treeview(recommended_frame, columns=("Restaurant", "Cost", "Cuisines", "Rating"), show="headings")
recommended_tree.heading("Restaurant", text="Restaurant")
recommended_tree.heading("Cost", text="Cost")
recommended_tree.heading("Cuisines", text="Cuisines")
recommended_tree.heading("Rating", text="Rating")
recommended_tree.pack(fill="both", expand=True)

root.mainloop()
