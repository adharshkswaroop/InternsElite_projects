"""Request and response schemas for review API operations."""

from typing import Literal

from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    """Select a stored review for deterministic baseline analysis."""

    review_id: str = Field(min_length=1)


class SearchRequest(BaseModel):
    """Request a simple in-memory lexical review search."""

    query: str = Field(min_length=1, max_length=500)
    limit: int = Field(default=10, ge=1, le=100)


class InsightGenerateRequest(BaseModel):
    """Placeholder request for a configured LLM insight provider."""

    scope: Literal["overview"] = "overview"
