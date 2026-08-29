"""Feature and target preparation for the initial sentiment baseline."""

import pandas as pd

from ml.preprocessing.text import clean_for_tfidf


def rating_to_sentiment(rating: float) -> str:
    """Map an observed 1–5 star rating to a transparent three-class target."""
    if rating <= 2:
        return "negative"
    if rating == 3:
        return "neutral"
    return "positive"


def prepare_sentiment_frame(reviews: pd.DataFrame) -> pd.DataFrame:
    """Add raw, cleaned, and target columns without mutating the input frame."""
    required_columns = {"review_id", "review_text", "rating"}
    missing_columns = required_columns.difference(reviews.columns)
    if missing_columns:
        missing = ", ".join(sorted(missing_columns))
        raise ValueError(f"Cannot prepare sentiment data; missing columns: {missing}")

    prepared = reviews.copy()
    representations = prepared["review_text"].map(clean_for_tfidf)
    prepared["raw_text"] = representations.map(lambda item: item.raw_text)
    prepared["ml_cleaned_text"] = representations.map(lambda item: item.cleaned_text)
    prepared["sentiment_label"] = prepared["rating"].map(rating_to_sentiment)
    return prepared
