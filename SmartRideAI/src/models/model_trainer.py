"""
Model training and evaluation module.
Handles Linear Regression model training, evaluation, and persistence.
"""

import pickle
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from typing import Tuple, Dict
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.config import MODEL_FILE


class ModelTrainer:
    """
    Class for training and evaluating Linear Regression model.
    """
    
    def __init__(self):
        """Initialize the ModelTrainer with a Linear Regression model."""
        self.model = LinearRegression()
        self.is_trained = False
        
    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> None:
        """
        Train the Linear Regression model.
        
        Args:
            X_train (np.ndarray): Training features
            y_train (np.ndarray): Training target
        """
        print("Training Linear Regression model...")
        self.model.fit(X_train, y_train)
        self.is_trained = True
        print("Model training completed!")
        
    def evaluate(self, X_train: np.ndarray, y_train: np.ndarray,
                 X_test: np.ndarray, y_test: np.ndarray) -> Dict[str, float]:
        """
        Evaluate the trained model on both training and testing sets.
        
        Args:
            X_train (np.ndarray): Training features
            y_train (np.ndarray): Training target
            X_test (np.ndarray): Testing features
            y_test (np.ndarray): Testing target
            
        Returns:
            Dict[str, float]: Dictionary containing evaluation metrics
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before evaluation")
        
        # Training set evaluation
        train_score = self.model.score(X_train, y_train)
        y_train_pred = self.model.predict(X_train)
        train_rmse = np.sqrt(mean_squared_error(y_train, y_train_pred))
        train_mae = mean_absolute_error(y_train, y_train_pred)
        
        # Testing set evaluation
        test_score = self.model.score(X_test, y_test)
        y_test_pred = self.model.predict(X_test)
        test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred))
        test_mae = mean_absolute_error(y_test, y_test_pred)
        
        metrics = {
            "train_r2_score": train_score,
            "train_rmse": train_rmse,
            "train_mae": train_mae,
            "test_r2_score": test_score,
            "test_rmse": test_rmse,
            "test_mae": test_mae
        }
        
        print(f"\nModel Evaluation Results:")
        print(f"Train R² Score: {train_score:.4f}")
        print(f"Train RMSE: {train_rmse:.2f}")
        print(f"Train MAE: {train_mae:.2f}")
        print(f"Test R² Score: {test_score:.4f}")
        print(f"Test RMSE: {test_rmse:.2f}")
        print(f"Test MAE: {test_mae:.2f}")
        
        return metrics
        
    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Make predictions using the trained model.
        
        Args:
            X (np.ndarray): Features for prediction
            
        Returns:
            np.ndarray: Predicted values
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        return self.model.predict(X)
        
    def save_model(self, file_path: str = MODEL_FILE) -> None:
        """
        Save the trained model to a pickle file.
        
        Args:
            file_path (str): Path to save the model
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before saving")
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, 'wb') as f:
            pickle.dump(self.model, f)
        
        print(f"Model saved successfully at: {file_path}")
        
    def load_model(self, file_path: str = MODEL_FILE) -> None:
        """
        Load a trained model from a pickle file.
        
        Args:
            file_path (str): Path to the saved model
        """
        try:
            with open(file_path, 'rb') as f:
                self.model = pickle.load(f)
            self.is_trained = True
            print(f"Model loaded successfully from: {file_path}")
        except FileNotFoundError:
            raise FileNotFoundError(f"Model file not found at: {file_path}")
            
    def get_model_coefficients(self) -> Dict[str, any]:
        """
        Get the coefficients and intercept of the trained model.
        
        Returns:
            Dict[str, any]: Dictionary containing coefficients and intercept
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before getting coefficients")
        
        return {
            "coefficients": self.model.coef_,
            "intercept": self.model.intercept_
        }


def train_and_save_model(X_train: np.ndarray, y_train: np.ndarray,
                         X_test: np.ndarray, y_test: np.ndarray,
                         model_path: str = MODEL_FILE) -> ModelTrainer:
    """
    Complete pipeline to train, evaluate, and save the model.
    
    Args:
        X_train (np.ndarray): Training features
        y_train (np.ndarray): Training target
        X_test (np.ndarray): Testing features
        y_test (np.ndarray): Testing target
        model_path (str): Path to save the trained model
        
    Returns:
        ModelTrainer: Trained model trainer instance
    """
    trainer = ModelTrainer()
    
    # Train the model
    trainer.train(X_train, y_train)
    
    # Evaluate the model
    metrics = trainer.evaluate(X_train, y_train, X_test, y_test)
    
    # Save the model
    trainer.save_model(model_path)
    
    return trainer


if __name__ == "__main__":
    # Test the model training module
    from src.data.data_loader import prepare_data
    
    print("Testing model training module...")
    X_train, X_test, y_train, y_test = prepare_data()
    
    trainer = train_and_save_model(X_train, y_train, X_test, y_test)
    
    # Test prediction
    test_sample = np.array([[80, 1770000, 6000, 85]])
    prediction = trainer.predict(test_sample)
    print(f"\nTest Prediction: {prediction[0]:.2f}")
