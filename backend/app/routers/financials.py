from fastapi import APIRouter, Path
from typing import List
from app.services.analytics_service import analytics_service
from app.schemas import FinancialStatementResponse

router = APIRouter(prefix="/v1", tags=["Financial Analytics"])

@router.get(
    "/financials/{symbol}",
    summary="Fetch Deterministic Fundamental Financials",
    description="Returns deterministic fundamental financial statements (Income Statement, Balance Sheet, Cash Flow, Ratios) calculated strictly via code algorithms.",
    response_model=List[FinancialStatementResponse]
)
def get_financials(
    symbol: str = Path(..., description="Ticker security symbol (e.g. NVDA)")
):
    return analytics_service.get_financial_statements(symbol)
