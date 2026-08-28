"""Streamlit interface for training and estimating Uber trip fares."""

from pathlib import Path

import numpy as np
import pandas as pd
import streamlit as st

from src.data.fare_pipeline import FEATURE_COLUMNS, engineer_features, save_model, train_models

MODEL_PATH = Path("models") / "uber_fare_model.joblib"

st.set_page_config(page_title="SuperRide AI | Fare Lab", page_icon="◆", layout="wide")
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
:root { --saffron:#f6b51b; --black:#10100f; --soft:#1c1b17; --muted:#aaa493; }
html, body, [class*="css"] { font-family:'Poppins', sans-serif; }
.stApp { background:var(--black); color:#fff8e8; }
.block-container { max-width:1180px; padding-top:2.5rem; }
h1 { font-size:3.8rem !important; line-height:1 !important; letter-spacing:-.06em; }
h1 em { color:var(--saffron); font-style:normal; }
section[data-testid="stSidebar"] { background:#181714; border-right:1px solid #37342b; }
section[data-testid="stSidebar"] h2 { color:var(--saffron); }
.stButton > button, .stDownloadButton > button { background:var(--saffron); color:var(--black); border:0; border-radius:0; font-weight:700; }
.stButton > button:hover { background:#ffc62e; color:var(--black); }
[data-testid="stMetric"] { background:var(--soft); border:1px solid #37342b; padding:1rem; }
[data-testid="stMetricValue"] { color:var(--saffron); }
[data-testid="stFileUploader"] { border:1px dashed #6b5c2c; padding:1rem; }
</style>
""", unsafe_allow_html=True)


def demo_data(rows: int = 80) -> pd.DataFrame:
    """Create an explicit demo dataset so the workflow is testable without a download."""
    rng = np.random.default_rng(7)
    pickup_latitude = 40.72 + rng.normal(0, .04, rows)
    pickup_longitude = -73.98 + rng.normal(0, .05, rows)
    dropoff_latitude = pickup_latitude + rng.normal(0, .025, rows)
    dropoff_longitude = pickup_longitude + rng.normal(0, .03, rows)
    pickup_datetime = pd.date_range("2024-01-01", periods=rows, freq="6h")
    distance = np.sqrt((pickup_latitude - dropoff_latitude) ** 2 + (pickup_longitude - dropoff_longitude) ** 2) * 80
    fares = 3.5 + distance * 2.2 + rng.normal(0, 1.8, rows) + rng.integers(0, 4, rows)
    return pd.DataFrame({
        "pickup_datetime": pickup_datetime,
        "pickup_longitude": pickup_longitude, "pickup_latitude": pickup_latitude,
        "dropoff_longitude": dropoff_longitude, "dropoff_latitude": dropoff_latitude,
        "passenger_count": rng.integers(1, 5, rows), "fare_amount": np.maximum(fares, 3.5),
    })


st.sidebar.markdown("## SuperRide AI")
st.sidebar.caption("Trip fare intelligence")
st.sidebar.markdown("### 01 / Data source")
upload = st.sidebar.file_uploader("Upload Uber trip CSV", type="csv")
use_demo = st.sidebar.checkbox("Use built-in demo data", value=upload is None)
st.sidebar.caption("Required: pickup/dropoff coordinates, pickup datetime, passenger count, and fare amount.")

if upload is not None and not use_demo:
    data = pd.read_csv(upload)
    source_label = upload.name
else:
    data = demo_data()
    source_label = "Built-in demo dataset"

st.markdown("### LIVE FARE ESTIMATION LAB")
st.title("Know the fare\nfor the road ahead.")
st.write("Upload historical trips, engineer distance and time signals, then compare three models before estimating a new journey.")

st.markdown("## Training workspace")
source_col, action_col = st.columns([3, 1])
with source_col:
    st.info(f"Data source: {source_label}  •  {len(data):,} raw records")
with action_col:
    train_clicked = st.button("Train models", use_container_width=True)

try:
    features, target = engineer_features(data)
    st.caption(f"Pipeline ready: {len(features):,} clean records  •  Haversine distance, pickup hour, weekday extracted")
except ValueError as error:
    st.error(str(error))
    st.stop()

if train_clicked or "results" not in st.session_state:
    with st.spinner("Training Random Forest, Gradient Boosting, and Linear Regression..."):
        st.session_state.results = train_models(data)

results = st.session_state.results
metrics = pd.DataFrame({name: {"MAE": item["mae"], "RMSE": item["rmse"], "R²": item["r2"]} for name, item in results.items()}).T
st.dataframe(metrics.style.format({"MAE": "${:.2f}", "RMSE": "${:.2f}", "R²": "{:.3f}"}), use_container_width=True)

st.markdown("## Estimate a new trip")
input_col, output_col = st.columns([1, 1])
with input_col:
    pickup_latitude = st.number_input("Pickup latitude", value=40.7484, format="%.5f")
    pickup_longitude = st.number_input("Pickup longitude", value=-73.9857, format="%.5f")
    dropoff_latitude = st.number_input("Dropoff latitude", value=40.7580, format="%.5f")
    dropoff_longitude = st.number_input("Dropoff longitude", value=-73.9855, format="%.5f")
    pickup_datetime = st.date_input("Pickup date")
    pickup_hour = st.slider("Pickup hour", 0, 23, 17)
    passenger_count = st.number_input("Passenger count", min_value=1, max_value=8, value=2)
    model_name = st.selectbox("Model", list(results.keys()), index=0)
    estimate_clicked = st.button("Estimate fare", use_container_width=True)
with output_col:
    st.markdown("### Model output")
    if estimate_clicked:
        trip = pd.DataFrame([{
            "pickup_datetime": f"{pickup_datetime} {pickup_hour:02d}:00:00",
            "pickup_longitude": pickup_longitude, "pickup_latitude": pickup_latitude,
            "dropoff_longitude": dropoff_longitude, "dropoff_latitude": dropoff_latitude,
            "passenger_count": passenger_count, "fare_amount": 1,
        }])
        trip_features, _ = engineer_features(trip)
        estimate = max(0, float(results[model_name]["model"].predict(trip_features)[0]))
        st.metric("Estimated fare", f"${estimate:,.2f}")
        st.caption(f"Predicted by {model_name} using {len(FEATURE_COLUMNS)} engineered signals.")
    else:
        st.metric("Estimated fare", "--")
        st.caption("Enter trip details and run an estimate.")

if st.button("Save selected model"):
    save_model(results[model_name]["model"], MODEL_PATH)
    st.success(f"Saved {model_name} to {MODEL_PATH}")
