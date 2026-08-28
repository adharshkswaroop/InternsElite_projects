"""Canonical, source-independent customer review schema."""

from datetime import date
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CanonicalReview(BaseModel):
    """A validated review record used by later pipeline stages.

    Raw text is retained for auditability. ``clean_text`` is intentionally not
    populated in Milestone 2; preprocessing is a later milestone.
    """

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    review_id: str = Field(min_length=1, max_length=256)
    review_text: str = Field(min_length=3, max_length=20_000)
    rating: float = Field(ge=1, le=5)
    product_id: str | None = Field(default=None, max_length=256)
    product_name: str | None = Field(default=None, max_length=1_000)
    user_id: str | None = Field(default=None, max_length=256)
    review_title: str | None = Field(default=None, max_length=1_000)
    review_date: date | None = None
    category: str | None = Field(default=None, max_length=256)
    verified_purchase: bool | None = None
    helpful_votes: int | None = Field(default=None, ge=0)
    source: str = Field(min_length=1, max_length=256)
    language: str = "und"

    @field_validator("review_text")
    @classmethod
    def reject_blank_text(cls, value: str) -> str:
        """Reject records whose text contains only whitespace."""
        if not value.strip():
            raise ValueError("review_text must contain visible characters")
        return value

    @field_validator("source")
    @classmethod
    def normalize_source(cls, value: str) -> str:
        """Store a consistent source label."""
        return value.strip().lower()


def amazon_reviews_2023_mapping(record: dict[str, Any], category: str) -> dict[str, Any]:
    """Map an Amazon Reviews 2023 JSON record into the canonical fields.

    This is a mapping helper only. Downloading and parsing that dataset remains
    a user-approved action after its usage terms are reviewed.
    """
    return {
        "review_id": record.get("review_id") or record.get("user_id", "") + "-" + str(record.get("timestamp", "")),
        "review_text": record.get("text", ""),
        "rating": record.get("rating"),
        "product_id": record.get("parent_asin"),
        "user_id": record.get("user_id"),
        "review_title": record.get("title"),
        "category": category,
        "verified_purchase": record.get("verified_purchase"),
        "helpful_votes": record.get("helpful_vote"),
        "source": "amazon_reviews_2023",
    }
