import tkinter as tk
from tkinter import ttk, messagebox
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load the data
data = pd.read_csv("BangaloreZomatoData.csv")

def filter_data(data, budget, mode):
    # Filter data within budget
    filtered_data = data[data['AverageCost'] <= budget]

    # Remove rows where the relevant column contains "-"
    if mode == "Delivery":
        filtered_data = filtered_data[filtered_data['Delivery Ratings'] != "-"]
        filtered_data = filtered_data.dropna(subset=['Delivery Ratings'])
    else:
        filtered_data = filtered_data[filtered_data['Dinner Ratings'] != "-"]
        filtered_data = filtered_data.dropna(subset=['Dinner Ratings'])

    return filtered_data

# Function to recommend restaurants
def recommend_restaurants():
    preferences = preferences_entry.get()
    budget = budget_entry.get()
    mode = mode_selection.get()
    location = location_entry.get().lower()  # Get user input for location

    if not preferences or not budget.isdigit() or int(budget) <= 0:
        messagebox.showerror("Input Error", "Please enter valid preferences and budget.")
        return
    if mode not in ["Delivery", "Dinner"]:
        messagebox.showerror("Input Error", "Please select a valid mode of service.")
        return

    if not location:
        messagebox.showerror("Input Error", "Please enter a location.")
        return
    
    budget = int(budget)

    # Filter data
    filtered_data = filter_data(data, budget, mode)

    # Add a content column for similarity calculation
    filtered_data['Content'] = (
        filtered_data['Cuisines'] + ' ' + filtered_data['PopularDishes'].fillna('')
    )
    
    vectorizer = CountVectorizer(stop_words='english')
    content_matrix = vectorizer.fit_transform(filtered_data['Content'])

    # Calculate content similarity scores
    user_vector = vectorizer.transform([preferences])
    similarity_scores = cosine_similarity(user_vector, content_matrix).flatten()

    # Add content similarity scores to the data
    filtered_data['ContentSimilarity'] = similarity_scores

    # Calculate location similarity using cosine similarity on the "Area" column
    area_vectorizer = CountVectorizer(stop_words='english')
    area_matrix = area_vectorizer.fit_transform(filtered_data['Area'].fillna(''))
    location_vector = area_vectorizer.transform([location])
    location_similarity_scores = cosine_similarity(location_vector, area_matrix).flatten()

    # Add location similarity scores to the data
    filtered_data['LocationSimilarity'] = location_similarity_scores

    # Select the rating column based on the mode of service
    if mode == "Delivery":
        rating_column = "Delivery Ratings"        
    else:
        rating_column = "Dinner Ratings"

    # Sort by content similarity and then by location similarity and the selected rating
    top_matches = (
        filtered_data.sort_values(by=['LocationSimilarity','ContentSimilarity',  rating_column], 
                                  ascending=False)
        .head(5)
    )

    # Display results
    results = ""
    for _, row in top_matches.iterrows():
        results += (
            f"Restaurant: {row['Name']}\n"
            f"Area: {row['Area']}\n"
            f"Cuisines: {row['Cuisines']}\n"
            f"Popular Dishes: {row['PopularDishes']}\n"
            f"Cost for Two: {row['AverageCost']} INR\n"
            f"{mode} Rating: {row[rating_column]}\n\n"
        )

    result_label.config(text=results.strip())

# Tkinter UI Setup
root = tk.Tk()
root.title("Restaurant Recommendation System")

# User Input Fields
tk.Label(root, text="Enter Your Preferences (e.g., Italian, Pizza):").grid(
    row=0, column=0, padx=10, pady=10, sticky="w"
)
preferences_entry = tk.Entry(root, width=50)
preferences_entry.grid(row=0, column=1, padx=10, pady=10)

tk.Label(root, text="Enter Your Budget (INR):").grid(
    row=1, column=0, padx=10, pady=10, sticky="w"
)
budget_entry = tk.Entry(root, width=20)
budget_entry.grid(row=1, column=1, padx=10, pady=10)

tk.Label(root, text="Select Mode of Service:").grid(
    row=2, column=0, padx=10, pady=10, sticky="w"
)
mode_selection = ttk.Combobox(root, values=["Delivery", "Dinner"], state="readonly")
mode_selection.grid(row=2, column=1, padx=10, pady=10)

tk.Label(root, text="Enter Location:").grid(
    row=3, column=0, padx=10, pady=10, sticky="w"
)
location_entry = tk.Entry(root, width=50)
location_entry.grid(row=3, column=1, padx=10, pady=10)

# Submit Button
submit_button = tk.Button(root, text="Recommend", command=recommend_restaurants)
submit_button.grid(row=4, column=0, columnspan=2, pady=10)

# Results Section
result_label = tk.Label(root, text="", justify="left", anchor="w", wraplength=500)
result_label.grid(row=5, column=0, columnspan=2, padx=10, pady=10)

# Run the application
root.mainloop()
