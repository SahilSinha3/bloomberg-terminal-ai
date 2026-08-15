from typing import List, Dict, Any

MOCK_FLIGHTS: List[Dict[str, Any]] = [
    {
        "tailNumber": "N1NVDA",
        "aircraft": "Gulfstream G650ER",
        "operator": "NVIDIA Corporate Aviation",
        "origin": "SJC (San Jose Intl)",
        "destination": "TSMC Hsinchu (RCTP / Taipei)",
        "status": "EN ROUTE",
        "altitude": "41,000 ft",
        "speed": "510 knots",
        "eventSignal": "Executive Supply Chain Meeting Signal",
        "departureTime": "06:15 UTC",
        "eta": "16:45 UTC"
    },
    {
        "tailNumber": "N1AAPL",
        "aircraft": "Bombardier Global 7500",
        "operator": "Apple Inc. Corporate Flight Ops",
        "origin": "SJC (San Jose Intl)",
        "destination": "AUS (Austin Executive)",
        "status": "LANDED",
        "altitude": "Ground",
        "speed": "0 knots",
        "eventSignal": "M&A Intelligence Signal: Corporate Jet Convergence at Austin Hub",
        "departureTime": "11:20 UTC",
        "eta": "14:50 UTC"
    },
    {
        "tailNumber": "N1MSFT",
        "aircraft": "Gulfstream G700",
        "operator": "Microsoft Flight Department",
        "origin": "BFI (Seattle Boeing Field)",
        "destination": "AUS (Austin Executive)",
        "status": "LANDED",
        "altitude": "Ground",
        "speed": "0 knots",
        "eventSignal": "M&A Intelligence Signal: Multiple Tech Executive Jets Converged at Same Airport",
        "departureTime": "10:45 UTC",
        "eta": "14:40 UTC"
    }
]

class FlightService:
    @staticmethod
    def get_flights() -> List[Dict[str, Any]]:
        return MOCK_FLIGHTS

flight_service = FlightService()
