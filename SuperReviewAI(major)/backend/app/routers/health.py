"""Operational health endpoints."""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["operations"])


class ServiceStatus(BaseModel):
    """A minimal, non-sensitive service status response."""

    status: str
    service: str


@router.get("/health", response_model=ServiceStatus, summary="Liveness check")
def health_check() -> ServiceStatus:
    """Return a liveness response without checking external dependencies."""
    return ServiceStatus(status="ok", service="customer-review-intelligence-api")


@router.get("/ready", response_model=ServiceStatus, summary="Readiness check")
def readiness_check() -> ServiceStatus:
    """Return readiness for the current dependency-free Milestone 1 service."""
    return ServiceStatus(status="ready", service="customer-review-intelligence-api")
