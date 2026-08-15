# AI-Native Financial Intelligence Terminal

### Working Name
**FinSight Terminal**

### One-Line Description

> An AI-native financial intelligence terminal that combines real-time market data, financial analytics, SEC filings, news, earnings intelligence, autonomous research agents, and cited RAG into a high-performance Bloomberg-style workspace.

---

# 1. Project Vision

Traditional financial terminals primarily expose large amounts of data and require the user to manually connect the dots.

FinSight should reverse this model.

Instead of:

```text
Data → User → Analysis
```

we build:

```text
Data
  ↓
Real-Time Intelligence
  ↓
AI Research Agents
  ↓
Evidence + Reasoning
  ↓
Actionable Intelligence
```

A user should be able to ask:

> “Why did NVIDIA move significantly today?”

and receive:

```text
Market Movement
      ↓
Price / Volume Analysis
      ↓
News Investigation
      ↓
SEC / Earnings Investigation
      ↓
Peer Comparison
      ↓
Macro Context
      ↓
Agent Verification
      ↓
Cited Research Report
```

Every important AI claim should be traceable to evidence.

---

# 2. Target Users

### Primary

- Software engineers interested in markets
- Retail investors
- Financial analysts
- Founders
- Researchers
- Traders
- Students learning financial analysis

### Future

- Small investment firms
- Research teams
- Wealth managers
- Financial advisory teams

For the portfolio version, we should initially target **individual users**, while architecting the backend as multi-tenant SaaS.

---

# 3. Core Product Modules

The system should have 10 major modules.

```text
1. Terminal Workspace
2. Market Data
3. Company Intelligence
4. Financial Analytics
5. News & Events
6. SEC / Filing Intelligence
7. AI Research Assistant
8. Autonomous Research Agents
9. Alerts & Anomaly Detection
10. Portfolio / Watchlist
```

---

# 4. Terminal Workspace

This is the primary interface.

The UI should behave more like a professional terminal than a normal SaaS dashboard.

## Workspace

Users can create layouts containing independent panels.

Example:

```text
┌───────────────────────────────────────────────────────────────┐
│ FINsight     Search / Command Palette             Market ●   │
├──────────────┬────────────────────────────┬───────────────────┤
│ WATCHLIST    │                            │ AI RESEARCH       │
│              │           NVDA             │                   │
│ NVDA  172.31 │       Price Chart           │ Why did NVDA     │
│ AAPL  214.20 │                            │ move today?       │
│ AMD   181.42 │                            │                   │
│ MSFT  521.11 │                            │ Investigating...  │
│ META  702.12 │                            │                   │
│              │                            │ ▸ Market          │
│              │                            │ ▸ News            │
│              │                            │ ▸ Filings         │
├──────────────┴────────────────────────────┴───────────────────┤
│ News │ Financials │ Earnings │ Filings │ Peers │ Events       │
└───────────────────────────────────────────────────────────────┘
```

## Workspace capabilities

- Resizable panels
- Drag-and-drop layouts
- Multiple workspaces
- Save/load layouts
- Multiple charts
- Symbol linking
- Cross-panel synchronization
- Persistent user preferences
- Keyboard navigation

---

# 5. Command Palette

This is an important UX feature.

Something similar to:

```text
⌘K
```

opens a universal command system.

Examples:

```text
NVDA
NVDA chart
NVDA financials
NVDA news
NVDA filings
compare NVDA AMD
research NVDA
set alert NVDA < 160
```

The command system becomes a unified interface over the entire application.

---

# 6. Keyboard-First Navigation

Add terminal-style commands.

Example:

```text
⌘K     Command palette
G C     Chart
G N     News
G F     Filings
G E     Earnings
G P     Peers
G R     Research
W       Watchlist
A       Alerts
```

This is an excellent frontend engineering talking point.

---

# 7. Market Data System

The market data system is responsible for:

- Quotes
- Historical prices
- OHLCV
- Volume
- Market status
- Corporate actions
- Intraday data
- Market indices
- Sector data

The actual production implementation should use a properly licensed market-data provider rather than scraping financial websites.

For fundamentals and filings, SEC provides official developer resources, including company submissions and extracted XBRL data through REST APIs.

---

# 8. Market Data Architecture

```text
External Market Data Provider
            │
            ▼
    Market Ingestion Service
            │
            ▼
      Normalization Layer
            │
      ┌─────┴──────┐
      ▼            ▼
 Redis Streams   PostgreSQL
      │
      ▼
 WebSocket Gateway
      │
      ▼
 Browser Clients
```

---

# 9. Why an Ingestion Layer?

Never allow frontend clients to directly depend on external market APIs.

Bad:

```text
Browser → Market API
```

Better:

```text
Browser
   ↓
Your API
   ↓
Your data layer
   ↓
External provider
```

This gives you:

- caching
- provider abstraction
- rate-limit management
- normalization
- retries
- failover
- observability
- security

---

# 10. Market Events

Every market update should be represented as an event.

Example:

```json
{
  "eventId": "evt_123",
  "eventType": "market.quote.updated",
  "version": 1,
  "timestamp": "2026-08-15T09:30:00Z",
  "symbol": "NVDA",
  "sequence": 184921,
  "data": {
    "price": 172.31,
    "volume": 1829301
  }
}
```

Important properties:

- event ID
- event type
- schema version
- timestamp
- sequence number
- source
- payload

---

# 11. WebSocket Contract

Client:

```text
WS /v1/stream
```

Subscribe:

```json
{
  "type": "subscribe",
  "channel": "quotes",
  "symbols": ["NVDA", "AMD", "AAPL"]
}
```

Server:

```json
{
  "type": "quote",
  "symbol": "NVDA",
  "sequence": 184921,
  "timestamp": "2026-08-15T09:30:00.120Z",
  "data": {
    "price": 172.31,
    "change": -4.21,
    "changePercent": -2.38,
    "volume": 1829301
  }
}
```

Unsubscribe:

```json
{
  "type": "unsubscribe",
  "channel": "quotes",
  "symbols": ["NVDA"]
}
```

---

# 12. Real-Time Reliability

The WebSocket layer should support:

### Reconnection

```text
connected
   ↓
connection lost
   ↓
exponential backoff
   ↓
reconnect
   ↓
resume subscriptions
```

### Sequence numbers

If:

```text
100
101
102
104
```

arrives, the client knows event `103` was missed.

It can request a replay or refresh.

### Heartbeats

```text
PING
PONG
```

### Backpressure

If the client cannot process thousands of updates per second:

```text
High-frequency events
        ↓
Aggregation/throttling
        ↓
Browser
```

Do not blindly render every market event.

---

# 13. Frontend Performance Architecture

This is where your existing performance background should show.

Use:

```text
Next.js
React
TypeScript
Zustand
TanStack Query
WebSockets
Web Workers
IndexedDB
```

Separate:

```text
Server state
     ↓
TanStack Query

Client/UI state
     ↓
Zustand

Real-time state
     ↓
Dedicated streaming store
```

Do not put every tick into a global React state.

---

# 14. Chart Engine

The charting system should support:

- Candlestick
- Line
- Area
- Volume
- Moving averages
- RSI
- MACD
- Bollinger Bands
- Time ranges
- Crosshair
- Zoom
- Pan
- Multiple indicators

Potential architecture:

```text
WebSocket
   ↓
Streaming Store
   ↓
Chart Data Buffer
   ↓
Web Worker
   ↓
Indicator Calculations
   ↓
Chart Renderer
```

Use Web Workers for expensive calculations.

---

# 15. Company Intelligence

Every company gets a unified profile.

Example:

```text
NVDA

Overview
Price
Financials
Valuation
Earnings
Filings
News
Peers
Insiders
Events
AI Research
```

---

# 16. Financial Data

Support:

### Income Statement

- Revenue
- Gross profit
- Operating income
- Net income
- EPS

### Balance Sheet

- Cash
- Debt
- Assets
- Liabilities
- Equity

### Cash Flow

- Operating cash flow
- CapEx
- Free cash flow

### Ratios

- P/E
- P/S
- EV/EBITDA
- ROE
- ROIC
- Gross margin
- Operating margin

---

# 17. Financial Analytics Engine

Don't calculate everything inside the frontend.

Create:

```text
Financial Analytics Service
```

Responsibilities:

```text
raw financial data
       ↓
normalization
       ↓
derived metrics
       ↓
historical comparisons
       ↓
peer comparisons
       ↓
valuation metrics
```

Example:

```text
Revenue Growth =
(Current Revenue - Previous Revenue)
/
Previous Revenue
```

The calculation engine should be deterministic.

LLMs should **not** be trusted to perform core financial calculations.

---

# 18. SEC Filing Intelligence

This is one of the strongest features.

Ingest:

- 10-K
- 10-Q
- 8-K
- earnings-related filings
- other relevant company filings

The SEC provides APIs for company submissions and extracted XBRL data through `data.sec.gov`.

Architecture:

```text
SEC
 ↓
Filing Ingestion Worker
 ↓
Document Parser
 ↓
Chunker
 ↓
Metadata Extraction
 ↓
Embedding
 ↓
Vector Store
 ↓
Hybrid Retrieval
```

---

# 19. Document Model

Example:

```json
{
  "documentId": "doc_123",
  "companyId": "cmp_nvda",
  "type": "10-Q",
  "filingDate": "2026-07-30",
  "period": "2026-Q2",
  "accessionNumber": "...",
  "sourceUrl": "...",
  "status": "indexed"
}
```

---

# 20. RAG Architecture

Do not build basic:

```text
PDF → embeddings → LLM
```

Build:

```text
Query
 ↓
Query Classification
 ↓
Hybrid Retrieval
 ├── Keyword Search
 ├── Vector Search
 └── Metadata Filters
 ↓
Reranker
 ↓
Evidence Selection
 ↓
LLM
 ↓
Citation Validation
 ↓
Answer
```

---

# 21. Citation System

Every AI-generated financial claim should ideally have evidence.

Example:

```text
NVIDIA's gross margin declined during the quarter.

[Source 1]
NVDA Q2 10-Q
Page 14

[Source 2]
Earnings transcript
August 2026
```

The UI should allow:

```text
Click citation
       ↓
Open source
       ↓
Highlight relevant paragraph
```

This significantly improves trust.

---

# 22. AI Research Assistant

This is the main AI interface.

User:

> “Why did NVDA fall today?”

The system should NOT immediately answer.

It first creates a research plan.

```text
Research Request
       ↓
Planner
       ↓
┌──────────────────────┐
│ Market investigation │
│ News investigation   │
│ Filing investigation │
│ Peer investigation   │
│ Macro investigation │
└──────────────────────┘
       ↓
Evidence Collection
       ↓
Reasoning
       ↓
Verification
       ↓
Final Report
```

---

# 23. Agent Architecture

Use specialized agents.

### 1. Planner Agent

Converts user question into a research plan.

### 2. Market Agent

Analyzes:

- price
- volume
- volatility
- correlations
- technical movements

### 3. News Agent

Searches recent news and events.

### 4. Filing Agent

Searches:

- 10-K
- 10-Q
- 8-K
- company filings

### 5. Financial Agent

Analyzes:

- revenue
- margins
- EPS
- cash flow
- valuation

### 6. Peer Agent

Compares competitors.

### 7. Macro Agent

Looks at:

- rates
- inflation
- indices
- commodities
- macroeconomic events

### 8. Critic Agent

Checks:

- unsupported claims
- contradictory evidence
- stale information
- calculation errors

### 9. Synthesis Agent

Produces the final response.

---

# 24. Agent Workflow

Example:

```text
User:
"Why did NVDA drop?"

        │
        ▼
   Planner Agent
        │
        ├──────────────┐
        ▼              ▼
 Market Agent       News Agent
        │              │
        ▼              ▼
 Filing Agent       Macro Agent
        │              │
        └───────┬──────┘
                ▼
          Evidence Store
                │
                ▼
          Critic Agent
                │
                ▼
        Synthesis Agent
                │
                ▼
       Cited Research Report
```

---

# 25. Agent Tool Contracts

Agents should never directly access your databases.

Expose controlled tools.

Example:

```text
get_quote(symbol)
get_historical_prices(symbol, range)
get_financials(symbol, period)
get_company_profile(symbol)
search_filings(symbol, query)
get_filing(documentId)
search_news(query, timeRange)
compare_companies(symbols, metrics)
calculate_metric(metric, inputs)
search_market_events(query)
```

The LLM decides which tools to call.

The backend owns authorization and validation.

Modern model APIs support function/tool calling and remote MCP-style integrations, which makes this architecture practical.

---

# 26. Example Tool Contract

```json
{
  "name": "get_historical_prices",
  "description": "Returns historical OHLCV data for a security",
  "input": {
    "symbol": "string",
    "startDate": "string",
    "endDate": "string",
    "interval": "1m | 5m | 1h | 1d"
  }
}
```

Response:

```json
{
  "symbol": "NVDA",
  "interval": "1d",
  "data": [
    {
      "timestamp": "2026-08-14",
      "open": 176.2,
      "high": 177.4,
      "low": 169.8,
      "close": 172.31,
      "volume": 1829301
    }
  ]
}
```

---

# 27. MCP Layer

Expose financial capabilities through MCP-style tools.

Potential tools:

```text
financial.get_quote
financial.get_financials
financial.get_earnings
financial.search_filings
financial.search_news
financial.compare
financial.get_peers
financial.get_events
financial.get_historical_prices
financial.calculate
```

This gives the project an additional architecture story:

> “I exposed my financial intelligence platform as a tool layer that agents can consume.”

---

# 28. Autonomous Market Investigation

This should be your **killer feature**.

User:

> “Find unusual activity in the semiconductor sector.”

The system:

```text
1. Scan price movements
2. Detect abnormal volume
3. Detect volatility anomalies
4. Identify affected securities
5. Search recent news
6. Search filings
7. Compare sector movement
8. Check macro events
9. Generate hypotheses
10. Validate hypotheses
11. Produce investigation
```

Example result:

```text
SEMICONDUCTOR INVESTIGATION

Detected:
NVDA + abnormal volume
AMD + elevated volatility
SOXX + sector-wide movement

Possible catalysts:

1. Earnings guidance
   Confidence: 91%

2. Export policy development
   Confidence: 78%

3. Broader semiconductor rotation
   Confidence: 64%

Evidence:
[10-Q]
[News article]
[Market data]
[Sector comparison]
```

This is far more impressive than a chatbot.

---

# 29. Anomaly Detection Service

Separate AI reasoning from deterministic anomaly detection.

Architecture:

```text
Market Stream
      ↓
Feature Generator
      ↓
Anomaly Detection
      ↓
Event Store
      ↓
Research Trigger
```

Potential signals:

```text
Price deviation
Volume spike
Volatility spike
Gap
Correlation breakdown
Sector divergence
Unusual spread
```

---

# 30. Alert System

Users can create alerts.

Examples:

```text
NVDA < 150
NVDA volume > 2x average
AAPL earnings released
TSLA gross margin < X
BTC moves > 5%
NVDA unusual activity
```

Architecture:

```text
Market Event
      ↓
Rule Engine
      ↓
Matching Rules
      ↓
Alert Event
      ↓
Notification Service
```

---

# 31. Portfolio Module

Users can create:

```text
Portfolio
Watchlist
Positions
Transactions
```

Show:

- allocation
- P&L
- exposure
- sector exposure
- concentration
- performance
- risk metrics

Important:

The system should clearly distinguish **analytics/information from personalized financial advice**.

---

# 32. Notification Service

Potential channels:

```text
In-app
Email
Push
Webhook
```

Architecture:

```text
Alert Event
    ↓
Notification Queue
    ↓
Notification Workers
    ├── Email
    ├── Push
    └── Webhook
```

Use asynchronous processing.

---

# 33. Core Backend Services

I would define these services:

```text
1. API Gateway
2. Auth Service
3. User Service
4. Workspace Service
5. Market Data Service
6. Market Ingestion Service
7. Financial Data Service
8. Company Intelligence Service
9. Filing Service
10. News Service
11. Search Service
12. RAG Service
13. Agent Orchestrator
14. Analytics Service
15. Anomaly Detection Service
16. Alert Service
17. Notification Service
18. WebSocket Gateway
19. Audit Service
20. Observability
```

Do NOT necessarily deploy all 20 as separate microservices on day one.

Start with a modular monolith plus independent workers.

Then split services when justified.

---

# 34. Recommended Deployment Architecture

```text
                         Internet
                            │
                            ▼
                     CloudFront / CDN
                            │
                            ▼
                     Load Balancer
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
        Next.js App                  API Gateway
                                           │
                     ┌─────────────────────┼─────────────────────┐
                     ▼                     ▼                     ▼
                User APIs           Market APIs             AI APIs
                     │                     │                     │
                     ▼                     ▼                     ▼
                PostgreSQL              Redis             Agent Runtime
                     │                     │                     │
                     │              Redis Streams                │
                     │                     │                     │
                     ▼                     ▼                     ▼
                Data Layer         WebSocket Gateway       RAG Pipeline
                                                               │
                                                               ▼
                                                         Vector Store
                                                               │
                                                               ▼
                                                           LLM APIs
```

---

# 35. Data Architecture

Use PostgreSQL as the primary relational database.

Major tables:

```text
users
organizations
memberships
roles
workspaces
workspace_panels

companies
securities
exchanges

quotes
price_bars
market_events

financial_periods
financial_metrics

filings
filing_chunks
documents

news_articles
news_entities

watchlists
watchlist_items

portfolios
positions
transactions

alerts
alert_events

research_sessions
research_tasks
research_reports
research_citations

agent_runs
agent_steps
tool_calls

audit_logs
```

---

# 36. Multi-Tenancy

Your resume already claims multi-tenant SaaS architecture.

Demonstrate it here.

Every tenant-owned record contains:

```text
organization_id
```

Example:

```sql
workspace
-----------
id
organization_id
name
created_at
```

Authorization:

```text
JWT
 ↓
User
 ↓
Organization Membership
 ↓
Role
 ↓
Resource
```

Never rely only on frontend authorization.

---

# 37. RBAC

Roles:

```text
Owner
Admin
Analyst
Member
Viewer
```

Permissions:

```text
workspace.read
workspace.write
portfolio.read
portfolio.write
research.run
research.share
billing.manage
members.manage
```

---

# 38. Authentication

Use:

```text
OAuth
JWT
Refresh Tokens
RBAC
```

Access token:

```text
short-lived
```

Refresh token:

```text
rotated
revocable
securely stored
```

---

# 39. API Architecture

I recommend:

### GraphQL

For:

```text
company pages
financial dashboards
workspace state
research results
user configuration
```

### REST

For:

```text
authentication
file/document operations
webhooks
health checks
internal service APIs
```

### WebSocket

For:

```text
market updates
agent progress
alerts
live research streaming
```

---

# 40. GraphQL Example

```graphql
query Company($symbol: String!) {
  company(symbol: $symbol) {
    symbol
    name

    quote {
      price
      change
      changePercent
    }

    financials {
      revenue
      grossMargin
      operatingMargin
      eps
    }

    peers {
      symbol
      peRatio
      revenueGrowth
    }
  }
}
```

---

# 41. Research API

Start research:

```http
POST /v1/research
```

Request:

```json
{
  "query": "Why did NVDA decline today?",
  "symbols": ["NVDA"],
  "mode": "deep"
}
```

Response:

```json
{
  "researchId": "res_123",
  "status": "queued"
}
```

Then stream progress:

```text
WS /v1/research/res_123
```

Events:

```json
{
  "type": "agent.started",
  "agent": "market"
}
```

```json
{
  "type": "tool.called",
  "tool": "search_news"
}
```

```json
{
  "type": "evidence.found",
  "sourceId": "src_123"
}
```

```json
{
  "type": "research.completed"
}
```

---

# 42. Research State Machine

Use explicit states.

```text
QUEUED
  ↓
PLANNING
  ↓
RESEARCHING
  ↓
VERIFYING
  ↓
SYNTHESIZING
  ↓
COMPLETED
```

Failure:

```text
ANY STATE
   ↓
FAILED
```

Cancellation:

```text
ANY RUNNING STATE
   ↓
CANCELLED
```

This is much safer than letting agents run uncontrolled.

---

# 43. Agent Run Model

```json
{
  "runId": "run_123",
  "researchId": "res_123",
  "agent": "market",
  "status": "running",
  "startedAt": "...",
  "completedAt": null,
  "steps": [
    {
      "type": "tool_call",
      "tool": "get_historical_prices",
      "status": "completed"
    }
  ]
}
```

This gives you full observability.

---

# 44. AI Guardrails

Financial AI requires strong boundaries.

The system should:

### Never

- invent financial figures
- invent citations
- claim unsupported causality
- fabricate market events
- silently use stale data

### Always

- show data timestamp
- show source
- distinguish fact from inference
- cite evidence
- surface uncertainty
- validate calculations

Example:

```text
FACT
NVDA revenue increased X%.

SOURCE
Q2 10-Q

INFERENCE
This may indicate...

CONFIDENCE
82%
```

---

# 45. Data Freshness

Every dataset should carry:

```text
source
retrieved_at
effective_at
expires_at
```

Example:

```json
{
  "price": 172.31,
  "source": "provider",
  "effectiveAt": "...",
  "retrievedAt": "..."
}
```

The UI can display:

```text
● Live
Updated 230ms ago
```

or:

```text
⚠ Delayed
Updated 18m ago
```

---

# 46. Caching Strategy

### Redis

Use for:

```text
latest quotes
company profiles
popular queries
AI research sessions
rate limits
distributed locks
```

### PostgreSQL

Use for durable data.

### Browser

Use:

```text
IndexedDB
```

for cached historical data/workspaces where useful.

---

# 47. Event Architecture

Core event types:

```text
market.quote.updated
market.bar.completed
market.anomaly.detected

filing.created
filing.indexed

news.created
news.updated

research.created
research.started
research.agent.started
research.agent.completed
research.completed
research.failed

alert.triggered
notification.sent
```

This makes the system extensible.

AWS's architecture guidance explicitly emphasizes loosely coupled event-driven components and idempotent interactions for distributed systems.

---

# 48. Idempotency

Important for:

```text
payments
alerts
research jobs
ingestion
notifications
event processing
```

Example:

```http
Idempotency-Key: research_123_attempt_1
```

If the same request arrives twice:

```text
Request 1 → execute
Request 2 → return existing result
```

---

# 49. Message Processing

Use:

```text
Redis Streams
```

initially.

Potential future architecture:

```text
Kafka
```

when event volume requires stronger distributed streaming infrastructure.

Don't introduce Kafka just to put Kafka on your resume.

---

# 50. Background Workers

Workers handle:

```text
market ingestion
filing ingestion
document parsing
embedding generation
news ingestion
agent execution
anomaly detection
alert evaluation
notifications
```

Architecture:

```text
API
 ↓
Queue
 ↓
Worker
 ↓
Result/Event
```

---

# 51. Search Architecture

Use two types of search.

### Structured

```text
symbol
sector
industry
date
filing type
market cap
```

### Semantic

```text
"companies exposed to AI infrastructure"
"why are margins declining?"
"previous guidance cuts"
```

Hybrid search:

```text
Keyword
+
Vector
+
Metadata
+
Reranking
```

---

# 52. Vector Data

Store:

```text
document_id
chunk_id
embedding
text
company_id
filing_type
filing_date
page
section
source_url
```

This allows highly precise retrieval.

---

# 53. Research Evidence Graph

A particularly impressive addition:

```text
Company
  │
  ├── Filing
  │     └── Evidence
  │
  ├── News
  │     └── Evidence
  │
  ├── Earnings
  │     └── Evidence
  │
  ├── Market Event
  │     └── Evidence
  │
  └── Peer
        └── Evidence
```

A research report is then composed of:

```text
Claim
 ↓
Evidence
 ↓
Source
 ↓
Document
```

This gives you explainability.

---

# 54. Research Report Schema

```json
{
  "researchId": "res_123",
  "title": "Why NVDA moved today",
  "summary": "...",
  "claims": [
    {
      "text": "...",
      "type": "fact",
      "confidence": 0.94,
      "citations": ["src_123"]
    }
  ],
  "sources": [],
  "agents": [],
  "createdAt": "..."
}
```

---

# 55. Observability

This is mandatory for a project of this complexity.

Implement:

```text
OpenTelemetry
Structured Logs
Metrics
Tracing
Error Tracking
```

Track:

### API

```text
p50 latency
p95 latency
p99 latency
error rate
requests/sec
```

### WebSocket

```text
connections
messages/sec
reconnect rate
dropped events
lag
```

### AI

```text
agent duration
tool calls
tokens
cost
failure rate
retrieval precision
citation coverage
```

---

# 56. AI Evaluation

This is one of the best differentiators.

Don't just say:

> “I built an AI agent.”

Measure it.

Create an evaluation dataset:

```text
100 financial questions
```

Measure:

```text
Answer correctness
Citation correctness
Citation completeness
Retrieval recall
Tool selection accuracy
Hallucination rate
Latency
Cost
```

Example:

```text
RAG Recall             91%
Citation Accuracy      96%
Tool Selection         94%
Unsupported Claims      2.1%
Median Research Time   8.4s
```

Only report numbers you actually measure.

---

# 57. AI Cost Controls

Agent systems can become expensive.

Implement:

```text
model routing
token budgets
max tool calls
max agent steps
caching
result reuse
context compression
```

Example:

```text
Simple question
      ↓
small/cheap model

Deep research
      ↓
strong reasoning model
```

---

# 58. Security Architecture

Important layers:

```text
TLS
JWT
RBAC
Rate Limiting
Input Validation
Secrets Manager
Encryption
Audit Logs
CORS
CSRF protection where applicable
SQL injection protection
Prompt injection defenses
```

Never expose:

```text
LLM API keys
database credentials
market provider credentials
AWS secrets
```

to the browser.

---

# 59. Prompt Injection Protection

This is especially important because financial documents and news are untrusted content.

A filing could contain malicious/instruction-like text.

Therefore:

```text
Retrieved document
        ↓
Treat as DATA
        ↓
Never as SYSTEM INSTRUCTION
```

Tool permissions should also be explicit.

The agent should not be able to arbitrarily execute backend operations.

---

# 60. Rate Limiting

Per:

```text
IP
user
organization
API key
research run
```

Example:

```text
Free:
10 research runs/day

Pro:
100/day

Internal:
unlimited
```

---

# 61. API Versioning

Use:

```text
/v1
```

Examples:

```text
/v1/companies
/v1/quotes
/v1/filings
/v1/research
/v1/watchlists
/v1/alerts
```

Never make the API contract dependent on internal database models.

---

# 62. Contract-First Development

Define:

```text
OpenAPI
GraphQL schema
JSON schemas
WebSocket event schemas
Agent tool schemas
```

before implementation.

Generate TypeScript types from contracts where possible.

This reduces frontend/backend drift.

---

# 63. Monorepo Structure

I would use:

```text
finsight/
│
├── apps/
│   ├── web/
│   ├── api/
│   ├── agent-service/
│   └── ingestion-worker/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── schemas/
│   ├── api-client/
│   ├── config/
│   └── eslint-config/
│
├── services/
│   ├── market-data/
│   ├── financial-data/
│   ├── filings/
│   ├── news/
│   ├── search/
│   ├── alerts/
│   └── notifications/
│
├── infrastructure/
│   ├── terraform/
│   ├── docker/
│   └── environments/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── adr/
│   └── research/
│
└── tests/
```

---

# 64. Technology Stack

## Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
Zustand
TanStack Query
WebSockets
Web Workers
IndexedDB
```

## Backend

```text
Node.js
TypeScript
FastAPI
Python
GraphQL
REST
WebSockets
```

## AI

```text
OpenAI
Claude
RAG
Embeddings
Vector Search
MCP
Agent Orchestration
```

OpenAI's current API supports tool/function integrations, streaming, file analysis and agent-oriented workflows, which fits the proposed tool-driven architecture.

## Data

```text
PostgreSQL
pgvector
Redis
Redis Streams
S3
```

## Infrastructure

```text
Docker
AWS
CloudFront
ECS
RDS
ElastiCache
S3
GitHub Actions
Terraform
```

## Observability

```text
OpenTelemetry
Prometheus
Grafana
Sentry
CloudWatch
```

---

# 65. AWS Architecture

Start simple:

```text
CloudFront
    ↓
ALB
    ↓
ECS
 ├── Next.js
 ├── API
 ├── Agent Service
 └── Workers

RDS PostgreSQL
ElastiCache Redis
S3
Secrets Manager
CloudWatch
```

Later:

```text
Kafka / MSK
EKS
OpenSearch
```

only if actual requirements justify them.

AWS's Well-Architected framework is organized around operational excellence, security, reliability, performance efficiency, cost optimization and sustainability, so those should explicitly guide the production architecture.

---

# 66. CI/CD

Pipeline:

```text
Pull Request
    ↓
Lint
    ↓
Type Check
    ↓
Unit Tests
    ↓
Integration Tests
    ↓
Build
    ↓
Security Scan
    ↓
Docker Build
    ↓
Deploy Staging
    ↓
Smoke Tests
    ↓
Production
```

Use:

```text
GitHub Actions
Docker
Terraform
```

---

# 67. Testing Strategy

### Frontend

```text
Unit
Component
Integration
E2E
```

### Backend

```text
Unit
Integration
Contract
Load
```

### AI

```text
Golden dataset
RAG evaluation
Tool-call evaluation
Citation evaluation
Regression tests
```

### Real-time

Test:

```text
reconnection
out-of-order events
duplicate events
missing events
slow consumers
high-frequency updates
```

---

# 68. Database Reliability

Implement:

```text
indexes
query optimization
connection pooling
read replicas later
backups
point-in-time recovery
migration system
```

Time-series tables should be designed carefully because market data can grow extremely quickly.

---

# 69. Data Retention

Not every dataset needs the same retention.

Example:

```text
Real-time ticks
→ short retention

1-minute bars
→ long retention

Daily bars
→ effectively permanent

Research reports
→ permanent

Agent logs
→ configurable retention
```

---

# 70. Performance Targets

Set measurable engineering targets.

### Frontend

```text
LCP < 2.0s
INP < 200ms
No unnecessary rerenders
```

### API

```text
p95 < 300ms
```

for normal non-AI requests.

### WebSocket

```text
p95 event delivery < 200ms
```

Target depends on the market-data source and geography; don't claim exchange-grade latency.

### AI

```text
Simple query < 5s
Deep research < 30s
```

Again, measure actual results.

---

# 71. Scalability Model

Suppose:

```text
10,000 concurrent users
```

You don't want:

```text
10,000 × external market API connections
```

Instead:

```text
External Provider
       ↓
Small number of ingestion connections
       ↓
Internal event stream
       ↓
WebSocket fleet
       ↓
10,000 clients
```

This is an excellent system-design interview discussion.

---

# 72. WebSocket Scaling

Multiple WebSocket servers:

```text
Client
  ↓
Load Balancer
  ↓
WS-1
WS-2
WS-3
WS-4
```

Redis Streams/PubSub or another event backbone distributes updates.

Each server can maintain local subscriptions.

---

# 73. Failure Handling

Example:

```text
Market Provider DOWN
        ↓
Circuit Breaker
        ↓
Cached/latest known data
        ↓
UI shows "Delayed"
```

AI provider unavailable:

```text
Primary LLM
    ↓ failure
Fallback model/provider
```

Redis unavailable:

```text
degraded mode
↓
database fallback where appropriate
```

Never silently return fake data.

---

# 74. Disaster Recovery

Implement:

```text
PostgreSQL backups
S3 versioning
Infrastructure as Code
Secrets backup strategy
Recovery runbook
```

Define:

```text
RPO
RTO
```

Even if the portfolio deployment is small.

---

# 75. Important Architectural Decision

## Do NOT start with 20 microservices.

Version 1:

```text
Next.js
   +
Node API
   +
Python AI Service
   +
PostgreSQL
   +
Redis
   +
Workers
```

Then split based on boundaries.

This is much more defensible than saying:

> “I used microservices because it's scalable.”

---

# 76. Suggested Service Boundaries

Eventually:

```text
API Gateway
│
├── Identity
├── Workspace
├── Market
├── Financial
├── Documents
├── Search
├── Research
├── Alerts
└── Notifications
```

And event-driven workers:

```text
Market Worker
Filing Worker
Embedding Worker
News Worker
Agent Worker
Alert Worker
```

---

# 77. MVP

Don't try to build everything immediately.

### MVP 1

```text
Authentication
Company search
Watchlist
Company page
Historical chart
Financials
News
Basic workspace
```

### MVP 2

```text
WebSocket market updates
Redis
Alerts
Command palette
Keyboard navigation
```

### MVP 3

```text
SEC ingestion
RAG
Financial research assistant
Citations
```

### MVP 4

```text
Multi-agent research
Autonomous investigations
Anomaly detection
```

### MVP 5

```text
Production deployment
Observability
AI evaluation
Load testing
Security hardening
```

---

# 78. The Demo Flow

The portfolio website should immediately show this:

### Demo 1 — Terminal

Open:

```text
NVDA
```

Show:

```text
Live price
Chart
Financials
News
Peers
```

### Demo 2 — Ask AI

User:

> Why did NVDA move today?

Show live agent execution:

```text
Planner ✓
Market Agent ✓
News Agent ✓
Filing Agent ✓
Peer Agent ✓
Critic ✓
```

Then produce cited answer.

### Demo 3 — Autonomous Investigation

User:

> Find unusual activity in semiconductors.

Show the agent discovering an event without the user specifying a company.

### Demo 4 — Evidence

Click a citation.

Open:

```text
10-Q
↓
relevant section highlighted
```

### Demo 5 — Real-Time

Open multiple symbols.

Show live updates flowing through WebSockets.

This five-minute demo tells your entire engineering story.

---

# 79. What Makes This Resume-Worthy

The project lets you legitimately demonstrate:

```text
✓ React
✓ Next.js
✓ TypeScript
✓ Python
✓ FastAPI
✓ Node.js
✓ GraphQL
✓ REST
✓ PostgreSQL
✓ Redis
✓ WebSockets
✓ Distributed Systems
✓ Event-Driven Architecture
✓ AWS
✓ Docker
✓ CI/CD
✓ AI Agents
✓ RAG
✓ Embeddings
✓ Vector Search
✓ MCP
✓ LLM orchestration
✓ AI evaluation
✓ RBAC
✓ Observability
✓ System Design
```

Those are not arbitrary technologies; they map directly to the capabilities already represented in your resume.

---

# 80. What I Would Put on Your Resume Eventually

Once the project is genuinely built and measured, the bullets could look conceptually like:

> **FinSight — AI Financial Intelligence Terminal**  
> Next.js · TypeScript · Python · FastAPI · PostgreSQL · Redis · WebSockets · RAG · AI Agents · AWS

Then bullets around:

- Architected a real-time financial intelligence platform ingesting and streaming market data through Redis Streams and WebSockets to a high-performance terminal UI.
- Built an agentic financial research engine combining hybrid RAG, SEC filings, market data and news with source-level citation and evidence verification.
- Designed autonomous market investigations using specialized market, filing, news and critic agents with observable tool execution and bounded workflows.
- Implemented multi-tenant workspaces, RBAC, event-driven alerts, caching, background workers and production AWS infrastructure.

**But only use numerical claims after you actually measure them.**

---

# 81. The Architecture Interview Story

If an interviewer asks:

> “Walk me through your project.”

Your answer should eventually be:

```text
The frontend is a Next.js terminal application.

Market data enters through an ingestion service rather than
directly from clients. We normalize provider-specific events,
publish them through Redis Streams, and distribute them through
a WebSocket gateway.

Durable financial and application data lives in PostgreSQL,
while Redis handles hot state and caching.

For AI research, we separate deterministic financial analytics
from LLM reasoning. Documents such as SEC filings are indexed
using hybrid retrieval. A planner creates a research graph,
specialized agents collect evidence through typed tools, and a
critic validates the evidence before the synthesis agent creates
the final cited report.

The entire research process is asynchronous and observable,
with agent runs, tool calls, citations and failures persisted
for debugging and evaluation.
```

That is the level of answer this project should enable.

---

# 82. Final Architecture

The complete system can be thought of as six planes.

```text
                    FINsight
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   EXPERIENCE       INTELLIGENCE     DATA
        │              │              │
        ▼              ▼              ▼
 Terminal UI       AI Agents       Market Data
 Workspaces        RAG             Financial Data
 Charts            Research       SEC Filings
 Command           Reasoning      News
 Palette            Evaluation     Events
        │              │              │
        └──────────────┼──────────────┘
                       │
                  PLATFORM CORE
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
   PostgreSQL        Redis          Event Streams
       │               │                │
       └───────────────┼────────────────┘
                       │
                  INFRASTRUCTURE
                       │
          AWS + Docker + CI/CD
                       │
               OBSERVABILITY
                       │
         Logs + Metrics + Traces
```

---

# 83. The Most Important Design Principle

The project should have a strict separation between:

```text
FACT
```

```text
CALCULATION
```

```text
RETRIEVAL
```

```text
REASONING
```

```text
INFERENCE
```

For example:

```text
FACT
Revenue = $X
Source = SEC filing

        ↓

CALCULATION
Revenue growth = Y%

        ↓

RETRIEVAL
News indicates...

        ↓

REASONING
Possible catalyst...

        ↓

INFERENCE
The movement may be related to...
Confidence: 78%
```

That architecture makes the AI system much more credible.

---

# 84. Final Scope Recommendation

Do **not** attempt to replicate all of Bloomberg.

Build approximately:

```text
30% Terminal
20% Real-Time Infrastructure
20% Financial Data
20% AI Research / Agents
10% Platform / DevOps
```

The objective is not feature count.

The objective is to demonstrate:

> **Can Sahil design and build a complex AI-powered distributed system end-to-end?**

Your existing resume already says you have shipped 15+ production applications and owned architecture from 0→1.

This project should therefore be the **technical proof of that claim**.

# Final Project Definition

**FinSight** is a production-oriented, AI-native financial intelligence terminal that provides real-time market data, company fundamentals, SEC filing intelligence, news, portfolio analytics and autonomous financial research through a high-performance terminal interface.

Its differentiator is an agentic research engine that can autonomously decompose financial questions, retrieve structured and unstructured evidence, invoke typed financial tools, reason over market events, validate claims, and produce source-cited research reports.

The architecture combines:

```text
Next.js
React
TypeScript
Python
FastAPI
Node.js
GraphQL
PostgreSQL
Redis
Redis Streams
WebSockets
RAG
Vector Search
AI Agents
MCP
AWS
Docker
GitHub Actions
OpenTelemetry
```

The system is designed around **real-time event processing, asynchronous workflows, typed contracts, multi-tenancy, security, observability, AI evaluation and graceful degradation**, rather than being a conventional dashboard.

That is the version I would build for your resume.