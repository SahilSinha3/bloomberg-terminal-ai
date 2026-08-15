from fastapi import APIRouter, Query
from typing import List
from app.services.news_anomaly_service import news_anomaly_service
from app.schemas import NewsArticleResponse, MarketAnomalyResponse

router = APIRouter(prefix="/v1", tags=["News & Anomaly Alerts"])

@router.get(
    "/news",
    summary="Fetch Real-Time Headlines & Sentiment",
    description="Returns breaking financial market headlines with automated entity symbol tags and sentiment classification (BULLISH, BEARISH, NEUTRAL).",
    response_model=List[NewsArticleResponse]
)
def get_news(
    symbol: str = Query(None, description="Optional symbol filter", example="NVDA")
):
    return news_anomaly_service.get_news(symbol)

@router.get(
    "/anomalies",
    summary="Fetch Market Anomaly Alerts",
    description="Returns real-time market anomaly alerts detected by volume velocity spikes, price gaps, and implied volatility breakouts.",
    response_model=List[MarketAnomalyResponse]
)
def get_anomalies(
    symbol: str = Query(None, description="Optional symbol filter", example="NVDA")
):
    return news_anomaly_service.get_anomalies(symbol)
