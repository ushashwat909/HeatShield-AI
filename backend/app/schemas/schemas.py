"""Pydantic schemas for request/response validation."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ─── Enums ───────────────────────────────────────────────

class UserRoleEnum(str, Enum):
    admin = "admin"
    researcher = "researcher"
    government_official = "government_official"
    public_user = "public_user"


class RiskLevelEnum(str, Enum):
    low = "low"
    moderate = "moderate"
    high = "high"
    very_high = "very_high"
    extreme = "extreme"


class HorizonEnum(int, Enum):
    week = 7
    month = 30
    quarter = 90


# ─── Auth Schemas ────────────────────────────────────────

class UserLogin(BaseModel):
    username: str
    password: str


class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    email: str
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None
    role: UserRoleEnum = UserRoleEnum.public_user


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ─── City & Region Schemas ───────────────────────────────

class CityResponse(BaseModel):
    id: int
    name: str
    state: Optional[str]
    latitude: float
    longitude: float
    population: Optional[int]
    area_sqkm: Optional[float]


class RegionResponse(BaseModel):
    id: int
    city_id: int
    name: str
    ward_number: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    area_sqkm: Optional[float]


# ─── HeatMap Schemas ─────────────────────────────────────

class HeatMapPoint(BaseModel):
    latitude: float
    longitude: float
    land_surface_temp: float
    ndvi: float
    ndbi: float
    air_temperature: Optional[float]
    humidity: Optional[float]
    risk_level: str
    heat_index: Optional[float]
    region_name: str
    ward_number: Optional[str]


class HeatMapResponse(BaseModel):
    type: str = "FeatureCollection"
    features: List[dict]
    metadata: dict


# ─── Prediction Schemas ──────────────────────────────────

class PredictionPoint(BaseModel):
    date: str
    current_temp: Optional[float]
    predicted_temp: float
    risk_level: str
    confidence: float


class PredictionResponse(BaseModel):
    region_name: str
    horizon_days: int
    current_temperature: float
    average_predicted_temp: float
    max_predicted_temp: float
    risk_level: str
    predictions: List[PredictionPoint]
    trend: str  # "increasing", "decreasing", "stable"
    model_used: str


# ─── Hotspot Schemas ─────────────────────────────────────

class HotspotItem(BaseModel):
    rank: int
    region_name: str
    ward_number: Optional[str]
    latitude: float
    longitude: float
    temperature: float
    risk_level: str
    risk_score: float
    ndvi: float
    ndbi: float
    priority: str  # "Critical", "High", "Medium", "Low"
    population_affected: Optional[int]


class HotspotResponse(BaseModel):
    city: str
    total_hotspots: int
    critical_count: int
    high_count: int
    hotspots: List[HotspotItem]
    timestamp: str


# ─── Recommendation Schemas ──────────────────────────────

class RecommendationItem(BaseModel):
    id: int
    category: str
    title: str
    description: str
    expected_temp_reduction: float
    energy_savings_kwh: float
    estimated_cost_inr: float
    priority_score: float
    implementation_timeline: str
    region_name: str


class RecommendationResponse(BaseModel):
    total_recommendations: int
    recommendations: List[RecommendationItem]
    summary: dict


# ─── Simulator Schemas ───────────────────────────────────

class SimulatorRequest(BaseModel):
    trees_added: int = Field(0, ge=0, le=100000)
    cool_roof_coverage_pct: float = Field(0, ge=0, le=100)
    green_roof_coverage_pct: float = Field(0, ge=0, le=100)
    reflective_pavement_pct: float = Field(0, ge=0, le=100)
    region_id: Optional[int] = None


class SimulatorBreakdown(BaseModel):
    strategy: str
    temp_reduction: float
    energy_savings_kwh: float
    carbon_reduction_tons: float
    cost_estimate_inr: float


class SimulatorResponse(BaseModel):
    baseline_temperature: float
    simulated_temperature: float
    total_temp_reduction: float
    total_energy_savings_kwh: float
    total_carbon_reduction_tons: float
    cost_effectiveness_score: float
    breakdown: List[SimulatorBreakdown]
    monthly_projections: List[dict]


# ─── Report Schemas ──────────────────────────────────────

class ReportRequest(BaseModel):
    city: str = "Delhi"
    include_heatmap: bool = True
    include_predictions: bool = True
    include_recommendations: bool = True
    include_hotspots: bool = True
    date_range_start: Optional[str] = None
    date_range_end: Optional[str] = None


class ReportResponse(BaseModel):
    report_id: str
    generated_at: str
    city: str
    summary: dict
    download_url: Optional[str]
