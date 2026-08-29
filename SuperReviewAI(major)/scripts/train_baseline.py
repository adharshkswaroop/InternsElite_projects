"""Train the baseline only from a user-provided local CSV."""

import argparse
from pathlib import Path

from ml.data.ingestion import load_csv_reviews
from ml.feature_engineering.sentiment import prepare_sentiment_frame
from ml.sentiment.baseline import train_and_evaluate_baseline, write_metrics


def main() -> None:
    """Train and write metrics for an explicitly supplied local dataset."""
    parser = argparse.ArgumentParser()
    parser.add_argument("csv_path", type=Path)
    parser.add_argument(
        "--metrics-path",
        type=Path,
        default=Path("artifacts/metrics/sentiment_metrics.json"),
    )
    arguments = parser.parse_args()

    reviews, quality_report = load_csv_reviews(arguments.csv_path)
    if quality_report.invalid_records:
        raise ValueError("Refusing training because the input contains invalid records")
    _, metrics = train_and_evaluate_baseline(prepare_sentiment_frame(reviews))
    write_metrics(metrics, arguments.metrics_path)
    print(f"Metrics written to {arguments.metrics_path}")
