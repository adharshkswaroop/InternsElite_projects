"""
Configuration settings for Uber Ride Prediction Application.
Contains all constants, file paths, and model parameters.
"""

import os

# Base directory paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")
STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")

# Data paths
DATA_FILE = os.path.join(DATA_DIR, "taxi.csv")
MODEL_FILE = os.path.join(MODEL_DIR, "taxi.pkl")

# Feature columns
FEATURE_COLUMNS = [
    "Priceperweek",
    "Population",
    "Monthlyincome",
    "Averageparkingpermonth"
]

# Target column
TARGET_COLUMN = "Numberofweeklyriders"

# Model parameters
TEST_SIZE = 0.3
RANDOM_STATE = 0

# Application settings
APP_HOST = "0.0.0.0"
APP_PORT = 8080
DEBUG = False

# Input field labels
INPUT_LABELS = {
    "Priceperweek": "Price per Week",
    "Population": "Population",
    "Monthlyincome": "Monthly Income",
    "Averageparkingpermonth": "Average Parking per Month"
}

# Prediction text template
PREDICTION_TEXT = "Number of Weekly Rides Should be {}"
