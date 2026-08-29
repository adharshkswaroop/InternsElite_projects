"""Model, metric, and optional-insight API routes."""

from pathlib import Path
import json

from fastapi import APIRouter, HTTPException

from backend.app.schemas.reviews import InsightGenerateRequest

router = APIRouter(tags=["system"])


@router.post("/insights/generate")
def generate_insights(request: InsightGenerateRequest) -> dict[str, object]:
    """Reject remote insight calls until a provider is explicitly configured."""
    del request
    raise HTTPException(
        status_code=501,
        detail="LLM insight provider is not configured; no remote generation was attempted",
    )


@router.get("/models")
def list_models() -> dict[str, object]:
    """Describe configured capabilities without asserting loaded model artifacts."""
    return {
        "models": [
            {"name": "tfidf_logistic_regression", "status": "train_on_demand"},
            {"name": "distilbert_sentiment", "status": "local_load_required"},
            {"name": "sentence_transformer", "status": "local_load_required"},
        ]
    }


@router.get("/metrics")
def get_metrics() -> dict[str, object]:
    """Return executed metric artifacts only when they actually exist locally."""
    metrics_path = Path("artifacts/metrics/sentiment_metrics.json")
    if not metrics_path.is_file():
        return {"status": "not_yet_generated", "metrics": None}
    try:
        return {"status": "available", "metrics": json.loads(metrics_path.read_text(encoding="utf-8"))}
    except json.JSONDecodeError as error:
        raise HTTPException(status_code=500, detail="Metrics artifact is malformed") from error
