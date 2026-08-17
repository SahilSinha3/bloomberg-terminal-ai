'use client';

import React, { useState, useEffect } from 'react';
import { useTerminalStore } from '../store/useTerminalStore';
import { SecuritySymbol } from '../types/terminal';
import { Search, Sparkles, TrendingUp, FileText, Layers, Newspaper, X, Terminal } from 'lucide-react';

export default function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setActiveSymbol,
    setActivePanel,
    startNewResearch,
    quotes
  } = useTerminalStore();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const availableSymbols: SecuritySymbol[] = ['NVIDIA', 'APPLE', 'MICROSOFT', 'AMD', 'TESLA', 'BTC-USD', 'SPY'];

  const filteredSymbols = availableSymbols.filter(sym =>
    sym.toLowerCase().includes(query.toLowerCase()) ||
    (quotes[sym]?.name || '').toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectSymbol = (sym: SecuritySymbol, panel?: 'CHART' | 'FINANCIALS' | 'FILINGS' | 'RESEARCH') => {
    setActiveSymbol(sym);
    if (panel) setActivePanel(panel);
    setCommandPaletteOpen(false);
    setQuery('');
  };

  const handleRunAIQuery = () => {
    if (!query.trim()) return;
    startNewResearch(query);
    setCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4 font-mono">
      <div className="bg-[#111318] border border-[#ff9900]/50 rounded-lg shadow-[0_0_40px_rgba(255,153,0,0.2)] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-150">

        {/* Top Command Input Bar */}
        <div className="p-3 border-b border-[#262a33] flex items-center gap-2 bg-[#171a21]">
          <Terminal className="text-[#ff9900]" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type ticker symbol, command (e.g. NVIDIA FILINGS), or ask AI research prompt..."
            className="w-full bg-transparent text-white text-sm outline-none placeholder:text-gray-500 font-mono"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.length > 0) {
                const upper = query.trim().toUpperCase() as SecuritySymbol;
                if (availableSymbols.includes(upper)) {
                  handleSelectSymbol(upper);
                } else {
                  handleRunAIQuery();
                }
              }
            }}
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick Suggestions & Commands */}
        <div className="p-3 max-h-[60vh] overflow-y-auto space-y-4 text-xs">

          {/* Ask AI Option */}
          {query.trim().length > 2 && (
            <div>
              <div className="text-[#ff9900] text-[10px] font-bold tracking-wider uppercase mb-1">Autonomous AI Agent Execution</div>
              <button
                onClick={handleRunAIQuery}
                className="w-full text-left p-2.5 rounded bg-[#ff9900]/10 border border-[#ff9900]/30 hover:bg-[#ff9900]/20 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#ff9900]" />
                  <span className="text-white font-semibold">Launch AI Research Agent: &quot;{query}&quot;</span>
                </div>
                <span className="text-[10px] bg-[#ff9900] text-black font-bold px-1.5 py-0.5 rounded">ENTER ↵</span>
              </button>
            </div>
          )}

          {/* Securities matching query */}
          <div>
            <div className="text-gray-500 text-[10px] font-bold tracking-wider uppercase mb-1.5">Securities & Market Quotes</div>
            <div className="space-y-1">
              {filteredSymbols.map((sym) => {
                const q = quotes[sym];
                const isPos = q ? q.change >= 0 : true;
                return (
                  <div
                    key={sym}
                    className="p-2 rounded bg-[#161922] hover:bg-[#202533] border border-[#222733] flex items-center justify-between cursor-pointer transition-colors"
                    onClick={() => handleSelectSymbol(sym)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#ff9900] text-sm">{sym}</span>
                      <span className="text-gray-300 font-sans text-xs">{q?.name}</span>
                      <span className="text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">{q?.sector}</span>
                    </div>

                    {q && (
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white">${q.price.toFixed(2)}</span>
                        <span className={`font-semibold text-xs ${isPos ? 'text-[#00e676]' : 'text-[#ff5252]'}`}>
                          {isPos ? '+' : ''}{q.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Terminal Navigation Shortcuts */}
          <div>
            <div className="text-gray-500 text-[10px] font-bold tracking-wider uppercase mb-1.5">Keyboard Navigation Shortcuts</div>
            <div className="grid grid-cols-2 gap-2 text-gray-300">
              <button
                onClick={() => { setActivePanel('CHART'); setCommandPaletteOpen(false); }}
                className="p-2 rounded bg-[#161922] hover:bg-[#202533] border border-[#222733] flex items-center gap-2 text-left"
              >
                <TrendingUp size={14} className="text-[#00e5ff]" />
                <span><strong className="text-white">G C</strong> — Price Chart & Technicals</span>
              </button>

              <button
                onClick={() => { setActivePanel('FINANCIALS'); setCommandPaletteOpen(false); }}
                className="p-2 rounded bg-[#161922] hover:bg-[#202533] border border-[#222733] flex items-center gap-2 text-left"
              >
                <Layers size={14} className="text-[#00e5ff]" />
                <span><strong className="text-white">G F</strong> — Financial Analytics</span>
              </button>

              <button
                onClick={() => { setActivePanel('FILINGS'); setCommandPaletteOpen(false); }}
                className="p-2 rounded bg-[#161922] hover:bg-[#202533] border border-[#222733] flex items-center gap-2 text-left"
              >
                <FileText size={14} className="text-[#00e5ff]" />
                <span><strong className="text-white">G R</strong> — SEC RAG Filings</span>
              </button>

              <button
                onClick={() => { setActivePanel('RESEARCH'); setCommandPaletteOpen(false); }}
                className="p-2 rounded bg-[#161922] hover:bg-[#202533] border border-[#222733] flex items-center gap-2 text-left"
              >
                <Sparkles size={14} className="text-[#ff9900]" />
                <span><strong className="text-white">G A</strong> — Autonomous AI Agents</span>
              </button>
            </div>
          </div>

        </div>

        <div className="p-2 bg-[#0e1014] border-t border-[#262a33] text-[11px] text-gray-500 flex justify-between items-center px-3">
          <span>Bloomberg Terminal AI Command System</span>
          <span>Press <kbd className="bg-gray-800 text-gray-300 px-1 py-0.5 rounded">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
