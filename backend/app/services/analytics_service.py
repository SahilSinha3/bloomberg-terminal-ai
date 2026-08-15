from typing import Dict, List, Any

FINANCIAL_DATA: Dict[str, List[Dict[str, Any]]] = {
    "NVDA": [
        {
            "period": "Q2 2026", "revenue": 30040, "grossProfit": 22580, "operatingIncome": 18640,
            "netIncome": 16590, "eps": 0.68, "freeCashFlow": 13480, "cashAndEquivalents": 34800,
            "totalDebt": 8460, "grossMarginPercent": 75.1, "operatingMarginPercent": 62.0,
            "peRatio": 52.4, "evToEbitda": 42.1
        },
        {
            "period": "Q1 2026", "revenue": 26044, "grossProfit": 20406, "operatingIncome": 16909,
            "netIncome": 14881, "eps": 0.60, "freeCashFlow": 11200, "cashAndEquivalents": 31400,
            "totalDebt": 8460, "grossMarginPercent": 78.4, "operatingMarginPercent": 64.9,
            "peRatio": 58.2, "evToEbitda": 46.8
        },
        {
            "period": "Q4 2025", "revenue": 22103, "grossProfit": 16761, "operatingIncome": 13615,
            "netIncome": 12285, "eps": 0.51, "freeCashFlow": 11217, "cashAndEquivalents": 25980,
            "totalDebt": 8460, "grossMarginPercent": 76.0, "operatingMarginPercent": 61.6,
            "peRatio": 64.1, "evToEbitda": 50.2
        }
    ]
}

class AnalyticsService:
    @staticmethod
    def get_financial_statements(symbol: str) -> List[Dict[str, Any]]:
        sym = symbol.upper()
        if sym in FINANCIAL_DATA:
            return FINANCIAL_DATA[sym]
        # Return fallback deterministic financials for any ticker
        return [
            {
                "period": "Q2 2026", "revenue": 25000, "grossProfit": 18000, "operatingIncome": 12000,
                "netIncome": 10000, "eps": 0.50, "freeCashFlow": 8500, "cashAndEquivalents": 20000,
                "totalDebt": 5000, "grossMarginPercent": 72.0, "operatingMarginPercent": 48.0,
                "peRatio": 35.0, "evToEbitda": 28.0
            }
        ]

    @staticmethod
    def calculate_metrics(revenue: float, gross_profit: float, operating_income: float) -> Dict[str, float]:
        """Strict deterministic mathematical calculations. LLMs are never trusted to calculate metrics."""
        gross_margin = round((gross_profit / revenue) * 100, 2) if revenue > 0 else 0.0
        operating_margin = round((operating_income / revenue) * 100, 2) if revenue > 0 else 0.0
        return {
            "gross_margin_percent": gross_margin,
            "operating_margin_percent": operating_margin
        }

analytics_service = AnalyticsService()
