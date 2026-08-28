"""Tests for preprocessing, feature preparation, and baseline safeguards."""

import pandas as pd
import pytest

from ml.feature_engineering.sentiment import prepare_sentiment_frame, rating_to_sentiment
from ml.preprocessing.text import clean_for_tfidf
from ml.sentiment.baseline import BaselineConfig, train_and_evaluate_baseline


def test_text_cleaning_preserves_raw_text_and_removes_html_and_urls() -> None:
    """The deterministic representation remains traceable to its source."""
    result = clean_for_tfidf("  Great <b>product</b>! Visit https://example.test 😀  ")

    assert result.raw_text == "  Great <b>product</b>! Visit https://example.test 😀  "
    assert result.cleaned_text == "great product ! visit 😀"


def test_rating_target_mapping_and_feature_preparation() -> None:
    """Ratings map predictably without discarding raw review content."""
    reviews = pd.DataFrame(
        [{"review_id": "r-1", "review_text": "A <i>good</i> choice", "rating": 4}]
    )
    prepared = prepare_sentiment_frame(reviews)

    assert rating_to_sentiment(1) == "negative"
    assert rating_to_sentiment(3) == "neutral"
    assert rating_to_sentiment(5) == "positive"
    assert prepared.loc[0, "raw_text"] == "A <i>good</i> choice"
    assert prepared.loc[0, "ml_cleaned_text"] == "a good choice"


def test_baseline_trains_on_synthetic_fixture_and_returns_metrics() -> None:
    """The baseline operates on a small balanced synthetic fixture."""
    rows = []
    examples = [
        ("negative", 1, "terrible"),
        ("neutral", 3, "average"),
        ("positive", 5, "excellent"),
    ]
    for label, rating, token in examples:
        rows.extend(
            {
                "review_id": f"{label}-{index}",
                "review_text": f"{token} product {index}",
                "rating": rating,
            }
            for index in range(5)
        )

    _, metrics = train_and_evaluate_baseline(
        prepare_sentiment_frame(pd.DataFrame(rows)), BaselineConfig(test_size=0.4)
    )

    assert metrics["model"] == "tfidf_logistic_regression"
    assert metrics["test_records"] == 6
    assert 0 <= float(metrics["accuracy"]) <= 1


def test_baseline_rejects_insufficient_class_counts() -> None:
    """A non-stratifiable input cannot yield misleading baseline metrics."""
    reviews = prepare_sentiment_frame(
        pd.DataFrame([{"review_id": "r-1", "review_text": "Only one record", "rating": 5}])
    )

    with pytest.raises(ValueError, match="at least two"):
        train_and_evaluate_baseline(reviews)
