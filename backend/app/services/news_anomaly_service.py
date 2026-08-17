from typing import Dict, List, Any
from datetime import datetime

MOCK_NEWS: List[Dict[str, Any]] = [
    {
        "id": "news_1",
        "title": "NVIDIA Experiences Volatility Following Supply Chain Assessment on Next-Gen Chips",
        "source": "Bloomberg Intelligence",
        "publishedAt": "12 mins ago",
        "summary": "Analyst reports highlight tight substrate packaging capacity for AI accelerators, though demand remains at record highs across cloud providers.",
        "url": "https://bloomberg.com/news/NVIDIA-supply-chain-check",
        "sentiment": "BEARISH",
        "relatedSymbols": ["NVIDIA", "AMD", "TESLA"]
    },
    {
        "id": "news_2",
        "title": "Microsoft Expands Azure AI Infrastructure Footprint with New Custom Silicon and NVIDIA B200 Clusters",
        "source": "Financial Times",
        "publishedAt": "45 mins ago",
        "summary": "Microsoft announces $12B capital expenditure expansion for enterprise AI models, reinforcing infrastructure commitment.",
        "url": "https://ft.com/tech/microsoft-azure-ai-capex",
        "sentiment": "BULLISH",
        "relatedSymbols": ["MICROSOFT", "NVIDIA"]
    }
]

MOCK_ANOMALIES: List[Dict[str, Any]] = [
    {
        "id": "anom_1",
        "timestamp": datetime.utcnow().strftime("%H:%M:%S UTC"),
        "symbol": "NVIDIA",
        "type": "VOLUME_SPIKE",
        "severity": "HIGH",
        "description": "Abnormal block trade volume detected (2.8x 30-day average ticker velocity)",
        "metrics": {
            "current": "58.4M shares",
            "baseline": "21.0M shares",
            "deviation": "+178%"
        }
    }
]

class NewsAnomalyService:
    @staticmethod
    def get_news(symbol: str = None) -> List[Dict[str, Any]]:
        if symbol:
            sym = symbol.upper()
            filtered = [n for n in MOCK_NEWS if sym in n["relatedSymbols"]]
            if filtered:
                return filtered
        return MOCK_NEWS

    @staticmethod
    def get_anomalies(symbol: str = None) -> List[Dict[str, Any]]:
        if symbol:
            sym = symbol.upper()
            filtered = [a for a in MOCK_ANOMALIES if a["symbol"] == sym]
            if filtered:
                return filtered
        return MOCK_ANOMALIES

news_anomaly_service = NewsAnomalyService()
