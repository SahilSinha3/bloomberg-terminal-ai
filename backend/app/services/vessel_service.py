from typing import List, Dict, Any

MOCK_VESSELS: List[Dict[str, Any]] = [
    {
        "imo": "9842109",
        "name": "PACIFIC TITAN",
        "type": "VLCC (Crude Oil Supertanker)",
        "flag": "Marshall Islands",
        "cargo": "2,100,000 Barrels Brent Crude",
        "dwt": "319,000 DWT",
        "status": "UNDERWAY (LOADED)",
        "destination": "Port of Rotterdam (NL)",
        "eta": "2026-08-21 14:00 UTC",
        "chokepoint": "Strait of Hormuz",
        "latitude": 26.54,
        "longitude": 56.28,
        "speed": "14.2 knots",
        "draft": "21.5m / 22.0m"
    },
    {
        "imo": "9721088",
        "name": "ARCTIC ENERGY",
        "type": "LNG Carrier",
        "flag": "Panama",
        "cargo": "174,000 m³ Liquefied Natural Gas",
        "dwt": "95,000 DWT",
        "status": "UNDERWAY (LOADED)",
        "destination": "Suez Canal Entry (EG)",
        "eta": "2026-08-18 09:30 UTC",
        "chokepoint": "Suez Canal",
        "latitude": 29.95,
        "longitude": 32.55,
        "speed": "18.5 knots",
        "draft": "11.8m / 12.0m"
    },
    {
        "imo": "9912040",
        "name": "SEMICON EXPRESS",
        "type": "Container Ship (18,000 TEU)",
        "flag": "Singapore",
        "cargo": "High-Value Electronic Components & Substrates",
        "dwt": "165,000 DWT",
        "status": "PORT CONGESTION (WAITING)",
        "destination": "Port of Los Angeles (US)",
        "eta": "2026-08-17 18:00 UTC",
        "chokepoint": "Panama Canal",
        "latitude": 33.74,
        "longitude": -118.27,
        "speed": "0.5 knots",
        "draft": "14.2m / 15.0m"
    }
]

class VesselService:
    @staticmethod
    def get_vessels() -> List[Dict[str, Any]]:
        return MOCK_VESSELS

vessel_service = VesselService()
