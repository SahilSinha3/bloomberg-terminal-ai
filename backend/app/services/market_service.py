import random
from datetime import datetime, timedelta
from typing import Dict, List, Any

MOCK_QUOTES: Dict[str, Dict[str, Any]] = {
    "NVDA": {
        "symbol": "NVDA", "name": "NVIDIA Corporation", "price": 172.31, "change": -4.21, "change_percent": -2.38,
        "high_24h": 177.50, "low_24h": 169.80, "volume": 58492010, "market_cap": "$4.21T", "pe_ratio": 52.4,
        "sector": "Semiconductors", "last_updated": datetime.utcnow().isoformat()
    },
    "AAPL": {
        "symbol": "AAPL", "name": "Apple Inc.", "price": 214.20, "change": 1.85, "change_percent": 0.87,
        "high_24h": 215.40, "low_24h": 212.10, "volume": 38920100, "market_cap": "$3.28T", "pe_ratio": 33.1,
        "sector": "Consumer Electronics", "last_updated": datetime.utcnow().isoformat()
    },
    "MSFT": {
        "symbol": "MSFT", "name": "Microsoft Corporation", "price": 521.11, "change": 6.42, "change_percent": 1.25,
        "high_24h": 523.00, "low_24h": 516.80, "volume": 24109200, "market_cap": "$3.87T", "pe_ratio": 37.8,
        "sector": "Software & Cloud", "last_updated": datetime.utcnow().isoformat()
    },
    "AMD": {
        "symbol": "AMD", "name": "Advanced Micro Devices", "price": 181.42, "change": -3.88, "change_percent": -2.09,
        "high_24h": 186.20, "low_24h": 179.90, "volume": 42109800, "market_cap": "$293.4B", "pe_ratio": 48.2,
        "sector": "Semiconductors", "last_updated": datetime.utcnow().isoformat()
    },
    "TSLA": {
        "symbol": "TSLA", "name": "Tesla, Inc.", "price": 248.90, "change": -7.10, "change_percent": -2.77,
        "high_24h": 257.20, "low_24h": 246.50, "volume": 61209300, "market_cap": "$792.1B", "pe_ratio": 64.5,
        "sector": "Automotive & Clean Energy", "last_updated": datetime.utcnow().isoformat()
    },
    "BTC-USD": {
        "symbol": "BTC-USD", "name": "Bitcoin USD", "price": 94820.00, "change": 1420.50, "change_percent": 1.52,
        "high_24h": 95400.00, "low_24h": 92900.00, "volume": 28940200100, "market_cap": "$1.87T", "pe_ratio": 0.0,
        "sector": "Digital Assets", "last_updated": datetime.utcnow().isoformat()
    },
    "SPY": {
        "symbol": "SPY", "name": "SPDR S&P 500 ETF Trust", "price": 592.40, "change": 2.10, "change_percent": 0.36,
        "high_24h": 593.80, "low_24h": 590.20, "volume": 51209400, "market_cap": "$590B", "pe_ratio": 26.8,
        "sector": "Broad Market Index", "last_updated": datetime.utcnow().isoformat()
    }
}

class MarketService:
    @staticmethod
    def get_quotes() -> Dict[str, Dict[str, Any]]:
        return MOCK_QUOTES

    @staticmethod
    def get_quote(symbol: str) -> Dict[str, Any]:
        sym = symbol.upper()
        if sym in MOCK_QUOTES:
            return MOCK_QUOTES[sym]
        return {
            "symbol": sym, "name": f"{sym} Corporation", "price": 150.00, "change": 0.0, "change_percent": 0.0,
            "high_24h": 155.00, "low_24h": 148.00, "volume": 10000000, "market_cap": "$100B", "pe_ratio": 25.0,
            "sector": "Technology", "last_updated": datetime.utcnow().isoformat()
        }

    @staticmethod
    def generate_historical_bars(symbol: str, days: int = 30) -> List[Dict[str, Any]]:
        base_price = MOCK_QUOTES.get(symbol.upper(), {}).get("price", 150.0)
        bars = []
        now = datetime.utcnow()
        current_price = base_price * 0.88

        for i in range(days, -1, -1):
            date_str = (now - timedelta(days=i)).strftime("%Y-%m-%d")
            rand_change = (random.random() - 0.48) * 0.04
            open_p = round(current_price, 2)
            close_p = round(open_p * (1 + rand_change), 2)
            high_p = round(max(open_p, close_p) * (1 + random.random() * 0.015), 2)
            low_p = round(min(open_p, close_p) * (1 - random.random() * 0.015), 2)
            vol = int(20000000 + random.random() * 40000000)

            current_price = close_p
            bars.append({
                "timestamp": date_str,
                "open": open_p,
                "high": high_p,
                "low": low_p,
                "close": close_p,
                "volume": vol,
                "ma20": round(close_p * 0.98, 2),
                "ma50": round(close_p * 0.94, 2)
            })
        return bars

market_service = MarketService()
