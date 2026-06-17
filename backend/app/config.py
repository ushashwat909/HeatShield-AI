"""Application configuration using environment variables."""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "HeatShield AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./heatshield.db"

    # JWT Authentication
    SECRET_KEY: str = "heatshield-ai-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # ML Model Paths
    ML_MODEL_DIR: str = "./app/ml/saved_models"

    # City Configuration (default: Delhi)
    DEFAULT_CITY: str = "Delhi"
    DEFAULT_LAT: float = 28.6139
    DEFAULT_LON: float = 77.2090

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
