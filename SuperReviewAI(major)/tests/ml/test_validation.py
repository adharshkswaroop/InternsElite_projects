"""Tests for local review validation and EDA foundations."""

from pathlib import Path
from unittest.mock import patch

import pandas as pd
import pytest

from ml.data.eda import generate_eda
from ml.data.ingestion import load_csv_reviews
from ml.data.validation import validate_records


def test_validation_reports_invalid_and_duplicate_records() -> None:
    """Invalid ratings and repeated review IDs do not enter the valid output."""
    valid, report = validate_records(
        [
            {
                "review_id": "r-1",
                "review_text": "A genuinely useful product.",
                "rating": 5,
                "source": "test",
            },
            {
                "review_id": "r-1",
                "review_text": "Duplicate identifier.",
                "rating": 4,
                "source": "test",
            },
            {
                "review_id": "r-3",
                "review_text": "Out of range rating.",
                "rating": 6,
                "source": "test",
            },
        ]
    )

    assert len(valid) == 1
    assert report.valid_records == 1
    assert report.invalid_records == 2
    assert report.duplicate_review_ids == 1


def test_local_csv_loader_and_eda_produce_expected_outputs() -> None:
    """A supplied local CSV produces validated rows and EDA output paths."""
    source_frame = pd.DataFrame(
        [
            {"review_id": "r-1", "review_text": "Excellent product and delivery.", "rating": 5},
            {"review_id": "r-2", "review_text": "Packaging could be better.", "rating": 3},
        ]
    )
    with patch("ml.data.ingestion.pd.read_csv", return_value=source_frame):
        reviews, report = load_csv_reviews("supplied-reviews.csv")
    with patch("matplotlib.figure.Figure.savefig") as savefig:
        statistics = generate_eda(reviews, Path("docs/images"))

    assert report.valid_records == 2
    assert statistics["review_count"] == 2
    assert savefig.call_count == 2


def test_csv_loader_requires_canonical_fields() -> None:
    """The loader gives a clear error for a malformed CSV schema."""
    source_frame = pd.DataFrame([{"review_id": "r-1", "review_text": "Missing rating field."}])
    with patch("ml.data.ingestion.pd.read_csv", return_value=source_frame):
        with pytest.raises(ValueError, match="rating"):
            load_csv_reviews("missing_rating.csv")
