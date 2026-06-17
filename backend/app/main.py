"""HeatShield AI — FastAPI Application Entry Point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import heatmap, predictions, hotspots, recommendations, simulator, reports, auth

app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "AI-Powered Urban Heat Island Monitoring and Mitigation Platform. "
        "Provides real-time heat map analysis, AI predictions, hotspot detection, "
        "cooling recommendations, and urban cooling simulation."
    ),
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {"name": "Heat Map", "description": "GeoJSON heat map data"},
        {"name": "Predictions", "description": "AI temperature predictions"},
        {"name": "Hotspots", "description": "Urban heat hotspot detection"},
        {"name": "Recommendations", "description": "AI cooling strategy recommendations"},
        {"name": "Simulator", "description": "Urban cooling simulation engine"},
        {"name": "Reports", "description": "Report generation and dashboard summary"},
        {"name": "Authentication", "description": "User authentication and authorization"},
    ],
)

# CORS middleware
origins = settings.CORS_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(heatmap.router)
app.include_router(predictions.router)
app.include_router(hotspots.router)
app.include_router(recommendations.router)
app.include_router(simulator.router)
app.include_router(reports.router)
app.include_router(auth.router)


@app.get("/", tags=["Root"])
async def root():
    """API root — health check."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs": "/docs",
    }


@app.get("/health", tags=["Root"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": settings.APP_NAME}
