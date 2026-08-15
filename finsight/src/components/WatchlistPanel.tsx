'use client';

import React from 'react';
import { useTerminalStore } from '../store/useTerminalStore';
import { SecuritySymbol } from '../types/terminal';
import { TrendingUp, TrendingDown, Volume2, ShieldAlert } from 'lucide-react';

export default function WatchlistPanel() {
  const { activeSymbol, quotes, setActiveSymbol } = useTerminalStore();

  const symbols: SecuritySymbol[] = ['NVDA', 'AAPL', 'MSFT', 'AMD', 'TSLA', 'BTC-USD', 'SPY'];

  return (
    <div className="bg-[#111318] border border-[#262a33] rounded-lg p-3 font-mono flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-[#262a33] pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff9900]"></span>
          <h2 className="text-xs font-bold text-[#ff9900] tracking-wider uppercase">GLOBAL WATCHLIST</h2>
        </div>
        <span className="text-[10px] text-gray-500 font-semibold">{symbols.length} SECURITIES</span>
      </div>

      <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
        {symbols.map((sym) => {
          const q = quotes[sym];
          if (!q) return null;
          const isPos = q.change >= 0;
          const isSelected = activeSymbol === sym;

          return (
            <div
              key={sym}
              onClick={() => setActiveSymbol(sym)}
              className={`p-2 rounded border cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-[#1b202c] border-[#ff9900]/60 shadow-[0_0_12px_rgba(255,153,0,0.15)]' 
                  : 'bg-[#151821] border-[#222733] hover:border-gray-700 hover:bg-[#1a1e29]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-xs ${isSelected ? 'text-[#ff9900]' : 'text-white'}`}>{sym}</span>
                  <span className="text-[10px] text-gray-400 truncate max-w-[90px] font-sans">{q.name}</span>
                </div>

                <div className="text-right font-bold text-xs text-white">
                  ${q.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[10px] text-gray-500">{q.sector}</span>

                <div className={`flex items-center gap-1 font-semibold ${isPos ? 'text-[#00e676]' : 'text-[#ff5252]'}`}>
                  {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{isPos ? '+' : ''}{q.changePercent.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-[#262a33] pt-2 mt-2 text-[10px] text-gray-500 flex justify-between">
        <span>TICKER STREAM: ONLINE</span>
        <span className="text-[#00e5ff]">AUTO-NORMALIZED</span>
      </div>
    </div>
  );
}
