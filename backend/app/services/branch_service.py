import math
from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.branch import Branch

def calculate_haversine_miles(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates the great-circle distance between two points in miles."""
    R = 3958.8  # Earth's radius in miles

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c

# Static UK Postcode approximate coordinates map for instant accurate local lookup
POSTCODE_COORDS = {
    "NW1": (51.5360, -0.1420),   # Camden Central
    "W1U": (51.5190, -0.1550),   # Baker Street
    "W12": (51.5074, -0.2217),   # Shepherd's Bush / Westfield
    "N1C": (51.5340, -0.1250),   # King's Cross
    "W6": (51.4930, -0.2260),    # Hammersmith
    "EC1": (51.5230, -0.0980),   # City London
    "SW1A": (51.5010, -0.1410),  # Westminster
}

def resolve_postcode_lat_lng(postcode: str) -> tuple[float, float]:
    """Resolves UK postcode prefix to approximate latitude and longitude."""
    clean_pc = postcode.upper().replace(" ", "")
    for prefix, coords in POSTCODE_COORDS.items():
        if clean_pc.startswith(prefix):
            return coords
    # Default London Central fallback
    return (51.5074, -0.1278)

def find_nearest_eligible_branch(
    db: Session,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    postcode: Optional[str] = None
) -> dict:
    """
    Finds the nearest eligible branch for delivery.
    Verifies branch active status, ordering_enabled, delivery_enabled, and delivery_radius_miles.
    """
    if (lat is None or lng is None) and postcode:
        lat, lng = resolve_postcode_lat_lng(postcode)
    
    if lat is None or lng is None:
        return {"assigned_branch": None, "distance_miles": None, "status": "INVALID_LOCATION", "message": "Please provide coordinates or a valid UK postcode."}

    branches = db.query(Branch).filter(
        Branch.is_active == True,
        Branch.ordering_enabled == True,
        Branch.delivery_enabled == True
    ).all()

    if not branches:
        return {"assigned_branch": None, "distance_miles": None, "status": "NO_BRANCHES_AVAILABLE", "message": "No branches are currently taking delivery orders."}

    nearest_branch = None
    min_distance = float('inf')

    for branch in branches:
        dist = calculate_haversine_miles(lat, lng, branch.latitude, branch.longitude)
        if dist <= branch.delivery_radius_miles:
            if dist < min_distance:
                min_distance = dist
                nearest_branch = branch

    if nearest_branch:
        return {
            "assigned_branch": nearest_branch,
            "distance_miles": round(min_distance, 2),
            "status": "SUCCESS",
            "message": f"Assigned to {nearest_branch.name} ({round(min_distance, 2)} miles away)"
        }

    return {
        "assigned_branch": None,
        "distance_miles": None,
        "status": "OUT_OF_DELIVERY_ZONE",
        "message": "Sorry, your address is outside our delivery radius. You can still order for Collection!"
    }
