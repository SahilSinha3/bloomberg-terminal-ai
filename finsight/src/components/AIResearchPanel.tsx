'use client';

import React, { useState } from 'react';
import { useTerminalStore } from '../store/useTerminalStore';
import { Sparkles, CheckCircle, Clock, ShieldCheck, ExternalLink, Bot, FileText, Search, Play } from 'lucide-react';

export default function AIResearchPanel() {
  const { 
    activeSymbol, 
    activeResearchReport, 
    isResearchRunning, 
    startNewResearch, 
    openCitation 
  } = useTerminalStore();

  const [inputPrompt, setInputPrompt] = useState('');

  const handleStartResearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim()) return;
    startNewResearch(inputPrompt);
    setInputPrompt('');
  };

  const report = activeResearchReport;

  return (
    <div className="bg-[#111318] border border-[#262a33] rounded-lg p-4 font-mono flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262a33] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#ff9900] animate-pulse" size={18} />
          <h2 className="text-sm font-bold text-[#ff9900] tracking-wider uppercase">AUTONOMOUS MULTI-AGENT RESEARCH ENGINE</h2>
          <span className="text-xs text-gray-400">({activeSymbol})</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-[#ff9900]/10 text-[#ff9900] border border-[#ff9900]/40 px-2.5 py-1 rounded font-bold flex items-center gap-1">
            <Bot size={14} />
            <span>STATE MACHINE OPERATIONAL</span>
          </span>
        </div>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleStartResearch} className="mb-4">
        <div className="flex items-center gap-2 bg-[#141720] p-2 rounded border border-[#262a33] focus-within:border-[#ff9900] transition-all">
          <Search size={16} className="text-[#ff9900]" />
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={`Ask AI agent research query e.g., "Why did ${activeSymbol} move today?" or "Summarize Q2 10-Q risk factors"`}
            className="w-full bg-transparent text-white text-xs outline-none placeholder:text-gray-500 font-mono"
            disabled={isResearchRunning}
          />
          <button
            type="submit"
            disabled={isResearchRunning || !inputPrompt.trim()}
            className="flex items-center gap-1 bg-[#ff9900] hover:bg-[#ffaa22] text-black font-bold px-3 py-1.5 rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={12} />
            <span>{isResearchRunning ? 'Investigating...' : 'Research'}</span>
          </button>
        </div>
      </form>

      {/* Main Execution View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
        
        {/* Left Col: Live Agent Execution Steps Trace */}
        <div className="bg-[#141720] border border-[#222733] rounded p-3 overflow-y-auto flex flex-col">
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Agent Execution State Machine</span>
            <span className="text-[#00e5ff]">{report?.status || 'IDLE'}</span>
          </div>

          <div className="space-y-2 flex-1">
            {report?.executionSteps.map((step) => {
              const isDone = step.status === 'COMPLETED';
              const isRunning = step.status === 'RUNNING';

              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded border text-xs transition-all ${
                    isRunning 
                      ? 'bg-[#1e2536] border-[#ff9900] text-white shadow-[0_0_12px_rgba(255,153,0,0.15)]' 
                      : isDone 
                      ? 'bg-[#161a24] border-[#222733] text-gray-300' 
                      : 'bg-[#13151d] border-[#1f232d] text-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[11px] text-[#ff9900]">{step.agentRole}</span>
                    <div className="flex items-center gap-1">
                      {isDone ? (
                        <CheckCircle size={12} className="text-[#00e676]" />
                      ) : isRunning ? (
                        <Clock size={12} className="text-[#ff9900] animate-spin" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                      )}
                    </div>
                  </div>

                  <p className="font-semibold text-xs text-white mb-1">{step.name}</p>

                  {step.toolCall && (
                    <div className="bg-[#10121a] p-1.5 rounded border border-[#1f232d] text-[10px] font-mono text-[#00e5ff] mb-1">
                      🔨 Tool: <code>{step.toolCall.toolName}({JSON.stringify(step.toolCall.params)})</code>
                    </div>
                  )}

                  {step.outputSummary && (
                    <p className="text-[11px] text-gray-400 font-sans">{step.outputSummary}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Cited Research Intelligence Report */}
        <div className="lg:col-span-2 bg-[#141720] border border-[#222733] rounded p-4 overflow-y-auto flex flex-col">
          {report ? (
            <div className="space-y-4">
              {/* Report Header */}
              <div className="border-b border-[#262a33] pb-3">
                <div className="flex items-center justify-between">
                  <span className="bg-[#ff9900]/20 text-[#ff9900] text-[10px] font-bold px-2 py-0.5 rounded border border-[#ff9900]/40">
                    CITED FINANCIAL INTELLIGENCE REPORT
                  </span>
                  <span className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleTimeString()}</span>
                </div>
                <h2 className="text-base font-bold text-white mt-2">{report.query}</h2>
              </div>

              {/* Executive Summary Box */}
              <div className="bg-[#181d29] border border-[#ff9900]/30 rounded p-3 text-xs leading-relaxed text-gray-200">
                <h3 className="text-[#ff9900] font-bold text-xs uppercase tracking-wider mb-1">Executive Intelligence Summary</h3>
                <p>{report.summary}</p>
              </div>

              {/* Verified Claims & Interactive Citations */}
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="text-[#00e676]" size={15} />
                  <span>Grounding Verified Claims ({report.claims.length})</span>
                </h3>

                <div className="space-y-2.5">
                  {report.claims.map((claim) => (
                    <div key={claim.id} className="bg-[#181b26] border border-[#262a33] rounded p-3 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="bg-gray-800 text-gray-300 text-[10px] px-1.5 py-0.5 rounded font-bold">{claim.claimType}</span>
                        <span className="text-[#00e676] text-[10px] font-bold">Confidence: {(claim.confidence * 100).toFixed(0)}%</span>
                      </div>

                      <p className="text-gray-200 font-sans text-xs mb-2 leading-relaxed">{claim.text}</p>

                      {/* Citation Pills */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#222733]">
                        <span className="text-[10px] text-gray-500 font-bold">Verified Evidence Sources:</span>
                        {claim.citationIds.map((citId) => {
                          const citation = report.citations.find(c => c.id === citId);
                          if (!citation) return null;

                          return (
                            <button
                              key={citId}
                              onClick={() => openCitation(citation)}
                              className="text-[10px] bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40 px-2 py-0.5 rounded font-bold flex items-center gap-1 transition-colors"
                            >
                              <FileText size={10} />
                              <span>{citation.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-12">
              <Bot size={36} className="text-gray-600 mb-2" />
              <p className="text-xs">No active research session. Enter a prompt above to launch autonomous multi-agent analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
