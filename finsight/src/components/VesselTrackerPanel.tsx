'use client';

import React, { useState } from 'react';
import { Anchor, Compass, Navigation, Radio, MapPin, Eye, Globe, ZoomIn, ZoomOut, RotateCcw, Crosshair } from 'lucide-react';

export interface Vessel {
  imo: string;
  name: string;
  type: string;
  flag: string;
  cargo: string;
  dwt: string;
  status: string;
  destination: string;
  eta: string;
  chokepoint: string;
  latitude: number;
  longitude: number;
  speed: string;
  draft: string;
}

const MOCK_VESSELS: Vessel[] = [
  {
    imo: "9842109",
    name: "PACIFIC TITAN",
    type: "VLCC (Crude Oil Supertanker)",
    flag: "Marshall Islands",
    cargo: "2,100,000 Barrels Brent Crude",
    dwt: "319,000 DWT",
    status: "UNDERWAY (LOADED)",
    destination: "Port of Rotterdam (NL)",
    eta: "2026-08-21 14:00 UTC",
    chokepoint: "Strait of Hormuz",
    latitude: 26.54,
    longitude: 56.28,
    speed: "14.2 knots",
    draft: "21.5m / 22.0m"
  },
  {
    imo: "9721088",
    name: "ARCTIC ENERGY",
    type: "LNG Carrier",
    flag: "Panama",
    cargo: "174,000 m³ Liquefied Natural Gas",
    dwt: "95,000 DWT",
    status: "UNDERWAY (LOADED)",
    destination: "Suez Canal Entry (EG)",
    eta: "2026-08-18 09:30 UTC",
    chokepoint: "Suez Canal",
    latitude: 29.95,
    longitude: 32.55,
    speed: "18.5 knots",
    draft: "11.8m / 12.0m"
  },
  {
    imo: "9912040",
    name: "SEMICON EXPRESS",
    type: "Container Ship (18,000 TEU)",
    flag: "Singapore",
    cargo: "High-Value Electronic Components & Substrates",
    dwt: "165,000 DWT",
    status: "PORT CONGESTION (WAITING)",
    destination: "Port of Los Angeles (US)",
    eta: "2026-08-17 18:00 UTC",
    chokepoint: "Panama Canal",
    latitude: 9.14,
    longitude: -79.72,
    speed: "0.5 knots",
    draft: "14.2m / 15.0m"
  },
  {
    imo: "9654100",
    name: "ATLANTIC FORTUNE",
    type: "Aframax Product Tanker",
    flag: "Liberia",
    cargo: "750,000 Barrels Refined Jet Fuel",
    dwt: "115,000 DWT",
    status: "UNDERWAY (LOADED)",
    destination: "Port of Singapore (SG)",
    eta: "2026-08-22 04:00 UTC",
    chokepoint: "Malacca Strait",
    latitude: 2.50,
    longitude: 101.80,
    speed: "13.8 knots",
    draft: "14.0m / 14.5m"
  }
];

export default function VesselTrackerPanel() {
  const [selectedVessel, setSelectedVessel] = useState<Vessel>(MOCK_VESSELS[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 4.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.4, 0.8));
  const handleResetZoom = () => setZoomLevel(1.2);

  const mapCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <div className="bg-[#111318] border border-[#262a33] rounded-lg p-4 font-mono flex flex-col h-full overflow-hidden">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262a33] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Globe className="text-[#00e5ff]" size={18} />
          <h2 className="text-sm font-bold text-[#00e5ff] tracking-wider uppercase">GLOBAL AIS MARITIME &amp; TANKER WORLD RADAR</h2>
          <span className="bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40 text-[10px] px-2 py-0.5 rounded font-bold">
            PHASE 2 BETA
          </span>
        </div>

        <span className="text-xs bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30 px-2.5 py-1 rounded font-bold flex items-center gap-1">
          <Radio size={13} className="animate-pulse text-[#00e676]" />
          <span>SATELLITE AIS RADAR LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
        {/* Left Column: Interactive World Map Radar Canvas with Zoom Controls */}
        <div className="lg:col-span-2 bg-[#080b10] border border-[#00e5ff]/30 rounded-lg p-3 relative overflow-hidden flex flex-col justify-between shadow-inner">
          
          {/* Map Header Controls */}
          <div className="flex items-center justify-between z-10 text-[11px] bg-[#10141f]/90 border border-[#222733] px-3 py-1.5 rounded">
            <div className="flex items-center gap-2 text-gray-300 font-bold">
              <Compass size={14} className="text-[#00e5ff]" />
              <span>SATELLITE WORLD CONTINENTS AIS RADAR</span>
            </div>

            {/* Interactive Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-[#161a24] p-1 rounded border border-[#262a33]">
              <button
                onClick={handleZoomIn}
                className="p-1 text-gray-300 hover:text-white hover:bg-[#222733] rounded"
                title="Zoom In (+)"
              >
                <ZoomIn size={14} className="text-[#00e5ff]" />
              </button>

              <button
                onClick={handleZoomOut}
                className="p-1 text-gray-300 hover:text-white hover:bg-[#222733] rounded"
                title="Zoom Out (-)"
              >
                <ZoomOut size={14} className="text-[#00e5ff]" />
              </button>

              <button
                onClick={handleResetZoom}
                className="p-1 text-gray-300 hover:text-white hover:bg-[#222733] rounded"
                title="Reset Zoom"
              >
                <RotateCcw size={13} className="text-gray-400" />
              </button>

              <span className="text-[10px] font-bold text-[#00e5ff] px-1">{zoomLevel.toFixed(1)}x</span>
            </div>
          </div>

          {/* Zoomable World Map Canvas with Vector Continent Landmasses */}
          <div className="relative flex-1 w-full my-2 border border-[#222733] rounded bg-[#06080d] overflow-hidden">
            <div 
              className="w-full h-full relative transition-transform duration-300 ease-out origin-center flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* World Continents Vector SVG Outline Background */}
              <svg 
                viewBox="0 0 1000 500" 
                className="w-full h-full absolute inset-0 opacity-40"
                style={{ filter: 'drop-shadow(0 0 6px rgba(0,229,255,0.15))' }}
              >
                {/* North America */}
                <path d="M 120 80 Q 180 50 260 70 Q 320 120 280 200 Q 220 240 180 210 Q 140 180 120 80 Z" fill="#131c29" stroke="#00e5ff" strokeWidth="1.2" />
                {/* Greenland */}
                <path d="M 330 40 Q 380 30 400 70 Q 370 100 330 40 Z" fill="#131c29" stroke="#00e5ff" strokeWidth="1" />
                {/* South America */}
                <path d="M 280 240 Q 340 260 320 380 Q 280 440 250 360 Q 240 280 280 240 Z" fill="#131c29" stroke="#00e5ff" strokeWidth="1.2" />
                {/* Europe */}
                <path d="M 460 70 Q 550 60 580 120 Q 520 160 470 140 Q 450 100 460 70 Z" fill="#131c29" stroke="#00e5ff" strokeWidth="1.2" />
                {/* Africa */}
                <path d="M 450 150 Q 560 160 580 260 Q 540 370 480 350 Q 440 260 450 150 Z" fill="#131c29" stroke="#00e5ff" strokeWidth="1.2" />
                {/* Asia */}
                <path d="M 580 70 Q 780 40 880 110 Q 860 250 720 240 Q 620 220 580 120 Z" fill="#131c29" stroke="#00e5ff" strokeWidth="1.2" />
                {/* Australia */}
                <path d="M 780 300 Q 880 310 860 390 Q 780 410 760 350 Z" fill="#131c29" stroke="#00e5ff" strokeWidth="1.2" />
              </svg>

              {/* World Map Lat/Lng Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#00e5ff0d_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff0d_1px,transparent_1px)] bg-[size:36px_36px]"></div>

              {/* Equator & Prime Meridian Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#00e5ff]/20"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#00e5ff]/20"></div>

              {/* Clickable Vessel Radar Pins */}
              {MOCK_VESSELS.map((v) => {
                const pos = mapCoords(v.latitude, v.longitude);
                const isSelected = selectedVessel.imo === v.imo;

                return (
                  <div
                    key={v.imo}
                    onClick={() => setSelectedVessel(v)}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                  >
                    <div className="relative flex items-center justify-center">
                      <span className={`w-3.5 h-3.5 rounded-full transition-transform ${isSelected ? 'bg-[#00e676] scale-125 animate-ping' : 'bg-[#00e5ff] hover:scale-125'}`}></span>
                      <span className={`absolute w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-[#00e676]' : 'bg-[#00e5ff]'}`}></span>
                    </div>

                    {/* Tooltip Hover Label */}
                    <div className={`absolute left-1/2 -translate-x-1/2 bottom-6 whitespace-nowrap bg-[#101420] border px-2 py-1 rounded text-[9px] font-bold shadow-lg transition-all ${
                      isSelected ? 'border-[#00e676] text-white opacity-100' : 'border-[#262a33] text-gray-300 opacity-80 group-hover:opacity-100'
                    }`}>
                      <div>{v.name}</div>
                      <div className="text-[8px] text-[#00e5ff]">{v.chokepoint}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map Footer Lat/Lng Readout */}
          <div className="flex justify-between items-center text-[10px] text-gray-500 z-10 bg-[#0a0c12]/90 px-3 py-1 rounded border border-[#222733]">
            <span>SELECTED VESSEL: {selectedVessel.name} ({selectedVessel.latitude}°N, {selectedVessel.longitude}°E)</span>
            <span className="text-[#00e5ff]">WORLD MAP VECTOR CONTINENTS ACTIVE</span>
          </div>
        </div>

        {/* Right Column: Detailed Vessel Inspector */}
        <div className="bg-[#141720] border border-[#222733] rounded p-4 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#262a33] pb-3 mb-3">
              <div>
                <span className="text-[10px] bg-[#ff9900] text-black font-extrabold px-2 py-0.5 rounded uppercase">
                  {selectedVessel.status}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{selectedVessel.name}</h3>
                <span className="text-xs text-gray-400 font-sans">IMO: {selectedVessel.imo} ({selectedVessel.flag})</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block font-sans">Speed</span>
                <span className="text-xs font-bold text-[#00e676]">{selectedVessel.speed}</span>
              </div>
            </div>

            {/* Cargo Box */}
            <div className="bg-[#181d29] border border-[#00e5ff]/30 rounded p-3 text-xs mb-3">
              <span className="text-[#00e5ff] font-bold text-[10px] uppercase tracking-wider block mb-1">Carried Commodity Cargo</span>
              <p className="text-white font-bold text-sm">{selectedVessel.cargo}</p>
              <span className="text-[11px] text-gray-400 mt-1 block">Tonnage Capacity: {selectedVessel.dwt}</span>
            </div>

            {/* Voyage Details */}
            <div className="space-y-2 text-xs">
              <div className="bg-[#161a24] p-2.5 rounded border border-[#222733]">
                <span className="text-gray-500 text-[10px] block">DESTINATION PORT</span>
                <span className="font-bold text-white">{selectedVessel.destination}</span>
                <span className="text-[10px] text-gray-400 block mt-1">ETA: {selectedVessel.eta}</span>
              </div>

              <div className="bg-[#161a24] p-2.5 rounded border border-[#222733]">
                <span className="text-gray-500 text-[10px] block">MARITIME CHOKEPOINT</span>
                <span className="font-bold text-[#ff9900]">{selectedVessel.chokepoint}</span>
                <span className="text-[10px] text-gray-400 block mt-1">Coordinates: {selectedVessel.latitude}°N, {selectedVessel.longitude}°E</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#262a33] text-[11px] text-gray-500 flex justify-between">
            <span>DRAFT: {selectedVessel.draft}</span>
            <span className="text-[#00e5ff]">AIS SATELLITE RADAR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
