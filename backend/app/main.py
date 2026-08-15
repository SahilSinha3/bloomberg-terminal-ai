from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import random
from datetime import datetime

from app.schemas import SecurityQuoteResponse, ResearchRequest, ResearchReportResponse

app = FastAPI(
    title="Bloomberg Terminal AI Backend",
    description="Python FastAPI backend powering Market Ingestion, SEC Edgar Hybrid RAG, and Multi-Agent Orchestration.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MOCK_QUOTES = {
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
    }
}

@app.get("/")
def read_root():
    return {
        "service": "Bloomberg Terminal AI FastAPI Backend",
        "status": "ONLINE",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/v1/health")
def health_check():
    return {"status": "ok", "service": "FastAPI", "version": "1.0.0"}

@app.get("/v1/quotes", response_model=dict)
def get_all_quotes():
    return MOCK_QUOTES

@app.get("/v1/quotes/{symbol}", response_model=SecurityQuoteResponse)
def get_quote(symbol: str):
    symbol_upper = symbol.upper()
    if symbol_upper in MOCK_QUOTES:
        return MOCK_QUOTES[symbol_upper]
    return {
        "symbol": symbol_upper, "name": f"{symbol_upper} Corp", "price": 150.00, "change": 0.0, "change_percent": 0.0,
        "high_24h": 155.00, "low_24h": 148.00, "volume": 10000000, "market_cap": "$100B", "pe_ratio": 25.0,
        "sector": "Technology", "last_updated": datetime.utcnow().isoformat()
    }

@app.websocket("/v1/ws/stream")
async def websocket_stream_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        symbols = ["NVDA", "AAPL", "MSFT"]
        while True:
            await asyncio.sleep(2)
            chosen = random.choice(symbols)
            q = MOCK_QUOTES[chosen]
            tick_change = (random.random() - 0.49) * 0.5
            new_price = round(q["price"] + tick_change, 2)
            q["price"] = newPrice = new_price
            q["last_updated"] = datetime.utcnow().isoformat()
            
            payload = {
                "type": "quote_tick",
                "symbol": chosen,
                "data": q
            }
            await websocket.send_text(json.dumps(payload))
    except WebSocketDisconnect:
        pass
