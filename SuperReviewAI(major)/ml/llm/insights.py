"""Evidence-grounded, provider-agnostic business insight generation."""

import json
from dataclasses import dataclass
from typing import Protocol

from pydantic import BaseModel, ConfigDict, Field, field_validator


class EvidenceItem(BaseModel):
    """One auditable fact or aggregate that an insight may reference."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    evidence_id: str = Field(min_length=1, max_length=128)
    statement: str = Field(min_length=1, max_length=2_000)
    source: str = Field(min_length=1, max_length=256)


class InsightRequest(BaseModel):
    """Validated input passed to an optional LLM provider."""

    model_config = ConfigDict(extra="forbid")

    audience: str = Field(default="business stakeholder", max_length=128)
    evidence: list[EvidenceItem] = Field(min_length=1, max_length=100)

    @field_validator("evidence")
    @classmethod
    def require_unique_evidence_ids(cls, value: list[EvidenceItem]) -> list[EvidenceItem]:
        """Prevent ambiguous citations in generated output."""
        identifiers = [item.evidence_id for item in value]
        if len(identifiers) != len(set(identifiers)):
            raise ValueError("evidence_id values must be unique")
        return value


class RecommendedAction(BaseModel):
    """A proposed action with explicit evidence citations."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    action: str = Field(min_length=1, max_length=500)
    rationale: str = Field(min_length=1, max_length=1_000)
    evidence_ids: list[str] = Field(min_length=1, max_length=10)


class BusinessInsight(BaseModel):
    """Structured LLM result that can be checked before display."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    executive_summary: str = Field(min_length=1, max_length=2_000)
    recommended_actions: list[RecommendedAction] = Field(default_factory=list, max_length=10)
    evidence_ids: list[str] = Field(min_length=1, max_length=100)
    limitations: list[str] = Field(default_factory=list, max_length=20)


class JsonInsightProvider(Protocol):
    """A provider that returns JSON text for an evidence-grounded prompt."""

    def generate_json(self, prompt: str) -> str:
        """Return a JSON object encoded as text."""


@dataclass(frozen=True, slots=True)
class InsightResult:
    """Validated insight plus the exact evidence made available to the provider."""

    insight: BusinessInsight
    evidence: list[EvidenceItem]


def build_insight_prompt(request: InsightRequest) -> str:
    """Create a provider-neutral instruction with structured evidence only."""
    evidence_json = json.dumps([item.model_dump() for item in request.evidence], ensure_ascii=False)
    return (
        "You generate concise business insights for a "
        f"{request.audience}. Use only the evidence JSON below. Do not invent facts, "
        "metrics, causes, dates, or entities. Cite every claim using evidence_ids. "
        "Return exactly one JSON object matching this schema: "
        '{"executive_summary":"string","recommended_actions":['
        '{"action":"string","rationale":"string","evidence_ids":["id"]}],'
        '"evidence_ids":["id"],"limitations":["string"]}. Evidence: '
        f"{evidence_json}"
    )


def generate_insight(request: InsightRequest, provider: JsonInsightProvider) -> InsightResult:
    """Generate, parse, and verify a provider response against supplied evidence."""
    raw_response = provider.generate_json(build_insight_prompt(request))
    try:
        insight = BusinessInsight.model_validate_json(raw_response)
    except ValueError as error:
        raise ValueError("Insight provider returned invalid structured output") from error

    allowed_ids = {item.evidence_id for item in request.evidence}
    cited_ids = set(insight.evidence_ids)
    for action in insight.recommended_actions:
        cited_ids.update(action.evidence_ids)
    unknown_ids = cited_ids.difference(allowed_ids)
    if unknown_ids:
        unknown = ", ".join(sorted(unknown_ids))
        raise ValueError(f"Insight cites evidence not supplied to the provider: {unknown}")
    return InsightResult(insight=insight, evidence=request.evidence)
