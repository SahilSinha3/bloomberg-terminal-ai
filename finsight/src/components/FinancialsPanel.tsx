'use client';

import React, { useState } from 'react';
import { useTerminalStore } from '../store/useTerminalStore';
import { FINANCIAL_STATEMENTS } from '../data/mockFinancialData';
import { Layers, DollarSign, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';

export default function FinancialsPanel() {
  const { activeSymbol } = useTerminalStore();
  const [statementType, setStatementType] = useState<'INCOME' | 'BALANCE' | 'CASHFLOW' | 'RATIOS'>('INCOME');

  const statements = FINANCIAL_STATEMENTS[activeSymbol] || FINANCIAL_STATEMENTS['NVIDIA'];

  return (
    <div className="bg-[#111318] border border-[#262a33] rounded-lg p-4 font-mono flex flex-col h-full overflow-hidden">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262a33] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="text-[#00e5ff]" size={18} />
          <h2 className="text-sm font-bold text-[#00e5ff] tracking-wider uppercase">FINANCIAL ANALYTICS ENGINE</h2>
          <span className="text-xs text-gray-400">({activeSymbol})</span>
        </div>

        {/* Statement Switcher Tabs */}
        <div className="flex items-center gap-1 bg-[#161922] p-1 rounded border border-[#222733] text-xs">
          <button
            onClick={() => setStatementType('INCOME')}
            className={`px-2.5 py-1 rounded font-bold transition-colors ${statementType === 'INCOME' ? 'bg-[#00e5ff] text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Income Statement
          </button>

          <button
            onClick={() => setStatementType('BALANCE')}
            className={`px-2.5 py-1 rounded font-bold transition-colors ${statementType === 'BALANCE' ? 'bg-[#00e5ff] text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Balance Sheet
          </button>

          <button
            onClick={() => setStatementType('CASHFLOW')}
            className={`px-2.5 py-1 rounded font-bold transition-colors ${statementType === 'CASHFLOW' ? 'bg-[#00e5ff] text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Cash Flow
          </button>

          <button
            onClick={() => setStatementType('RATIOS')}
            className={`px-2.5 py-1 rounded font-bold transition-colors ${statementType === 'RATIOS' ? 'bg-[#00e5ff] text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Valuation Ratios
          </button>
        </div>
      </div>

      <div className="bg-[#141720] border border-[#ff9900]/30 rounded p-2.5 mb-3 text-xs text-gray-300 flex items-center gap-2">
        <ShieldCheck className="text-[#00e676]" size={16} />
        <span><strong>Deterministic Computation Notice:</strong> Financial ratios and metrics are calculated deterministically via code algorithms. LLMs are strictly excluded from performing fundamental math.</span>
      </div>

      {/* Financial Table */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#262a33] text-gray-400 bg-[#161922]">
              <th className="p-2.5 font-bold text-white">Metric (in $ Millions USD)</th>
              {statements.map((s, idx) => (
                <th key={idx} className="p-2.5 text-right font-bold text-[#ff9900]">{s.period}</th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#222733] text-gray-200">
            {statementType === 'INCOME' && (
              <>
                <tr className="hover:bg-[#181c26]">
                  <td className="p-2.5 font-semibold text-white">Total Revenue</td>
                  {statements.map((s, i) => (
                    <td key={i} className="p-2.5 text-right font-mono font-bold text-[#00e676]">${s.revenue.toLocaleString()} M</td>
                  ))}
                </tr>

                <tr className="hover:bg-[#181c26]">
                  <td className="p-2.5 font-semibold text-gray-300">Gross Profit</td>
                  {statements.map((s, i) => (
                    <td key={i} className="p-2.5 text-right font-mono">${s.grossProfit.toLocaleString()} M</td>
                  ))}
                </tr>

                <tr className="hover:bg-[#181c26]">
                  <td className="p-2.5 font-semibold text-gray-300">Operating Income</td>
                  {statements.map((s, i) => (
                    <td key={i} className="p-2.5 text-right font-mono">${s.operatingIncome.toLocaleString()} M</td>
                  ))}
                </tr>

                <tr className="hover:bg-[#181c26] bg-[#141722]">
                  <td className="p-2.5 font-bold text-[#ff9900]">Net Income</td>
                  {statements.map((s, i) => (
                    <td key={i} className="p-2.5 text-right font-mono font-bold text-[#ff9900]">${s.netIncome.toLocaleString()} M</td>
                  ))}
                </tr>

                <tr className="hover:bg-[#181c26]">
                  <td className="p-2.5 font-semibold text-gray-300">Diluted EPS</td>
                  {statements.map((s, i) => (
                    <td key={i} className="p-2.5 text-right font-mono font-bold text-[#00e5ff]">${s.eps.toFixed(2)}</td>
                  ))}
                </tr>
              </>
            )}

            {statementType === 'BALANCE' && (
              <>
                <tr className="hover:bg-[#181c26]">
                  <td className="p-2.5 font-semibold text-white">Cash & Cash Equivalents</td>
                  {statements.map((s, i) => (
                    <td key={i} className="p-2.5 text-right font-mono text-[#00e676]">${s.cashAndEquivalents.toLocaleString()} M</td>
                  ))}
                </tr>

                <tr className="hover:bg-[#181c26]">
                  <td className="p-2.5 font-semibold text-gray-300">Total Debt</td>
                  {statements.map((s, i) => (
                    <td key={i} className="p-2.5 text-right font-mono text-[#ff5252]">${s.totalDebt.toLocaleString()} M</td>
                  ))}
                </tr>

                <tr className="hover:bg-[#181c26]">
                  <td className="p-2.5 font-semibold text-gray-300">Net Cash / (Debt) Position</td>
                  {statements.map((s, i) => (
                    <td key={i} className="p-2.5 text-right font-mono font-bold text-[#00e676]">
                      +${(s.cashAndEquivalents - s.totalDebt).toLocaleString()} M
                    </td>
                  ))}
                </tr>
              </>
            )}

            {statementType === 'CASHFLOW' && (
              <>
                <tr className="hover:bg-[#181c26]">
                  <td className="p-2.5 font-semibold text-white">Free Cash Flow (FCF)</td>
                  {statements.map((s, i) => (
                    <td key={i} className="p-2.5 text-right font-mono font-bold text-[#00e676]">${s.freeCashFlow.toLocaleString()} M</td>
                  ))}
                </tr>

                <tr className="hover:bg-[#181c26]">
                  <td className="p-2.5 font-semibold text-gray-300">FCF Margin %</td>
                  {statements.map((s, i) => (
                    <td key={i} className="p-2.5 text-right font-mono text-[#00e5ff]">
                      {((s.freeCashFlow / s.revenue) * 100).toFixed(1)}%
                    </td>
                  ))}
                </tr>
              </>
            )}

            {statementType === 'RATIOS' && (
              <>
                <tr className="hover:bg-[#181c26]">
                  <td className="p-2.5 font-semibold text-white">Gross Margin %</td>
                  {statements.map((s, i) => (
                    <td key={i} className="p-2.5 text-right font-mono text-[#00e676] font-bold">{s.grossMarginPercent}%</td>
                  ))}
                </tr>

                <tr className="hover:bg-[#181c26]">
                  <td className="p-2.5 font-semibold text-gray-300">Operating Margin %</td>
                  {statements.map((s, i) => (
                    <td key={i} className="p-2.5 text-right font-mono text-[#00e5ff] font-bold">{s.operatingMarginPercent}%</td>
                  ))}
                </tr>

                <tr className="hover:bg-[#181c26]">
                  <td className="p-2.5 font-semibold text-gray-300">P/E Ratio (TTM)</td>
                  {statements.map((s, i) => (
                    <td key={i} className="p-2.5 text-right font-mono text-[#ff9900] font-bold">{s.peRatio}x</td>
                  ))}
                </tr>

                <tr className="hover:bg-[#181c26]">
                  <td className="p-2.5 font-semibold text-gray-300">EV / EBITDA</td>
                  {statements.map((s, i) => (
                    <td key={i} className="p-2.5 text-right font-mono font-bold text-white">{s.evToEbitda}x</td>
                  ))}
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
