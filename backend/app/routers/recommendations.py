"""Recommendations API endpoint."""
from fastapi import APIRouter
from app.services.mock_data import generate_recommendations

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])


@router.get("/", summary="Get AI cooling recommendations")
async def get_recommendations():
    """
    Returns AI-generated cooling strategy recommendations.
    
    Each recommendation includes:
    - Expected temperature reduction
    - Energy savings (kWh/year)
    - Estimated implementation cost (INR)
    - Priority score (0-100)
    - Implementation timeline
    """
    data = generate_recommendations()
    return data
