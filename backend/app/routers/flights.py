from fastapi import APIRouter
from typing import List, Dict, Any
from app.services.flight_service import flight_service

router = APIRouter(prefix="/v1", tags=["FLIGHT Corporate & Live Air Radar"])

@router.get(
    "/flights",
    summary="Fetch Live Global Flight Stream (OpenSky Network + Corporate Jets)",
    description="Returns real-time executive aircraft tracking data and live global flights fetched from OpenSky Network API."
)
async def get_flights() -> List[Dict[str, Any]]:
    return await flight_service.get_live_flights()
