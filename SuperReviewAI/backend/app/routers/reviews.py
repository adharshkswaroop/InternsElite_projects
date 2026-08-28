"""Review ingestion, browsing, analysis, and basic analytics routes."""

import csv
from dataclasses import asdict
from io import StringIO

from fastapi import APIRouter, HTTPException, UploadFile, status

from backend.app.schemas.reviews import AnalyzeRequest, SearchRequest
from backend.app.services.review_store import review_store
from ml.data.validation import validate_records

router = APIRouter(tags=["reviews"])


@router.post("/reviews/upload", status_code=status.HTTP_201_CREATED)
async def upload_reviews(file: UploadFile) -> dict[str, object]:
    """Validate a UTF-8 CSV upload and keep valid rows in process memory."""
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=415, detail="Only CSV uploads are supported")
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="CSV upload exceeds the 5 MB limit")
    try:
        rows = list(csv.DictReader(StringIO(content.decode("utf-8-sig"))))
    except UnicodeDecodeError as error:
        raise HTTPException(status_code=400, detail="CSV must be UTF-8 encoded") from error
    for row in rows:
        row.setdefault("source", "csv_upload")
    valid_reviews, report = validate_records(rows)
    inserted = sum(review_store.add(review) for review in valid_reviews)
    return {"inserted_reviews": inserted, "quality_report": report.as_dict()}


@router.post("/reviews/analyze")
def analyze_review(request: AnalyzeRequest) -> dict[str, object]:
    """Analyze one stored review using the currently available baselines."""
    if request.review_id not in review_store.reviews:
        raise HTTPException(status_code=404, detail="Review not found")
    analysis = review_store.analyze(request.review_id)
    return {
        "review_id": request.review_id,
        "sentiment": analysis.sentiment,
        "aspects": [asdict(aspect) for aspect in analysis.aspects],
        "analysis_type": "rating-derived sentiment and rule-based aspects",
    }


@router.get("/reviews")
def list_reviews(offset: int = 0, limit: int = 20) -> dict[str, object]:
    """Return a bounded page of process-local reviews."""
    if offset < 0 or not 1 <= limit <= 100:
        raise HTTPException(status_code=422, detail="offset must be non-negative and limit must be 1–100")
    items = list(review_store.reviews.values())[offset : offset + limit]
    return {"items": [item.model_dump(mode="json") for item in items], "offset": offset, "limit": limit}


@router.get("/reviews/{review_id}")
def get_review(review_id: str) -> dict[str, object]:
    """Return a single stored review."""
    review = review_store.reviews.get(review_id)
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    return review.model_dump(mode="json")


@router.get("/analytics/overview")
def analytics_overview() -> dict[str, object]:
    """Return actual in-memory overview aggregates."""
    return review_store.overview()


@router.get("/analytics/sentiment")
def analytics_sentiment() -> dict[str, object]:
    """Return rating-derived sentiment counts for stored reviews."""
    return {"sentiment_counts": review_store.overview()["sentiment_counts"]}


@router.get("/analytics/aspects")
def analytics_aspects() -> dict[str, object]:
    """Return counts of aspects that were explicitly analyzed."""
    counts: dict[str, int] = {}
    for analysis in review_store.analyses.values():
        for aspect in analysis.aspects:
            counts[aspect.aspect] = counts.get(aspect.aspect, 0) + 1
    return {"aspect_counts": counts, "analyzed_reviews": len(review_store.analyses)}


@router.get("/analytics/topics")
def analytics_topics() -> dict[str, object]:
    """Report that topic results require an explicit dataset run."""
    return {"topics": [], "status": "not_yet_generated"}


@router.get("/analytics/trends")
def analytics_trends() -> dict[str, object]:
    """Report no trend aggregation until dated data is analyzed."""
    return {"trends": [], "status": "not_yet_generated"}


@router.post("/search")
def search_reviews(request: SearchRequest) -> dict[str, object]:
    """Run a transparent lexical fallback while embedding search is unavailable."""
    query = request.query.lower()
    matches = [
        review.model_dump(mode="json")
        for review in review_store.reviews.values()
        if query in review.review_text.lower()
    ][: request.limit]
    return {"items": matches, "search_type": "lexical_fallback"}
