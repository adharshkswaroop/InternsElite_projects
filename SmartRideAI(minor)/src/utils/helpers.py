"""
Helper utility functions for the Uber Ride Prediction application.
"""

import math
import numpy as np
from typing import Union


def format_prediction(prediction: float) -> int:
    """
    Format the prediction result by flooring to the nearest integer.
    
    Args:
        prediction (float): Raw prediction value
        
    Returns:
        int: Formatted prediction value
    """
    return math.floor(prediction)


def validate_input(input_data: list) -> bool:
    """
    Validate input data for prediction.
    
    Args:
        input_data (list): List of input values
        
    Returns:
        bool: True if valid, False otherwise
    """
    try:
        # Check if all values can be converted to numbers
        [float(x) for x in input_data]
        
        # Check if we have the correct number of features
        if len(input_data) != 4:
            return False
            
        return True
    except (ValueError, TypeError):
        return False


def prepare_features_for_prediction(input_values: list) -> np.ndarray:
    """
    Prepare input features for model prediction.
    
    Args:
        input_values (list): List of input values from form
        
    Returns:
        np.ndarray: Formatted feature array for prediction
    """
    int_features = [int(x) for x in input_values]
    final_features = np.array([int_features])
    return final_features


def format_number_with_comma(number: Union[int, float]) -> str:
    """
    Format a number with comma separators.
    
    Args:
        number (Union[int, float]): Number to format
        
    Returns:
        str: Formatted number string
    """
    return f"{number:,}"


def calculate_percentage_change(old_value: float, new_value: float) -> float:
    """
    Calculate percentage change between two values.
    
    Args:
        old_value (float): Original value
        new_value (float): New value
        
    Returns:
        float: Percentage change
    """
    if old_value == 0:
        return 0.0
    return ((new_value - old_value) / old_value) * 100


if __name__ == "__main__":
    # Test helper functions
    print("Testing helper functions...")
    
    # Test format_prediction
    test_pred = 123456.789
    print(f"Formatted prediction: {format_prediction(test_pred)}")
    
    # Test validate_input
    valid_input = [80, 1770000, 6000, 85]
    invalid_input = [80, 1770000, 6000]
    print(f"Valid input test: {validate_input(valid_input)}")
    print(f"Invalid input test: {validate_input(invalid_input)}")
    
    # Test prepare_features
    features = prepare_features_for_prediction(valid_input)
    print(f"Prepared features: {features}")
