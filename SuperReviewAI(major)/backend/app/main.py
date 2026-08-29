"""FastAPI application entry point."""

from fastapi import FastAPI

from backend.app.config.settings import settings
from backend.app.routers.health import router as health_router
from backend.app.routers.reviews import router as reviews_router
from backend.app.routers.system import router as system_router

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Milestone 1 foundation. Review analysis endpoints are not implemented yet.",
)
app.include_router(health_router)
app.include_router(health_router, prefix=settings.api_v1_prefix)
app.include_router(reviews_router, prefix=settings.api_v1_prefix)
app.include_router(system_router, prefix=settings.api_v1_prefix)
