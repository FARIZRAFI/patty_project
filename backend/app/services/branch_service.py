import math
from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.branch import Branch

# NON-NEGOTIABLE BUSINESS RULE — DELIVERY RADIUS IS 2 MILES MAXIMUM
MAX_DELIVERY_RADIUS_MILES = 2.0

def calculate_haversine_miles(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates the great-circle distance between two points in miles using Earth radius 3958.8 miles."""
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

def is_valid_coordinate(lat: Optional[float], lng: Optional[float]) -> bool:
    """Validates that latitude and longitude are valid numeric floats within Earth bounds."""
    if lat is None or lng is None:
        return False
    try:
        lat_f = float(lat)
        lng_f = float(lng)
        if math.isnan(lat_f) or math.isinf(lat_f) or math.isnan(lng_f) or math.isinf(lng_f):
            return False
        return -90.0 <= lat_f <= 90.0 and -180.0 <= lng_f <= 180.0
    except (ValueError, TypeError):
        return False

def find_nearest_eligible_branch(
    db: Session,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    postcode: Optional[str] = None
) -> dict:
    """
    Finds the nearest eligible branch for delivery by checking distance against ALL active branches.
    Enforces non-negotiable 2-mile delivery radius rule (<= 2.0 miles).
    Fail-closed: returns is_delivery_eligible = False if location is missing, invalid, or outside 2.0 miles.
    """
    if not is_valid_coordinate(lat, lng) and postcode:
        lat, lng = resolve_postcode_lat_lng(postcode)
    
    if not is_valid_coordinate(lat, lng):
        return {
            "assigned_branch": None,
            "nearest_branch": None,
            "distance_miles": None,
            "is_delivery_eligible": False,
            "status": "INVALID_LOCATION",
            "message": "Location access is required to check delivery availability. Please enable location access, or choose Collection from your nearest store."
        }

    branches = db.query(Branch).filter(
        Branch.is_active == True,
        Branch.ordering_enabled == True
    ).all()

    if not branches:
        return {
            "assigned_branch": None,
            "nearest_branch": None,
            "distance_miles": None,
            "is_delivery_eligible": False,
            "status": "NO_BRANCHES_AVAILABLE",
            "message": "WE PROVIDE DELIVERY UP TO 2 MILES ONLY"
        }

    nearest_branch = None
    min_distance = float('inf')

    for branch in branches:
        dist = calculate_haversine_miles(lat, lng, branch.latitude, branch.longitude)
        if dist < min_distance:
            min_distance = dist
            nearest_branch = branch

    rounded_dist = round(min_distance, 2) if min_distance != float('inf') else None

    if nearest_branch is not None and rounded_dist is not None and rounded_dist <= MAX_DELIVERY_RADIUS_MILES and nearest_branch.delivery_enabled:
        return {
            "assigned_branch": nearest_branch,
            "nearest_branch": nearest_branch,
            "distance_miles": rounded_dist,
            "is_delivery_eligible": True,
            "status": "SUCCESS",
            "message": f"Assigned to {nearest_branch.name} ({rounded_dist} miles away)"
        }

    return {
        "assigned_branch": None,
        "nearest_branch": nearest_branch,
        "distance_miles": rounded_dist,
        "is_delivery_eligible": False,
        "status": "DELIVERY_OUTSIDE_RADIUS",
        "message": "WE PROVIDE DELIVERY UP TO 2 MILES ONLY"
    }


