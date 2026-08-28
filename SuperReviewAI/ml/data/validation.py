"""Validation and quality reporting for canonical review data."""

from collections import Counter
from dataclasses import dataclass, field
from typing import Any

from pydantic import ValidationError

from ml.data.schema import CanonicalReview


@dataclass(slots=True)
class ValidationReport:
    """Machine-readable counts and record-level validation errors."""

    total_records: int = 0
    valid_records: int = 0
    invalid_records: int = 0
    duplicate_review_ids: int = 0
    missing_by_field: Counter[str] = field(default_factory=Counter)
    errors: list[dict[str, Any]] = field(default_factory=list)

    def as_dict(self) -> dict[str, Any]:
        """Serialize the report for JSON output or API use."""
        return {
            "total_records": self.total_records,
            "valid_records": self.valid_records,
            "invalid_records": self.invalid_records,
            "duplicate_review_ids": self.duplicate_review_ids,
            "missing_by_field": dict(self.missing_by_field),
            "errors": self.errors,
        }


def validate_records(records: list[dict[str, Any]]) -> tuple[list[CanonicalReview], ValidationReport]:
    """Validate records and return valid records plus a transparent report."""
    report = ValidationReport(total_records=len(records))
    valid: list[CanonicalReview] = []
    seen_review_ids: set[str] = set()

    for row_number, record in enumerate(records, start=1):
        for field_name, value in record.items():
            if value is None or (isinstance(value, str) and not value.strip()):
                report.missing_by_field[field_name] += 1
        try:
            review = CanonicalReview.model_validate(record)
        except ValidationError as error:
            report.invalid_records += 1
            report.errors.append({"row": row_number, "errors": error.errors(include_url=False)})
            continue

        if review.review_id in seen_review_ids:
            report.duplicate_review_ids += 1
            report.invalid_records += 1
            report.errors.append({"row": row_number, "errors": [{"msg": "duplicate review_id"}]})
            continue

        seen_review_ids.add(review.review_id)
        valid.append(review)
        report.valid_records += 1

    return valid, report
