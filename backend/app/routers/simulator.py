"""Simulator API endpoint."""
from fastapi import APIRouter
from app.schemas.schemas import SimulatorRequest
from app.services.mock_data import generate_simulation

router = APIRouter(prefix="/api/simulator", tags=["Simulator"])


@router.post("/", summary="Run urban cooling simulation")
async def run_simulation(request: SimulatorRequest):
    """
    Simulates urban cooling strategies and estimates impact.
    
    Input parameters:
    - **trees_added**: Number of trees to plant (0-100,000)
    - **cool_roof_coverage_pct**: Cool roof coverage percentage (0-100%)
    - **green_roof_coverage_pct**: Green roof coverage percentage (0-100%)
    - **reflective_pavement_pct**: Reflective pavement percentage (0-100%)
    
    Returns temperature reduction, energy savings, carbon reduction,
    cost-effectiveness score, and monthly projections.
    """
    data = generate_simulation(
        trees=request.trees_added,
        cool_roof=request.cool_roof_coverage_pct,
        green_roof=request.green_roof_coverage_pct,
        reflective_pavement=request.reflective_pavement_pct,
    )
    return data
