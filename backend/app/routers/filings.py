from fastapi import APIRouter, Path, Query
from typing import List, Dict, Any
from app.services.sec_rag_service import sec_rag_service
from app.schemas import SECFilingResponse

router = APIRouter(prefix="/v1", tags=["SEC Filings & RAG Search"])

@router.get(
    "/filings/{symbol}",
    summary="List SEC EDGAR Filings",
    description="Returns indexed SEC EDGAR 10-K, 10-Q, and 8-K filings for a specific company alongside extracted vector text chunks.",
    response_model=List[SECFilingResponse]
)
def get_filings(
    symbol: str = Path(..., description="Ticker security symbol")
):
    return sec_rag_service.get_filings(symbol)

@router.get(
    "/filings/{symbol}/search",
    summary="Hybrid Vector Search over SEC Filings",
    description="Executes hybrid RAG search (Metadata Filters + SQL BM25 Keyword Search + Vector Similarity) over SEC EDGAR filing text chunks.",
    response_model=List[Dict[str, Any]]
)
def search_filing_chunks(
    symbol: str = Path(..., description="Ticker security symbol"),
    q: str = Query(..., description="Natural language or keyword search query")
):
    return sec_rag_service.search_chunks(symbol, q)
