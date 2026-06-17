"""SQLAlchemy ORM models for HeatShield AI."""
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, ForeignKey,
    Text, Boolean, Enum as SQLEnum
)
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    RESEARCHER = "researcher"
    GOVERNMENT_OFFICIAL = "government_official"
    PUBLIC_USER = "public_user"


class RiskLevel(str, enum.Enum):
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    VERY_HIGH = "very_high"
    EXTREME = "extreme"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(String(50), default=UserRole.PUBLIC_USER.value)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    state = Column(String(200))
    country = Column(String(100), default="India")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    population = Column(Integer)
    area_sqkm = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    regions = relationship("Region", back_populates="city")


class Region(Base):
    __tablename__ = "regions"

    id = Column(Integer, primary_key=True, index=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    name = Column(String(200), nullable=False)
    ward_number = Column(String(50))
    area_sqkm = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    city = relationship("City", back_populates="regions")
    heat_measurements = relationship("HeatMeasurement", back_populates="region")
    predictions = relationship("Prediction", back_populates="region")
    recommendations = relationship("Recommendation", back_populates="region")
    simulations = relationship("Simulation", back_populates="region")


class HeatMeasurement(Base):
    __tablename__ = "heat_measurements"

    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    land_surface_temp = Column(Float)  # LST in Celsius
    air_temperature = Column(Float)
    ndvi = Column(Float)  # -1 to 1
    ndbi = Column(Float)  # -1 to 1
    humidity = Column(Float)  # percentage
    wind_speed = Column(Float)  # m/s
    heat_index = Column(Float)
    risk_level = Column(String(50))
    data_source = Column(String(100))

    region = relationship("Region", back_populates="heat_measurements")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=False)
    prediction_date = Column(DateTime, nullable=False)
    predicted_temp = Column(Float, nullable=False)
    predicted_risk_level = Column(String(50))
    confidence = Column(Float)  # 0 to 1
    horizon_days = Column(Integer, nullable=False)  # 7, 30, 90
    model_used = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

    region = relationship("Region", back_populates="predictions")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=False)
    category = Column(String(100), nullable=False)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=False)
    expected_temp_reduction = Column(Float)  # Celsius
    energy_savings_kwh = Column(Float)
    estimated_cost_inr = Column(Float)
    priority_score = Column(Float)  # 0 to 100
    implementation_timeline = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

    region = relationship("Region", back_populates="recommendations")


class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(Integer, ForeignKey("regions.id"))
    trees_added = Column(Integer, default=0)
    cool_roof_coverage_pct = Column(Float, default=0)
    green_roof_coverage_pct = Column(Float, default=0)
    reflective_pavement_pct = Column(Float, default=0)
    baseline_temp = Column(Float)
    simulated_temp = Column(Float)
    temp_reduction = Column(Float)
    energy_savings_kwh = Column(Float)
    carbon_reduction_tons = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    region = relationship("Region", back_populates="simulations")
