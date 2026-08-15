'use client';

import React, { useState, useMemo } from 'react';
import { useTerminalStore } from '../store/useTerminalStore';
import { generateBarsForSymbol } from '../data/mockFinancialData';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Line 
} from 'recharts';
import { TrendingUp, Activity, BarChart2, Eye, Sparkles } from 'lucide-react';

export default function ChartPanel() {
  const { activeSymbol, quotes, startNewResearch } = useTerminalStore();
  const [chartType, setChartType] = useState<'AREA' | 'BARS'>('AREA');
  const [showMA, setShowMA] = useState(true);
  const [showVolume, setShowVolume] = useState(true);

  const quote = quotes[activeSymbol] || quotes['NVDA'];
  const isPos = quote ? quote.change >= 0 : true;

  const data = useMemo(() => {
    return generateBarsForSymbol(activeSymbol);
  }, [activeSymbol]);

  const handleAskAIAboutMove = () => {
    const prompt = `Why did ${activeSymbol} move ${isPos ? '+' : ''}${quote.changePercent.toFixed(2)}% today? Investigating price action, volume velocity, and SEC filings.`;
    startNewResearch(prompt);
  };

  return (
    <div className="bg-[#111318] border border-[#262a33] rounded-lg p-4 font-mono flex flex-col h-full">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262a33] pb-3 mb-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-white">{activeSymbol}</h1>
            <span className="text-xs text-gray-400 font-sans">{quote.name}</span>
            <span className="text-[10px] bg-[#1a1f2c] text-[#00e5ff] border border-[#00e5ff]/30 px-2 py-0.5 rounded font-bold uppercase">
              {quote.sector}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-2xl font-black text-white">${quote.price.toFixed(2)}</span>
            <span className={`text-sm font-bold ${isPos ? 'text-[#00e676]' : 'text-[#ff5252]'}`}>
              {isPos ? '+' : ''}{quote.change.toFixed(2)} ({isPos ? '+' : ''}{quote.changePercent.toFixed(2)}%)
            </span>
            <span className="text-xs text-gray-500">Vol: {(quote.volume / 1000000).toFixed(1)}M</span>
            <span className="text-xs text-gray-500">Mkt Cap: {quote.marketCap}</span>
          </div>
        </div>

        {/* Chart Controls & AI Trigger Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAskAIAboutMove}
            className="flex items-center gap-1.5 bg-[#ff9900]/20 hover:bg-[#ff9900]/30 text-[#ff9900] border border-[#ff9900]/50 px-3 py-1.5 rounded text-xs font-bold shadow-[0_0_15px_rgba(255,153,0,0.2)] transition-all"
          >
            <Sparkles size={14} className="animate-spin" />
            <span>AI INVESTIGATE MOVE</span>
          </button>

          <div className="flex items-center gap-1 bg-[#181c26] p-1 rounded border border-[#262a33] text-xs">
            <button
              onClick={() => setChartType('AREA')}
              className={`px-2 py-0.5 rounded text-xs font-semibold ${chartType === 'AREA' ? 'bg-[#ff9900] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('BARS')}
              className={`px-2 py-0.5 rounded text-xs font-semibold ${chartType === 'BARS' ? 'bg-[#ff9900] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Candle Bars
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-400">
            <button
              onClick={() => setShowMA(!showMA)}
              className={`px-2 py-1 rounded border ${showMA ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]/40' : 'bg-[#161922] border-gray-800'}`}
            >
              MA (20/50)
            </button>

            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2 py-1 rounded border ${showVolume ? 'bg-[#00e676]/20 text-[#00e676] border-[#00e676]/40' : 'bg-[#161922] border-gray-800'}`}
            >
              Volume
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Visualization Container */}
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPos ? '#00e676' : '#ff5252'} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isPos ? '#00e676' : '#ff5252'} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#222733" />
            <XAxis dataKey="timestamp" stroke="#6b7280" tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <YAxis domain={['auto', 'auto']} stroke="#6b7280" tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#13161c', borderColor: '#262a33', borderRadius: '6px', fontSize: '12px' }}
              labelStyle={{ color: '#ff9900', fontWeight: 'bold' }}
            />

            {showVolume && <Bar dataKey="volume" yAxisId="vol" fill="#374151" opacity={0.4} />}

            {chartType === 'AREA' ? (
              <Area 
                type="monotone" 
                dataKey="close" 
                stroke={isPos ? '#00e676' : '#ff5252'} 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#priceGradient)" 
              />
            ) : (
              <Line type="monotone" dataKey="close" stroke={isPos ? '#00e676' : '#ff5252'} strokeWidth={2} dot={false} />
            )}

            {showMA && (
              <>
                <Line type="monotone" dataKey="ma20" stroke="#00e5ff" strokeWidth={1.5} dot={false} name="MA 20" />
                <Line type="monotone" dataKey="ma50" stroke="#ff9900" strokeWidth={1.5} dot={false} name="MA 50" />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicator Stats */}
      <div className="grid grid-cols-4 gap-2 pt-3 mt-2 border-t border-[#262a33] text-xs">
        <div className="bg-[#141720] p-2 rounded border border-[#222733]">
          <span className="text-gray-500 text-[10px]">24H HIGH</span>
          <p className="font-bold text-white">${quote.high24h.toFixed(2)}</p>
        </div>
        <div className="bg-[#141720] p-2 rounded border border-[#222733]">
          <span className="text-gray-500 text-[10px]">24H LOW</span>
          <p className="font-bold text-white">${quote.low24h.toFixed(2)}</p>
        </div>
        <div className="bg-[#141720] p-2 rounded border border-[#222733]">
          <span className="text-gray-500 text-[10px]">P/E RATIO</span>
          <p className="font-bold text-[#00e5ff]">{quote.peRatio || 'N/A'}</p>
        </div>
        <div className="bg-[#141720] p-2 rounded border border-[#222733]">
          <span className="text-gray-500 text-[10px]">RSI (14)</span>
          <p className="font-bold text-[#00e676]">62.4 (BULLISH)</p>
        </div>
      </div>
    </div>
  );
}
