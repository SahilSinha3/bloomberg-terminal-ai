'use client';

import React, { useEffect } from 'react';
import Header from '../components/Header';
import CommandPalette from '../components/CommandPalette';
import WatchlistPanel from '../components/WatchlistPanel';
import ChartPanel from '../components/ChartPanel';
import FinancialsPanel from '../components/FinancialsPanel';
import FilingsPanel from '../components/FilingsPanel';
import AIResearchPanel from '../components/AIResearchPanel';
import NewsPanel from '../components/NewsPanel';
import CitationModal from '../components/CitationModal';
import { useTerminalStore } from '../store/useTerminalStore';
import { SecuritySymbol } from '../types/terminal';

export default function Home() {
  const { activePanel, isStreaming, updateQuotePrice, quotes } = useTerminalStore();

  // Real-time market tick simulator effect (updates prices every 2 seconds)
  useEffect(() => {
    if (!isStreaming) return;

    const symbols: SecuritySymbol[] = ['NVDA', 'AAPL', 'MSFT', 'AMD', 'TSLA', 'BTC-USD', 'SPY'];

    const interval = setInterval(() => {
      // Pick random symbol to tick
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const currentQuote = quotes[randomSymbol];
      if (!currentQuote) return;

      // Realistic tick step (+-0.15%)
      const changeFactor = 1 + (Math.random() - 0.49) * 0.003;
      const newPrice = currentQuote.price * changeFactor;

      updateQuotePrice(randomSymbol, newPrice);
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming, quotes, updateQuotePrice]);

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-gray-100 flex flex-col font-mono selection:bg-[#ff9900] selection:text-black">
      {/* Top Bloomberg Terminal Status & Command Header */}
      <Header />

      {/* Main Terminal Workspace Area */}
      <main className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-4 gap-3 overflow-hidden">
        
        {/* Left Column: Fixed Watchlist Panel */}
        <div className="lg:col-span-1 h-[calc(100vh-4.5rem)] min-h-[500px]">
          <WatchlistPanel />
        </div>

        {/* Right Columns: Main Dynamic Panel View */}
        <div className="lg:col-span-3 h-[calc(100vh-4.5rem)] min-h-[500px]">
          {activePanel === 'CHART' && <ChartPanel />}
          {activePanel === 'FINANCIALS' && <FinancialsPanel />}
          {activePanel === 'FILINGS' && <FilingsPanel />}
          {activePanel === 'RESEARCH' && <AIResearchPanel />}
          {activePanel === 'NEWS' && <NewsPanel />}
        </div>
      </main>

      {/* Overlays & Modals */}
      <CommandPalette />
      <CitationModal />
    </div>
  );
}
