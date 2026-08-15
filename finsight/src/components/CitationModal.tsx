'use client';

import React from 'react';
import { useTerminalStore } from '../store/useTerminalStore';
import { FileText, X, ExternalLink, ShieldCheck, Hash } from 'lucide-react';

export default function CitationModal() {
  const { isCitationDrawerOpen, selectedCitation, closeCitationDrawer } = useTerminalStore();

  if (!isCitationDrawerOpen || !selectedCitation) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end font-mono">
      <div className="bg-[#111318] border-l border-[#00e5ff]/50 w-full max-w-lg h-full p-5 overflow-y-auto shadow-[0_0_50px_rgba(0,229,255,0.2)] animate-in slide-in-from-right duration-200 flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#262a33] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="text-[#00e5ff]" size={20} />
              <div>
                <h2 className="text-sm font-bold text-white">CITATIONS &amp; EVIDENCE INSPECTOR</h2>
                <span className="text-[10px] text-[#00e676] font-bold">100% GROUNDING VERIFIED</span>
              </div>
            </div>

            <button
              onClick={closeCitationDrawer}
              className="text-gray-400 hover:text-white p-1 rounded bg-[#181c26] border border-[#262a33]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Evidence Details */}
          <div className="space-y-4 text-xs">
            <div className="bg-[#161a24] border border-[#222733] p-3 rounded">
              <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Source Document Title</div>
              <p className="font-bold text-white text-sm">{selectedCitation.title}</p>

              {selectedCitation.filingType && (
                <div className="flex items-center gap-3 mt-2 font-mono text-[11px] text-[#ff9900]">
                  <span>Filing: {selectedCitation.filingType}</span>
                  <span>Period: {selectedCitation.period}</span>
                  {selectedCitation.pageNumber && (
                    <span className="flex items-center gap-1 text-[#00e5ff]">
                      <Hash size={12} />
                      Page {selectedCitation.pageNumber}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="bg-[#181d2b] border border-[#00e5ff]/30 p-4 rounded text-gray-200 leading-relaxed font-sans shadow-inner">
              <div className="text-[10px] font-mono text-[#00e5ff] font-bold uppercase mb-2 flex items-center gap-1">
                <ShieldCheck size={14} />
                <span>Exact Extracted SEC Text Excerpt</span>
              </div>
              <p className="text-sm border-l-2 border-[#00e5ff] pl-3 italic text-gray-100">&quot;{selectedCitation.excerpt}&quot;</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#262a33] pt-3 mt-6 flex justify-between items-center text-xs">
          <span className="text-gray-500">Vector Chunk ID: {selectedCitation.id}</span>
          <button
            onClick={closeCitationDrawer}
            className="bg-[#00e5ff] text-black font-bold px-4 py-1.5 rounded text-xs hover:bg-[#33ebff] transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
