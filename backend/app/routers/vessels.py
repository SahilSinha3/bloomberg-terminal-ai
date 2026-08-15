from fastapi import APIRouter
from typing import List, Dict, Any
from app.services.vessel_service import vessel_service

router = APIRouter(prefix="/v1", tags=["AIS Vessel & Tanker Tracking"])

@router.get(
    "/vessels",
    summary="Fetch Global AIS Vessel & Oil Tanker Stream",
    description="Returns live satellite tracking data for crude oil supertankers (VLCCs), LNG carriers, and container ships across global chokepoints."
)
def get_vessels() -> List[Dict[str, Any]]:
    return vessel_service.get_vessels()
