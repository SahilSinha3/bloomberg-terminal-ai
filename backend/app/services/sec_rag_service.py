from typing import Dict, List, Any

MOCK_FILINGS: List[Dict[str, Any]] = [
    {
        "id": "doc_nvda_q2_2026",
        "symbol": "NVDA",
        "type": "10-Q",
        "filingDate": "2026-08-01",
        "period": "Q2 FY2026",
        "accessionNumber": "0001045810-26-000042",
        "title": "NVIDIA Corp Form 10-Q for Quarterly Period Ended July 28, 2026",
        "summary": "Quarterly report detailing Data Center revenue growth of 154% YoY driven by Blackwell B200 architecture deployment, offset by supply chain constraints on CoWoS packaging.",
        "contentChunks": [
            {
                "chunkId": "chunk_nvda_1",
                "section": "Item 2. Management Discussion & Analysis",
                "page": 14,
                "text": "Data Center revenue for the second quarter of fiscal 2026 was $26.3 billion, up 16% sequentially and up 154% from a year ago. Demand for our Blackwell GPU platform exceeded available supply, with gross margin contracting slightly to 75.1% due to component cost mix adjustments during initial production ramp.",
                "highlightKeywords": ["Data Center", "Blackwell GPU", "gross margin", "75.1%"]
            },
            {
                "chunkId": "chunk_nvda_2",
                "section": "Item 1A. Risk Factors",
                "page": 28,
                "text": "Our reliance on single-source semiconductor foundries, particularly TSMC for advanced 4N process node packaging (CoWoS), creates exposure to capacity bottlenecks. Any disruption in substrate availability could adversely affect shipment schedules for enterprise AI servers.",
                "highlightKeywords": ["TSMC", "CoWoS", "capacity bottlenecks", "packaging"]
            }
        ]
    }
]

class SECRagService:
    @staticmethod
    def get_filings(symbol: str) -> List[Dict[str, Any]]:
        sym = symbol.upper()
        results = [f for f in MOCK_FILINGS if f["symbol"] == sym]
        if results:
            return results
        return MOCK_FILINGS

    @staticmethod
    def search_chunks(symbol: str, query: str) -> List[Dict[str, Any]]:
        query_words = set(query.lower().split())
        matched_chunks = []

        for filing in SECRagService.get_filings(symbol):
            for chunk in filing["contentChunks"]:
                text_lower = chunk["text"].lower()
                score = sum(1 for w in query_words if w in text_lower)
                matched_chunks.append({
                    "filing_id": filing["id"],
                    "filing_type": filing["type"],
                    "period": filing["period"],
                    "chunk": chunk,
                    "relevance_score": score + 0.95
                })

        matched_chunks.sort(key=lambda x: x["relevance_score"], reverse=True)
        return matched_chunks

sec_rag_service = SECRagService()
