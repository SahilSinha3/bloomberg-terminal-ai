from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SecurityQuoteResponse(BaseModel):
    symbol: str = Field(..., description="Ticker security symbol (e.g., NVDA, AAPL, BTC-USD)", example="NVDA")
    name: str = Field(..., description="Full legal name of company or security", example="NVIDIA Corporation")
    price: float = Field(..., description="Current real-time market price in USD", example=172.31)
    change: float = Field(..., description="Absolute price change for the session", example=-4.21)
    change_percent: float = Field(..., description="Percentage price change for the session", example=-2.38)
    high_24h: float = Field(..., description="Intraday high price", example=177.50)
    low_24h: float = Field(..., description="Intraday low price", example=169.80)
    volume: int = Field(..., description="Total trading volume for session", example=58492010)
    market_cap: str = Field(..., description="Formatted market capitalization string", example="$4.21T")
    pe_ratio: float = Field(..., description="Price-to-Earnings valuation ratio (TTM)", example=52.4)
    sector: str = Field(..., description="Industry sector classification", example="Semiconductors")
    last_updated: str = Field(..., description="ISO 8601 timestamp of last quote update", example="2026-08-16T03:20:00Z")

class OHLCVBarResponse(BaseModel):
    timestamp: str = Field(..., description="Date of price bar (YYYY-MM-DD)", example="2026-08-15")
    open: float = Field(..., description="Opening price", example=170.50)
    high: float = Field(..., description="Session high price", example=174.20)
    low: float = Field(..., description="Session low price", example=169.10)
    close: float = Field(..., description="Closing price", example=172.31)
    volume: int = Field(..., description="Total bar trading volume", example=42109800)
    ma20: Optional[float] = Field(None, description="20-day Moving Average", example=168.90)
    ma50: Optional[float] = Field(None, description="50-day Moving Average", example=162.40)

class FinancialStatementResponse(BaseModel):
    period: str = Field(..., description="Fiscal quarter or annual period", example="Q2 2026")
    revenue: float = Field(..., description="Total revenue in millions USD", example=30040.0)
    grossProfit: float = Field(..., description="Gross profit in millions USD", example=22580.0)
    operatingIncome: float = Field(..., description="Operating income in millions USD", example=18640.0)
    netIncome: float = Field(..., description="Net income in millions USD", example=16590.0)
    eps: float = Field(..., description="Diluted Earnings Per Share", example=0.68)
    freeCashFlow: float = Field(..., description="Free Cash Flow in millions USD", example=13480.0)
    cashAndEquivalents: float = Field(..., description="Cash and equivalents in millions USD", example=34800.0)
    totalDebt: float = Field(..., description="Total debt obligations in millions USD", example=8460.0)
    grossMarginPercent: float = Field(..., description="Deterministic Gross Margin percentage", example=75.1)
    operatingMarginPercent: float = Field(..., description="Deterministic Operating Margin percentage", example=62.0)
    peRatio: float = Field(..., description="Price-to-Earnings valuation ratio", example=52.4)
    evToEbitda: float = Field(..., description="Enterprise Value to EBITDA ratio", example=42.1)

class SECChunkResponse(BaseModel):
    chunkId: str = Field(..., description="Unique vector chunk identifier", example="chunk_nvda_1")
    section: str = Field(..., description="Filing section heading", example="Item 2. MD&A")
    page: int = Field(..., description="Document page number", example=14)
    text: str = Field(..., description="Extracted paragraph text chunk from filing", example="Data Center revenue for Q2 was $26.3 billion...")
    highlightKeywords: Optional[List[str]] = Field(None, description="Extracted vector keywords", example=["Data Center", "Blackwell GPU"])

class SECFilingResponse(BaseModel):
    id: str = Field(..., description="Filing document identifier", example="doc_nvda_q2_2026")
    symbol: str = Field(..., description="Ticker security symbol", example="NVDA")
    type: str = Field(..., description="SEC filing type (10-K, 10-Q, 8-K)", example="10-Q")
    filingDate: str = Field(..., description="Official filing date", example="2026-08-01")
    period: str = Field(..., description="Reported fiscal period", example="Q2 FY2026")
    accessionNumber: str = Field(..., description="SEC EDGAR Accession Number", example="0001045810-26-000042")
    title: str = Field(..., description="Document title", example="NVIDIA Corp Form 10-Q for Period Ended July 28, 2026")
    summary: str = Field(..., description="Executive summary of document", example="Quarterly report detailing Data Center revenue growth...")
    contentChunks: List[SECChunkResponse]

class NewsArticleResponse(BaseModel):
    id: str = Field(..., description="Article ID", example="news_1")
    title: str = Field(..., description="Headline title", example="NVIDIA Experiences Volatility Following Supply Chain Assessment")
    source: str = Field(..., description="News publisher source", example="Bloomberg Intelligence")
    publishedAt: str = Field(..., description="Relative or ISO timestamp", example="12 mins ago")
    summary: str = Field(..., description="Article summary text", example="Analyst reports highlight tight substrate packaging capacity...")
    url: str = Field(..., description="Article URL link", example="https://bloomberg.com/news/nvda-supply-chain-check")
    sentiment: str = Field(..., description="Automated sentiment tag (BULLISH, BEARISH, NEUTRAL)", example="BEARISH")
    relatedSymbols: List[str] = Field(..., description="List of related ticker symbols", example=["NVDA", "AMD"])

class MarketAnomalyResponse(BaseModel):
    id: str = Field(..., description="Anomaly event ID", example="anom_1")
    timestamp: str = Field(..., description="Detection timestamp", example="14:22:10 UTC")
    symbol: str = Field(..., description="Target ticker symbol", example="NVDA")
    type: str = Field(..., description="Anomaly classification type", example="VOLUME_SPIKE")
    severity: str = Field(..., description="Alert severity level (HIGH, MEDIUM, LOW)", example="HIGH")
    description: str = Field(..., description="Human-readable anomaly description", example="Abnormal block trade volume detected")
    metrics: Dict[str, str] = Field(..., description="Quantitative metric deviation dictionary")

class CitationResponse(BaseModel):
    id: str = Field(..., description="Citation ID", example="cit_1")
    sourceType: str = Field(..., description="Source classification type", example="SEC_FILING")
    title: str = Field(..., description="Source document title", example="NVIDIA Q2 Form 10-Q (Page 14)")
    filingType: Optional[str] = Field(None, description="Filing type if SEC document", example="10-Q")
    period: Optional[str] = Field(None, description="Reported period", example="Q2 FY2026")
    pageNumber: Optional[int] = Field(None, description="Source page number", example=14)
    excerpt: str = Field(..., description="Exact extracted text excerpt", example="Data Center revenue reached $26.3 billion...")

class ClaimResponse(BaseModel):
    id: str = Field(..., description="Claim ID", example="c1")
    text: str = Field(..., description="Grounding claim assertion text", example="NVDA Q2 Form 10-Q highlights Data Center revenue growth (+154% YoY)...")
    claimType: str = Field(..., description="Claim classification (FACT, CALCULATION, INFERENCE)", example="FACT")
    confidence: float = Field(..., description="Grounding score confidence (0.0 to 1.0)", example=0.98)
    citationIds: List[str] = Field(..., description="Array of matching citation IDs", example=["cit_1"])

class AgentStepResponse(BaseModel):
    id: str = Field(..., description="Step execution ID", example="step_1")
    agentRole: str = Field(..., description="Specialized Agent Role", example="PLANNER")
    name: str = Field(..., description="Step execution title", example="Decompose Research Query into Multi-Agent Sub-tasks")
    status: str = Field(..., description="Execution status (COMPLETED, RUNNING, PENDING)", example="COMPLETED")
    outputSummary: Optional[str] = Field(None, description="Summary of step execution output")
    toolCall: Optional[Dict[str, Any]] = Field(None, description="Tool execution parameters if applicable")

class ResearchRequest(BaseModel):
    query: str = Field(..., description="Natural language prompt query", example="Why did NVDA drop today?")
    symbol: str = Field(..., description="Target ticker security symbol", example="NVDA")

class ResearchReportResponse(BaseModel):
    id: str = Field(..., description="Research report unique ID", example="res_1723800000")
    query: str = Field(..., description="Original prompt query", example="Why did NVDA drop today?")
    symbol: str = Field(..., description="Target security symbol", example="NVDA")
    createdAt: str = Field(..., description="ISO 8601 creation timestamp", example="2026-08-16T03:20:00Z")
    status: str = Field(..., description="State Machine status (QUEUED, PLANNING, RESEARCHING, VERIFYING, SYNTHESIZING, COMPLETED)", example="COMPLETED")
    summary: str = Field(..., description="Executive intelligence summary", example="Automated financial investigation completed...")
    claims: List[ClaimResponse]
    citations: List[CitationResponse]
    executionSteps: List[AgentStepResponse]
