"""Tests for the initial operational endpoints."""

from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_health_check_returns_service_status() -> None:
    """The liveness endpoint reports the API service as available."""
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "customer-review-intelligence-api"}


def test_versioned_health_check_is_available() -> None:
    """Operational routes are exposed through the versioned API prefix."""
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
