import { SecurityQuote, OHLCVBar, FinancialMetric, SECFiling, NewsArticle, MarketAnomaly, ResearchReport } from '../types/terminal';

export const INITIAL_QUOTES: Record<string, SecurityQuote> = {
  NVIDIA: {
    symbol: 'NVIDIA',
    name: 'NVIDIA Corporation',
    price: 172.31,
    change: -4.21,
    changePercent: -2.38,
    high24h: 177.50,
    low24h: 169.80,
    volume: 58492010,
    marketCap: '$4.21T',
    peRatio: 52.4,
    sector: 'Semiconductors',
    lastUpdated: new Date().toISOString()
  },
  APPLE: {
    symbol: 'APPLE',
    name: 'Apple Inc.',
    price: 214.20,
    change: 1.85,
    changePercent: 0.87,
    high24h: 215.40,
    low24h: 212.10,
    volume: 38920100,
    marketCap: '$3.28T',
    peRatio: 33.1,
    sector: 'Consumer Electronics',
    lastUpdated: new Date().toISOString()
  },
  MICROSOFT: {
    symbol: 'MICROSOFT',
    name: 'Microsoft Corporation',
    price: 521.11,
    change: 6.42,
    changePercent: 1.25,
    high24h: 523.00,
    low24h: 516.80,
    volume: 24109200,
    marketCap: '$3.87T',
    peRatio: 37.8,
    sector: 'Software & Cloud',
    lastUpdated: new Date().toISOString()
  },
  AMD: {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    price: 181.42,
    change: -3.88,
    changePercent: -2.09,
    high24h: 186.20,
    low24h: 179.90,
    volume: 42109800,
    marketCap: '$293.4B',
    peRatio: 48.2,
    sector: 'Semiconductors',
    lastUpdated: new Date().toISOString()
  },
  TESLA: {
    symbol: 'TESLA',
    name: 'Tesla, Inc.',
    price: 248.90,
    change: -7.10,
    changePercent: -2.77,
    high24h: 257.20,
    low24h: 246.50,
    volume: 61209300,
    marketCap: '$792.1B',
    peRatio: 64.5,
    sector: 'Automotive & Clean Energy',
    lastUpdated: new Date().toISOString()
  },
  'BTC-USD': {
    symbol: 'BTC-USD',
    name: 'Bitcoin USD',
    price: 94820.00,
    change: 1420.50,
    changePercent: 1.52,
    high24h: 95400.00,
    low24h: 92900.00,
    volume: 28940200100,
    marketCap: '$1.87T',
    peRatio: 0,
    sector: 'Digital Assets',
    lastUpdated: new Date().toISOString()
  },
  SPY: {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    price: 592.40,
    change: 2.10,
    changePercent: 0.36,
    high24h: 593.80,
    low24h: 590.20,
    volume: 51209400,
    marketCap: '$590B',
    peRatio: 26.8,
    sector: 'Broad Market Index',
    lastUpdated: new Date().toISOString()
  }
};

// Generate 30 days of OHLCV bars for charts
export function generateBarsForSymbol(symbol: string): OHLCVBar[] {
  const basePrice = INITIAL_QUOTES[symbol]?.price || 150;
  const bars: OHLCVBar[] = [];
  const now = new Date();

  let currentPrice = basePrice * 0.85; // Start 15% lower 30 days ago

  for (let i = 30; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const randomChangePercent = (Math.random() - 0.48) * 0.04;
    const open = Math.round(currentPrice * 100) / 100;
    const close = Math.round((open * (1 + randomChangePercent)) * 100) / 100;
    const high = Math.round(Math.max(open, close) * (1 + Math.random() * 0.015) * 100) / 100;
    const low = Math.round(Math.min(open, close) * (1 - Math.random() * 0.015) * 100) / 100;
    const volume = Math.floor(25000000 + Math.random() * 45000000);

    currentPrice = close;

    bars.push({
      timestamp: dateStr,
      open,
      high,
      low,
      close,
      volume,
      ma20: Math.round((close * 0.98) * 100) / 100,
      ma50: Math.round((close * 0.94) * 100) / 100,
      rsi: Math.round(45 + Math.random() * 30)
    });
  }

  return bars;
}

export const FINANCIAL_STATEMENTS: Record<string, FinancialMetric[]> = {
  NVIDIA: [
    {
      period: 'Q2 2026',
      revenue: 30040,
      grossProfit: 22580,
      operatingIncome: 18640,
      netIncome: 16590,
      eps: 0.68,
      freeCashFlow: 13480,
      cashAndEquivalents: 34800,
      totalDebt: 8460,
      grossMarginPercent: 75.1,
      operatingMarginPercent: 62.0,
      peRatio: 52.4,
      evToEbitda: 42.1
    },
    {
      period: 'Q1 2026',
      revenue: 26044,
      grossProfit: 20406,
      operatingIncome: 16909,
      netIncome: 14881,
      eps: 0.60,
      freeCashFlow: 11200,
      cashAndEquivalents: 31400,
      totalDebt: 8460,
      grossMarginPercent: 78.4,
      operatingMarginPercent: 64.9,
      peRatio: 58.2,
      evToEbitda: 46.8
    },
    {
      period: 'Q4 2025',
      revenue: 22103,
      grossProfit: 16761,
      operatingIncome: 13615,
      netIncome: 12285,
      eps: 0.51,
      freeCashFlow: 11217,
      cashAndEquivalents: 25980,
      totalDebt: 8460,
      grossMarginPercent: 76.0,
      operatingMarginPercent: 61.6,
      peRatio: 64.1,
      evToEbitda: 50.2
    },
    {
      period: 'FY 2025',
      revenue: 60922,
      grossProfit: 44301,
      operatingIncome: 32972,
      netIncome: 29760,
      eps: 1.19,
      freeCashFlow: 27021,
      cashAndEquivalents: 25980,
      totalDebt: 8460,
      grossMarginPercent: 72.7,
      operatingMarginPercent: 54.1,
      peRatio: 68.4,
      evToEbitda: 55.0
    }
  ]
};

export const MOCK_SEC_FILINGS: SECFiling[] = [
  {
    id: 'doc_NVIDIA_q2_2026',
    symbol: 'NVIDIA',
    type: '10-Q',
    filingDate: '2026-08-01',
    period: 'Q2 FY2026',
    accessionNumber: '0001045810-26-000042',
    title: 'NVIDIA Corp Form 10-Q for Quarterly Period Ended July 28, 2026',
    summary: 'Quarterly report detailing Data Center revenue growth of 154% YoY driven by Blackwell B200 architecture deployment, offset by supply chain constraints on CoWoS packaging.',
    contentChunks: [
      {
        chunkId: 'chunk_NVIDIA_1',
        section: 'Item 2. Management Discussion & Analysis',
        page: 14,
        text: 'Data Center revenue for the second quarter of fiscal 2026 was $26.3 billion, up 16% sequentially and up 154% from a year ago. Demand for our Blackwell GPU platform exceeded available supply, with gross margin contracting slightly to 75.1% due to component cost mix adjustments during initial production ramp.',
        highlightKeywords: ['Data Center', 'Blackwell GPU', 'gross margin', '75.1%']
      },
      {
        chunkId: 'chunk_NVIDIA_2',
        section: 'Item 1A. Risk Factors',
        page: 28,
        text: 'Our reliance on single-source semiconductor foundries, particularly TSMC for advanced 4N process node packaging (CoWoS), creates exposure to capacity bottlenecks. Any disruption in substrate availability could adversely affect shipment schedules for enterprise AI servers.',
        highlightKeywords: ['TSMC', 'CoWoS', 'capacity bottlenecks', 'packaging']
      }
    ]
  },
  {
    id: 'doc_NVIDIA_8k_2026',
    symbol: 'NVIDIA',
    type: '8-K',
    filingDate: '2026-08-14',
    period: 'Current Event',
    accessionNumber: '0001045810-26-000058',
    title: 'Form 8-K: Material Supply Expansion Agreement',
    summary: 'NVIDIA announces expanded supply agreement with SK Hynix and Micron Technology for High Bandwidth Memory (HBM3e / HBM4) allocation.',
    contentChunks: [
      {
        chunkId: 'chunk_NVIDIA_3',
        section: 'Item 8.01 Other Events',
        page: 2,
        text: 'On August 14, 2026, the Registrant entered into long-term wafer supply contracts guaranteeing HBM3e 12-hi stack capacity through 2027 to satisfy hyperscaler sovereign AI cluster deployments.',
        highlightKeywords: ['HBM3e', 'SK Hynix', 'hyperscaler', 'sovereign AI']
      }
    ]
  }
];

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'news_1',
    title: 'NVIDIA Experiences Volatility Following Supply Chain Assessment on Next-Gen Chips',
    source: 'Bloomberg Intelligence',
    publishedAt: '12 mins ago',
    summary: 'Analyst reports highlight tight substrate packaging capacity for AI accelerators, though demand remains at record highs across cloud providers.',
    url: 'https://bloomberg.com/news/NVIDIA-supply-chain-check',
    sentiment: 'BEARISH',
    relatedSymbols: ['NVIDIA', 'AMD', 'TESLA']
  },
  {
    id: 'news_2',
    title: 'Microsoft Expands Azure AI Infrastructure Footprint with New Custom Silicon and NVIDIA B200 Clusters',
    source: 'Financial Times',
    publishedAt: '45 mins ago',
    summary: 'Microsoft announces $12B capital expenditure expansion for enterprise AI models, reinforcing infrastructure commitment.',
    url: 'https://ft.com/tech/microsoft-azure-ai-capex',
    sentiment: 'BULLISH',
    relatedSymbols: ['MICROSOFT', 'NVIDIA']
  },
  {
    id: 'news_3',
    title: 'Semiconductor Sector Divergence: Options Activity Signals Short-Term Hedge Accumulation',
    source: 'Reuters Financial',
    publishedAt: '2 hours ago',
    summary: 'Traders increase put options protection across SOXX ETF following rapid rally over past two quarters.',
    url: 'https://reuters.com/markets/options-soxx-hedging',
    sentiment: 'NEUTRAL',
    relatedSymbols: ['NVIDIA', 'AMD', 'SPY']
  }
];

export const MOCK_ANOMALIES: MarketAnomaly[] = [
  {
    id: 'anom_1',
    timestamp: '14:22:10 UTC',
    symbol: 'NVIDIA',
    type: 'VOLUME_SPIKE',
    severity: 'HIGH',
    description: 'Abnormal block trade volume detected (2.8x 30-day average ticker velocity)',
    metrics: {
      current: '58.4M shares',
      baseline: '21.0M shares',
      deviation: '+178%'
    }
  },
  {
    id: 'anom_2',
    timestamp: '11:05:40 UTC',
    symbol: 'AMD',
    type: 'VOLATILITY_BREAKOUT',
    severity: 'MEDIUM',
    description: 'Intraday implied volatility jump ahead of sector peer earnings updates',
    metrics: {
      current: 'IV 48.2%',
      baseline: 'IV 34.0%',
      deviation: '+41.7%'
    }
  }
];

export const MOCK_PREBUILT_RESEARCH_REPORT: ResearchReport = {
  id: 'res_NVIDIA_move_2026',
  query: 'Why did NVIDIA move -2.38% today despite strong AI demand?',
  symbol: 'NVIDIA',
  createdAt: new Date().toISOString(),
  status: 'COMPLETED',
  summary: 'NVIDIA (NVIDIA) declined 2.38% to $172.31 today due to a combination of supply-chain capacity checks regarding CoWoS packaging substrate bottlenecks noted in recent SEC filings, options market hedging across the semiconductor sector (SOXX), and minor gross margin mix adjustments reported in Q2 Form 10-Q. Core fundamental demand for Blackwell GPUs remains strong.',
  claims: [
    {
      id: 'c1',
      text: 'NVIDIA Q2 Form 10-Q highlights Data Center revenue reaching $26.3B (+154% YoY), but noted a slight gross margin compression to 75.1% during initial Blackwell product ramp.',
      claimType: 'FACT',
      confidence: 0.98,
      citationIds: ['cit_1']
    },
    {
      id: 'c2',
      text: 'SEC Risk Factors explicitly designate TSMC 4N CoWoS substrate capacity as a primary operational bottleneck for server shipments.',
      claimType: 'FACT',
      confidence: 0.95,
      citationIds: ['cit_2']
    },
    {
      id: 'c3',
      text: 'Intraday news reports indicate institutional options hedging in SOXX ETF contributed to short-term pressure across semiconductor names.',
      claimType: 'INFERENCE',
      confidence: 0.84,
      citationIds: ['cit_3']
    }
  ],
  citations: [
    {
      id: 'cit_1',
      sourceType: 'SEC_FILING',
      title: 'NVIDIA Q2 Form 10-Q (Page 14)',
      filingType: '10-Q',
      period: 'Q2 FY2026',
      pageNumber: 14,
      excerpt: 'Data Center revenue for the second quarter of fiscal 2026 was $26.3 billion... gross margin contracting slightly to 75.1% due to component cost mix adjustments.'
    },
    {
      id: 'cit_2',
      sourceType: 'SEC_FILING',
      title: 'NVIDIA Item 1A Risk Factors (Page 28)',
      filingType: '10-Q',
      period: 'Q2 FY2026',
      pageNumber: 28,
      excerpt: 'Our reliance on single-source semiconductor foundries, particularly TSMC for advanced 4N process node packaging (CoWoS), creates exposure to capacity bottlenecks.'
    },
    {
      id: 'cit_3',
      sourceType: 'NEWS_ARTICLE',
      title: 'Bloomberg Intelligence: NVIDIA Supply Chain Assessment',
      excerpt: 'Analyst reports highlight tight substrate packaging capacity for AI accelerators, though demand remains at record highs across cloud providers.'
    }
  ],
  executionSteps: [
    {
      id: 'step_1',
      agentRole: 'PLANNER',
      name: 'Decompose Research Query into Multi-Agent Sub-tasks',
      status: 'COMPLETED',
      outputSummary: 'Created 4 parallel sub-tasks: 1) Price/Volume Anomaly analysis, 2) SEC 10-Q filing RAG query, 3) News sentiment scanning, 4) Semiconductor peer correlation.'
    },
    {
      id: 'step_2',
      agentRole: 'MARKET_AGENT',
      name: 'Query Market Ingestion Service & Anomaly Detection',
      status: 'COMPLETED',
      toolCall: {
        toolName: 'get_historical_prices',
        params: { symbol: 'NVIDIA', interval: '1d', range: '30d' },
        resultCount: 30
      },
      outputSummary: 'Detected 2.8x abnormal volume spike (58.4M shares) with intraday high of $177.50 reversing to low of $169.80.'
    },
    {
      id: 'step_3',
      agentRole: 'FILING_AGENT',
      name: 'Execute Hybrid RAG Search over SEC 10-Q / 10-K Filings',
      status: 'COMPLETED',
      toolCall: {
        toolName: 'search_filings',
        params: { symbol: 'NVIDIA', query: 'gross margin CoWoS substrate capacity' },
        resultCount: 2
      },
      outputSummary: 'Retrieved 2 cited paragraphs from Q2 10-Q MD&A section confirming 75.1% margin and TSMC CoWoS packaging bottlenecks.'
    },
    {
      id: 'step_4',
      agentRole: 'CRITIC_AGENT',
      name: 'Validate Evidence & Verify Claims Against Hallucination Defenses',
      status: 'COMPLETED',
      outputSummary: 'Verified 100% of claims against SEC Edgar line numbers. Grounding score: 0.98. Zero hallucinated metrics found.'
    },
    {
      id: 'step_5',
      agentRole: 'SYNTHESIS_AGENT',
      name: 'Assemble Final Cited Research Intelligence Report',
      status: 'COMPLETED',
      outputSummary: 'Compiled cited research report with 3 inline citations and source document links.'
    }
  ]
};
