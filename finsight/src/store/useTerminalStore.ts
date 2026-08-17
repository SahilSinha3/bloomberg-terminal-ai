import { create } from 'zustand';
import { SecuritySymbol, SecurityQuote, SECFiling, NewsArticle, ResearchReport, CitationReference, TerminalPanelId } from '../types/terminal';
import { INITIAL_QUOTES, MOCK_SEC_FILINGS, MOCK_NEWS, MOCK_PREBUILT_RESEARCH_REPORT } from '../data/mockFinancialData';

interface TerminalState {
  // Active state
  activeSymbol: SecuritySymbol;
  quotes: Record<string, SecurityQuote>;
  activePanel: TerminalPanelId;
  commandPaletteOpen: boolean;

  // Real-time streaming state
  isStreaming: boolean;

  // AI Research State
  activeResearchReport: ResearchReport | null;
  selectedCitation: CitationReference | null;
  isCitationDrawerOpen: boolean;
  isResearchRunning: boolean;

  // SEC Filings
  filings: SECFiling[];
  selectedFiling: SECFiling | null;
  activeChunkId: string | null;

  // News & Alerts
  news: NewsArticle[];

  // Actions
  setActiveSymbol: (symbol: SecuritySymbol) => void;
  setActivePanel: (panel: TerminalPanelId) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleStreaming: () => void;
  updateQuotePrice: (symbol: SecuritySymbol, newPrice: number) => void;

  // AI Research Actions
  startNewResearch: (query: string) => void;
  openCitation: (citation: CitationReference) => void;
  closeCitationDrawer: () => void;

  // Filings Actions
  selectFiling: (filing: SECFiling) => void;
  highlightChunk: (chunkId: string) => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  activeSymbol: 'NVIDIA',
  quotes: INITIAL_QUOTES,
  activePanel: 'CHART',
  commandPaletteOpen: false,

  isStreaming: true,

  activeResearchReport: MOCK_PREBUILT_RESEARCH_REPORT,
  selectedCitation: null,
  isCitationDrawerOpen: false,
  isResearchRunning: false,

  filings: MOCK_SEC_FILINGS,
  selectedFiling: MOCK_SEC_FILINGS[0],
  activeChunkId: null,

  news: MOCK_NEWS,

  setActiveSymbol: (symbol: SecuritySymbol) => set({ activeSymbol: symbol }),
  setActivePanel: (panel: TerminalPanelId) => set({ activePanel: panel }),
  setCommandPaletteOpen: (open: boolean) => set({ commandPaletteOpen: open }),

  toggleStreaming: () => set((state) => ({ isStreaming: !state.isStreaming })),

  updateQuotePrice: (symbol: SecuritySymbol, newPrice: number) => {
    set((state) => {
      const currentQuote = state.quotes[symbol];
      if (!currentQuote) return state;

      const diff = newPrice - currentQuote.price;
      const changePercent = (diff / currentQuote.price) * 100;

      return {
        quotes: {
          ...state.quotes,
          [symbol]: {
            ...currentQuote,
            price: Math.round(newPrice * 100) / 100,
            change: Math.round((currentQuote.change + diff) * 100) / 100,
            changePercent: Math.round((currentQuote.changePercent + changePercent) * 100) / 100,
            lastUpdated: new Date().toISOString()
          }
        }
      };
    });
  },

  startNewResearch: (query: string) => {
    const symbol = get().activeSymbol;

    set({
      isResearchRunning: true,
      activePanel: 'RESEARCH',
      activeResearchReport: {
        id: `res_${Date.now()}`,
        query,
        symbol,
        createdAt: new Date().toISOString(),
        status: 'PLANNING',
        summary: `Executing multi-agent financial investigation for ${symbol}...`,
        claims: [],
        citations: [],
        executionSteps: [
          {
            id: 'step_1',
            agentRole: 'PLANNER',
            name: 'Decompose Query into Sub-Agent Tasks',
            status: 'RUNNING',
            startedAt: new Date().toLocaleTimeString()
          }
        ]
      }
    });

    // Simulate multi-agent execution steps
    setTimeout(() => {
      set((state) => {
        if (!state.activeResearchReport) return state;
        return {
          activeResearchReport: {
            ...state.activeResearchReport,
            status: 'RESEARCHING',
            executionSteps: [
              ...state.activeResearchReport.executionSteps.map(s => s.id === 'step_1' ? { ...s, status: 'COMPLETED' as const, outputSummary: 'Sub-tasks generated for Market, News, and SEC Filing agents.' } : s),
              {
                id: 'step_2',
                agentRole: 'MARKET_AGENT',
                name: 'Fetch Market Ticks & Volume Metrics',
                status: 'RUNNING',
                startedAt: new Date().toLocaleTimeString(),
                toolCall: { toolName: 'get_historical_prices', params: { symbol, range: '30d' } }
              },
              {
                id: 'step_3',
                agentRole: 'FILING_AGENT',
                name: 'Query SEC EDGAR Form 10-Q & 10-K via Hybrid RAG',
                status: 'RUNNING',
                startedAt: new Date().toLocaleTimeString(),
                toolCall: { toolName: 'search_filings', params: { symbol, query } }
              }
            ]
          }
        };
      });
    }, 1500);

    setTimeout(() => {
      set((state) => {
        if (!state.activeResearchReport) return state;
        return {
          isResearchRunning: false,
          activeResearchReport: {
            ...state.activeResearchReport,
            status: 'COMPLETED',
            summary: `Automated investigation completed for ${symbol}: Evidence gathered across SEC filings, breaking news sentiment, and volume velocity. Grounding score verified at 0.96.`,
            claims: [
              {
                id: 'c1',
                text: `${symbol} intraday volume velocity reached 2.4x baseline average with key operational factors cited in Form 10-Q filings.`,
                claimType: 'FACT',
                confidence: 0.96,
                citationIds: ['cit_1']
              },
              {
                id: 'c2',
                text: 'SEC Risk Factors explicitly list semiconductor foundry packaging capacity (CoWoS) as a primary shipment constraint.',
                claimType: 'FACT',
                confidence: 0.94,
                citationIds: ['cit_2']
              }
            ],
            citations: [
              {
                id: 'cit_1',
                sourceType: 'SEC_FILING',
                title: `${symbol} Q2 Form 10-Q Report`,
                filingType: '10-Q',
                period: 'Q2 2026',
                pageNumber: 14,
                excerpt: 'Data Center revenue reached $26.3B, with gross margin contracting slightly to 75.1% during production ramp.'
              },
              {
                id: 'cit_2',
                sourceType: 'SEC_FILING',
                title: `${symbol} Item 1A Risk Factors`,
                filingType: '10-Q',
                period: 'Q2 2026',
                pageNumber: 28,
                excerpt: 'Reliance on single-source semiconductor foundries creates exposure to CoWoS capacity bottlenecks.'
              }
            ],
            executionSteps: state.activeResearchReport.executionSteps.map(s => ({ ...s, status: 'COMPLETED' as const }))
          }
        };
      });
    }, 3500);
  },

  openCitation: (citation: CitationReference) => {
    set({
      selectedCitation: citation,
      isCitationDrawerOpen: true
    });
  },

  closeCitationDrawer: () => set({ isCitationDrawerOpen: false, selectedCitation: null }),

  selectFiling: (filing: SECFiling) => set({ selectedFiling: filing, activePanel: 'FILINGS' }),

  highlightChunk: (chunkId: string) => set({ activeChunkId: chunkId, activePanel: 'FILINGS' })
}));
