"""
Prediction component for Flask application.
Handles prediction logic and result formatting.
"""

import numpy as np
import pickle
import math
from typing import Tuple
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.config import MODEL_FILE, PREDICTION_TEXT
from utils.helpers import format_prediction, prepare_features_for_prediction


class PredictionEngine:
    """
    Engine for making predictions using the trained model.
    """
    
    def __init__(self, model_path: str = MODEL_FILE):
        """
        Initialize the prediction engine and load the model.
        
        Args:
            model_path (str): Path to the saved model file
        """
        self.model = self._load_model(model_path)
        
    def _load_model(self, model_path: str):
        """
        Load the trained model from pickle file.
        
        Args:
            model_path (str): Path to the model file
            
        Returns:
            Loaded model object
        """
        try:
            with open(model_path, 'rb') as f:
                model = pickle.load(f)
            print(f"Model loaded successfully from: {model_path}")
            return model
        except FileNotFoundError:
            raise FileNotFoundError(f"Model file not found at: {model_path}")
        except Exception as e:
            raise Exception(f"Error loading model: {str(e)}")
    
    def predict(self, features: np.ndarray) -> float:
        """
        Make a prediction using the loaded model.
        
        Args:
            features (np.ndarray): Input features for prediction
            
        Returns:
            float: Predicted value
        """
        try:
            prediction = self.model.predict(features)
            return prediction[0]
        except Exception as e:
            raise Exception(f"Error making prediction: {str(e)}")
    
    def predict_from_form(self, form_data: list) -> Tuple[int, str]:
        """
        Make prediction from form input data.
        
        Args:
            form_data (list): List of form input values
            
        Returns:
            Tuple[int, str]: Predicted value and formatted message
        """
        try:
            # Prepare features
            features = prepare_features_for_prediction(form_data)
            
            # Make prediction
            raw_prediction = self.predict(features)
            
            # Format prediction
            formatted_prediction = format_prediction(raw_prediction)
            
            # Create message
            message = PREDICTION_TEXT.format(formatted_prediction)
            
            return formatted_prediction, message
            
        except Exception as e:
            raise Exception(f"Error processing form data: {str(e)}")


def create_prediction_engine(model_path: str = MODEL_FILE) -> PredictionEngine:
    """
    Factory function to create a PredictionEngine instance.
    
    Args:
        model_path (str): Path to the model file
        
    Returns:
        PredictionEngine: Initialized prediction engine
    """
    return PredictionEngine(model_path)


if __name__ == "__main__":
    # Test the prediction engine
    print("Testing prediction engine...")
    
    try:
        engine = create_prediction_engine()
        
        # Test with sample data
        test_data = [80, 1770000, 6000, 85]
        prediction, message = engine.predict_from_form(test_data)
        
        print(f"Prediction: {prediction}")
        print(f"Message: {message}")
        
    except Exception as e:
        print(f"Error: {str(e)}")
