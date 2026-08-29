"""Trip-level feature engineering and model training for Uber fare prediction."""

from __future__ import annotations

from pathlib import Path
from typing import Dict, Iterable, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

REQUIRED_COLUMNS = {
    "pickup_datetime", "pickup_longitude", "pickup_latitude",
    "dropoff_longitude", "dropoff_latitude", "passenger_count", "fare_amount"
}
ALIASES = {
    "pickup_date": "pickup_datetime", "pickup_time": "pickup_datetime",
    "fare": "fare_amount", "price": "fare_amount",
    "pickup_lon": "pickup_longitude", "dropoff_lon": "dropoff_longitude",
    "pickup_lat": "pickup_latitude", "dropoff_lat": "dropoff_latitude",
    "passengers": "passenger_count",
}
FEATURE_COLUMNS = [
    "distance_km", "pickup_hour", "pickup_day_of_week", "passenger_count",
    "pickup_longitude", "pickup_latitude", "dropoff_longitude", "dropoff_latitude"
]


def normalize_columns(data: pd.DataFrame) -> pd.DataFrame:
    """Normalize common Uber CSV header variants to the pipeline contract."""
    normalized = data.copy()
    normalized.columns = [str(column).strip().lower() for column in normalized.columns]
    normalized = normalized.rename(columns={key: value for key, value in ALIASES.items()})
    missing = REQUIRED_COLUMNS - set(normalized.columns)
    if missing:
        raise ValueError("Missing columns: " + ", ".join(sorted(missing)))
    return normalized


def haversine_distance(
    pickup_latitude: Iterable[float], pickup_longitude: Iterable[float],
    dropoff_latitude: Iterable[float], dropoff_longitude: Iterable[float]
) -> np.ndarray:
    """Return great-circle distance in kilometres between pickup and dropoff."""
    earth_radius_km = 6371.0
    latitude_one, latitude_two = np.radians(pickup_latitude), np.radians(dropoff_latitude)
    delta_latitude = np.radians(np.asarray(dropoff_latitude) - np.asarray(pickup_latitude))
    delta_longitude = np.radians(np.asarray(dropoff_longitude) - np.asarray(pickup_longitude))
    haversine = np.sin(delta_latitude / 2) ** 2 + np.cos(latitude_one) * np.cos(latitude_two) * np.sin(delta_longitude / 2) ** 2
    return earth_radius_km * 2 * np.arcsin(np.sqrt(haversine))


def engineer_features(data: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
    """Clean trip records and create distance, hour, and weekday features."""
    normalized = normalize_columns(data)
    clean = normalized.copy()
    numeric_columns = [column for column in REQUIRED_COLUMNS if column != "pickup_datetime"]
    for column in numeric_columns:
        clean[column] = pd.to_numeric(clean[column], errors="coerce")
    clean["pickup_datetime"] = pd.to_datetime(clean["pickup_datetime"], errors="coerce")
    clean = clean.dropna(subset=list(REQUIRED_COLUMNS))
    clean = clean[(clean["fare_amount"] > 0) & (clean["passenger_count"] > 0)]
    clean["distance_km"] = haversine_distance(clean["pickup_latitude"], clean["pickup_longitude"], clean["dropoff_latitude"], clean["dropoff_longitude"])
    clean["pickup_hour"] = clean["pickup_datetime"].dt.hour
    clean["pickup_day_of_week"] = clean["pickup_datetime"].dt.dayofweek
    features = clean[FEATURE_COLUMNS].replace([np.inf, -np.inf], np.nan).dropna()
    return features, clean.loc[features.index, "fare_amount"]


def train_models(data: pd.DataFrame, test_size: float = 0.2, random_state: int = 42) -> Dict[str, object]:
    """Train, score, and return the three supported regression models."""
    features, target = engineer_features(data)
    if len(features) < 5:
        raise ValueError("At least 5 valid trip records are required after cleaning.")
    X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=test_size, random_state=random_state)
    models = {
        "Random Forest": RandomForestRegressor(n_estimators=160, random_state=random_state, n_jobs=-1),
        "Gradient Boosting": GradientBoostingRegressor(random_state=random_state),
        "Linear Regression": LinearRegression(),
    }
    results = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        results[name] = {
            "model": model,
            "mae": mean_absolute_error(y_test, predictions),
            "rmse": np.sqrt(mean_squared_error(y_test, predictions)),
            "r2": r2_score(y_test, predictions),
            "rows": len(features),
        }
    return results


def save_model(model: object, path: str | Path) -> None:
    """Persist a trained fare model."""
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, path)
