"""Interpretable NMF topic discovery baseline for review corpora."""

from dataclasses import dataclass

from sklearn.decomposition import NMF
from sklearn.feature_extraction.text import TfidfVectorizer


@dataclass(frozen=True, slots=True)
class DiscoveredTopic:
    """An automatically discovered topic, not a ground-truth business label."""

    topic_id: int
    terms: list[str]


class NmfTopicModel:
    """Fit a small CPU-friendly NMF topic model to cleaned review text."""

    def __init__(self, n_topics: int = 5, random_state: int = 42) -> None:
        self.n_topics = n_topics
        self._vectorizer = TfidfVectorizer(stop_words="english", min_df=1)
        self._model = NMF(
            n_components=n_topics,
            init="nndsvda",
            random_state=random_state,
            max_iter=300,
        )
        self._is_fitted = False

    def fit(self, texts: list[str]) -> "NmfTopicModel":
        """Fit topics to at least ``n_topics`` non-empty reviews."""
        non_empty = [text for text in texts if text.strip()]
        if len(non_empty) < self.n_topics:
            raise ValueError("Topic modeling requires at least as many reviews as requested topics")
        matrix = self._vectorizer.fit_transform(non_empty)
        if matrix.shape[1] < self.n_topics:
            raise ValueError(
                "Topic modeling requires at least as many unique terms as requested topics"
            )
        self._model.fit(matrix)
        self._is_fitted = True
        return self

    def topics(self, top_terms: int = 5) -> list[DiscoveredTopic]:
        """Return highest-weighted terms for each automatically discovered topic."""
        if not self._is_fitted:
            raise RuntimeError("Topic model is not fitted")
        feature_names = self._vectorizer.get_feature_names_out()
        return [
            DiscoveredTopic(
                topic_id=index,
                terms=[feature_names[term] for term in component.argsort()[-top_terms:][::-1]],
            )
            for index, component in enumerate(self._model.components_)
        ]

    def transform(self, texts: list[str]) -> list[int]:
        """Assign each text its highest-weighted discovered topic identifier."""
        if not self._is_fitted:
            raise RuntimeError("Topic model is not fitted")
        matrix = self._vectorizer.transform(texts)
        return self._model.transform(matrix).argmax(axis=1).tolist()
