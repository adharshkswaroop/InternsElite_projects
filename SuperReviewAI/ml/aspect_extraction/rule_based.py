"""Transparent keyword-based aspect and sentiment baseline."""

import re
from dataclasses import dataclass

DEFAULT_ASPECT_KEYWORDS: dict[str, set[str]] = {
    "battery": {"battery", "charge", "charging"},
    "camera": {"camera", "photo", "picture"},
    "display": {"display", "screen"},
    "price": {"price", "cost", "value"},
    "delivery": {"delivery", "shipping", "arrived"},
    "packaging": {"packaging", "package", "box"},
    "quality": {"quality", "durable", "build"},
    "performance": {"performance", "fast", "slow"},
    "customer_support": {"support", "service", "representative"},
    "warranty": {"warranty", "replacement", "return"},
    "usability": {"easy", "difficult", "usable"},
}
POSITIVE_WORDS = {"excellent", "great", "good", "fast", "easy", "durable", "love", "helpful"}
NEGATIVE_WORDS = {"bad", "poor", "slow", "difficult", "broken", "hate", "delay", "drains"}


@dataclass(frozen=True, slots=True)
class AspectPrediction:
    """A rule-derived aspect prediction with an auditable evidence span."""

    aspect: str
    sentiment: str
    confidence: float
    evidence: str


def extract_aspects(
    text: str, keywords: dict[str, set[str]] | None = None
) -> list[AspectPrediction]:
    """Extract configured aspect mentions and rule-derived local sentiment.

    This baseline is deliberately deterministic and does not claim NER-quality
    extraction. The keyword dictionary can be replaced or extended by later
    learned aspect extractors.
    """
    if not text.strip():
        return []
    active_keywords = keywords or DEFAULT_ASPECT_KEYWORDS
    sentences = [sentence.strip() for sentence in re.split(r"[.!?]+", text) if sentence.strip()]
    predictions: list[AspectPrediction] = []
    for aspect, terms in active_keywords.items():
        for sentence in sentences:
            tokens = set(re.findall(r"\b\w+\b", sentence.lower()))
            if tokens.intersection(terms):
                sentiment, confidence = _score_sentence(tokens)
                predictions.append(
                    AspectPrediction(
                        aspect=aspect,
                        sentiment=sentiment,
                        confidence=confidence,
                        evidence=sentence,
                    )
                )
                break
    return predictions


def _score_sentence(tokens: set[str]) -> tuple[str, float]:
    """Calculate a transparent lexicon score for one evidence sentence."""
    positive = len(tokens.intersection(POSITIVE_WORDS))
    negative = len(tokens.intersection(NEGATIVE_WORDS))
    if positive > negative:
        return "positive", 0.5 + min(positive, 3) * 0.1
    if negative > positive:
        return "negative", 0.5 + min(negative, 3) * 0.1
    return "neutral", 0.5
