"""Predictions API endpoint."""
from fastapi import APIRouter, Query
from app.services.mock_data import generate_predictions

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])


@router.get("/", summary="Get temperature predictions")
async def get_predictions(
    region_id: int = Query(0, description="Region ID (0-19)"),
    horizon: int = Query(30, description="Prediction horizon in days (7, 30, 90)"),
):
    """
    Returns AI-generated temperature predictions.
    
    Prediction horizons:
    - **7 days**: Short-term forecast with high confidence
    - **30 days**: Medium-term forecast
    - **90 days**: Long-term trend analysis
    """
    data = generate_predictions(region_id=region_id, horizon=horizon)
    return data
