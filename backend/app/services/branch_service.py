import math
import urllib.request
import json
import time
import logging
from typing import Optional, Tuple, Dict, Any, List
from sqlalchemy.orm import Session
from app.models.branch import Branch

logger = logging.getLogger(__name__)

# NON-NEGOTIABLE BUSINESS RULE — DELIVERY RADIUS IS 2 MILES MAXIMUM
MAX_DELIVERY_RADIUS_MILES = 2.0

# 24-hour in-memory geocoding TTL cache (Client-side / Process-level optimization)
# Maps normalized_postcode -> ((latitude, longitude), timestamp)
POSTCODE_CACHE: Dict[str, Tuple[Tuple[float, float], float]] = {}
POSTCODE_CACHE_TTL_SECONDS = 86400  # 24 hours
POSTCODE_CACHE_MAX_SIZE = 10000

def normalize_uk_postcode(postcode: Optional[str]) -> Optional[str]:
    """
    Normalizes a UK postcode by stripping whitespace, converting to uppercase,
    and removing internal spaces (e.g., 'w6 9yd' -> 'W69YD').
    Zero PII is processed or stored.
    """
    if not postcode or not isinstance(postcode, str):
        return None
    cleaned = "".join(postcode.strip().upper().split())
    return cleaned if cleaned else None

def calculate_haversine_miles(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates the great-circle distance between two points in miles using Earth radius 3958.8 miles."""
    R = 3958.8  # Earth's radius in miles

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c

# Expanded UK Postcode / Outcode approximate coordinates map for instant accurate local lookup
POSTCODE_COORDS: Dict[str, Tuple[float, float]] = {
    # London Outcodes
    "NW1": (51.5360, -0.1420),   # Camden Central
    "NW3": (51.5550, -0.1770),   # Hampstead
    "NW5": (51.5490, -0.1420),   # Kentish Town
    "NW8": (51.5320, -0.1720),   # St John's Wood
    "W1": (51.5140, -0.1420),    # West End Central
    "W1U": (51.5190, -0.1550),   # Baker Street / Marylebone
    "W1K": (51.5110, -0.1500),   # Mayfair
    "W1D": (51.5130, -0.1330),   # Soho
    "W2": (51.5160, -0.1800),    # Paddington
    "W6": (51.4930, -0.2260),    # Hammersmith
    "W12": (51.5074, -0.2217),   # Shepherd's Bush / Westfield
    "W14": (51.4960, -0.2080),   # West Kensington
    "WC1": (51.5240, -0.1230),   # Bloomsbury
    "WC2": (51.5120, -0.1230),   # Covent Garden
    "EC1": (51.5230, -0.0980),   # City / Clerkenwell
    "EC2": (51.5180, -0.0860),   # Liverpool Street / Shoreditch
    "EC3": (51.5120, -0.0810),   # Monument
    "EC4": (51.5130, -0.1000),   # St Paul's
    "SW1": (51.4970, -0.1380),   # Victoria
    "SW1A": (51.5010, -0.1410),  # Westminster / St James
    "SW3": (51.4910, -0.1660),   # Chelsea
    "SW7": (51.4980, -0.1770),   # South Kensington
    "SW10": (51.4840, -0.1830),  # West Chelsea
    "SE1": (51.5010, -0.0930),   # London Bridge / Waterloo
    "SE11": (51.4900, -0.1140),  # Kennington
    "N1": (51.5380, -0.1030),    # Islington
    "N1C": (51.5340, -0.1250),   # King's Cross
    "E1": (51.5150, -0.0630),    # Whitechapel / Aldgate
    "E2": (51.5290, -0.0610),    # Bethnal Green
}

def is_valid_coordinate(lat: Optional[float], lng: Optional[float]) -> bool:
    """
    Validates that latitude and longitude are valid numeric floats within Earth bounds:
    - Latitude must be between -90.0 and +90.0
    - Longitude must be between -180.0 and +180.0
    """
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

def resolve_postcode_lat_lng(postcode: Optional[str]) -> Optional[Tuple[float, float]]:
    """
    Resolves a UK postcode to (latitude, longitude).
    1. Normalizes input and checks static prefix/outcode map.
    2. Checks in-memory TTL cache.
    3. Attempts dynamic lookup via postcodes.io API with strict timeout (2.5s).
    4. Returns None on geocoding failure (fail-closed, no fake coordinates).
    """
    clean_pc = normalize_uk_postcode(postcode)
    if not clean_pc:
        return None

    # Step 1: Match static prefixes in local table
    for prefix in sorted(POSTCODE_COORDS.keys(), key=len, reverse=True):
        if clean_pc.startswith(prefix):
            return POSTCODE_COORDS[prefix]

    # Step 2: Check in-memory TTL cache
    now = time.time()
    if clean_pc in POSTCODE_CACHE:
        coords, cached_time = POSTCODE_CACHE[clean_pc]
        if now - cached_time < POSTCODE_CACHE_TTL_SECONDS:
            return coords
        else:
            del POSTCODE_CACHE[clean_pc]

    # Step 3: Dynamic online lookup via postcodes.io
    resolved_coords = None
    try:
        url = f"https://api.postcodes.io/postcodes/{clean_pc}"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "PattyProject/1.0 (DeliveryRadiusResolver)"}
        )
        with urllib.request.urlopen(req, timeout=2.5) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode("utf-8"))
                result = data.get("result", {})
                lat = result.get("latitude")
                lng = result.get("longitude")
                if is_valid_coordinate(lat, lng):
                    resolved_coords = (float(lat), float(lng))
    except Exception as e:
        logger.debug(f"postcodes.io lookup failed for {clean_pc}: {e}")

    # Step 4: Outcode fallback lookup via postcodes.io
    if not resolved_coords:
        try:
            outcode = clean_pc[:len(clean_pc)-3] if len(clean_pc) > 4 else clean_pc
            if outcode:
                url_out = f"https://api.postcodes.io/outcodes/{outcode}"
                req_out = urllib.request.Request(
                    url_out,
                    headers={"User-Agent": "PattyProject/1.0 (DeliveryRadiusResolver)"}
                )
                with urllib.request.urlopen(req_out, timeout=2.5) as resp_out:
                    if resp_out.status == 200:
                        data_out = json.loads(resp_out.read().decode("utf-8"))
                        result_out = data_out.get("result", {})
                        lat = result_out.get("latitude")
                        lng = result_out.get("longitude")
                        if is_valid_coordinate(lat, lng):
                            resolved_coords = (float(lat), float(lng))
        except Exception as e:
            logger.debug(f"postcodes.io outcode lookup failed for {clean_pc}: {e}")

    # Cache successful resolution
    if resolved_coords:
        if len(POSTCODE_CACHE) >= POSTCODE_CACHE_MAX_SIZE:
            # Simple eviction of first key if full
            first_key = next(iter(POSTCODE_CACHE))
            del POSTCODE_CACHE[first_key]
        POSTCODE_CACHE[clean_pc] = (resolved_coords, now)

    return resolved_coords

def find_nearest_eligible_branch(
    db: Session,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    postcode: Optional[str] = None,
    fulfillment_method: Optional[str] = None
) -> dict:
    """
    Finds the nearest eligible branch for delivery/collection by checking distance against ALL active branches.
    Enforces non-negotiable 2-mile delivery radius rule (<= 2.0 miles).
    
    Fail-closed:
    - Returns is_delivery_eligible = False if location is missing, invalid, or outside 2.0 miles.
    - Active branches without valid coordinates are safely skipped.
    - Uses deterministic tie-breaking on (distance, branch.id).
    - Returns candidate_outlets breakdown.
    """
    start_time = time.perf_counter()
    fulfillment = (fulfillment_method or "DELIVERY").strip().upper()

    # Attempt coordinate resolution from postcode if coordinates are not provided or invalid
    if not is_valid_coordinate(lat, lng) and postcode:
        resolved = resolve_postcode_lat_lng(postcode)
        if resolved:
            lat, lng = resolved

    if not is_valid_coordinate(lat, lng):
        duration_ms = (time.perf_counter() - start_time) * 1000.0
        logger.info(
            f"[OUTLET_RESOLUTION] status=INVALID_LOCATION fulfillment={fulfillment} candidates=0 selected_id=None distance_mi=None duration_ms={duration_ms:.2f}"
        )
        return {
            "assigned_branch": None,
            "nearest_branch": None,
            "candidate_outlets": [],
            "distance_miles": None,
            "is_delivery_eligible": False,
            "delivery_available": False,
            "collection_available": False,
            "status": "INVALID_LOCATION",
            "message": "Location access is required to check delivery availability. Please enable location access, or choose Collection from your nearest store."
        }

    # Query active branches
    branches: List[Branch] = db.query(Branch).filter(
        Branch.is_active == True,
        Branch.ordering_enabled == True
    ).all()

    # Filter only branches with valid coordinates
    valid_branches = [b for b in branches if b is not None and is_valid_coordinate(getattr(b, "latitude", None), getattr(b, "longitude", None))]

    if not valid_branches:
        duration_ms = (time.perf_counter() - start_time) * 1000.0
        logger.info(
            f"[OUTLET_RESOLUTION] status=NO_BRANCHES_AVAILABLE fulfillment={fulfillment} candidates=0 selected_id=None distance_mi=None duration_ms={duration_ms:.2f}"
        )
        return {
            "assigned_branch": None,
            "nearest_branch": None,
            "candidate_outlets": [],
            "distance_miles": None,
            "is_delivery_eligible": False,
            "delivery_available": False,
            "collection_available": False,
            "status": "NO_BRANCHES_AVAILABLE",
            "message": "WE PROVIDE DELIVERY UP TO 2 MILES ONLY"
        }

    # Calculate exact unrounded distance for all branches with deterministic tie-breaking (distance_miles, branch.id)
    branch_distances = []
    for branch in valid_branches:
        raw_dist = calculate_haversine_miles(lat, lng, branch.latitude, branch.longitude)
        branch_distances.append((raw_dist, str(branch.id), branch))

    branch_distances.sort(key=lambda item: (item[0], item[1]))

    # Nearest physical store
    nearest_raw_dist, _, nearest_branch = branch_distances[0]
    nearest_rounded_dist = round(nearest_raw_dist, 2)

    # Candidate outlets list with precision and eligibility flags
    candidate_outlets = []
    for raw_d, _, b in branch_distances:
        rounded_d = round(raw_d, 2)
        candidate_outlets.append({
            "id": b.id,
            "name": b.name,
            "code": b.code,
            "address_line1": b.address_line1,
            "city": b.city,
            "postcode": b.postcode,
            "distance_miles": rounded_d,
            "delivery_eligible": rounded_d <= MAX_DELIVERY_RADIUS_MILES and bool(b.delivery_enabled),
            "collection_eligible": bool(b.collection_enabled)
        })

    # Check delivery eligibility (<= 2.0 miles and delivery_enabled)
    delivery_eligible = (
        nearest_branch is not None and
        nearest_rounded_dist <= MAX_DELIVERY_RADIUS_MILES and
        bool(nearest_branch.delivery_enabled)
    )

    # Check collection availability on nearest store
    collection_available = bool(nearest_branch.collection_enabled) if nearest_branch else False

    duration_ms = (time.perf_counter() - start_time) * 1000.0
    status = "SUCCESS" if delivery_eligible else "DELIVERY_OUTSIDE_RADIUS"
    assigned_branch = nearest_branch if delivery_eligible else None

    logger.info(
        f"[OUTLET_RESOLUTION] status={status} fulfillment={fulfillment} candidates={len(valid_branches)} selected_id={nearest_branch.id if nearest_branch else None} distance_mi={nearest_rounded_dist} duration_ms={duration_ms:.2f}"
    )

    if delivery_eligible:
        return {
            "assigned_branch": nearest_branch,
            "nearest_branch": nearest_branch,
            "candidate_outlets": candidate_outlets,
            "distance_miles": nearest_rounded_dist,
            "is_delivery_eligible": True,
            "delivery_available": True,
            "collection_available": collection_available,
            "status": "SUCCESS",
            "message": f"Assigned to {nearest_branch.name} ({nearest_rounded_dist} miles away)"
        }

    return {
        "assigned_branch": None,
        "nearest_branch": nearest_branch,
        "candidate_outlets": candidate_outlets,
        "distance_miles": nearest_rounded_dist,
        "is_delivery_eligible": False,
        "delivery_available": False,
        "collection_available": collection_available,
        "status": "DELIVERY_OUTSIDE_RADIUS",
        "message": "WE PROVIDE DELIVERY UP TO 2 MILES ONLY"
    }
