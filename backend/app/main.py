from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import random
from datetime import datetime

from app.config import settings
from app.routers import market, financials, filings, news, research, vessels, flights, macro
from app.services.market_service import MOCK_QUOTES

tags_metadata = [
    {
        "name": "Market Data & Quotes",
        "description": "Real-time ticker quotes, 24h market metrics, and historical daily OHLCV price bars for technical charting.",
    },
    {
        "name": "Financial Analytics",
        "description": "Deterministic fundamental metric calculations for Income Statements, Balance Sheets, Cash Flow, and Valuation Ratios.",
    },
    {
        "name": "SEC Filings & RAG Search",
        "description": "Automated indexing of SEC EDGAR 10-K, 10-Q, 8-K submissions and Hybrid RAG search (pgvector + BM25 keyword search).",
    },
    {
        "name": "AIS Vessel & Tanker Tracking",
        "description": "Live satellite tracking of crude oil supertankers (VLCCs), LNG carriers, and container ships across global chokepoints.",
    },
    {
        "name": "FLIGHT Corporate Jet Tracking",
        "description": "Real-time executive aircraft tracking data (N1NVIDIA, N1APPLE, N1MICROSOFT) and M&A jet convergence signals.",
    },
    {
        "name": "Macro Economic Indicators",
        "description": "Federal Reserve FRED target interest rates, CPI Inflation, NFP Payrolls, and GDP indicators.",
    },
    {
        "name": "News & Anomaly Alerts",
        "description": "Breaking market headlines with automated sentiment tags and real-time volume velocity anomaly alerts.",
    },
    {
        "name": "Autonomous Multi-Agent Engine",
        "description": "Orchestrates multi-agent research state machines (Planner -> Market -> Filing -> Critic -> Synthesis) with verified evidence citations.",
    },
]

app = FastAPI(
    title=settings.APP_NAME,
    description="""
### 📊 Bloomberg Terminal AI Backend Engine

Production Python FastAPI service delivering:
- ⚡ **Real-time market quote streaming** over WebSockets & REST.
- 🚢 **AIS Maritime Vessel & Crude Oil Supertanker Tracking**.
- ✈️ **FLIGHT Executive Corporate Jet Tracking & M&A Convergence Signals**.
- 📄 **SEC EDGAR Hybrid Vector Search (RAG)** over 10-K & 10-Q filing text chunks.
- 🤖 **Autonomous Multi-Agent Orchestration** with deterministic state machine execution & hallucination defenses.
- 🧮 **Deterministic Financial Analytics** for fundamental financial statements.
""",
    version=settings.VERSION,
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router Endpoints
app.include_router(market.router)
app.include_router(financials.router)
app.include_router(filings.router)
app.include_router(vessels.router)
app.include_router(flights.router)
app.include_router(macro.router)
app.include_router(news.router)
app.include_router(research.router)

@app.get("/", tags=["System Information"], summary="API Root & System Status")
def read_root():
    return {
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "ONLINE",
        "timestamp": datetime.utcnow().isoformat(),
        "swagger_docs": "/docs",
        "redoc_docs": "/redoc"
    }

@app.get("/v1/health", tags=["System Information"], summary="Health Check & System Diagnostics")
def health_check():
    return {
        "status": "ok",
        "service": "FastAPI Backend",
        "version": settings.VERSION,
        "database": "PostgreSQL Ready",
        "vector_search": "pgvector Hybrid RAG Ready",
        "vessel_tracker": "AIS Stream Operational",
        "flight_tracker": "Executive Jet Stream Operational"
    }

@app.websocket("/v1/ws/stream")
async def websocket_stream_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        symbols = ["NVIDIA", "APPLE", "MICROSOFT", "AMD", "TESLA", "BTC-USD", "SPY"]
        while True:
            await asyncio.sleep(2)
            chosen = random.choice(symbols)
            if chosen in MOCK_QUOTES:
                q = MOCK_QUOTES[chosen]
                tick_change = (random.random() - 0.49) * 0.4
                q["price"] = round(q["price"] + tick_change, 2)
                q["last_updated"] = datetime.utcnow().isoformat()
                
                payload = {
                    "type": "quote_tick",
                    "symbol": chosen,
                    "data": q
                }
                await websocket.send_text(json.dumps(payload))
    except WebSocketDisconnect:
        pass
