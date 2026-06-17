"""Heatmap API endpoint."""
from fastapi import APIRouter, Query
from app.services.mock_data import generate_heatmap_geojson

router = APIRouter(prefix="/api/heatmap", tags=["Heat Map"])


@router.get("/", summary="Get heat map GeoJSON data")
async def get_heatmap(
    layer: str = Query("lst", description="Layer type: lst, ndvi, ndbi, vulnerability"),
    city: str = Query("Delhi", description="City name"),
):
    """
    Returns GeoJSON FeatureCollection with heat measurement data.
    
    Supports layer types:
    - **lst**: Land Surface Temperature
    - **ndvi**: Normalized Difference Vegetation Index
    - **ndbi**: Normalized Difference Built-up Index
    - **vulnerability**: Heat Vulnerability Index
    """
    data = generate_heatmap_geojson(layer_type=layer)
    return data
