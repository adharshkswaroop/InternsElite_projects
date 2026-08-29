"""Reproducible TF-IDF + Logistic Regression sentiment baseline."""

import json
import time
from dataclasses import asdict, dataclass
from pathlib import Path

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


@dataclass(frozen=True, slots=True)
class BaselineConfig:
    """Configuration for the CPU-friendly initial classifier."""

    random_state: int = 42
    test_size: float = 0.2
    max_features: int = 20_000
    max_iter: int = 1_000


DEFAULT_CONFIG = BaselineConfig()


def build_baseline(config: BaselineConfig = DEFAULT_CONFIG) -> Pipeline:
    """Build an untrained TF-IDF and Logistic Regression pipeline."""
    return Pipeline(
        [
            ("tfidf", TfidfVectorizer(max_features=config.max_features, ngram_range=(1, 2))),
            (
                "classifier",
                LogisticRegression(max_iter=config.max_iter, random_state=config.random_state),
            ),
        ]
    )


def train_and_evaluate_baseline(
    prepared_reviews: pd.DataFrame, config: BaselineConfig = DEFAULT_CONFIG
) -> tuple[Pipeline, dict[str, object]]:
    """Train a stratified baseline and calculate honest held-out metrics.

    Call this only with a real, documented dataset. It refuses datasets with
    fewer than two examples per sentiment class because stratification would be
    invalid and the results misleading.
    """
    required_columns = {"ml_cleaned_text", "sentiment_label"}
    missing_columns = required_columns.difference(prepared_reviews.columns)
    if missing_columns:
        missing = ", ".join(sorted(missing_columns))
        raise ValueError(f"Prepared data is missing columns: {missing}")

    counts = prepared_reviews["sentiment_label"].value_counts()
    if counts.empty or counts.min() < 2:
        raise ValueError("Each sentiment class needs at least two records for a stratified split")

    train_text, test_text, train_labels, test_labels = train_test_split(
        prepared_reviews["ml_cleaned_text"],
        prepared_reviews["sentiment_label"],
        test_size=config.test_size,
        random_state=config.random_state,
        stratify=prepared_reviews["sentiment_label"],
    )
    model = build_baseline(config)
    started = time.perf_counter()
    model.fit(train_text, train_labels)
    elapsed_seconds = time.perf_counter() - started
    predictions = model.predict(test_text)

    metrics: dict[str, object] = {
        "model": "tfidf_logistic_regression",
        "config": asdict(config),
        "train_records": len(train_text),
        "test_records": len(test_text),
        "accuracy": accuracy_score(test_labels, predictions),
        "macro_f1": f1_score(test_labels, predictions, average="macro", zero_division=0),
        "weighted_f1": f1_score(test_labels, predictions, average="weighted", zero_division=0),
        "macro_precision": precision_score(
            test_labels, predictions, average="macro", zero_division=0
        ),
        "macro_recall": recall_score(test_labels, predictions, average="macro", zero_division=0),
        "classification_report": classification_report(
            test_labels, predictions, output_dict=True, zero_division=0
        ),
        "training_seconds": elapsed_seconds,
    }
    return model, metrics


def write_metrics(metrics: dict[str, object], destination: Path) -> None:
    """Persist executed metrics as machine-readable JSON outside source control."""
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
