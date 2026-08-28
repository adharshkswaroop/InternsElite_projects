"""Tests for evidence-grounded insight generation without remote LLM calls."""

import json

import pytest

from ml.llm.insights import EvidenceItem, InsightRequest, build_insight_prompt, generate_insight


class FakeJsonProvider:
    """Return deterministic structured output for validation tests."""

    def __init__(self, response: dict[str, object]) -> None:
        self.response = response

    def generate_json(self, prompt: str) -> str:
        """Serialize configured output after asserting evidence is present."""
        assert "review-count" in prompt
        return json.dumps(self.response)


def test_prompt_contains_only_structured_evidence_and_instruction() -> None:
    """The prompt makes citation and non-invention constraints explicit."""
    request = InsightRequest(
        evidence=[EvidenceItem(evidence_id="review-count", statement="10 reviews", source="EDA")]
    )

    prompt = build_insight_prompt(request)

    assert "Do not invent facts" in prompt
    assert "review-count" in prompt


def test_generated_insight_requires_known_evidence_citations() -> None:
    """Structured output tied to supplied evidence is accepted."""
    request = InsightRequest(
        evidence=[EvidenceItem(evidence_id="review-count", statement="10 reviews", source="EDA")]
    )
    provider = FakeJsonProvider(
        {
            "executive_summary": "Review volume is available for analysis.",
            "recommended_actions": [
                {
                    "action": "Review the available feedback.",
                    "rationale": "This is based on the recorded review volume.",
                    "evidence_ids": ["review-count"],
                }
            ],
            "evidence_ids": ["review-count"],
            "limitations": ["This fixture contains one aggregate."],
        }
    )

    result = generate_insight(request, provider)

    assert result.insight.evidence_ids == ["review-count"]
    assert result.evidence[0].source == "EDA"


def test_unknown_citation_is_rejected() -> None:
    """Providers cannot cite evidence that was not made available to them."""
    request = InsightRequest(
        evidence=[EvidenceItem(evidence_id="review-count", statement="10 reviews", source="EDA")]
    )
    provider = FakeJsonProvider(
        {
            "executive_summary": "Unsupported conclusion.",
            "recommended_actions": [],
            "evidence_ids": ["not-supplied"],
            "limitations": [],
        }
    )

    with pytest.raises(ValueError, match="not supplied"):
        generate_insight(request, provider)
