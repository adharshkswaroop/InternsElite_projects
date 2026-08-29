import tkinter as tk
from tkinter import ttk, messagebox
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load the dataset
data = pd.read_csv("BangaloreZomatoData.csv")

# Preprocess the data
def preprocess_data(data):
    data['Content'] = (
        data['Cuisines'].fillna('') + " " +
        data['PopularDishes'].fillna('') + " " +
        data['KnownFor'].fillna('')
    )
    return data

data = preprocess_data(data)

# Build the TF-IDF matrix
vectorizer = TfidfVectorizer(stop_words='english')
content_matrix = vectorizer.fit_transform(data['Content'])

# Function to recommend restaurants
def recommend_restaurants():
    restaurant_name = preferences_entry.get().strip()
    budget = budget_entry.get()
    mode = mode_selection.get()

    if not restaurant_name:
        messagebox.showerror("Input Error", "Please enter a restaurant name or preferences.")
        return
    if not budget.isdigit() or int(budget) <= 0:
        messagebox.showerror("Input Error", "Please enter a valid budget.")
        return
    if mode not in ["Delivery", "Dinner"]:
        messagebox.showerror("Input Error", "Please select a valid mode of service.")
        return

    budget = int(budget)

    # Check if the restaurant exists in the dataset
    if restaurant_name not in data['Name'].values:
        messagebox.showerror("Input Error", f"'{restaurant_name}' not found in the dataset.")
        return

    # Filter data within budget
    filtered_data = data[data['AverageCost'] <= budget]
    if mode == "Delivery":
        filtered_data = filtered_data[filtered_data['Delivery Ratings'] != "-"]
    else:
        filtered_data = filtered_data[filtered_data['Dinner Ratings'] != "-"]

    # Get the vector of the input restaurant
    input_index = data[data['Name'] == restaurant_name].index[0]
    input_vector = content_matrix[input_index]

    # Calculate similarity scores
    similarity_scores = cosine_similarity(input_vector, content_matrix).flatten()
    filtered_data['Similarity'] = similarity_scores[filtered_data.index]

    # Sort by similarity and ratings
    rating_column = "Delivery Ratings" if mode == "Delivery" else "Dinner Ratings"
    filtered_data = filtered_data.sort_values(
        by=['Similarity', rating_column, 'AverageCost'],
        ascending=[False, False, True]
    ).head(5)

    # Display recommendations
    if filtered_data.empty:
        result_label.config(text="No recommendations found.")
        return

    result_text = "Top 5 Similar Restaurants:\n"
    for _, row in filtered_data.iterrows():
        result_text += (
            f"Restaurant: {row['Name']}\n"
            f"Cuisines: {row['Cuisines']}\n"
            f"Popular Dishes: {row['PopularDishes']}\n"
            f"Known For: {row['KnownFor']}\n"
            f"Cost for Two: {row['AverageCost']} INR\n"
            f"{mode} Rating: {row[rating_column]}\n\n"
        )

    result_label.config(text=result_text.strip())

# Tkinter UI Setup
root = tk.Tk()
root.title("Content-Based Restaurant Recommendation System")

# Input Fields
tk.Label(root, text="Enter Restaurant Name:").grid(row=0, column=0, padx=10, pady=10, sticky="w")
preferences_entry = tk.Entry(root, width=50)
preferences_entry.grid(row=0, column=1, padx=10, pady=10, sticky="w")

tk.Label(root, text="Enter Your Budget (INR):").grid(row=1, column=0, padx=10, pady=10, sticky="w")
budget_entry = tk.Entry(root, width=20)
budget_entry.grid(row=1, column=1, padx=10, pady=10, sticky="w")

tk.Label(root, text="Select Mode of Service:").grid(row=2, column=0, padx=10, pady=10, sticky="w")
mode_selection = ttk.Combobox(root, values=["Delivery", "Dinner"], state="readonly")
mode_selection.grid(row=2, column=1, padx=10, pady=10, sticky="w")

# Submit Button
submit_button = tk.Button(root, text="Recommend", command=recommend_restaurants)
submit_button.grid(row=3, column=0, columnspan=2, pady=10)

# Results Section
result_label = tk.Label(root, text="", justify="left", anchor="w", wraplength=500)
result_label.grid(row=4, column=0, columnspan=2, padx=10, pady=10)

# Run the application
root.mainloop()
