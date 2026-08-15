from fastapi import APIRouter
from app.services.sec_rag_service import sec_rag_service

router = APIRouter(prefix="/v1", tags=["SEC Filings & RAG"])

@router.get("/filings/{symbol}")
def get_filings(symbol: str):
    return sec_rag_service.get_filings(symbol)

@router.get("/filings/{symbol}/search")
def search_filing_chunks(symbol: str, q: str):
    return sec_rag_service.search_chunks(symbol, q)
