'use client';

import React from 'react';
import { useTerminalStore } from '../store/useTerminalStore';
import { MOCK_ANOMALIES } from '../data/mockFinancialData';
import { Newspaper, ShieldAlert, TrendingUp, TrendingDown, ExternalLink, Activity } from 'lucide-react';

export default function NewsPanel() {
  const { news, activeSymbol } = useTerminalStore();

  return (
    <div className="bg-[#111318] border border-[#262a33] rounded-lg p-4 font-mono flex flex-col h-full overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-[#262a33] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="text-[#00e5ff]" size={18} />
          <h2 className="text-sm font-bold text-[#00e5ff] tracking-wider uppercase">NEWS STREAM &amp; MARKET ANOMALY DETECTOR</h2>
        </div>

        <span className="text-xs text-[#00e676] bg-[#00e676]/10 border border-[#00e676]/30 px-2 py-0.5 rounded font-bold">
          REAL-TIME ANOMALY ENGINE ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden">
        {/* Left Column: Market Anomaly Alerts */}
        <div className="bg-[#141720] border border-[#222733] rounded p-3 overflow-y-auto space-y-2.5">
          <div className="text-[#ff5252] text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldAlert size={14} className="animate-pulse text-[#ff5252]" />
            <span>Detected Market Anomalies ({MOCK_ANOMALIES.length})</span>
          </div>

          {MOCK_ANOMALIES.map((anom) => (
            <div key={anom.id} className="bg-[#1a1722] border border-[#ff5252]/40 rounded p-3 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#ff9900]">{anom.symbol}</span>
                <span className="text-[10px] text-gray-400">{anom.timestamp}</span>
              </div>

              <div className="font-bold text-white text-xs mb-1">{anom.type.replace('_', ' ')}</div>
              <p className="text-gray-300 font-sans text-xs mb-2">{anom.description}</p>

              <div className="grid grid-cols-3 gap-1 bg-[#121018] p-1.5 rounded text-[10px] font-mono text-center">
                <div>
                  <span className="text-gray-500 block">Current</span>
                  <span className="text-white font-bold">{anom.metrics.current}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Baseline</span>
                  <span className="text-gray-400">{anom.metrics.baseline}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Deviation</span>
                  <span className="text-[#ff5252] font-bold">{anom.metrics.deviation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Breaking News Feed */}
        <div className="bg-[#141720] border border-[#222733] rounded p-3 overflow-y-auto space-y-3">
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            Real-Time Headlines &amp; Financial News ({news.length})
          </div>

          {news.map((item) => {
            const isBullish = item.sentiment === 'BULLISH';
            const isBearish = item.sentiment === 'BEARISH';

            return (
              <div key={item.id} className="bg-[#181b24] border border-[#222733] hover:border-gray-700 rounded p-3 text-xs transition-colors">
                <div className="flex items-center justify-between mb-1 text-[10px]">
                  <span className="text-[#00e5ff] font-bold">{item.source}</span>
                  <span className="text-gray-400">{item.publishedAt}</span>
                </div>

                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-bold text-white text-xs hover:text-[#ff9900] flex items-center justify-between gap-2 mb-1 group"
                >
                  <span className="line-clamp-2">{item.title}</span>
                  <ExternalLink size={12} className="shrink-0 text-gray-500 group-hover:text-[#ff9900]" />
                </a>

                <p className="text-gray-300 font-sans text-xs line-clamp-2 mb-2">{item.summary}</p>

                <div className="flex items-center justify-between pt-2 border-t border-[#222733] text-[10px]">
                  <div className="flex items-center gap-1">
                    {item.relatedSymbols.map((s) => (
                      <span key={s} className="bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded font-mono font-bold">
                        {s}
                      </span>
                    ))}
                  </div>

                  <span className={`px-2 py-0.5 rounded font-bold ${
                    isBullish ? 'bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30' :
                    isBearish ? 'bg-[#ff5252]/10 text-[#ff5252] border border-[#ff5252]/30' :
                    'bg-gray-800 text-gray-400'
                  }`}>
                    {item.sentiment}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
