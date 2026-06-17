"""Reports API endpoint."""
from fastapi import APIRouter, Query
from datetime import datetime
import uuid

from app.services.mock_data import (
    generate_dashboard_summary,
    generate_hotspots,
    generate_recommendations,
)

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("/", summary="Generate heat analysis report")
async def get_report(
    city: str = Query("Delhi", description="City name"),
    include_heatmap: bool = Query(True),
    include_predictions: bool = Query(True),
    include_recommendations: bool = Query(True),
    include_hotspots: bool = Query(True),
):
    """
    Generates a comprehensive heat analysis report.
    
    The report includes:
    - Dashboard summary statistics
    - Heat hotspot analysis
    - AI recommendations
    - Monthly trends
    
    Returns data suitable for PDF generation.
    """
    report_id = str(uuid.uuid4())[:8].upper()
    summary = generate_dashboard_summary()
    hotspots = generate_hotspots(top_n=10) if include_hotspots else None
    recs = generate_recommendations() if include_recommendations else None

    return {
        "report_id": f"HS-{report_id}",
        "generated_at": datetime.now().isoformat(),
        "city": city,
        "summary": {
            "dashboard": summary,
            "hotspot_analysis": hotspots,
            "recommendations": recs,
            "report_period": {
                "start": "2026-05-01",
                "end": "2026-06-17",
            },
            "total_area_monitored_sqkm": 1483,
            "satellite_passes_analyzed": 42,
            "data_quality_score": 94.5,
        },
        "download_url": None,
    }


@router.get("/dashboard-summary", summary="Get dashboard summary statistics")
async def get_dashboard_summary():
    """Returns current dashboard overview statistics."""
    return generate_dashboard_summary()
