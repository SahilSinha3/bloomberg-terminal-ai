'use client';

import React, { useState } from 'react';
import { Plane, AlertTriangle, Radio, MapPin, Globe, Zap, ZoomIn, ZoomOut, RotateCcw, Crosshair } from 'lucide-react';

export interface CorporateFlight {
  tailNumber: string;
  aircraft: string;
  operator: string;
  origin: string;
  destination: string;
  status: string;
  altitude: string;
  speed: string;
  eventSignal: string;
  departureTime: string;
  eta: string;
  latitude: number;
  longitude: number;
  path: { name: string; lat: number; lng: number }[];
}

const MOCK_FLIGHTS: CorporateFlight[] = [
  {
    tailNumber: "N1NVDA",
    aircraft: "Gulfstream G650ER",
    operator: "NVIDIA Corporate Aviation",
    origin: "SJC (San Jose Intl)",
    destination: "TSMC Hsinchu (RCTP / Taipei)",
    status: "EN ROUTE",
    altitude: "41,000 ft",
    speed: "510 knots",
    eventSignal: "Executive Supply Chain Meeting Signal",
    departureTime: "06:15 UTC",
    eta: "16:45 UTC",
    latitude: 37.36,
    longitude: -121.92,
    path: [
      { name: "SJC (San Jose)", lat: 37.36, lng: -121.92 },
      { name: "Pacific Waypoint 1", lat: 32.10, lng: -150.40 },
      { name: "Pacific Waypoint 2", lat: 28.50, lng: 165.20 },
      { name: "RCTP (Taipei)", lat: 25.07, lng: 121.23 }
    ]
  },
  {
    tailNumber: "N1AAPL",
    aircraft: "Bombardier Global 7500",
    operator: "Apple Inc. Corporate Flight Ops",
    origin: "SJC (San Jose Intl)",
    destination: "AUS (Austin Executive)",
    status: "LANDED",
    altitude: "Ground",
    speed: "0 knots",
    eventSignal: "M&A Intelligence Signal: Corporate Jet Convergence at Austin Hub",
    departureTime: "11:20 UTC",
    eta: "14:50 UTC",
    latitude: 30.30,
    longitude: -97.66,
    path: [
      { name: "SJC (San Jose)", lat: 37.36, lng: -121.92 },
      { name: "ABQ Waypoint", lat: 35.04, lng: -106.60 },
      { name: "AUS (Austin)", lat: 30.30, lng: -97.66 }
    ]
  },
  {
    tailNumber: "N1MSFT",
    aircraft: "Gulfstream G700",
    operator: "Microsoft Flight Department",
    origin: "BFI (Seattle Boeing Field)",
    destination: "AUS (Austin Executive)",
    status: "LANDED",
    altitude: "Ground",
    speed: "0 knots",
    eventSignal: "M&A Intelligence Signal: Multiple Tech Executive Jets Converged at Same Airport",
    departureTime: "10:45 UTC",
    eta: "14:40 UTC",
    latitude: 30.31,
    longitude: -97.67,
    path: [
      { name: "BFI (Seattle)", lat: 47.53, lng: -122.30 },
      { name: "DEN Waypoint", lat: 39.85, lng: -104.67 },
      { name: "AUS (Austin)", lat: 30.31, lng: -97.67 }
    ]
  }
];

export default function FlightTrackerPanel() {
  const [selectedFlight, setSelectedFlight] = useState<CorporateFlight>(MOCK_FLIGHTS[0]);
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
          <Plane className="text-[#ff9900]" size={18} />
          <h2 className="text-sm font-bold text-[#ff9900] tracking-wider uppercase">FLIGHT CORPORATE JET &amp; M&amp;A INTELLIGENCE RADAR</h2>
          <span className="bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/40 text-[10px] px-2 py-0.5 rounded font-bold">
            PHASE 2 BETA
          </span>
        </div>

        <span className="text-xs bg-[#ff9900]/10 text-[#ff9900] border border-[#ff9900]/40 px-2.5 py-1 rounded font-bold flex items-center gap-1">
          <Radio size={14} className="animate-pulse text-[#ff9900]" />
          <span>ADS-B SATELLITE RADAR ONLINE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
        {/* Left Column: Interactive World Air Radar Canvas with SVG World Map */}
        <div className="lg:col-span-2 bg-[#0c0a07] border border-[#ff9900]/30 rounded-lg p-3 relative overflow-hidden flex flex-col justify-between shadow-inner">
          
          {/* Radar Header Overlay */}
          <div className="flex items-center justify-between z-10 text-[11px] bg-[#14100b]/90 border border-[#222733] px-3 py-1.5 rounded">
            <div className="flex items-center gap-2 text-gray-300 font-bold">
              <Globe size={14} className="text-[#ff9900]" />
              <span>SATELLITE WORLD CONTINENTS ADS-B FLIGHT RADAR</span>
            </div>

            {/* Interactive Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-[#1a150e] p-1 rounded border border-[#262a33]">
              <button
                onClick={handleZoomIn}
                className="p-1 text-gray-300 hover:text-white hover:bg-[#282116] rounded"
                title="Zoom In (+)"
              >
                <ZoomIn size={14} className="text-[#ff9900]" />
              </button>

              <button
                onClick={handleZoomOut}
                className="p-1 text-gray-300 hover:text-white hover:bg-[#282116] rounded"
                title="Zoom Out (-)"
              >
                <ZoomOut size={14} className="text-[#ff9900]" />
              </button>

              <button
                onClick={handleResetZoom}
                className="p-1 text-gray-300 hover:text-white hover:bg-[#282116] rounded"
                title="Reset Zoom"
              >
                <RotateCcw size={13} className="text-gray-400" />
              </button>

              <span className="text-[10px] font-bold text-[#ff9900] px-1">{zoomLevel.toFixed(1)}x</span>
            </div>
          </div>

          {/* Zoomable World Air Radar Canvas with Vector Continents */}
          <div className="relative flex-1 w-full my-2 border border-[#222733] rounded bg-[#080705] overflow-hidden">
            <div 
              className="w-full h-full relative transition-transform duration-300 ease-out origin-center flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* World Continents Vector SVG Outline Background */}
              <svg 
                viewBox="0 0 1000 500" 
                className="w-full h-full absolute inset-0 opacity-40"
                style={{ filter: 'drop-shadow(0 0 6px rgba(255,153,0,0.15))' }}
              >
                {/* North America */}
                <path d="M 120 80 Q 180 50 260 70 Q 320 120 280 200 Q 220 240 180 210 Q 140 180 120 80 Z" fill="#241a0d" stroke="#ff9900" strokeWidth="1.2" />
                {/* Greenland */}
                <path d="M 330 40 Q 380 30 400 70 Q 370 100 330 40 Z" fill="#241a0d" stroke="#ff9900" strokeWidth="1" />
                {/* South America */}
                <path d="M 280 240 Q 340 260 320 380 Q 280 440 250 360 Q 240 280 280 240 Z" fill="#241a0d" stroke="#ff9900" strokeWidth="1.2" />
                {/* Europe */}
                <path d="M 460 70 Q 550 60 580 120 Q 520 160 470 140 Q 450 100 460 70 Z" fill="#241a0d" stroke="#ff9900" strokeWidth="1.2" />
                {/* Africa */}
                <path d="M 450 150 Q 560 160 580 260 Q 540 370 480 350 Q 440 260 450 150 Z" fill="#241a0d" stroke="#ff9900" strokeWidth="1.2" />
                {/* Asia */}
                <path d="M 580 70 Q 780 40 880 110 Q 860 250 720 240 Q 620 220 580 120 Z" fill="#241a0d" stroke="#ff9900" strokeWidth="1.2" />
                {/* Australia */}
                <path d="M 780 300 Q 880 310 860 390 Q 780 410 760 350 Z" fill="#241a0d" stroke="#ff9900" strokeWidth="1.2" />
              </svg>

              {/* Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff99000d_1px,transparent_1px),linear-gradient(to_bottom,#ff99000d_1px,transparent_1px)] bg-[size:36px_36px]"></div>

              {/* Equator & Meridian Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#ff9900]/20"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#ff9900]/20"></div>

              {/* Clickable Flight Radar Pins */}
              {MOCK_FLIGHTS.map((f) => {
                const pos = mapCoords(f.latitude, f.longitude);
                const isSelected = selectedFlight.tailNumber === f.tailNumber;

                return (
                  <div
                    key={f.tailNumber}
                    onClick={() => setSelectedFlight(f)}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                  >
                    <div className="relative flex items-center justify-center">
                      <Plane size={18} className={`transition-transform ${isSelected ? 'text-[#ff9900] scale-125 animate-bounce' : 'text-gray-400 hover:text-white'}`} />
                    </div>

                    {/* Tooltip Hover Label */}
                    <div className={`absolute left-1/2 -translate-x-1/2 bottom-6 whitespace-nowrap bg-[#14100b] border px-2 py-1 rounded text-[9px] font-bold shadow-lg transition-all ${
                      isSelected ? 'border-[#ff9900] text-white opacity-100' : 'border-[#262a33] text-gray-400 opacity-80 group-hover:opacity-100'
                    }`}>
                      <div>{f.tailNumber} ({f.aircraft})</div>
                      <div className="text-[8px] text-[#ff9900]">{f.origin} ➔ {f.destination}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Radar Footer Status */}
          <div className="flex justify-between items-center text-[10px] text-gray-500 z-10 bg-[#0c0a07]/90 px-3 py-1 rounded border border-[#222733]">
            <span>SELECTED FLIGHT: {selectedFlight.tailNumber} ({selectedFlight.origin} ➔ {selectedFlight.destination})</span>
            <span className="text-[#ff9900]">WORLD MAP VECTOR CONTINENTS ACTIVE</span>
          </div>
        </div>

        {/* Right Column: Flight Inspector & Path Breakdown */}
        <div className="bg-[#141720] border border-[#222733] rounded p-4 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#262a33] pb-3 mb-3">
              <div>
                <span className="text-[10px] bg-[#ff9900] text-black font-extrabold px-2 py-0.5 rounded uppercase">
                  {selectedFlight.tailNumber}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{selectedFlight.operator}</h3>
                <span className="text-xs text-gray-400 font-sans">{selectedFlight.aircraft}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block font-sans">Altitude / Speed</span>
                <span className="text-xs font-bold text-[#00e5ff]">{selectedFlight.altitude} / {selectedFlight.speed}</span>
              </div>
            </div>

            {/* Event Signal Alert Box */}
            <div className="bg-[#1f1914] border border-[#ff9900]/40 rounded p-3 text-xs mb-3">
              <div className="flex items-center gap-1.5 text-[#ff9900] font-bold text-[10px] uppercase tracking-wider mb-1">
                <Zap size={14} className="animate-bounce" />
                <span>M&amp;A Intelligence Corporate Signal</span>
              </div>
              <p className="text-white font-bold text-xs">{selectedFlight.eventSignal}</p>
            </div>

            {/* Flight Path Waypoint Steps */}
            <div className="space-y-1.5 text-xs mb-3">
              <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Flight Path Waypoints ({selectedFlight.path.length})</span>
              {selectedFlight.path.map((pt, idx) => (
                <div key={idx} className="bg-[#161a24] p-2 rounded border border-[#222733] flex items-center justify-between font-mono text-[11px]">
                  <span className="text-gray-300 font-bold">{idx + 1}. {pt.name}</span>
                  <span className="text-[#00e5ff]">{pt.lat}°N, {pt.lng}°E</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#262a33] text-[11px] text-gray-500 flex justify-between">
            <span>STATUS: {selectedFlight.status}</span>
            <span className="text-[#ff9900]">ADS-B SATELLITE RADAR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
