import tkinter as tk
from tkinter import ttk, messagebox
import pandas as pd

# Load the dataset
data = pd.read_csv("BangaloreZomatoData.csv")

# Preprocess the data (convert columns to appropriate types)
data['AverageCost'] = pd.to_numeric(data['AverageCost'], errors='coerce').fillna(0)
data['isVegOnly'] = data['isVegOnly'].astype(int)
data['isIndoorSeating'] = data['isIndoorSeating'].astype(int)
data['isTakeaway'] = data['isTakeaway'].astype(int)
data['IsHomeDelivery'] = data['IsHomeDelivery'].astype(int)

# Function to recommend restaurants based on user preferences
def recommend_restaurants():
    budget = budget_entry.get()
    cuisine = cuisine_entry.get().strip()
    veg_only = veg_option.get()
    service_mode = service_mode_selection.get()

    if not budget.isdigit() or int(budget) <= 0:
        messagebox.showerror("Input Error", "Please enter a valid budget.")
        return
    if not cuisine:
        messagebox.showerror("Input Error", "Please enter a preferred cuisine.")
        return
    if service_mode not in ["Delivery", "Takeaway", "Indoor Seating"]:
        messagebox.showerror("Input Error", "Please select a valid service mode.")
        return

    budget = int(budget)
    veg_only = 1 if veg_only == "Yes" else 0

    # Filter data based on user inputs
    filtered_data = data[data['AverageCost'] <= budget]
    filtered_data = filtered_data[filtered_data['Cuisines'].str.contains(cuisine, case=False, na=False)]
    filtered_data = filtered_data[filtered_data['isVegOnly'] == veg_only]

    if service_mode == "Delivery":
        filtered_data = filtered_data[filtered_data['IsHomeDelivery'] == 1]
    elif service_mode == "Takeaway":
        filtered_data = filtered_data[filtered_data['isTakeaway'] == 1]
    elif service_mode == "Indoor Seating":
        filtered_data = filtered_data[filtered_data['isIndoorSeating'] == 1]

    # Display recommendations
    if filtered_data.empty:
        result_label.config(text="No recommendations found based on your preferences.")
        return

    result_text = "Recommended Restaurants:\n"
    for _, row in filtered_data.head(5).iterrows():
        result_text += (
            f"Restaurant: {row['Name']}\n"
            f"Cuisines: {row['Cuisines']}\n"
            f"Known For: {row['KnownFor']}\n"
            f"Cost for Two: {row['AverageCost']} INR\n"
            f"Service Mode: {service_mode}\n\n"
        )

    result_label.config(text=result_text.strip())

# Tkinter UI Setup
root = tk.Tk()
root.title("Knowledge-Based Restaurant Recommendation System")

# Input Fields
tk.Label(root, text="Enter Your Budget (INR):").grid(row=0, column=0, padx=10, pady=10, sticky="w")
budget_entry = tk.Entry(root, width=20)
budget_entry.grid(row=0, column=1, padx=10, pady=10, sticky="w")

tk.Label(root, text="Enter Preferred Cuisine:").grid(row=1, column=0, padx=10, pady=10, sticky="w")
cuisine_entry = tk.Entry(root, width=50)
cuisine_entry.grid(row=1, column=1, padx=10, pady=10, sticky="w")

tk.Label(root, text="Vegetarian Only?").grid(row=2, column=0, padx=10, pady=10, sticky="w")
veg_option = ttk.Combobox(root, values=["Yes", "No"], state="readonly")
veg_option.grid(row=2, column=1, padx=10, pady=10, sticky="w")

tk.Label(root, text="Select Service Mode:").grid(row=3, column=0, padx=10, pady=10, sticky="w")
service_mode_selection = ttk.Combobox(root, values=["Delivery", "Takeaway", "Indoor Seating"], state="readonly")
service_mode_selection.grid(row=3, column=1, padx=10, pady=10, sticky="w")

# Submit Button
submit_button = tk.Button(root, text="Recommend", command=recommend_restaurants)
submit_button.grid(row=4, column=0, columnspan=2, pady=10)

# Results Section
result_label = tk.Label(root, text="", justify="left", anchor="w", wraplength=500)
result_label.grid(row=5, column=0, columnspan=2, padx=10, pady=10)

# Run the application
root.mainloop()
