# 📊 Bloomberg Terminal AI

> An AI-native financial intelligence workspace inspired by the Bloomberg Terminal, combining real-time market data, financial analytics, SEC filing RAG, market anomaly detection, and autonomous multi-agent research into a high-performance terminal.

---

## 🌟 Key Features

- ⚡ **Real-Time Market Streaming (<200ms tick fanout)**: Isolated Zustand state store receiving high-frequency price updates over WebSockets without React UI re-render lag.
- 📄 **SEC Filing Intelligence & Hybrid RAG**: Indexing SEC EDGAR 10-K and 10-Q filings using `pgvector` + SQL BM25 Keyword Search. Every AI claim is grounded with clickable, line-level source citations.
- 🤖 **Autonomous Multi-Agent Research Engine**: A deterministic state machine (`QUEUED` → `PLANNING` → `RESEARCHING` → `VERIFYING` → `SYNTHESIZING` → `COMPLETED`) running specialized agents:
  - *Planner Agent*: Decomposes prompts into sub-tasks.
  - *Market Agent*: Analyzes price action, volume velocity, and technical signals.
  - *Filing Agent*: Queries SEC filings via hybrid RAG.
  - *News Agent*: Fetches breaking market headlines & sentiment.
  - *Critic Agent*: Verifies all LLM claims against raw retrieved evidence to eliminate hallucinations.
  - *Synthesis Agent*: Compiles final report with interactive citations.
- 🧮 **Deterministic Financial Analytics**: Fundamental metrics (P/E, EV/EBITDA, Free Cash Flow, Operating Margins) are calculated strictly by code algorithms. *LLMs are never trusted to do financial math.*
- ⌨️ **Keyboard-First Terminal Navigation**: Universal Command Palette (`⌘K`) for symbol switching, search queries, and instant navigation shortcuts (`G C` for Chart, `G F` for Financials, `G R` for SEC RAG, `G A` for AI Agents).

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
│ Market Ingestion │   │ Workspace Layout │    │ SEC Edgar Filing │    │ Hybrid RAG Vector│   │ Multi-Agent AI   │
│ Service Worker   │   │ Service          │    │ Ingestion Worker │    │ Search Engine    │   │ Orchestrator     │
└────────┬─────────┘   └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘   └────────┬─────────┘
         │                      │                       │                       │                      │
         ▼                      ▼                       ▼                       ▼                      ▼
┌──────────────────┐   ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐   ┌──────────────────┐
│ Redis Streams &  │   │ PostgreSQL DB    │    │ SEC Raw Storage  │    │ pgvector Index   │   │ Evidence & Tool  │
│ WebSocket PubSub │   │ (Multi-Tenant)   │    │ (AWS S3 Bucket)  │    │ Embeddings       │   │ Registries       │
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
| **Database & Vector Search**| PostgreSQL + `pgvector` extension | Relational tables for users & workspaces, vector search for SEC filing RAG. |
| **Event Stream & Cache** | Redis & Redis Streams | In-memory message bus for tick fanout and task queueing. |

---

## 📂 Project Structure

```
.
├── README.md                            # Main Project Documentation
├── SERVICES_REQUIREMENTS_AND_HLD.md     # Detailed Service Requirements & High-Level Architecture
├── implementation_plan.md               # Phased MVP Implementation Roadmap
├── backend/                             # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py                      # FastAPI server with CORS, REST & WebSockets
│   │   └── schemas.py                   # Pydantic data schemas
│   └── requirements.txt                 # Backend Python dependencies
└── finsight/                            # Next.js Terminal Frontend
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx                 # Main Bloomberg Terminal workspace layout
    │   │   └── globals.css              # Custom terminal dark theme styles
    │   ├── components/                  # Terminal Component Library
    │   │   ├── Header.tsx               # Status bar, UTC clock & command line prompt
    │   │   ├── CommandPalette.tsx       # ⌘K universal command palette
    │   │   ├── WatchlistPanel.tsx       # Live ticker tape & quote panel
    │   │   ├── ChartPanel.tsx           # Financial candlestick/area chart with MA20/MA50
    │   │   ├── FinancialsPanel.tsx      # Income statement, Balance sheet & Ratios
    │   │   ├── FilingsPanel.tsx         # SEC 10-K/10-Q filing viewer with RAG citations
    │   │   ├── AIResearchPanel.tsx      # Multi-Agent step trace & cited report
    │   │   ├── NewsPanel.tsx            # Breaking headlines & Anomaly Detection stream
    │   │   └── CitationModal.tsx        # Source evidence inspector drawer
    │   ├── store/
    │   │   └── useTerminalStore.ts      # Zustand state store
    │   ├── types/
    │   │   └── terminal.ts              # TypeScript interfaces
    │   └── data/
    │       └── mockFinancialData.ts     # Mock market quotes, SEC filings & research reports
    └── package.json                     # Frontend dependencies
```

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

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3005`) in your browser to interact with the Bloomberg Terminal UI.

### 2. Running the Python FastAPI Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

FastAPI server will start on [http://localhost:8000](http://localhost:8000). You can check health status at `http://localhost:8000/v1/health`.

---

## ⚙️ Environment Variables (`.env.example`)

To connect live production services, create a `.env` file in the project root:

```env
# Database Credentials (PostgreSQL + pgvector)
DATABASE_URL=postgresql://postgres:password@localhost:5432/bloomberg_terminal

# Redis Credentials
REDIS_URL=redis://localhost:6379

# Market Data API Keys
FMP_API_KEY=your_fmp_api_key
POLYGON_API_KEY=your_polygon_api_key
SEC_USER_AGENT=YourName user@domain.com

# LLM Provider Keys
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

---

## 📄 License

This project is licensed under the MIT License.
