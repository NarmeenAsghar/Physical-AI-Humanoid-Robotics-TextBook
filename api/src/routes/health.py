"""
Health check endpoint.
"""
from fastapi import APIRouter

from ..models.schemas import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.

    Returns:
        HealthResponse with status and version
    """
    print("Health check endpoint called")
    return HealthResponse(
        status="healthy",
        version="1.0.0"
    )
