"""Deterministic review-text preprocessing utilities."""

import html
import re
import unicodedata
from dataclasses import dataclass

_HTML_TAG_PATTERN = re.compile(r"<[^>]+>")
_URL_PATTERN = re.compile(r"https?://\S+|www\.\S+", re.IGNORECASE)
_WHITESPACE_PATTERN = re.compile(r"\s+")


@dataclass(frozen=True, slots=True)
class TextRepresentations:
    """Auditable raw and deterministic ML-cleaned review representations."""

    raw_text: str
    cleaned_text: str


def clean_for_tfidf(raw_text: str) -> TextRepresentations:
    """Prepare text for a classic TF-IDF model while retaining the raw source.

    This function deliberately does not remove stopwords or punctuation. Those
    choices are model-dependent and transformer inputs will use raw text later.
    """
    normalized = unicodedata.normalize("NFKC", raw_text)
    unescaped = html.unescape(normalized)
    without_tags = _HTML_TAG_PATTERN.sub(" ", unescaped)
    without_urls = _URL_PATTERN.sub(" ", without_tags)
    cleaned = _WHITESPACE_PATTERN.sub(" ", without_urls).strip().lower()
    return TextRepresentations(raw_text=raw_text, cleaned_text=cleaned)
