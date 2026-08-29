"""
Data loading and preprocessing module.
Handles all data operations including loading, cleaning, and splitting.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from typing import Tuple
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.config import DATA_FILE, FEATURE_COLUMNS, TARGET_COLUMN, TEST_SIZE, RANDOM_STATE


def load_data(file_path: str = DATA_FILE) -> pd.DataFrame:
    """
    Load the Uber ride dataset from CSV file.
    
    Args:
        file_path (str): Path to the CSV file
        
    Returns:
        pd.DataFrame: Loaded dataframe
        
    Raises:
        FileNotFoundError: If the data file doesn't exist
        pd.errors.EmptyDataError: If the file is empty
    """
    try:
        data = pd.read_csv(file_path)
        print(f"Data loaded successfully with shape: {data.shape}")
        return data
    except FileNotFoundError:
        raise FileNotFoundError(f"Data file not found at: {file_path}")
    except pd.errors.EmptyDataError:
        raise pd.errors.EmptyDataError("The data file is empty")


def get_feature_target_split(data: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
    """
    Split data into features (X) and target (y).
    
    Args:
        data (pd.DataFrame): Input dataframe
        
    Returns:
        Tuple[np.ndarray, np.ndarray]: Feature matrix and target vector
    """
    X = data.iloc[:, :-1].values
    y = data.iloc[:, -1].values
    
    print(f"Features shape: {X.shape}")
    print(f"Target shape: {y.shape}")
    
    return X, y


def split_train_test(X: np.ndarray, y: np.ndarray, 
                     test_size: float = TEST_SIZE, 
                     random_state: int = RANDOM_STATE) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Split data into training and testing sets.
    
    Args:
        X (np.ndarray): Feature matrix
        y (np.ndarray): Target vector
        test_size (float): Proportion of dataset to include in test split
        random_state (int): Random state for reproducibility
        
    Returns:
        Tuple: X_train, X_test, y_train, y_test
    """
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )
    
    print(f"Training set size: {X_train.shape[0]}")
    print(f"Testing set size: {X_test.shape[0]}")
    
    return X_train, X_test, y_train, y_test


def prepare_data() -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Complete data preparation pipeline.
    Loads data, extracts features/target, and splits into train/test.
    
    Returns:
        Tuple: X_train, X_test, y_train, y_test
    """
    # Load data
    data = load_data()
    
    # Extract features and target
    X, y = get_feature_target_split(data)
    
    # Split into train and test
    X_train, X_test, y_train, y_test = split_train_test(X, y)
    
    return X_train, X_test, y_train, y_test


def get_data_summary(data: pd.DataFrame) -> dict:
    """
    Get summary statistics of the dataset.
    
    Args:
        data (pd.DataFrame): Input dataframe
        
    Returns:
        dict: Summary statistics
    """
    summary = {
        "shape": data.shape,
        "columns": list(data.columns),
        "dtypes": data.dtypes.to_dict(),
        "null_counts": data.isnull().sum().to_dict(),
        "statistics": data.describe().to_dict()
    }
    
    return summary


if __name__ == "__main__":
    # Test the data loading functions
    print("Testing data loading module...")
    X_train, X_test, y_train, y_test = prepare_data()
    print("\nData preparation completed successfully!")
