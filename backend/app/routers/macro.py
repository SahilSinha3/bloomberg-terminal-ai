from fastapi import APIRouter
from typing import List, Dict, Any
from app.services.macro_service import macro_service

router = APIRouter(prefix="/v1", tags=["Macro Economic Indicators"])

@router.get(
    "/macro",
    summary="Fetch Federal Reserve FRED Macro Economic Data",
    description="Returns Federal Reserve FRED target interest rates, CPI Inflation, NFP Payrolls, and GDP indicators."
)
def get_macro() -> List[Dict[str, Any]]:
    return macro_service.get_macro_indicators()
