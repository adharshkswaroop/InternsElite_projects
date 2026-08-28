"""CPU-capable transformer sentiment inference with explicit model loading."""

from dataclasses import dataclass
from time import perf_counter
from typing import Any, Protocol


class TextClassifier(Protocol):
    """Minimal protocol implemented by Hugging Face text-classification pipelines."""

    def __call__(self, inputs: str | list[str], **kwargs: Any) -> Any:
        """Classify one or more texts."""


@dataclass(frozen=True, slots=True)
class TransformerConfig:
    """Configuration for a pretrained transformer inference model.

    The default is a compact DistilBERT model fine-tuned for English binary
    sentiment. Set ``local_files_only`` to false only when an intentional model
    download is permitted. CPU is the safe default for limited compute.
    """

    model_name: str = "distilbert-base-uncased-finetuned-sst-2-english"
    max_length: int = 256
    batch_size: int = 16
    local_files_only: bool = True


@dataclass(frozen=True, slots=True)
class SentimentPrediction:
    """A traceable sentiment prediction from a loaded pretrained model."""

    sentiment: str
    confidence: float
    model_name: str
    latency_ms: float


DEFAULT_TRANSFORMER_CONFIG = TransformerConfig()


class TransformerSentimentPredictor:
    """Load and run a Hugging Face text-classification model on CPU.

    Construction does not download or initialize model weights. Call ``load``
    explicitly when a compatible pretrained model is available locally or when
    a permitted download has been enabled in the configuration.
    """

    def __init__(self, config: TransformerConfig = DEFAULT_TRANSFORMER_CONFIG) -> None:
        self.config = config
        self._classifier: TextClassifier | None = None

    @property
    def is_loaded(self) -> bool:
        """Return whether a classifier pipeline is ready for inference."""
        return self._classifier is not None

    def load(self) -> None:
        """Load the configured model via Transformers with CPU execution."""
        from transformers import pipeline

        self._classifier = pipeline(
            task="sentiment-analysis",
            model=self.config.model_name,
            tokenizer=self.config.model_name,
            device=-1,
            truncation=True,
            max_length=self.config.max_length,
            model_kwargs={"local_files_only": self.config.local_files_only},
        )

    def predict(self, text: str) -> SentimentPrediction:
        """Classify one non-empty raw review and include measured latency."""
        if not text.strip():
            raise ValueError("Cannot classify empty review text")
        if self._classifier is None:
            raise RuntimeError("Transformer model is not loaded; call load() first")

        started = perf_counter()
        result = self._classifier(text, truncation=True, max_length=self.config.max_length)
        latency_ms = (perf_counter() - started) * 1_000
        prediction = _first_prediction(result)
        return SentimentPrediction(
            sentiment=normalize_sentiment_label(str(prediction["label"])),
            confidence=float(prediction["score"]),
            model_name=self.config.model_name,
            latency_ms=latency_ms,
        )

    def predict_batch(self, texts: list[str]) -> list[SentimentPrediction]:
        """Classify a non-empty batch using the configured CPU batch size."""
        if not texts:
            return []
        if any(not text.strip() for text in texts):
            raise ValueError("Cannot classify empty review text")
        if self._classifier is None:
            raise RuntimeError("Transformer model is not loaded; call load() first")

        started = perf_counter()
        result = self._classifier(
            texts,
            truncation=True,
            max_length=self.config.max_length,
            batch_size=self.config.batch_size,
        )
        latency_ms_per_review = ((perf_counter() - started) * 1_000) / len(texts)
        predictions = _prediction_list(result)
        return [
            SentimentPrediction(
                sentiment=normalize_sentiment_label(str(prediction["label"])),
                confidence=float(prediction["score"]),
                model_name=self.config.model_name,
                latency_ms=latency_ms_per_review,
            )
            for prediction in predictions
        ]


def normalize_sentiment_label(label: str) -> str:
    """Normalize common model labels into the platform's sentiment vocabulary."""
    normalized = label.strip().lower().replace("_", " ")
    mappings = {
        "label 0": "negative",
        "label 1": "positive",
        "negative": "negative",
        "neutral": "neutral",
        "positive": "positive",
    }
    return mappings.get(normalized, normalized)


def _first_prediction(result: Any) -> dict[str, Any]:
    """Extract one prediction from the Transformers pipeline response."""
    if isinstance(result, list) and result and isinstance(result[0], dict):
        return result[0]
    raise ValueError("Unexpected transformer response for one review")


def _prediction_list(result: Any) -> list[dict[str, Any]]:
    """Extract a batch prediction list from the Transformers pipeline response."""
    if isinstance(result, list) and all(isinstance(item, dict) for item in result):
        return result
    raise ValueError("Unexpected transformer response for review batch")
