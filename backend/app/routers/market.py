from fastapi import APIRouter, Path, Query
from typing import Dict, List, Any
from app.services.market_service import market_service
from app.schemas import SecurityQuoteResponse, OHLCVBarResponse

router = APIRouter(prefix="/v1", tags=["Market Data & Quotes"])

@router.get(
    "/quotes",
    summary="Fetch All Market Quotes",
    description="Returns real-time price quotes, intraday high/low, volume, market cap, and P/E ratios for all tracked securities.",
    response_model=Dict[str, SecurityQuoteResponse]
)
def get_quotes():
    return market_service.get_quotes()

@router.get(
    "/quotes/{symbol}",
    summary="Fetch Single Security Quote",
    description="Returns normalized market quote details for a specific ticker symbol (e.g. NVIDIA, APPLE, BTC-USD).",
    response_model=SecurityQuoteResponse
)
def get_quote(
    symbol: str = Path(..., description="Ticker security symbol (e.g., NVIDIA, APPLE, BTC-USD)")
):
    return market_service.get_quote(symbol)

@router.get(
    "/historical-bars/{symbol}",
    summary="Fetch Historical OHLCV Price Bars",
    description="Returns historical daily OHLCV bars alongside calculated Moving Averages (MA20, MA50) for financial charting.",
    response_model=List[OHLCVBarResponse]
)
def get_historical_bars(
    symbol: str = Path(..., description="Ticker security symbol"),
    days: int = Query(30, description="Number of historical days to retrieve", ge=1, le=365)
):
    return market_service.generate_historical_bars(symbol, days)
