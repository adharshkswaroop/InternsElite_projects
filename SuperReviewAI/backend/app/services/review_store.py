"""Temporary in-memory review store for the Milestone 7 API."""

from collections import Counter
from dataclasses import dataclass, field

from ml.aspect_extraction.rule_based import AspectPrediction, extract_aspects
from ml.data.schema import CanonicalReview
from ml.feature_engineering.sentiment import rating_to_sentiment


@dataclass(slots=True)
class StoredAnalysis:
    """Deterministic baseline analysis associated with one stored review."""

    sentiment: str
    aspects: list[AspectPrediction]


@dataclass(slots=True)
class ReviewStore:
    """Process-local state; it is intentionally replaced by persistence later."""

    reviews: dict[str, CanonicalReview] = field(default_factory=dict)
    analyses: dict[str, StoredAnalysis] = field(default_factory=dict)

    def add(self, review: CanonicalReview) -> bool:
        """Store a review and report whether it was newly inserted."""
        if review.review_id in self.reviews:
            return False
        self.reviews[review.review_id] = review
        return True

    def analyze(self, review_id: str) -> StoredAnalysis:
        """Run existing deterministic baseline analyses for one stored review."""
        review = self.reviews[review_id]
        analysis = StoredAnalysis(
            sentiment=rating_to_sentiment(review.rating),
            aspects=extract_aspects(review.review_text),
        )
        self.analyses[review_id] = analysis
        return analysis

    def overview(self) -> dict[str, object]:
        """Calculate live aggregates from only the reviews in this process."""
        reviews = list(self.reviews.values())
        if not reviews:
            return {"total_reviews": 0, "average_rating": None, "sentiment_counts": {}}
        sentiment_counts = Counter(rating_to_sentiment(review.rating) for review in reviews)
        return {
            "total_reviews": len(reviews),
            "average_rating": sum(review.rating for review in reviews) / len(reviews),
            "sentiment_counts": dict(sentiment_counts),
        }

    def clear(self) -> None:
        """Clear transient state; used by isolated API tests only."""
        self.reviews.clear()
        self.analyses.clear()


review_store = ReviewStore()
