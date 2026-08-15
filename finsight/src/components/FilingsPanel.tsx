'use client';

import React from 'react';
import { useTerminalStore } from '../store/useTerminalStore';
import { FileText, ExternalLink, Hash, CheckCircle, Search, Sparkles } from 'lucide-react';

export default function FilingsPanel() {
  const { filings, selectedFiling, selectFiling, activeChunkId, openCitation } = useTerminalStore();

  const currentFiling = selectedFiling || filings[0];

  return (
    <div className="bg-[#111318] border border-[#262a33] rounded-lg p-4 font-mono flex flex-col h-full overflow-hidden">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262a33] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <FileText className="text-[#00e5ff]" size={18} />
          <h2 className="text-sm font-bold text-[#00e5ff] tracking-wider uppercase">SEC EDGAR FILING INTELLIGENCE &amp; RAG ENGINE</h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-[#1a1f2c] text-[#00e676] border border-[#00e676]/40 px-2 py-0.5 rounded font-bold">
            PGVECTOR HYBRID RAG INDEXED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
        {/* Left Column: Filing Selection List */}
        <div className="bg-[#141720] border border-[#222733] rounded p-2.5 overflow-y-auto space-y-2">
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Available Company Filings</div>

          {filings.map((f) => (
            <div
              key={f.id}
              onClick={() => selectFiling(f)}
              className={`p-2.5 rounded border cursor-pointer transition-all ${
                currentFiling.id === f.id
                  ? 'bg-[#1e2433] border-[#00e5ff] text-white shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                  : 'bg-[#181b24] border-[#262a33] hover:border-gray-600 text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-[#ff9900]">{f.type}</span>
                <span className="text-[10px] text-gray-400">{f.filingDate}</span>
              </div>
              <p className="text-xs font-semibold line-clamp-2">{f.title}</p>
              <div className="text-[10px] text-gray-500 mt-1 font-mono">Accession: {f.accessionNumber}</div>
            </div>
          ))}
        </div>

        {/* Right Column: Interactive Filing Chunk Viewer */}
        <div className="md:col-span-2 bg-[#141720] border border-[#222733] rounded p-3 overflow-y-auto flex flex-col">
          {/* Document Meta Header */}
          <div className="border-b border-[#262a33] pb-2.5 mb-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#ff9900] text-black font-extrabold text-xs px-2 py-0.5 rounded">{currentFiling.type}</span>
                <h3 className="text-sm font-bold text-white">{currentFiling.title}</h3>
              </div>
              <p className="text-xs text-gray-400 mt-1 font-sans">{currentFiling.summary}</p>
            </div>

            <a
              href={`https://www.sec.gov/edgar/searchedgar/companysearch`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#00e5ff] hover:underline flex items-center gap-1 bg-[#181c26] border border-[#262a33] px-2.5 py-1 rounded"
            >
              <span>SEC.gov</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Paragraph Chunks */}
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
              Indexed Hybrid Vector Chunks ({currentFiling.contentChunks.length} chunks extracted)
            </div>

            {currentFiling.contentChunks.map((chunk) => {
              const isChunkHighlighted = activeChunkId === chunk.chunkId;
              return (
                <div
                  key={chunk.chunkId}
                  className={`p-3 rounded border font-sans text-xs leading-relaxed transition-all ${
                    isChunkHighlighted
                      ? 'bg-[#21293a] border-[#00e5ff] text-white shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                      : 'bg-[#181b24] border-[#222733] text-gray-300 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 font-mono text-[11px]">
                    <div className="flex items-center gap-2 text-[#00e5ff] font-bold">
                      <Hash size={12} />
                      <span>{chunk.section}</span>
                      <span className="text-gray-500 font-normal">| Page {chunk.page}</span>
                    </div>

                    <button
                      onClick={() => openCitation({
                        id: `cit_${chunk.chunkId}`,
                        sourceType: 'SEC_FILING',
                        title: `${currentFiling.symbol} ${currentFiling.type} (${chunk.section})`,
                        filingType: currentFiling.type,
                        period: currentFiling.period,
                        pageNumber: chunk.page,
                        excerpt: chunk.text
                      })}
                      className="text-[10px] bg-[#1f2533] hover:bg-[#283145] text-[#00e5ff] border border-[#00e5ff]/40 px-2 py-0.5 rounded font-mono font-bold"
                    >
                      Cite in AI RAG
                    </button>
                  </div>

                  <p className="text-gray-200">{chunk.text}</p>

                  {chunk.highlightKeywords && chunk.highlightKeywords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 mt-2 font-mono text-[10px]">
                      <span className="text-gray-500">Vector Keywords:</span>
                      {chunk.highlightKeywords.map((kw, i) => (
                        <span key={i} className="bg-[#242c3d] text-[#ff9900] px-1.5 py-0.5 rounded border border-[#ff9900]/30">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
