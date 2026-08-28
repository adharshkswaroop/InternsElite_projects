"""Opt-in Sentence Transformer embedder for semantic search."""

from dataclasses import dataclass

import numpy as np


@dataclass(frozen=True, slots=True)
class EmbeddingConfig:
    """CPU-first configuration for a pretrained sentence embedding model."""

    model_name: str = "sentence-transformers/all-MiniLM-L6-v2"
    local_files_only: bool = True


class SentenceTransformerEmbedder:
    """Explicitly loaded, CPU-capable Sentence Transformer adapter."""

    def __init__(self, config: EmbeddingConfig | None = None) -> None:
        self.config = config or EmbeddingConfig()
        self._model: object | None = None

    def load(self) -> None:
        """Load an embedding model only when local or permitted remote files exist."""
        from sentence_transformers import SentenceTransformer

        self._model = SentenceTransformer(
            self.config.model_name,
            device="cpu",
            local_files_only=self.config.local_files_only,
        )

    def encode(self, texts: list[str]) -> np.ndarray:
        """Create normalized embeddings for non-empty review text."""
        if self._model is None:
            raise RuntimeError("Embedding model is not loaded; call load() first")
        if not texts or any(not text.strip() for text in texts):
            raise ValueError("Embedder requires one or more non-empty texts")
        return np.asarray(self._model.encode(texts, normalize_embeddings=True), dtype="float32")  # type: ignore[union-attr]
