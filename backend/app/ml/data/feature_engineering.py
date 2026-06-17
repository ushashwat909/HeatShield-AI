"""Feature engineering for heat island analysis."""
import numpy as np
from typing import Dict, List


def compute_heat_vulnerability_index(
    ndvi: float,
    ndbi: float,
    lst: float,
    population_density: float,
    building_density: float,
) -> float:
    """
    Compute Heat Vulnerability Index (HVI) from environmental features.
    
    HVI = w1 * norm_LST + w2 * norm_NDBI + w3 * (1 - norm_NDVI) 
        + w4 * norm_pop_density + w5 * norm_building_density
    
    Returns a score from 0 (low vulnerability) to 100 (extreme vulnerability).
    """
    # Normalize features to 0-1
    norm_lst = np.clip((lst - 25) / 30, 0, 1)           # 25-55°C range
    norm_ndbi = np.clip((ndbi + 1) / 2, 0, 1)            # -1 to 1 range
    norm_ndvi_inv = np.clip(1 - (ndvi + 1) / 2, 0, 1)    # Inverse NDVI
    norm_pop = np.clip(population_density / 40000, 0, 1)  # Up to 40k/sqkm
    norm_build = np.clip(building_density, 0, 1)

    # Weighted combination
    weights = {
        "lst": 0.30,
        "ndbi": 0.20,
        "ndvi_inv": 0.25,
        "pop_density": 0.10,
        "building_density": 0.15,
    }

    hvi = (
        weights["lst"] * norm_lst
        + weights["ndbi"] * norm_ndbi
        + weights["ndvi_inv"] * norm_ndvi_inv
        + weights["pop_density"] * norm_pop
        + weights["building_density"] * norm_build
    ) * 100

    return round(float(np.clip(hvi, 0, 100)), 1)


def extract_features_from_geojson(feature: dict) -> Dict[str, float]:
    """Extract ML features from a GeoJSON feature's properties."""
    props = feature.get("properties", {})
    return {
        "ndvi": props.get("ndvi", 0.2),
        "ndbi": props.get("ndbi", 0.5),
        "lst": props.get("land_surface_temp", 42),
        "population_density": props.get("population_density", 15000),
        "building_density": props.get("building_density", 0.5),
    }


def compute_uhi_intensity(urban_temp: float, rural_temp: float = 32.0) -> float:
    """
    Calculate Urban Heat Island intensity.
    UHI Intensity = T_urban - T_rural
    """
    return round(urban_temp - rural_temp, 1)
