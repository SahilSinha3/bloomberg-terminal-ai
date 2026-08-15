'use client';

import React, { useState, useEffect } from 'react';
import { useTerminalStore } from '../store/useTerminalStore';
import { SecuritySymbol } from '../types/terminal';
import { 
  Search, 
  Terminal, 
  Wifi, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Activity,
  Layers,
  FileText,
  Newspaper,
  ShieldCheck
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

  const currentQuote = quotes[activeSymbol] || quotes['NVDA'];

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
    <header className="bg-[#0e1014] border-b border-[#262a33] text-gray-200 px-4 py-2 flex flex-wrap items-center justify-between gap-4 font-mono select-none">
      {/* Brand & Market Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-[#171a21] border border-[#ff9900]/40 px-2.5 py-1 rounded text-sm font-bold text-[#ff9900] tracking-wider shadow-[0_0_12px_rgba(255,153,0,0.2)]">
          <Terminal size={16} className="text-[#ff9900] animate-pulse" />
          <span>BLOOMBERG TERMINAL AI</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs bg-[#13161c] px-2 py-1 rounded border border-[#222733]">
          <span className="w-2 h-2 rounded-full bg-[#00e676] animate-ping"></span>
          <span className="text-[#00e676] font-semibold">MARKET OPEN</span>
        </div>

        <button
          onClick={toggleStreaming}
          className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded border transition-colors ${
            isStreaming 
              ? 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/40' 
              : 'bg-gray-800 text-gray-400 border-gray-700'
          }`}
          title="Toggle Real-Time Stream"
        >
          <Wifi size={13} className={isStreaming ? 'animate-pulse' : ''} />
          <span>{isStreaming ? 'LIVE 12ms' : 'PAUSED'}</span>
        </button>
      </div>

      {/* Symbol Selector & Quick Command Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        {/* Ticker Quick Buttons */}
        <div className="hidden lg:flex items-center gap-1 bg-[#13161c] p-1 rounded border border-[#222733]">
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

        {/* Command Line Input */}
        <form onSubmit={handleQuickSubmit} className="relative flex-1">
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-[#ff9900] font-bold text-xs">CMD &gt;</span>
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Type symbol or press ⌘K for Command Palette..."
              className="w-full bg-[#13161c] border border-[#262a33] focus:border-[#ff9900] text-xs text-white pl-16 pr-8 py-1.5 rounded outline-none transition-all placeholder:text-gray-600"
            />
            <button 
              type="button" 
              onClick={() => setCommandPaletteOpen(true)}
              className="absolute right-2 text-gray-500 hover:text-gray-300 text-xs flex items-center gap-1"
            >
              <kbd className="bg-[#1f2430] border border-[#333a4a] px-1 py-0.5 rounded text-[10px]">⌘K</kbd>
            </button>
          </div>
        </form>
      </div>

      {/* Navigation Tabs & Active Symbol Status */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 bg-[#13161c] p-1 rounded border border-[#222733]">
          <button
            onClick={() => setActivePanel('CHART')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
              activePanel === 'CHART' ? 'bg-[#1f2430] text-[#00e5ff] font-bold border border-[#00e5ff]/30' : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp size={13} />
            <span>Chart</span>
          </button>

          <button
            onClick={() => setActivePanel('FINANCIALS')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
              activePanel === 'FINANCIALS' ? 'bg-[#1f2430] text-[#00e5ff] font-bold border border-[#00e5ff]/30' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>Financials</span>
          </button>

          <button
            onClick={() => setActivePanel('FILINGS')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
              activePanel === 'FILINGS' ? 'bg-[#1f2430] text-[#00e5ff] font-bold border border-[#00e5ff]/30' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText size={13} />
            <span>SEC RAG</span>
          </button>

          <button
            onClick={() => setActivePanel('RESEARCH')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
              activePanel === 'RESEARCH' ? 'bg-[#ff9900]/20 text-[#ff9900] font-bold border border-[#ff9900]/50' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles size={13} className="text-[#ff9900]" />
            <span>AI Agents</span>
          </button>

          <button
            onClick={() => setActivePanel('NEWS')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
              activePanel === 'NEWS' ? 'bg-[#1f2430] text-[#00e5ff] font-bold border border-[#00e5ff]/30' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Newspaper size={13} />
            <span>News & Alerts</span>
          </button>
        </div>

        {/* Live Clock & Security Status */}
        <div className="flex items-center gap-2 text-xs text-gray-400 border-l border-[#262a33] pl-3">
          <Clock size={13} className="text-[#ff9900]" />
          <span className="font-semibold text-gray-300">{timeStr}</span>
        </div>
      </div>
    </header>
  );
}
