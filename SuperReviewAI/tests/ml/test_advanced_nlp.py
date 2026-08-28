"""Tests for rule aspects, NMF topics, and the local FAISS adapter."""

import numpy as np
import pytest

from ml.aspect_extraction.rule_based import extract_aspects
from ml.embeddings.faiss_store import FaissVectorStore
from ml.topic_modeling.nmf import NmfTopicModel


def test_aspect_extraction_returns_evidence_and_rule_sentiment() -> None:
    """Configured aspect words return sentence-level auditable predictions."""
    predictions = extract_aspects("Battery drains quickly. The camera is excellent.")

    by_aspect = {prediction.aspect: prediction for prediction in predictions}
    assert by_aspect["battery"].sentiment == "negative"
    assert by_aspect["battery"].evidence == "Battery drains quickly"
    assert by_aspect["camera"].sentiment == "positive"


def test_nmf_topic_model_produces_terms_and_assignments() -> None:
    """Topic outputs are generated from a small synthetic text fixture."""
    texts = [
        "battery charging drains quickly",
        "battery life charging is poor",
        "camera photo image quality excellent",
        "camera picture image quality good",
    ]
    model = NmfTopicModel(n_topics=2).fit(texts)

    topics = model.topics(top_terms=2)
    assert len(topics) == 2
    assert all(len(topic.terms) == 2 for topic in topics)
    assert len(model.transform(texts)) == len(texts)


def test_faiss_store_returns_the_closest_item() -> None:
    """The local adapter normalizes vectors for cosine similarity search."""
    store = FaissVectorStore(dimension=2)
    store.add(["battery", "camera"], np.array([[1, 0], [0, 1]], dtype="float32"))

    matches = store.search(np.array([0.9, 0.1], dtype="float32"), limit=1)

    assert matches[0].item_id == "battery"
    assert matches[0].score > 0.9


def test_faiss_store_rejects_invalid_vector_shape() -> None:
    """Invalid embeddings cannot silently enter the semantic index."""
    store = FaissVectorStore(dimension=2)

    with pytest.raises(ValueError, match="shape"):
        store.add(["bad"], np.array([[1, 2, 3]], dtype="float32"))
