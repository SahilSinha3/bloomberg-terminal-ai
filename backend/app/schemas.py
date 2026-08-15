from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SecurityQuoteResponse(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    change_percent: float
    high_24h: float
    low_24h: float
    volume: int
    market_cap: str
    pe_ratio: float
    sector: str
    last_updated: str

class OHLCVBarResponse(BaseModel):
    timestamp: str
    open: float
    high: float
    low: float
    close: float
    volume: int
    ma20: Optional[float] = None
    ma50: Optional[float] = None

class SECChunkResponse(BaseModel):
    chunk_id: str
    section: str
    page: int
    text: str
    highlight_keywords: Optional[List[str]] = None

class SECFilingResponse(BaseModel):
    id: str
    symbol: str
    type: str
    filing_date: str
    period: str
    accession_number: str
    title: str
    summary: str
    content_chunks: List[SECChunkResponse]

class CitationResponse(BaseModel):
    id: str
    source_type: str
    title: str
    filing_type: Optional[str] = None
    period: Optional[str] = None
    page_number: Optional[int] = None
    excerpt: str

class ClaimResponse(BaseModel):
    id: str
    text: str
    claim_type: str
    confidence: float
    citation_ids: List[str]

class AgentStepResponse(BaseModel):
    id: str
    agent_role: str
    name: str
    status: str
    output_summary: Optional[str] = None
    tool_call: Optional[Dict[str, Any]] = None

class ResearchRequest(BaseModel):
    query: str
    symbol: str

class ResearchReportResponse(BaseModel):
    id: str
    query: str
    symbol: str
    created_at: str
    status: str
    summary: str
    claims: List[ClaimResponse]
    citations: List[CitationResponse]
    execution_steps: List[AgentStepResponse]
