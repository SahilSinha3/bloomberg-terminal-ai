# 📊 Bloomberg Terminal AI

> An AI-native financial intelligence workspace inspired by the Bloomberg Terminal, combining real-time market data, financial analytics, SEC filing RAG, global maritime AIS ship tracking, corporate jet ADS-B radar tracking, and autonomous multi-agent research into a high-performance terminal.

---

## 🌟 Key Features

- ⚡ **Real-Time Market Streaming (<200ms tick fanout)**: Isolated Zustand state store receiving high-frequency price updates over WebSockets without React UI re-render lag.
- 🚢 **AIS Global Maritime Vessel & Oil Tanker Radar (`Ships BETA`)**: Satellite AIS tracking of crude oil supertankers (VLCCs), LNG carriers, and container ships across global chokepoints (Strait of Hormuz, Suez Canal, Panama Canal, Malacca Strait) with live tonnage, draft depth, and commodity volume tracking.
- ✈️ **FLIGHT Corporate Jet Radar & M&A Signal Tracker (`Jets BETA`)**: ADS-B satellite radar tracking executive aircraft (`N1NVDA`, `N1AAPL`, `N1MSFT`), flight trajectory waypoints, OpenSky Network free public API integration, and corporate jet convergence signals.
- 🗺️ **Interactive World Map Vector Radar**: Real-time continent landmass outlines (North America, South America, Europe, Africa, Asia, Australia) with interactive Zoom In (**`+`**), Zoom Out (**`-`**), and Reset controls (0.8x to 4.0x magnification scale).
- 📄 **SEC Filing Intelligence & Hybrid RAG**: Indexing SEC EDGAR 10-K and 10-Q filings using `pgvector` + SQL BM25 Keyword Search. Every AI claim is grounded with clickable, line-level source citations.
- 🤖 **Autonomous Multi-Agent Research Engine**: A deterministic state machine (`QUEUED` → `PLANNING` → `RESEARCHING` → `VERIFYING` → `SYNTHESIZING` → `COMPLETED`) running specialized agents:
  - *Planner Agent*: Decomposes prompts into sub-tasks.
  - *Market Agent*: Analyzes price action, volume velocity, and technical signals.
  - *Filing Agent*: Queries SEC filings via hybrid RAG.
  - *News Agent*: Fetches breaking market headlines & sentiment.
  - *Critic Agent*: Verifies all LLM claims against raw retrieved evidence to eliminate hallucinations.
  - *Synthesis Agent*: Compiles final report with interactive citations.
- 🧮 **Deterministic Financial Analytics**: Fundamental metrics (P/E, EV/EBITDA, Free Cash Flow, Operating Margins) are calculated strictly by code algorithms. *LLMs are never trusted to do financial math.*
- ⌨️ **Vim/Bloomberg Keyboard Navigation**: Universal Command Palette (`⌘K`) for symbol switching, search queries, and sequential keyboard shortcuts (`G C` for Chart, `G F` for Financials, `G R` for SEC RAG, `G V` for Ships, `G J` for Jets, `G A` for AI Agents).

---

## 🎯 Phase 2 Vision & Planned Bloomberg Terminal Features

### What We Want to Achieve in Phase 2
Phase 2 aims to transform **Bloomberg Terminal AI** into a comprehensive, multi-asset institutional terminal replicating iconic Bloomberg Terminal capabilities for equities, macroeconomics, portfolio risk management, and global supply chain tracking.

### Planned Phase 2 Modules & Functions

1. **`EQS` (Equity Screener)**:
   - Multi-factor stock filter (Market Cap > $10B, P/E < 50, Revenue Growth > 20%, Volume Velocity > 2x).
   - Instant filtering across global stock exchanges.
   - Keyboard Shortcut: **`G S`** (*Go Screener*).

2. **`PORT` (Portfolio & Risk Analytics)**:
   - Multi-asset holdings management (Quantity, Average Cost, Unrealized P&L, Weight %).
   - Deterministic risk metrics: Portfolio Beta, Sharpe Ratio, Volatility, and Value-at-Risk (VaR 95%).
   - Keyboard Shortcut: **`G P`** (*Go Portfolio*).

3. **`ECO` (Macro Economic Calendar & Fed Watch)**:
   - Federal Reserve FRED API integration for target Fed Funds interest rates, CPI Inflation, Non-Farm Payrolls (NFP), and GDP indicators.
   - Rate hike / rate cut probability tracker.
   - Keyboard Shortcut: **`G E`** (*Go Economics*).

4. **`DES` (Company Description & Insider Intelligence)**:
   - Executive C-suite profiles (CEO, CFO, Board members).
   - SEC Form 4 insider trading transactions (Insider Buys vs Sells) and institutional ownership breakdowns.

5. **`HEAT` (S&P 500 Market Heatmap)**:
   - Visual treemap grid of S&P 500 sectors (Technology, Healthcare, Financials, Energy, Consumer Discretionary) color-coded by intraday % performance.

6. **`IB` (Instant Bloomberg Chat Simulation)**:
   - Terminal-style real-time trader messaging feed with live symbol auto-linking (`$NVDA`, `$AAPL`).

7. **`AIS` & `FLIGHT` Expansion**:
   - Real-time port congestion indexes (Rotterdam, Los Angeles, Shanghai).
   - Enhanced live flight trajectory curves on vector world map projections.

---

## 📐 Architecture Diagram

```
                                  ┌────────────────────────────────┐
                                  │   Bloomberg Terminal Frontend  │
                                  │   (Next.js / Zustand / React)  │
                                  └───────────────┬────────────────┘
                                                  │
                                                  ▼
                                  ┌────────────────────────────────┐
                                  │   API Gateway (v1 REST/WS)     │
                                  └───────────────┬────────────────┘
                                                  │
 ┌──────────────────────┬─────────────────────────┼─────────────────────────┬──────────────────────┐
 ▼                      ▼                         ▼                         ▼                      ▼
┌──────────────────┐   ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐   ┌──────────────────┐
│ Market Ingestion │   │ AIS Vessel &     │    │ SEC Edgar Filing │    │ Hybrid RAG Vector│   │ Multi-Agent AI   │
│ Service Worker   │   │ Flight Radar API │    │ Ingestion Worker │    │ Search Engine    │   │ Orchestrator     │
└────────┬─────────┘   └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘   └────────┬─────────┘
         │                      │                       │                       │                      │
         ▼                      ▼                       ▼                       ▼                      ▼
┌──────────────────┐   ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐   ┌──────────────────┐
│ Redis Streams &  │   │ PostgreSQL DB    │    │ OpenSky Network  │    │ pgvector Index   │   │ Evidence & Tool  │
│ WebSocket PubSub │   │ (Multi-Tenant)   │    │ Public Air Stream│    │ Embeddings       │   │ Registries       │
└──────────────────┘   └──────────────────┘    └──────────────────┘    └──────────────────┘   └──────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend UI** | Next.js 16 (App Router), React 19, TypeScript | Responsive multi-panel layout, server components, typed API contracts. |
| **Styling & Layout** | Tailwind CSS + Custom Terminal CSS | Classic dark terminal aesthetic (`#0a0b0d`), high-contrast amber/cyan typography. |
| **State & Streaming** | Zustand + Recharts + WebSockets | High-speed tick streaming isolated from main UI thread. |
| **Backend API** | Python FastAPI, Uvicorn, Pydantic | High-concurrency REST endpoints and WebSocket tick fanout server. |
| **OpenAPI Docs** | Swagger UI (`/docs`), ReDoc (`/redoc`) | Live interactive Swagger test suite and API specification. |
| **Database & Vector Search**| PostgreSQL + `pgvector` extension | Relational tables for users & workspaces, vector search for SEC filing RAG. |
| **Event Stream & Cache** | Redis & Redis Streams | In-memory message bus for tick fanout and task queueing. |
| **Public Radar APIs** | OpenSky Network API | Free public real-time air flight radar stream. |

---

## 📂 Project Structure

```
.
├── README.md                            # Main Project Documentation
├── SERVICES_REQUIREMENTS_AND_HLD.md     # Detailed Service Requirements & High-Level Architecture
├── implementation_plan.md               # Phased MVP Implementation Roadmap
├── .env                                 # Local environment variables
├── .env.example                         # Environment configuration template
├── backend/                             # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py                      # FastAPI server with CORS, REST & WebSockets
│   │   ├── config.py                    # Environment configuration settings
│   │   ├── schemas.py                   # Pydantic data schemas & Swagger docs
│   │   ├── services/                    # Core Backend Services
│   │   │   ├── market_service.py        # Market data ingestion & OHLCV bar generator
│   │   │   ├── analytics_service.py     # Deterministic financial analytics engine
│   │   │   ├── sec_rag_service.py       # SEC EDGAR hybrid RAG chunk search
│   │   │   ├── vessel_service.py        # AIS maritime vessel & tanker radar
│   │   │   ├── flight_service.py        # OpenSky Network & corporate jet radar
│   │   │   ├── news_anomaly_service.py  # News & market anomaly detector
│   │   │   └── agent_orchestrator.py    # Multi-agent execution state machine
│   │   └── routers/                     # FastAPI API Routers
│   │       ├── market.py                # /v1/quotes & /v1/historical-bars
│   │       ├── financials.py            # /v1/financials
│   │       ├── filings.py               # /v1/filings & /v1/filings/search
│   │       ├── vessels.py               # /v1/vessels
│   │       ├── flights.py               # /v1/flights
│   │       ├── macro.py                 # /v1/macro
│   │       ├── news.py                  # /v1/news & /v1/anomalies
│   │       └── research.py              # /v1/research/start
│   └── requirements.txt                 # Backend Python dependencies
└── finsight/                            # Next.js Terminal Frontend
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx                 # Main Bloomberg Terminal workspace layout
    │   │   └── globals.css              # Custom terminal dark theme styles
    │   ├── components/                  # Terminal Component Library
    │   │   ├── Header.tsx               # Status bar, UTC clock & CMD prompt
    │   │   ├── CommandPalette.tsx       # ⌘K universal command palette
    │   │   ├── WatchlistPanel.tsx       # Live ticker tape & quote panel
    │   │   ├── ChartPanel.tsx           # Financial candlestick/area chart with MA20/MA50
    │   │   ├── FinancialsPanel.tsx      # Income statement, Balance sheet & Ratios
    │   │   ├── FilingsPanel.tsx         # SEC 10-K/10-Q filing viewer with RAG citations
    │   │   ├── VesselTrackerPanel.tsx   # AIS maritime vessel world radar (BETA)
    │   │   ├── FlightTrackerPanel.tsx   # ADS-B corporate jet world radar (BETA)
    │   │   ├── AIResearchPanel.tsx      # Multi-Agent step trace & cited report
    │   │   ├── NewsPanel.tsx            # Breaking headlines & Anomaly Detection stream
    │   │   └── CitationModal.tsx        # Source evidence inspector drawer
    │   ├── hooks/
    │   │   └── useTerminalKeyboardShortcuts.ts # G C, G F, G R, G V, G J shortcuts
    │   ├── store/
    │   │   └── useTerminalStore.ts      # Zustand state store
    │   ├── types/
    │   │   └── terminal.ts              # TypeScript interfaces
    │   └── data/
    │       └── mockFinancialData.ts     # Mock market quotes, SEC filings & research reports
    └── package.json                     # Frontend dependencies
```

---

## ⌨️ Terminal Keyboard Shortcuts

| Key Sequence | Action | Description |
| :--- | :--- | :--- |
| **`⌘K`** / **`Ctrl + K`** | **Command Palette** | Opens central command system for ticker searches & AI prompts. |
| **`G C`** | **Go Chart** | Switches to Financial Candlestick/Area Price Chart. |
| **`G F`** | **Go Financials** | Switches to Deterministic Financial Analytics. |
| **`G R`** | **Go SEC RAG** | Switches to SEC EDGAR Filing Intelligence & RAG Search. |
| **`G V`** | **Go Vessels** | Switches to AIS Maritime Vessel & Oil Tanker World Radar (`Ships BETA`). |
| **`G J`** | **Go Jets** | Switches to ADS-B Corporate Jet & M&A Intelligence Radar (`Jets BETA`). |
| **`G A`** | **Go AI Agents** | Switches to Autonomous Multi-Agent Research Engine. |
| **`ESC`** | **Close Modal** | Closes Command Palette or Citation Inspector drawer. |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **Python**: v3.10.0 or higher

### 1. Running the Next.js Frontend

```bash
cd finsight
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Running the Python FastAPI Backend & Swagger Docs

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

FastAPI server will start on [http://localhost:8000](http://localhost:8000). You can open:
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📄 License

This project is licensed under the MIT License.
