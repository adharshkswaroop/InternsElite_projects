# FoodieMe Frontend

FoodieMe is an AI-powered leftover recipe generator, nutrition validator, and restaurant intelligence workspace.

## Features and Workflow

These images indicate the features and workflow pipeline of the project:

1. **Recipe Generator:** Add pantry ingredients, choose dietary constraints, and generate a tailored meal.
2. **Restaurant Intelligence:** Set a cuisine, neighbourhood, occasion, and budget to explore restaurant recommendations.
3. **USDA Nutrition Analyzer:** Inspect ingredient quantities, verify macronutrients, and review dietary compatibility badges.

### Workflow Screens

<img src="./assets/Screenshot 2026-08-28 233127.png" alt="Recipe Generator workflow" width="820" style="display:block; margin:16px auto; max-width:100%; height:auto;" />

<img src="./assets/Screenshot 2026-08-28 233203.png" alt="Restaurant Intelligence workflow" width="820" style="display:block; margin:16px auto; max-width:100%; height:auto;" />

<img src="./assets/Screenshot 2026-08-28 233413.png" alt="USDA Nutrition Analyzer workflow" width="820" style="display:block; margin:16px auto; max-width:100%; height:auto;" />

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# Restaurant Recommendation System

This repository contains a set of code files for building a **Restaurant Recommendation System** using multiple techniques, including **Content-Based Filtering**, **Collaborative Filtering**, and **Hybrid Models**. The system provides personalized restaurant recommendations based on user preferences and historical data.

## Dataset Link:

https://www.kaggle.com/datasets/vora1011/zomato-bangalore-restaurants-2022/

## Repository Structure

1. **Code Files:**
   - `1_RecomSystem_knowledge_based.py`: Implements knowledge-based recommendation logic.
   - `2_RecomSystem_Content_User_Entry.py`: Allows user input for content-based recommendations.
   - `2_RecomSystem_Restaurant_Content.py`: Implements content-based filtering using restaurant features.
   - `3_Matrix_Multiplication.ipynb`: Jupyter notebook for matrix multiplication operations.
   - `3_RecomSystem_Matrix_Multiplication.py`: Python script for matrix multiplication.
   - `4_Hybrid_Recommendation_model.ipynb`: Jupyter notebook for building a hybrid recommendation model.
   - `4_RecomSystem_Hybrid.py`: Python script for hybrid recommendation logic.
   - `5_Collaborative_Filtering.ipynb`: Jupyter notebook for collaborative filtering model.
   - `5_RecomSystem_Collaborative.py`: Python script for collaborative filtering model.
   
2. **Data Files:**
   - `BangaloreZomatoData.csv`: Raw data for restaurants in Bangalore.
   - `BangaloreZomatoData_with_rest_id.csv`: Processed data with restaurant IDs.
   - `UserOrdersData.csv`: Data for user orders and ratings.
   - `USER AND RESTRAUNT.xlsx`: Additional data for user and restaurant interactions.

3. **README.md**: This file.

## Features

- **Knowledge-Based Filtering**:  A knowledge-based recommender system (KBRS) is a decision support system that uses explicit knowledge about items, users, and recommendations to help users find relevant items. 
- **Content-Based Filtering**: Recommends restaurants based on their features like cuisines and what they are known for.
- **Collaborative Filtering**: Uses user-item interactions to recommend restaurants based on user ratings.
- **Hybrid Model**: Combines both content-based and collaborative filtering techniques for better recommendations.
- **Matrix Multiplication Based**: The Matrix Multiplication-Based Restaurant Recommendation System helps users find suitable restaurants based on their preferences.

## Technologies Used

- **Python**: Programming language used for the implementation.
- **Pandas**: For data manipulation and processing.
- **Scikit-learn**: For machine learning models like cosine similarity and SVD.
- **Surprise**: For collaborative filtering using the SVD algorithm.
- **Tkinter**: For building the graphical user interface (GUI).
- **Jupyter Notebooks**: For matrix multiplication and hybrid recommendation model development.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/prateekmaj21/Restaurant-Recommendation-System.git
   ```
2. Install the required libraries:

   ```bash
   pip install -r requirements.txt
   ```
3. Run the Tkinter app to interact with the recommendation system.

## Future Improvements:
- Integrating additional recommendation algorithms.
- Adding more user interaction features.
- Expanding the dataset to include more restaurants and user interactions.
