"""Local CSV ingestion utilities for the Milestone 2 workflow."""

from pathlib import Path

import pandas as pd

from ml.data.validation import ValidationReport, validate_records

REQUIRED_COLUMNS = {"review_id", "review_text", "rating"}


def load_csv_reviews(path: Path, source: str = "local_csv") -> tuple[pd.DataFrame, ValidationReport]:
    """Load a CSV, validate canonical records, and return valid reviews only.

    The caller must explicitly provide the local file; this function never
    downloads or scrapes review data.
    """
    frame = pd.read_csv(path)
    missing_columns = REQUIRED_COLUMNS.difference(frame.columns)
    if missing_columns:
        missing = ", ".join(sorted(missing_columns))
        raise ValueError(f"CSV is missing required columns: {missing}")

    frame = frame.where(frame.notna(), None)
    records = frame.to_dict(orient="records")
    for record in records:
        record.setdefault("source", source)

    reviews, report = validate_records(records)
    return pd.DataFrame([review.model_dump(mode="json") for review in reviews]), report
