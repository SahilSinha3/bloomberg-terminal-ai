# Bloomberg Terminal AI — Services Requirements & High-Level System Design (HLD)

---

## 1. Project Overview & Vision

**Bloomberg Terminal AI** is a production-grade, AI-native financial intelligence workspace inspired by the Bloomberg Terminal. It combines real-time market streams, company fundamentals, SEC filings, financial news, market anomaly detection, and autonomous multi-agent research into a high-performance workspace.

Unlike conventional dashboards that dump raw charts on a user, **Bloomberg Terminal AI** reverses the paradigm:
```
Raw Market Data + SEC Filings + Financial News
                     ↓
         Real-Time Event Processing
                     ↓
      Autonomous Multi-Agent Investigation
                     ↓
     Source-Cited Evidence & Reasoning Report
```

---

## 2. Complete Technology Stack & Specifications

| Architectural Layer | Technology Chosen | Detailed Purpose |
| :--- | :--- | :--- |
| **Frontend UI Workspace** | **Next.js (App Router), React 19, TypeScript** | Responsive multi-panel layout, SSR, server components, typed API client contracts. |
| **Styling & Layout** | **Custom Terminal CSS + CSS Modules + Tailwind** | Classic dark terminal aesthetic (`#0a0b0d`), high-contrast amber/green typography (`JetBrains Mono`), glassmorphism, resizable panels. |
| **State & Streaming** | **Zustand + TanStack Query + WebSockets** | Isolates high-frequency market tick streaming (Zustand) from REST API queries (TanStack Query) to eliminate UI re-render lag. |
| **Financial Charting** | **Recharts / Canvas API + Web Workers** | Offloads complex technical indicators (RSI, MACD, Moving Averages 20/50) off the main thread. |
| **API Gateway** | **Node.js (Fastify / Express)** | Bi-directional WebSocket management, GraphQL / REST API endpoints, JWT auth validation. |
| **AI / Agent Engine** | **Python (FastAPI) + Model API (Gemini / Claude / OpenAI)** | Multi-agent state machine, tool routing, structured output parsing, MCP (Model Context Protocol) tool execution. |
| **Primary Database** | **PostgreSQL + pgvector extension** | Relational tables for users, organizations, workspaces, financial periods, and vector embeddings for SEC RAG. |
| **Real-Time Buffer & Cache**| **Redis & Redis Streams** | Event stream bus for market ticks, WebSocket pub/sub fanout, rate-limiting, and task queueing. |
| **Background Queue** | **BullMQ (Node.js) / Celery (Python)** | Asynchronous workers for SEC Edgar scraping, PDF/HTML parsing, vector embedding, and deep research tasks. |
| **Container & Infra** | **Docker, AWS (ECS / RDS / ElastiCache / S3 / CloudFront)** | Production containerization, managed cloud databases, edge CDN distribution. |
| **Observability** | **OpenTelemetry, Grafana, Sentry** | Real-time monitoring of p95 API latency, WebSocket connection drop rates, and LLM token costs / hallucination metrics. |

---

## 3. Comprehensive Breakdown of All 12 Core Services

```
                                  ┌────────────────────────────────┐
                                  │   Bloomberg Terminal Frontend  │
                                  └───────────────┬────────────────┘
                                                  │
                                                  ▼
                                  ┌────────────────────────────────┐
                                  │      API Gateway (v1 REST/WS)  │
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
└└─────────────────┘   └──────────────────┘    └──────────────────┘    └──────────────────┘   └──────────────────┘
```

### 1. API Gateway & Auth Service
- **Role**: Entry point for all HTTP REST, GraphQL, and WebSocket client traffic.
- **Service Requirements**:
  - Issue and rotate short-lived JWT access tokens and long-lived refresh tokens.
  - Multi-tenant organization scoping (`organization_id` isolation on every request).
  - RBAC permission enforcement (`Owner`, `Analyst`, `Viewer`).
  - Rate-limiting (e.g. 100 API requests/min for Free users, 1000/min for Pro users).

### 2. Workspace & Layout Sync Service
- **Role**: Persists user workspace grid configurations, symbol linkings, and panel arrangements.
- **Service Requirements**:
  - Save customizable JSON grid states (e.g. Panel 1 = Watchlist, Panel 2 = Chart, Panel 3 = Filings).
  - Synchronize active symbol changes across panels (Symbol Linking).

### 3. Market Ingestion & Normalization Worker
- **Role**: Continuously ingests price ticks, historical bars, volume, and quotes from market APIs (e.g., FMP, Polygon, SEC APIs).
- **Service Requirements**:
  - Convert provider-specific messages into a unified schema (`market.quote.updated`).
  - Publish normalized ticks to **Redis Streams**.
  - Abstract external provider credentials so frontend clients never interact directly with 3rd-party APIs.

### 4. WebSocket Streaming Gateway
- **Role**: Streams real-time financial ticks and live AI research progress directly to client browsers.
- **Service Requirements**:
  - Support `subscribe` / `unsubscribe` topics (`quotes:NVDA`, `agent_run:res_123`).
  - Event sequence numbering so clients can detect missed ticks and request instant refresh.
  - Heartbeat `PING` / `PONG` management and exponential backoff reconnection.
  - Intraday tick throttling to prevent browser UI freeze during volatile market spikes.

### 5. Financial Analytics & Deterministic Engine
- **Role**: Calculates financial ratios and normalized fundamental metrics.
- **Service Requirements**:
  - Deterministically compute P/E, P/S, EV/EBITDA, Free Cash Flow Growth, Gross Margins, and ROIC.
  - **Golden Rule**: *LLMs are never allowed to perform financial calculations*. Math is executed strictly by code.

### 6. SEC Filing Ingestion & XBRL Parser Worker
- **Role**: Automated background scraper and indexer for SEC 10-K, 10-Q, and 8-K filings from `data.sec.gov`.
- **Service Requirements**:
  - Parse raw SEC HTML/XBRL submissions into clean structured sections (MD&A, Risk Factors, Financial Notes).
  - Split text into 500-token semantic chunks with rich metadata (`accessionNumber`, `filingDate`, `section`, `pageNumber`).
  - Store raw documents in AWS S3 and push text chunks to the vector embedding pipeline.

### 7. News & Sentiment Ingestion Service
- **Role**: Collects breaking market headlines from financial RSS/News APIs.
- **Service Requirements**:
  - Entity extraction: Map articles to relevant stock symbols (`NVDA`, `AAPL`, `MSFT`).
  - Assign automated sentiment tags (`BULLISH`, `BEARISH`, `NEUTRAL`).

### 8. Market Anomaly Detection Engine
- **Role**: Scans real-time streams for abnormal volatility, volume spikes, and margin shifts.
- **Service Requirements**:
  - Detect volume velocity (>2x 30-day average ticker baseline).
  - Detect price gaps and implied volatility jumps.
  - Automatically trigger an autonomous AI research task when a high-severity anomaly occurs.

### 9. Hybrid RAG & Vector Search Engine
- **Role**: Retrieves exact relevant paragraphs from indexed SEC filings and news for AI queries.
- **Service Requirements**:
  - Hybrid Search Pipeline: Metadata Filter (Symbol + Filing Type) + SQL BM25 Keyword Search + Vector Cosine Similarity (`pgvector`).
  - Return top-k chunks alongside verified source line numbers and page references.

### 10. Multi-Agent AI Research Orchestrator
- **Role**: Runs deep financial research tasks using a deterministic multi-agent state machine.
- **Service Requirements**:
  - State Machine: `QUEUED` → `PLANNING` → `RESEARCHING` → `VERIFYING` → `SYNTHESIZING` → `COMPLETED`.
  - **Specialized Agents**:
    1. *Planner Agent*: Breaks question into concrete research steps.
    2. *Market Agent*: Analyzes price/volume history via typed tools (`get_historical_prices`).
    3. *Filing Agent*: Queries SEC filings via RAG (`search_filings`).
    4. *News Agent*: Fetches breaking headlines (`search_news`).
    5. *Critic Agent*: Verifies all LLM assertions against returned evidence to prevent hallucinations.
    6. *Synthesis Agent*: Compiles final markdown report with interactive citations.

### 11. Notification & Alerting Service
- **Role**: Evaluates user alert rules and anomaly signals.
- **Service Requirements**:
  - Asynchronous alert evaluation via Redis Streams.
  - Push notifications via WebSockets, Email, or Webhooks.

### 12. Observability & AI Evaluation Service
- **Role**: Tracks system health, API latencies, and AI performance metrics.
- **Service Requirements**:
  - Measure p50, p95, p99 latency for API & WebSocket streams.
  - Track AI Golden Dataset evaluation metrics: Retrieval Recall (target >90%), Citation Accuracy (target >95%), Hallucination rate (target <2%).

---

## 4. High-Level Design (HLD) Explained in Easy Terms

### Concept A: The Real-Time Tick Pipeline (How price updates reach your screen in <200ms)
Think of market data like a water pipe:
1. **The Source**: External exchanges output raw market prices every millisecond.
2. **The Ingestion Worker**: Our server grabs raw ticks, formats them cleanly into standard JSON events, and drops them into a **Redis Stream** (a super-fast in-memory pipeline).
3. **The WebSocket Gateway**: Reads from the Redis Stream and broadcasts ticks only to users viewing that specific stock symbol.
4. **The Terminal UI**: React receives the tick over WebSockets and updates the Zustand store, causing the chart and price header to flash green/red without re-rendering the whole web page!

```
[Exchange / Market API]
         │ (Raw Ticks)
         ▼
[Market Ingestion Worker] ──► Normalizes JSON schema
         │
         ▼
   [Redis Stream]         ──► High-speed event buffer
         │
         ▼
[WebSocket Gateway Fleet] ──► Distributes stream per symbol
         │
         ▼ (WS /v1/stream)
 [Next.js Terminal UI]    ──► Updates Zustand Store ──► Flashes Chart & Header
```

---

### Concept B: SEC Filing Intelligence & Cited RAG
How a 100-page SEC 10-Q document becomes an instant answer with citations:
1. **Scrape**: The Ingestion Service downloads SEC 10-Q filings as soon as companies submit them to EDGAR.
2. **Chunk & Tag**: The document is split into small 500-word paragraphs. Each paragraph gets tagged with its Page Number, Section Title, and Company Ticker.
3. **Embed**: A vector model converts text into math vectors (numbers representing meaning).
4. **Retrieve**: When a user asks a question, we convert the question into a vector, find the top 3 matching SEC paragraphs in `pgvector`, and send them to the LLM.
5. **Cite**: The final answer includes clickable badges `[Source 1: NVDA Q2 10-Q Page 14]`. Clicking highlights the exact sentence in the SEC viewer!

---

### Concept C: How Autonomous AI Agents Work Together
Instead of relying on a single chatbot that guesses answers:
1. **Planner Agent** breaks the prompt into 4 sub-queries.
2. **Market Agent**, **Filing Agent**, and **News Agent** run simultaneously using typed code tools (`get_quote`, `search_filings`, `search_news`).
3. **Evidence Collector** gathers all raw output into a shared memory store.
4. **Critic Agent** double-checks: *"Is every claim in this report backed by retrieved text?"* If a claim lacks proof, it gets discarded.
5. **Synthesis Agent** writes the final report for the user.

```
                             [User Prompt]
                                   │
                                   ▼
                            [Planner Agent]
                                   │
            ┌──────────────────────┼──────────────────────┐
            ▼                      ▼                      ▼
     [Market Agent]          [News Agent]          [Filing Agent]
  (Calls get_quote)      (Calls search_news)   (Calls search_filings)
            │                      │                      │
            └──────────────────────┼──────────────────────┘
                                   │
                                   ▼
                          [Critic Agent] ──► (Catches hallucinations)
                                   │
                                   ▼
                         [Cited Research Report]
```

---

## 5. Implementation Roadmap (Phased Development)

- **Phase 1 (MVP 1)**: Next.js Terminal UI, Resizable Panel Grid, Interactive Candlestick Chart, Company Financial Statements.
- **Phase 2 (MVP 2)**: Redis Stream + WebSocket Gateway real-time updates, Command Palette (`⌘K`), Keyboard shortcuts (`G C`, `G F`), Watchlist persistence.
- **Phase 3 (MVP 3)**: SEC Edgar Scraper, `pgvector` hybrid search, Document Viewer with clickable citation highlights.
- **Phase 4 (MVP 4)**: Python FastAPI Multi-Agent Research Orchestrator, Agent Tool Contracts, Anomaly Detection trigger engine.
- **Phase 5 (MVP 5)**: Production Docker & AWS Deployment (ECS/RDS), OpenTelemetry Tracing, AI Golden Dataset evaluation.
