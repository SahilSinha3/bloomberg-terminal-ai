export type SecuritySymbol = 'NVIDIA' | 'APPLE' | 'MICROSOFT' | 'AMD' | 'TESLA' | 'BTC-USD' | 'SPY';

export interface SecurityQuote {
  symbol: SecuritySymbol;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  marketCap: string;
  peRatio: number;
  sector: string;
  lastUpdated: string;
}

export interface OHLCVBar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma20?: number;
  ma50?: number;
  rsi?: number;
}

export interface FinancialMetric {
  period: string;
  revenue: number;
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  eps: number;
  freeCashFlow: number;
  cashAndEquivalents: number;
  totalDebt: number;
  grossMarginPercent: number;
  operatingMarginPercent: number;
  peRatio: number;
  evToEbitda: number;
}

export interface SECFiling {
  id: string;
  symbol: SecuritySymbol;
  type: '10-K' | '10-Q' | '8-K';
  filingDate: string;
  period: string;
  accessionNumber: string;
  title: string;
  summary: string;
  contentChunks: {
    chunkId: string;
    section: string;
    page: number;
    text: string;
    highlightKeywords?: string[];
  }[];
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  summary: string;
  url: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  relatedSymbols: SecuritySymbol[];
}

export interface MarketAnomaly {
  id: string;
  timestamp: string;
  symbol: SecuritySymbol;
  type: 'VOLUME_SPIKE' | 'PRICE_GAP' | 'VOLATILITY_BREAKOUT' | 'MARGIN_DEVIATION';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  metrics: {
    current: string;
    baseline: string;
    deviation: string;
  };
}

export type AgentRole =
  | 'PLANNER'
  | 'MARKET_AGENT'
  | 'NEWS_AGENT'
  | 'FILING_AGENT'
  | 'PEER_AGENT'
  | 'CRITIC_AGENT'
  | 'SYNTHESIS_AGENT';

export type AgentStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface AgentExecutionStep {
  id: string;
  agentRole: AgentRole;
  name: string;
  status: AgentStatus;
  startedAt?: string;
  completedAt?: string;
  toolCall?: {
    toolName: string;
    params: Record<string, unknown>;
    resultCount?: number;
  };
  outputSummary?: string;
}

export interface CitationReference {
  id: string;
  sourceType: 'SEC_FILING' | 'NEWS_ARTICLE' | 'MARKET_DATA';
  title: string;
  documentId?: string;
  filingType?: string;
  period?: string;
  pageNumber?: number;
  excerpt: string;
  url?: string;
}

export interface ResearchClaim {
  id: string;
  text: string;
  claimType: 'FACT' | 'CALCULATION' | 'INFERENCE';
  confidence: number;
  citationIds: string[];
}

export interface ResearchReport {
  id: string;
  query: string;
  symbol: SecuritySymbol;
  createdAt: string;
  summary: string;
  claims: ResearchClaim[];
  citations: CitationReference[];
  executionSteps: AgentExecutionStep[];
  status: 'QUEUED' | 'PLANNING' | 'RESEARCHING' | 'VERIFYING' | 'SYNTHESIZING' | 'COMPLETED' | 'FAILED';
}

export type TerminalPanelId = 'WATCHLIST' | 'CHART' | 'FINANCIALS' | 'FILINGS' | 'RESEARCH' | 'NEWS' | 'VESSELS' | 'FLIGHTS';
