"""Local FAISS vector-store adapter with a replaceable narrow interface."""

from dataclasses import dataclass

import faiss
import numpy as np


@dataclass(frozen=True, slots=True)
class SearchMatch:
    """One semantic-search result from the local vector index."""

    item_id: str
    score: float


class FaissVectorStore:
    """In-memory cosine-similarity store suitable for local development."""

    def __init__(self, dimension: int) -> None:
        if dimension <= 0:
            raise ValueError("Vector dimension must be positive")
        self.dimension = dimension
        self._index = faiss.IndexFlatIP(dimension)
        self._item_ids: list[str] = []

    def add(self, item_ids: list[str], vectors: np.ndarray) -> None:
        """Add uniquely identified vectors after L2 normalization."""
        if len(item_ids) != len(vectors):
            raise ValueError("item_ids and vectors must have the same length")
        if len(set(item_ids)) != len(item_ids) or set(item_ids).intersection(self._item_ids):
            raise ValueError("item_ids must be unique")
        matrix = _normalized_matrix(vectors, self.dimension)
        self._index.add(matrix)
        self._item_ids.extend(item_ids)

    def search(self, query_vector: np.ndarray, limit: int = 5) -> list[SearchMatch]:
        """Return the nearest indexed vectors by cosine similarity."""
        if limit <= 0:
            raise ValueError("limit must be positive")
        if not self._item_ids:
            return []
        query = _normalized_matrix(np.asarray([query_vector]), self.dimension)
        scores, indices = self._index.search(query, min(limit, len(self._item_ids)))
        return [
            SearchMatch(item_id=self._item_ids[index], score=float(score))
            for score, index in zip(scores[0], indices[0], strict=True)
            if index != -1
        ]


def _normalized_matrix(vectors: np.ndarray, dimension: int) -> np.ndarray:
    """Validate float vectors and normalize rows for inner-product cosine search."""
    matrix = np.asarray(vectors, dtype="float32")
    if matrix.ndim != 2 or matrix.shape[1] != dimension:
        raise ValueError(f"Expected vectors with shape (n, {dimension})")
    norms = np.linalg.norm(matrix, axis=1, keepdims=True)
    if np.any(norms == 0):
        raise ValueError("Zero vectors cannot be normalized")
    return matrix / norms
