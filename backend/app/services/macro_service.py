from typing import List, Dict, Any

MOCK_MACRO: List[Dict[str, Any]] = [
    {
        "indicator": "Fed Funds Target Rate",
        "current": "5.25%",
        "previous": "5.50%",
        "frequency": "Monthly",
        "releaseDate": "2026-07-30",
        "source": "Federal Reserve FRED API",
        "impact": "HIGH",
        "sentiment": "NEUTRAL"
    },
    {
        "indicator": "US CPI Inflation YoY",
        "current": "2.6%",
        "previous": "2.8%",
        "frequency": "Monthly",
        "releaseDate": "2026-08-12",
        "source": "US Bureau of Labor Statistics",
        "impact": "HIGH",
        "sentiment": "BULLISH"
    },
    {
        "indicator": "Non-Farm Payrolls (NFP)",
        "current": "+185,000",
        "previous": "+160,000",
        "frequency": "Monthly",
        "releaseDate": "2026-08-07",
        "source": "US Bureau of Labor Statistics",
        "impact": "HIGH",
        "sentiment": "BULLISH"
    },
    {
        "indicator": "US Real GDP Annualized",
        "current": "+2.8%",
        "previous": "+2.4%",
        "frequency": "Quarterly",
        "releaseDate": "2026-07-25",
        "source": "US Bureau of Economic Analysis",
        "impact": "MEDIUM",
        "sentiment": "BULLISH"
    }
]

class MacroService:
    @staticmethod
    def get_macro_indicators() -> List[Dict[str, Any]]:
        return MOCK_MACRO

macro_service = MacroService()
