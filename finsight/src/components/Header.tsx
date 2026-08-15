'use client';

import React, { useState, useEffect } from 'react';
import { useTerminalStore } from '../store/useTerminalStore';
import { SecuritySymbol } from '../types/terminal';
import { 
  Terminal, 
  Wifi, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  FileText, 
  Newspaper,
  Anchor,
  Plane
} from 'lucide-react';

export default function Header() {
  const { 
    activeSymbol, 
    quotes, 
    activePanel, 
    setActiveSymbol, 
    setActivePanel, 
    setCommandPaletteOpen,
    isStreaming,
    toggleStreaming
  } = useTerminalStore();

  const [timeStr, setTimeStr] = useState<string>('');
  const [quickSearch, setQuickSearch] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const symbolsList: SecuritySymbol[] = ['NVDA', 'AAPL', 'MSFT', 'AMD', 'TSLA', 'BTC-USD', 'SPY'];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const upper = quickSearch.trim().toUpperCase() as SecuritySymbol;
    if (symbolsList.includes(upper)) {
      setActiveSymbol(upper);
      setQuickSearch('');
    } else {
      setCommandPaletteOpen(true);
    }
  };

  return (
    <div className="flex flex-col font-mono select-none">
      {/* Top Ticker Tape Banner */}
      <div className="bg-[#08090c] border-b border-[#1e222b] px-4 py-1 flex items-center justify-between text-[11px] text-gray-400 overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-4">
          <span className="text-[#ff9900] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff9900] animate-ping"></span>
            GLOBAL FEED:
          </span>
          <span className="text-gray-300">S&amp;P 500 <strong className="text-[#00e676]">5,924.40 (+0.36%)</strong></span>
          <span className="text-gray-300">NASDAQ <strong className="text-[#00e676]">18,910.20 (+0.54%)</strong></span>
          <span className="text-gray-300">BITCOIN <strong className="text-[#00e676]">$94,820 (+1.52%)</strong></span>
          <span className="text-gray-300">GOLD <strong className="text-[#ff5252]">$2,740.10 (-0.18%)</strong></span>
          <span className="text-gray-300">BRENT CRUDE <strong className="text-[#00e676]">$78.40 (+0.82%)</strong></span>
        </div>

        <div className="text-[10px] text-gray-500 font-semibold flex items-center gap-2">
          <span>AIS &amp; ADS-B RADAR:</span>
          <span className="text-[#00e676]">ONLINE</span>
          <span className="bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/40 text-[9px] px-1 py-0.2 rounded font-bold">PHASE 2 BETA</span>
        </div>
      </div>

      {/* Main Terminal Navigation Header */}
      <header className="bg-[#0e1014] border-b border-[#262a33] text-gray-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Market Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#171a21] border border-[#ff9900]/40 px-2.5 py-1 rounded text-xs font-bold text-[#ff9900] tracking-wider shadow-[0_0_12px_rgba(255,153,0,0.2)]">
            <Terminal size={15} className="text-[#ff9900] animate-pulse" />
            <span>BLOOMBERG TERMINAL AI</span>
          </div>

          <button
            onClick={toggleStreaming}
            className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border transition-colors ${
              isStreaming 
                ? 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/40' 
                : 'bg-gray-800 text-gray-400 border-gray-700'
            }`}
            title="Toggle Real-Time Market Ticks"
          >
            <Wifi size={12} className={isStreaming ? 'animate-pulse' : ''} />
            <span>{isStreaming ? 'STREAMING 12ms' : 'PAUSED'}</span>
          </button>
        </div>

        {/* Quick Ticker Switcher & Command Prompt */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="hidden xl:flex items-center gap-1 bg-[#13161c] p-1 rounded border border-[#222733]">
            {symbolsList.map((sym) => {
              const q = quotes[sym];
              const isPos = q ? q.change >= 0 : true;
              return (
                <button
                  key={sym}
                  onClick={() => setActiveSymbol(sym)}
                  className={`px-2 py-0.5 text-xs rounded font-bold transition-all ${
                    activeSymbol === sym 
                      ? 'bg-[#ff9900] text-black shadow-md' 
                      : 'text-gray-400 hover:text-white hover:bg-[#1f2430]'
                  }`}
                >
                  {sym}
                  {q && (
                    <span className={`ml-1 text-[10px] ${activeSymbol === sym ? 'text-black' : isPos ? 'text-[#00e676]' : 'text-[#ff5252]'}`}>
                      {isPos ? '+' : ''}{q.changePercent.toFixed(1)}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleQuickSubmit} className="relative flex-1">
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-[#ff9900] font-bold text-xs">CMD &gt;</span>
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Type symbol (NVDA) or press ⌘K..."
                className="w-full bg-[#13161c] border border-[#262a33] focus:border-[#ff9900] text-xs text-white pl-16 pr-8 py-1.5 rounded outline-none transition-all placeholder:text-gray-600 font-mono"
              />
              <button 
                type="button" 
                onClick={() => setCommandPaletteOpen(true)}
                className="absolute right-2 text-gray-500 hover:text-gray-300 text-xs"
              >
                <kbd className="bg-[#1f2430] border border-[#333a4a] px-1 py-0.5 rounded text-[10px]">⌘K</kbd>
              </button>
            </div>
          </form>
        </div>

        {/* View Switchers & Navigation Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#13161c] p-1 rounded border border-[#222733]">
            <button
              onClick={() => setActivePanel('CHART')}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                activePanel === 'CHART' ? 'bg-[#1f2430] text-[#00e5ff] font-bold border border-[#00e5ff]/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp size={13} />
              <span>Chart</span>
            </button>

            <button
              onClick={() => setActivePanel('FINANCIALS')}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                activePanel === 'FINANCIALS' ? 'bg-[#1f2430] text-[#00e5ff] font-bold border border-[#00e5ff]/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers size={13} />
              <span>Financials</span>
            </button>

            <button
              onClick={() => setActivePanel('FILINGS')}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                activePanel === 'FILINGS' ? 'bg-[#1f2430] text-[#00e5ff] font-bold border border-[#00e5ff]/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText size={13} />
              <span>SEC RAG</span>
            </button>

            {/* Phase 2 Beta Units */}
            <button
              onClick={() => setActivePanel('VESSELS')}
              className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors ${
                activePanel === 'VESSELS' ? 'bg-[#1f2430] text-[#00e5ff] font-bold border border-[#00e5ff]/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Anchor size={13} />
              <span>Ships</span>
              <span className="bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40 text-[9px] px-1 py-0.2 rounded font-bold">BETA</span>
            </button>

            <button
              onClick={() => setActivePanel('FLIGHTS')}
              className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors ${
                activePanel === 'FLIGHTS' ? 'bg-[#1f2430] text-[#ff9900] font-bold border border-[#ff9900]/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Plane size={13} />
              <span>Jets</span>
              <span className="bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/40 text-[9px] px-1 py-0.2 rounded font-bold">BETA</span>
            </button>

            <button
              onClick={() => setActivePanel('RESEARCH')}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                activePanel === 'RESEARCH' ? 'bg-[#ff9900]/20 text-[#ff9900] font-bold border border-[#ff9900]/50' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles size={13} className="text-[#ff9900]" />
              <span>AI Agents</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 border-l border-[#262a33] pl-3">
            <Clock size={13} className="text-[#ff9900]" />
            <span className="font-semibold text-gray-300">{timeStr}</span>
          </div>
        </div>
      </header>
    </div>
  );
}
