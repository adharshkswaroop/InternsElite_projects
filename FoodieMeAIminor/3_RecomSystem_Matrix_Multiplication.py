# -*- coding: utf-8 -*-
"""
Created on Sun Jan  5 18:52:23 2025

@author: anjuv
"""

# -*- coding: utf-8 -*-
"""
Created on Sun Jan  5 18:47:08 2025

@author: anjuv
"""

import pandas as pd
from sklearn.decomposition import TruncatedSVD
import numpy as np
import tkinter as tk
from tkinter import ttk, messagebox

# Load data
usersorder_df = pd.read_excel(r"USER AND RESTRAUNT.xlsx")  # Contains columns: user_id, rest_id, cost, rating, location
restaurants_df = pd.read_csv(r"BangaloreZomatoData_with_rest_id.csv")

# Function to get previous ratings by a user
def get_previous_ratings(user_id):
    user_ratings = usersorder_df[usersorder_df['user_id'] == user_id]
    return user_ratings.sort_values(by='rating', ascending=False)

# Merge the two dataframes on 'rest_id'
merged_df = pd.merge(usersorder_df, restaurants_df, on='rest_id')
user_rest_matrix = merged_df.pivot_table(index='user_id', columns='rest_id', values='rating', fill_value=0)

# Apply Singular Value Decomposition (SVD) to decompose the matrix
svd = TruncatedSVD(n_components=20, random_state=42)
matrix_svd = svd.fit_transform(user_rest_matrix)
matrix_svd_reconstructed = np.dot(matrix_svd, svd.components_)

# Function to recommend top N restaurants for a specific user
def recommend_restaurants(user_id, num_recommendations=5):
    if user_id not in user_rest_matrix.index:
        raise ValueError(f"User ID {user_id} not found.")
    user_idx = user_rest_matrix.index.get_loc(user_id)
    predicted_ratings = matrix_svd_reconstructed[user_idx]
    recommended_idx = np.argsort(predicted_ratings)[::-1][:num_recommendations]
    recommended_restaurants = restaurants_df.iloc[recommended_idx]
    return recommended_restaurants[['Name', 'Cuisines', 'AverageCost']]

# GUI App
def fetch_data():
    user_id = user_id_entry.get().strip()
    if not user_id:
        messagebox.showerror("Error", "Please enter a User ID.")
        return

    try:
        # Display previous ratings
        prev_ratings = get_previous_ratings(user_id)
        prev_ratings_text.set("")
        if prev_ratings.empty:
            prev_ratings_text.set("No previous ratings found.")
        else:
            prev_text = "\n".join(
                f"{row['Name']} | Rating: {row['rating']} | Price: {row['cost']} | Cuisines: {row['Cuisines']}"
                for _, row in prev_ratings.iterrows()
            )
            prev_ratings_text.set(prev_text)

        # Display recommendations
        recommendations = recommend_restaurants(user_id)
        rec_table.delete(*rec_table.get_children())
        for _, row in recommendations.iterrows():
            rec_table.insert("", tk.END, values=(row['Name'], row['Cuisines'], row['AverageCost']))
    except ValueError as e:
        messagebox.showerror("Error", str(e))
    except Exception as e:
        messagebox.showerror("Error", f"An unexpected error occurred: {e}")

# Tkinter App Design
app = tk.Tk()
app.title("Restaurant Recommendation System MATRIX")
app.geometry("800x600")

# User Input Section
user_id_label = tk.Label(app, text="Enter User ID:")
user_id_label.pack(pady=10)
user_id_entry = tk.Entry(app, width=30)
user_id_entry.pack(pady=5)

fetch_button = tk.Button(app, text="Get Recommendations", command=fetch_data)
fetch_button.pack(pady=10)

# Previous Ratings Section
prev_ratings_label = tk.Label(app, text="Previously Rated Restaurants:")
prev_ratings_label.pack(pady=10)

prev_ratings_text = tk.StringVar()
prev_ratings_display = tk.Label(app, textvariable=prev_ratings_text, justify="left", anchor="w")
prev_ratings_display.pack(pady=5, fill="x")

# Recommendations Table
rec_table_label = tk.Label(app, text="Recommended Restaurants:")
rec_table_label.pack(pady=10)

rec_table = ttk.Treeview(app, columns=("Name", "Cuisines", "AverageCost"), show="headings", height=10)
rec_table.heading("Name", text="Restaurant Name")
rec_table.heading("Cuisines", text="Cuisines")
rec_table.heading("AverageCost", text="Average Cost")
rec_table.pack(pady=10, fill="both", expand=True)

# Run the App
app.mainloop()
