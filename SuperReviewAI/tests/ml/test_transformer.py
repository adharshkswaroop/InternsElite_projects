"""Tests for transformer inference behavior without downloading model weights."""

from typing import Any

import pytest

from ml.sentiment.transformer import (
    TransformerConfig,
    TransformerSentimentPredictor,
    normalize_sentiment_label,
)


class FakeClassifier:
    """Small deterministic stand-in for a Hugging Face inference pipeline."""

    def __call__(self, inputs: str | list[str], **kwargs: Any) -> Any:
        """Return labels in the same shape as the real pipeline."""
        if isinstance(inputs, str):
            return [{"label": "LABEL_1", "score": 0.9}]
        return [{"label": "LABEL_0", "score": 0.8} for _ in inputs]


def test_predict_requires_explicit_model_load() -> None:
    """A predictor cannot silently trigger model loading during inference."""
    predictor = TransformerSentimentPredictor()

    with pytest.raises(RuntimeError, match="not loaded"):
        predictor.predict("Useful review")


def test_predict_normalizes_labels_and_preserves_model_identifier() -> None:
    """A loaded pipeline produces a traceable normalized prediction."""
    config = TransformerConfig(model_name="test-model")
    predictor = TransformerSentimentPredictor(config)
    predictor._classifier = FakeClassifier()

    prediction = predictor.predict("This is a useful product")

    assert prediction.sentiment == "positive"
    assert prediction.confidence == 0.9
    assert prediction.model_name == "test-model"
    assert prediction.latency_ms >= 0


def test_batch_inference_and_label_normalization() -> None:
    """Batch output preserves review count and maps binary negative labels."""
    predictor = TransformerSentimentPredictor()
    predictor._classifier = FakeClassifier()

    predictions = predictor.predict_batch(["bad delivery", "poor packaging"])

    assert [prediction.sentiment for prediction in predictions] == ["negative", "negative"]
    assert normalize_sentiment_label("neutral") == "neutral"
    assert normalize_sentiment_label("custom-label") == "custom-label"


def test_empty_text_is_rejected() -> None:
    """Blank source reviews cannot enter transformer inference."""
    predictor = TransformerSentimentPredictor()
    predictor._classifier = FakeClassifier()

    with pytest.raises(ValueError, match="empty"):
        predictor.predict("   ")
