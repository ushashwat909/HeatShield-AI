"""Hotspots API endpoint."""
from fastapi import APIRouter, Query
from app.services.mock_data import generate_hotspots

router = APIRouter(prefix="/api/hotspots", tags=["Hotspots"])


@router.get("/", summary="Get heat hotspot rankings")
async def get_hotspots(
    top_n: int = Query(10, description="Number of top hotspots to return"),
    city: str = Query("Delhi", description="City name"),
):
    """
    Returns ranked list of urban heat hotspots.
    
    Hotspots are ranked by surface temperature and include:
    - Risk level and score
    - NDVI/NDBI values
    - Priority classification
    - Affected population estimate
    """
    data = generate_hotspots(top_n=top_n)
    return data
