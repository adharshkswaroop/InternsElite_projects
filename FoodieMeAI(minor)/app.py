from pathlib import Path

import pandas as pd
from flask import Flask, jsonify, render_template, request
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "BangaloreZomatoData.csv"

app = Flask(__name__)


def load_restaurants():
    restaurants = pd.read_csv(DATA_PATH)
    for column in ["Cuisines", "KnownFor", "PopularDishes", "Area"]:
        restaurants[column] = restaurants[column].fillna("").astype(str)
    restaurants["AverageCost"] = pd.to_numeric(
        restaurants["AverageCost"], errors="coerce"
    ).fillna(0)
    restaurants["DeliveryRating"] = pd.to_numeric(
        restaurants["Delivery Ratings"].replace("-", pd.NA), errors="coerce"
    ).fillna(0)
    restaurants["DinnerRating"] = pd.to_numeric(
        restaurants["Dinner Ratings"].replace("-", pd.NA), errors="coerce"
    ).fillna(0)
    restaurants["SearchText"] = (
        restaurants["Cuisines"]
        + " "
        + restaurants["KnownFor"]
        + " "
        + restaurants["PopularDishes"]
        + " "
        + restaurants["Area"]
    )
    return restaurants


RESTAURANTS = load_restaurants()
VECTORIZER = TfidfVectorizer(stop_words="english")
FEATURES = VECTORIZER.fit_transform(RESTAURANTS["SearchText"])


def unique_values(column):
    values = RESTAURANTS[column].str.split(", ").explode().str.strip()
    return sorted(value for value in values.unique() if value)


def recommend(form):
    query = form.get("query", "").strip()
    area = form.get("area", "").strip()
    mode = form.get("mode", "Delivery")
    vegetarian = form.get("vegetarian") == "on"

    try:
        budget = int(form.get("budget", "1500"))
    except (TypeError, ValueError):
        budget = 1500
    budget = max(budget, 50)

    matches = RESTAURANTS[RESTAURANTS["AverageCost"] <= budget].copy()
    if area:
        matches = matches[matches["Area"].str.contains(area, case=False, na=False)]
    if vegetarian:
        matches = matches[matches["isVegOnly"] == 1]
    if mode == "Dinner":
        matches = matches[matches["DinnerRating"] > 0]
    else:
        matches = matches[matches["DeliveryRating"] > 0]
    if matches.empty:
        return []

    if query:
        query_vector = VECTORIZER.transform([query])
        similarities = cosine_similarity(query_vector, FEATURES).ravel()
        matches["similarity"] = similarities[matches.index]
    else:
        matches["similarity"] = 0.0

    rating_column = "DinnerRating" if mode == "Dinner" else "DeliveryRating"
    matches["score"] = matches["similarity"] * 0.7 + (matches[rating_column] / 5) * 0.3
    matches = matches.sort_values(
        by=["score", rating_column, "AverageCost"],
        ascending=[False, False, True],
    ).head(8)

    return [
        {
            "name": row["Name"],
            "area": row["Area"],
            "cuisines": row["Cuisines"],
            "known_for": row["KnownFor"] or "Local favourite",
            "dishes": row["PopularDishes"],
            "cost": int(row["AverageCost"]),
            "rating": float(row[rating_column]),
            "rating_label": mode,
            "delivery": bool(row["IsHomeDelivery"]),
            "takeaway": bool(row["isTakeaway"]),
            "indoor": bool(row["isIndoorSeating"]),
            "url": row["URL"],
        }
        for _, row in matches.iterrows()
    ]


@app.get("/")
def index():
    filters = {
        "areas": sorted(RESTAURANTS["Area"].unique()),
        "cuisines": unique_values("Cuisines"),
        "restaurant_count": len(RESTAURANTS),
        "area_count": RESTAURANTS["Area"].nunique(),
    }
    results = recommend(request.args) if request.args else recommend({})
    return render_template("index.html", filters=filters, results=results)


@app.post("/api/recommend")
def api_recommend():
    return jsonify({"results": recommend(request.form)})


if __name__ == "__main__":
    app.run(debug=True)