"""Realistic mock data generators for all HeatShield AI API endpoints.

Data is centered on Delhi, India with realistic temperature ranges,
NDVI/NDBI values, and geographic coordinates.
"""
import random
import math
from datetime import datetime, timedelta
from typing import List, Optional

# Delhi regions with realistic coordinates
DELHI_REGIONS = [
    {"name": "Connaught Place", "ward": "W-01", "lat": 28.6315, "lon": 77.2167, "type": "commercial"},
    {"name": "Chandni Chowk", "ward": "W-02", "lat": 28.6506, "lon": 77.2334, "type": "old_city"},
    {"name": "Karol Bagh", "ward": "W-03", "lat": 28.6519, "lon": 77.1907, "type": "commercial"},
    {"name": "Saket", "ward": "W-04", "lat": 28.5244, "lon": 77.2066, "type": "residential"},
    {"name": "Dwarka", "ward": "W-05", "lat": 28.5823, "lon": 77.0500, "type": "residential"},
    {"name": "Nehru Place", "ward": "W-06", "lat": 28.5491, "lon": 77.2533, "type": "commercial"},
    {"name": "Lajpat Nagar", "ward": "W-07", "lat": 28.5677, "lon": 77.2433, "type": "commercial"},
    {"name": "Rohini", "ward": "W-08", "lat": 28.7321, "lon": 77.1199, "type": "residential"},
    {"name": "Janakpuri", "ward": "W-09", "lat": 28.6219, "lon": 77.0878, "type": "residential"},
    {"name": "Mayur Vihar", "ward": "W-10", "lat": 28.5937, "lon": 77.2973, "type": "residential"},
    {"name": "Pitampura", "ward": "W-11", "lat": 28.7019, "lon": 77.1316, "type": "residential"},
    {"name": "Anand Vihar", "ward": "W-12", "lat": 28.6469, "lon": 77.3164, "type": "mixed"},
    {"name": "Shahdara", "ward": "W-13", "lat": 28.6741, "lon": 77.2894, "type": "industrial"},
    {"name": "Okhla Industrial", "ward": "W-14", "lat": 28.5307, "lon": 77.2713, "type": "industrial"},
    {"name": "Narela", "ward": "W-15", "lat": 28.8526, "lon": 77.0929, "type": "semi_urban"},
    {"name": "India Gate", "ward": "W-16", "lat": 28.6129, "lon": 77.2295, "type": "green_space"},
    {"name": "Lodhi Garden Area", "ward": "W-17", "lat": 28.5931, "lon": 77.2197, "type": "green_space"},
    {"name": "ITO", "ward": "W-18", "lat": 28.6281, "lon": 77.2428, "type": "commercial"},
    {"name": "Noida Border", "ward": "W-19", "lat": 28.5706, "lon": 77.3273, "type": "mixed"},
    {"name": "Mundka Industrial", "ward": "W-20", "lat": 28.6839, "lon": 77.0293, "type": "industrial"},
]


def _get_base_temp(region_type: str) -> float:
    """Get baseline temperature based on land use type."""
    base_temps = {
        "commercial": 44.5,
        "old_city": 46.0,
        "residential": 42.0,
        "industrial": 47.5,
        "mixed": 43.5,
        "semi_urban": 40.0,
        "green_space": 37.5,
    }
    return base_temps.get(region_type, 43.0)


def _get_ndvi(region_type: str) -> float:
    """Get NDVI based on land use type."""
    ndvi_map = {
        "commercial": random.uniform(0.05, 0.15),
        "old_city": random.uniform(0.03, 0.10),
        "residential": random.uniform(0.15, 0.35),
        "industrial": random.uniform(0.02, 0.08),
        "mixed": random.uniform(0.10, 0.25),
        "semi_urban": random.uniform(0.25, 0.45),
        "green_space": random.uniform(0.55, 0.80),
    }
    return round(ndvi_map.get(region_type, 0.15), 3)


def _get_ndbi(region_type: str) -> float:
    """Get NDBI based on land use type."""
    ndbi_map = {
        "commercial": random.uniform(0.55, 0.75),
        "old_city": random.uniform(0.65, 0.85),
        "residential": random.uniform(0.35, 0.55),
        "industrial": random.uniform(0.70, 0.90),
        "mixed": random.uniform(0.40, 0.60),
        "semi_urban": random.uniform(0.20, 0.40),
        "green_space": random.uniform(0.05, 0.15),
    }
    return round(ndbi_map.get(region_type, 0.45), 3)


def _risk_level(temp: float) -> str:
    """Determine risk level from temperature."""
    if temp >= 48:
        return "extreme"
    elif temp >= 45:
        return "very_high"
    elif temp >= 42:
        return "high"
    elif temp >= 38:
        return "moderate"
    return "low"


def _risk_score(temp: float) -> float:
    """Calculate risk score 0-100 from temperature."""
    return round(min(100, max(0, (temp - 30) * 5)), 1)


def _priority(risk: str) -> str:
    """Map risk level to priority."""
    return {
        "extreme": "Critical",
        "very_high": "Critical",
        "high": "High",
        "moderate": "Medium",
        "low": "Low",
    }.get(risk, "Medium")


# ─── HeatMap Data ────────────────────────────────────────

def generate_heatmap_geojson(layer_type: str = "lst") -> dict:
    """Generate realistic GeoJSON heatmap data for Delhi."""
    features = []

    for i, region in enumerate(DELHI_REGIONS):
        base_temp = _get_base_temp(region["type"])
        temp = round(base_temp + random.uniform(-2, 3), 1)
        ndvi = _get_ndvi(region["type"])
        ndbi = _get_ndbi(region["type"])
        risk = _risk_level(temp)

        # Create a polygon around each region center
        offset = 0.012
        coords = [
            [region["lon"] - offset, region["lat"] - offset],
            [region["lon"] + offset, region["lat"] - offset],
            [region["lon"] + offset, region["lat"] + offset],
            [region["lon"] - offset, region["lat"] + offset],
            [region["lon"] - offset, region["lat"] - offset],
        ]

        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [coords],
            },
            "properties": {
                "id": i + 1,
                "name": region["name"],
                "ward": region["ward"],
                "land_surface_temp": temp,
                "air_temperature": round(temp - random.uniform(3, 6), 1),
                "ndvi": ndvi,
                "ndbi": ndbi,
                "humidity": round(random.uniform(25, 55), 1),
                "wind_speed": round(random.uniform(2, 12), 1),
                "risk_level": risk,
                "risk_score": _risk_score(temp),
                "heat_index": round(temp + random.uniform(2, 8), 1),
                "land_use": region["type"],
                "population_density": random.randint(5000, 35000),
            },
        }
        features.append(feature)

    # Add extra scattered heatmap points for density
    for j in range(60):
        lat = 28.45 + random.uniform(0, 0.45)
        lon = 77.0 + random.uniform(0, 0.35)
        temp = round(random.uniform(36, 50), 1)
        features.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [lon, lat]},
            "properties": {
                "id": 100 + j,
                "land_surface_temp": temp,
                "ndvi": round(random.uniform(0.02, 0.6), 3),
                "ndbi": round(random.uniform(0.1, 0.85), 3),
                "risk_level": _risk_level(temp),
                "risk_score": _risk_score(temp),
            },
        })

    return {
        "type": "FeatureCollection",
        "features": features,
        "metadata": {
            "city": "Delhi",
            "data_source": "Landsat-9 / Sentinel-2",
            "acquisition_date": datetime.now().strftime("%Y-%m-%d"),
            "layer_type": layer_type,
            "total_features": len(features),
            "temperature_range": {"min": 35.0, "max": 52.0, "unit": "°C"},
        },
    }


# ─── Predictions Data ───────────────────────────────────

def generate_predictions(region_id: Optional[int] = None, horizon: int = 30) -> dict:
    """Generate temperature prediction data."""
    region = DELHI_REGIONS[min(region_id or 0, len(DELHI_REGIONS) - 1)]
    base_temp = _get_base_temp(region["type"])
    current_temp = round(base_temp + random.uniform(-1, 2), 1)

    predictions = []
    now = datetime.now()

    for day in range(horizon):
        date = now + timedelta(days=day)
        # Simulate seasonal variation
        seasonal_factor = math.sin((day / horizon) * math.pi) * 2
        noise = random.uniform(-1.5, 1.5)
        pred_temp = round(current_temp + seasonal_factor + noise + (day * 0.03), 1)

        predictions.append({
            "date": date.strftime("%Y-%m-%d"),
            "current_temp": current_temp if day == 0 else None,
            "predicted_temp": pred_temp,
            "risk_level": _risk_level(pred_temp),
            "confidence": round(max(0.65, 0.95 - (day * 0.003)), 2),
        })

    avg_pred = round(sum(p["predicted_temp"] for p in predictions) / len(predictions), 1)
    max_pred = max(p["predicted_temp"] for p in predictions)

    # Determine trend
    first_half = sum(p["predicted_temp"] for p in predictions[:len(predictions)//2])
    second_half = sum(p["predicted_temp"] for p in predictions[len(predictions)//2:])
    if second_half > first_half * 1.02:
        trend = "increasing"
    elif second_half < first_half * 0.98:
        trend = "decreasing"
    else:
        trend = "stable"

    return {
        "region_name": region["name"],
        "horizon_days": horizon,
        "current_temperature": current_temp,
        "average_predicted_temp": avg_pred,
        "max_predicted_temp": round(max_pred, 1),
        "risk_level": _risk_level(avg_pred),
        "predictions": predictions,
        "trend": trend,
        "model_used": "XGBoost + Random Forest Ensemble",
    }


# ─── Hotspots Data ───────────────────────────────────────

def generate_hotspots(top_n: int = 10) -> dict:
    """Generate top heat hotspot data."""
    hotspots = []

    for region in DELHI_REGIONS:
        base_temp = _get_base_temp(region["type"])
        temp = round(base_temp + random.uniform(-1, 4), 1)
        risk = _risk_level(temp)
        hotspots.append({
            "region_name": region["name"],
            "ward_number": region["ward"],
            "latitude": region["lat"],
            "longitude": region["lon"],
            "temperature": temp,
            "risk_level": risk,
            "risk_score": _risk_score(temp),
            "ndvi": _get_ndvi(region["type"]),
            "ndbi": _get_ndbi(region["type"]),
            "priority": _priority(risk),
            "population_affected": random.randint(15000, 250000),
        })

    # Sort by temperature descending
    hotspots.sort(key=lambda x: x["temperature"], reverse=True)
    hotspots = hotspots[:top_n]

    # Add rank
    for i, h in enumerate(hotspots):
        h["rank"] = i + 1

    critical = sum(1 for h in hotspots if h["priority"] == "Critical")
    high = sum(1 for h in hotspots if h["priority"] == "High")

    return {
        "city": "Delhi",
        "total_hotspots": len(hotspots),
        "critical_count": critical,
        "high_count": high,
        "hotspots": hotspots,
        "timestamp": datetime.now().isoformat(),
    }


# ─── Recommendations Data ───────────────────────────────

def generate_recommendations() -> dict:
    """Generate AI-based cooling recommendations."""
    recs = [
        {
            "id": 1,
            "category": "Vegetation",
            "title": "Increase Urban Tree Canopy Cover",
            "description": "Deploy drought-resistant native tree species in identified heat corridors. Focus on Neem, Peepal, and Banyan trees that provide maximum canopy coverage. Target areas with NDVI below 0.15.",
            "expected_temp_reduction": 2.8,
            "energy_savings_kwh": 45000,
            "estimated_cost_inr": 12500000,
            "priority_score": 92,
            "implementation_timeline": "6-12 months",
            "region_name": "Chandni Chowk",
        },
        {
            "id": 2,
            "category": "Cool Roofs",
            "title": "Implement Cool Roof Program",
            "description": "Apply high-albedo reflective coatings on commercial and residential buildings. White or light-colored roof surfaces can reduce surface temperature by 20-30°C compared to dark roofs.",
            "expected_temp_reduction": 3.5,
            "energy_savings_kwh": 62000,
            "estimated_cost_inr": 8500000,
            "priority_score": 88,
            "implementation_timeline": "3-6 months",
            "region_name": "Okhla Industrial",
        },
        {
            "id": 3,
            "category": "Green Infrastructure",
            "title": "Install Green Roof Systems",
            "description": "Deploy modular green roof systems on government and commercial buildings. Vegetated roofs provide insulation, reduce stormwater runoff, and lower ambient temperature.",
            "expected_temp_reduction": 2.2,
            "energy_savings_kwh": 38000,
            "estimated_cost_inr": 18000000,
            "priority_score": 76,
            "implementation_timeline": "6-18 months",
            "region_name": "Connaught Place",
        },
        {
            "id": 4,
            "category": "Reflective Pavements",
            "title": "Deploy High-Albedo Pavements",
            "description": "Replace dark asphalt surfaces with reflective pavement materials in major arterial roads and parking lots. Cool pavements can reduce surface temperature by 5-10°C.",
            "expected_temp_reduction": 1.8,
            "energy_savings_kwh": 28000,
            "estimated_cost_inr": 22000000,
            "priority_score": 71,
            "implementation_timeline": "12-24 months",
            "region_name": "Mundka Industrial",
        },
        {
            "id": 5,
            "category": "Water Features",
            "title": "Restore and Create Urban Water Bodies",
            "description": "Rejuvenate existing water bodies and create new water features in heat hotspot zones. Evaporative cooling from water surfaces can reduce surrounding air temperature by 1-3°C.",
            "expected_temp_reduction": 1.5,
            "energy_savings_kwh": 15000,
            "estimated_cost_inr": 35000000,
            "priority_score": 65,
            "implementation_timeline": "12-36 months",
            "region_name": "Shahdara",
        },
        {
            "id": 6,
            "category": "Urban Planning",
            "title": "Optimize Building Orientation and Spacing",
            "description": "Enforce urban planning guidelines for new constructions to maximize wind corridors and minimize heat trapping. Implement mandatory setback rules and height restrictions.",
            "expected_temp_reduction": 1.2,
            "energy_savings_kwh": 20000,
            "estimated_cost_inr": 5000000,
            "priority_score": 60,
            "implementation_timeline": "24-48 months",
            "region_name": "Karol Bagh",
        },
        {
            "id": 7,
            "category": "Smart Systems",
            "title": "Deploy IoT-Based Heat Monitoring Network",
            "description": "Install a network of IoT temperature and humidity sensors across the city for real-time heat monitoring. Enable predictive alerts and automated cooling system activation.",
            "expected_temp_reduction": 0.5,
            "energy_savings_kwh": 55000,
            "estimated_cost_inr": 15000000,
            "priority_score": 82,
            "implementation_timeline": "3-9 months",
            "region_name": "Citywide",
        },
        {
            "id": 8,
            "category": "Vegetation",
            "title": "Develop Urban Parks and Green Belts",
            "description": "Create new urban parks and expand existing green belts connecting fragmented green spaces. Target minimum 0.5 hectare parks within 500m walking distance of all residential areas.",
            "expected_temp_reduction": 3.0,
            "energy_savings_kwh": 40000,
            "estimated_cost_inr": 50000000,
            "priority_score": 85,
            "implementation_timeline": "12-36 months",
            "region_name": "Rohini",
        },
    ]

    total_reduction = sum(r["expected_temp_reduction"] for r in recs)
    total_savings = sum(r["energy_savings_kwh"] for r in recs)
    total_cost = sum(r["estimated_cost_inr"] for r in recs)

    return {
        "total_recommendations": len(recs),
        "recommendations": recs,
        "summary": {
            "total_expected_temp_reduction": round(total_reduction, 1),
            "total_energy_savings_kwh": total_savings,
            "total_estimated_cost_inr": total_cost,
            "average_priority_score": round(sum(r["priority_score"] for r in recs) / len(recs), 1),
            "categories": list(set(r["category"] for r in recs)),
        },
    }


# ─── Simulator Data ──────────────────────────────────────

def generate_simulation(
    trees: int = 0,
    cool_roof: float = 0,
    green_roof: float = 0,
    reflective_pavement: float = 0,
) -> dict:
    """Run urban cooling simulation with given parameters."""
    baseline_temp = 45.2  # Delhi summer baseline

    # Cooling coefficients (based on research literature)
    tree_reduction = min(trees * 0.00035, 4.0)  # Max 4°C from trees
    cool_roof_reduction = cool_roof * 0.04  # Max 4°C at 100%
    green_roof_reduction = green_roof * 0.025  # Max 2.5°C at 100%
    pavement_reduction = reflective_pavement * 0.02  # Max 2°C at 100%

    total_reduction = round(
        tree_reduction + cool_roof_reduction + green_roof_reduction + pavement_reduction,
        2,
    )
    simulated_temp = round(baseline_temp - total_reduction, 1)

    # Energy savings (kWh per year)
    tree_energy = trees * 4.5
    cool_roof_energy = cool_roof * 650
    green_roof_energy = green_roof * 420
    pavement_energy = reflective_pavement * 280
    total_energy = round(tree_energy + cool_roof_energy + green_roof_energy + pavement_energy)

    # Carbon reduction (tons CO2 per year)
    total_carbon = round(total_energy * 0.00082, 2)

    # Cost estimates (INR)
    tree_cost = trees * 2500
    cool_roof_cost = cool_roof * 85000
    green_roof_cost = green_roof * 180000
    pavement_cost = reflective_pavement * 220000
    total_cost = tree_cost + cool_roof_cost + green_roof_cost + pavement_cost

    # Cost effectiveness
    cost_effectiveness = round(total_reduction / max(total_cost / 1000000, 0.01), 2)

    breakdown = [
        {
            "strategy": "Tree Plantation",
            "temp_reduction": round(tree_reduction, 2),
            "energy_savings_kwh": round(tree_energy),
            "carbon_reduction_tons": round(tree_energy * 0.00082, 2),
            "cost_estimate_inr": tree_cost,
        },
        {
            "strategy": "Cool Roof Coverage",
            "temp_reduction": round(cool_roof_reduction, 2),
            "energy_savings_kwh": round(cool_roof_energy),
            "carbon_reduction_tons": round(cool_roof_energy * 0.00082, 2),
            "cost_estimate_inr": cool_roof_cost,
        },
        {
            "strategy": "Green Roof Systems",
            "temp_reduction": round(green_roof_reduction, 2),
            "energy_savings_kwh": round(green_roof_energy),
            "carbon_reduction_tons": round(green_roof_energy * 0.00082, 2),
            "cost_estimate_inr": green_roof_cost,
        },
        {
            "strategy": "Reflective Pavements",
            "temp_reduction": round(pavement_reduction, 2),
            "energy_savings_kwh": round(pavement_energy),
            "carbon_reduction_tons": round(pavement_energy * 0.00082, 2),
            "cost_estimate_inr": pavement_cost,
        },
    ]

    # Monthly projections (12 months)
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    seasonal_temps = [18, 22, 30, 38, 44, 46, 40, 36, 36, 32, 24, 19]
    monthly = []
    for i, (month, seasonal_temp) in enumerate(zip(months, seasonal_temps)):
        reduction_factor = min(1.0, (i + 1) / 6)  # Gradual implementation
        monthly.append({
            "month": month,
            "baseline_temp": seasonal_temp,
            "mitigated_temp": round(seasonal_temp - total_reduction * reduction_factor, 1),
            "reduction": round(total_reduction * reduction_factor, 1),
        })

    return {
        "baseline_temperature": baseline_temp,
        "simulated_temperature": simulated_temp,
        "total_temp_reduction": total_reduction,
        "total_energy_savings_kwh": total_energy,
        "total_carbon_reduction_tons": total_carbon,
        "cost_effectiveness_score": cost_effectiveness,
        "breakdown": breakdown,
        "monthly_projections": monthly,
    }


# ─── Dashboard Summary ──────────────────────────────────

def generate_dashboard_summary() -> dict:
    """Generate dashboard overview statistics."""
    return {
        "current_temperature": round(random.uniform(42, 47), 1),
        "avg_lst": round(random.uniform(43, 48), 1),
        "max_lst": round(random.uniform(48, 53), 1),
        "min_lst": round(random.uniform(35, 40), 1),
        "avg_ndvi": round(random.uniform(0.15, 0.25), 3),
        "avg_ndbi": round(random.uniform(0.45, 0.60), 3),
        "total_hotspots": random.randint(8, 15),
        "critical_zones": random.randint(3, 6),
        "overall_risk": "high",
        "monitored_area_sqkm": 1483,
        "population_at_risk": random.randint(2500000, 4500000),
        "active_sensors": random.randint(120, 180),
        "last_satellite_pass": (datetime.now() - timedelta(hours=random.randint(2, 12))).isoformat(),
        "data_source": "Landsat-9 / Sentinel-2",
        "trend_7day": round(random.uniform(-0.5, 1.5), 1),
        "trend_30day": round(random.uniform(0.5, 3.0), 1),
    }
