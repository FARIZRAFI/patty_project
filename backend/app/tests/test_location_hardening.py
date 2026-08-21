import pytest
import math
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import get_db
from app.models.branch import Branch
from app.services.branch_service import (
    find_nearest_eligible_branch,
    resolve_postcode_lat_lng,
    normalize_uk_postcode,
    POSTCODE_CACHE,
    calculate_haversine_miles
)
from app.tests.db import TestingSessionLocal, override_get_db

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

# ---------------------------------------------------------------------------
# PHASE 3 TEST SUITE: Production-Grade Location & Outlet Resolution Hardening
# ---------------------------------------------------------------------------

def test_invalid_postcode_fails_closed_no_default_branch():
    """
    CRITICAL SAFETY TEST:
    An invalid/unresolvable postcode MUST fail closed.
    It must return assigned_branch=None and nearest_branch=None.
    It must NEVER arbitrarily return branches[0] (Central/Camden).
    """
    db = TestingSessionLocal()
    result = find_nearest_eligible_branch(db, postcode="INVALID999ZZ")

    assert result["status"] == "INVALID_LOCATION"
    assert result["assigned_branch"] is None
    assert result["nearest_branch"] is None
    assert result["distance_miles"] is None
    assert result["is_delivery_eligible"] is False
    assert result["delivery_available"] is False
    db.close()

    # Via API endpoint
    res = client.post("/api/v1/branches/nearest", json={"postcode": "INVALID999ZZ"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "INVALID_LOCATION"
    assert data["assigned_branch"] is None
    assert data["nearest_branch"] is None
    assert data["is_delivery_eligible"] is False


def test_geocoder_timeout_or_unavailability_handling_fail_closed():
    """
    TEST:
    When the external geocoding service times out or throws a network error,
    the system must fail closed and return None without crashing or defaulting to branches[0].
    """
    with patch("urllib.request.urlopen", side_effect=TimeoutError("Request timed out")):
        # Postcode not in static map
        coords = resolve_postcode_lat_lng("BN1 1AA")
        assert coords is None

    db = TestingSessionLocal()
    with patch("urllib.request.urlopen", side_effect=Exception("Connection refused")):
        result = find_nearest_eligible_branch(db, postcode="BN1 1AA")
        assert result["status"] == "INVALID_LOCATION"
        assert result["assigned_branch"] is None
        assert result["nearest_branch"] is None
    db.close()


def test_no_eligible_outlets_returns_no_branches_available():
    """
    TEST:
    When all outlets in the database are inactive or disabled,
    the system must explicitly return NO_BRANCHES_AVAILABLE with no fallback branch.
    """
    db = TestingSessionLocal()
    # Temporarily deactivate all branches
    branches = db.query(Branch).all()
    for b in branches:
        b.is_active = False
    db.commit()

    result = find_nearest_eligible_branch(db, lat=51.5074, lng=-0.2217)
    assert result["status"] == "NO_BRANCHES_AVAILABLE"
    assert result["assigned_branch"] is None
    assert result["nearest_branch"] is None
    assert result["is_delivery_eligible"] is False

    # Restore branches
    for b in branches:
        b.is_active = True
    db.commit()
    db.close()


def test_invalid_coordinates_rejected_by_pydantic():
    """
    TEST:
    Coordinates outside Earth bounds (-90..90 for lat, -180..180 for lng) or NaN/Inf
    must be rejected with HTTP 422 Unprocessable Entity.
    """
    # Latitude > 90
    res_lat = client.post("/api/v1/branches/nearest", json={"latitude": 95.0, "longitude": 0.0})
    assert res_lat.status_code == 422

    # Longitude < -180
    res_lng = client.post("/api/v1/branches/nearest", json={"latitude": 51.5, "longitude": -190.0})
    assert res_lng.status_code == 422

    # Invalid fulfillment method
    res_ful = client.post("/api/v1/branches/nearest", json={"latitude": 51.5, "longitude": -0.1, "fulfillment_method": "DRONE"})
    assert res_ful.status_code == 422


def test_postcode_normalization_and_caching():
    """
    TEST:
    Postcodes with varied casing and whitespace ('nw1 7je', 'NW1  7JE', 'NW17JE')
    must be normalized identically and utilize the in-memory cache safely.
    """
    # Normalization tests
    assert normalize_uk_postcode("w6 9yd") == "W69YD"
    assert normalize_uk_postcode("  NW1   7JE  ") == "NW17JE"
    assert normalize_uk_postcode("ec1a 1bb") == "EC1A1BB"

    # Static prefix lookup
    coords1 = resolve_postcode_lat_lng("NW1 7JE")
    coords2 = resolve_postcode_lat_lng("nw1   7je")
    assert coords1 is not None
    assert coords1 == coords2

    # Verify cache functionality
    test_key = "MOCKPC1"
    POSTCODE_CACHE[test_key] = ((51.5000, -0.1200), 9999999999.0)
    resolved = resolve_postcode_lat_lng("mock pc 1")
    assert resolved == (51.5000, -0.1200)

    # Cleanup mock key
    del POSTCODE_CACHE[test_key]


def test_deterministic_tie_breaking_equidistant_branches():
    """
    TEST:
    If two branches have identical distances, selection must be deterministic
    using (distance, branch.id) sorting rather than random order.
    """
    db = TestingSessionLocal()
    # Create two equidistant test branches
    b1 = Branch(
        id="branch-alpha-001",
        code="BA",
        name="Branch Alpha",
        address_line1="100 Equidistant St",
        postcode="NW1 1AA",
        latitude=51.5000,
        longitude=-0.1000,
        delivery_enabled=True,
        collection_enabled=True,
        ordering_enabled=True,
        is_active=True
    )
    b2 = Branch(
        id="branch-beta-002",
        code="BB",
        name="Branch Beta",
        address_line1="100 Equidistant St",
        postcode="NW1 1AA",
        latitude=51.5000,
        longitude=-0.1000,
        delivery_enabled=True,
        collection_enabled=True,
        ordering_enabled=True,
        is_active=True
    )
    db.add(b1)
    db.add(b2)
    db.commit()

    # Query from customer exactly at 51.5000, -0.1000
    res = find_nearest_eligible_branch(db, lat=51.5000, lng=-0.1000)
    assert res["assigned_branch"] is not None
    # branch-alpha-001 comes before branch-beta-002 alphabetically by id
    assert res["assigned_branch"].id == "branch-alpha-001"

    db.delete(b1)
    db.delete(b2)
    db.commit()
    db.close()


def test_candidate_outlets_breakdown():
    """
    TEST:
    The nearest-outlet endpoint must return a list of all candidate outlets
    with distances and eligibility flags for frontend transparency.
    """
    res = client.post("/api/v1/branches/nearest", json={"latitude": 51.492306, "longitude": -0.224556})
    assert res.status_code == 200
    data = res.json()

    assert "candidate_outlets" in data
    assert len(data["candidate_outlets"]) >= 2

    # Check that Westfield is in candidates and delivery-eligible
    westfield_candidate = next((c for c in data["candidate_outlets"] if c["id"] == "branch-westfield-002"), None)
    assert westfield_candidate is not None
    assert westfield_candidate["delivery_eligible"] is True
    assert 1.0 <= westfield_candidate["distance_miles"] <= 1.1

    # Check that Camden is in candidates and delivery-ineligible (> 2 miles)
    camden_candidate = next((c for c in data["candidate_outlets"] if c["id"] == "branch-camden-001"), None)
    assert camden_candidate is not None
    assert camden_candidate["delivery_eligible"] is False
    assert camden_candidate["distance_miles"] > 2.0


def test_manual_branch_override_delivery_outside_radius_rejected():
    """
    CRITICAL SECURITY & INTEGRITY TEST:
    If a customer attempts to force a delivery order from a store that is outside
    the 2.0-mile delivery radius (e.g. Camden for Shepherd's Bush customer),
    the backend MUST reject the order with HTTP 400 DELIVERY_OUTSIDE_RADIUS.
    """
    order_payload = {
        "branch_id": "branch-camden-001",  # Camden (4.66 miles away from customer)
        "order_type": "DELIVERY",
        "customer_name": "Alice Override",
        "customer_email": "alice@example.com",
        "customer_phone": "+44 7123456789",
        "latitude": 51.492306,
        "longitude": -0.224556,
        "delivery_postcode": "W12 7GF",
        "delivery_address": {
            "address_line1": "Flat 4, Hammersmith Rd",
            "city": "London",
            "postcode": "W12 7GF"
        },
        "items": [
            {
                "product_id": "prod-mc-project",
                "quantity": 1,
                "selected_modifiers": []
            }
        ]
    }

    res = client.post("/api/v1/orders", json=order_payload)
    assert res.status_code == 400
    assert "DELIVERY_OUTSIDE_RADIUS" in str(res.json())


def test_full_e2e_ordering_pipeline_westfield():
    """
    END-TO-END FLOW VERIFICATION:
    Customer Location: 51.492306, -0.224556
    1. POST /branches/nearest -> assigns London - Westfield (1.05 mi)
    2. Customer adds item to cart with branch_id = Westfield
    3. POST /orders -> Backend validates Westfield is active, delivery_enabled, and <= 2.0 mi
    4. Order created with status PENDING_PAYMENT for London - Westfield.
    """
    # Step 1: Resolve nearest branch
    res_loc = client.post("/api/v1/branches/nearest", json={
        "latitude": 51.492306,
        "longitude": -0.224556,
        "fulfillment_method": "DELIVERY"
    })
    assert res_loc.status_code == 200
    loc_data = res_loc.json()
    assert loc_data["is_delivery_eligible"] is True
    assert loc_data["assigned_branch"]["name"] == "London - Westfield"
    assert loc_data["assigned_branch"]["id"] == "branch-westfield-002"

    westfield_id = loc_data["assigned_branch"]["id"]

    # Step 2 & 3: Place delivery order
    order_payload = {
        "branch_id": westfield_id,
        "order_type": "DELIVERY",
        "customer_name": "Jane Westfield",
        "customer_email": "jane@example.com",
        "customer_phone": "+44 7987654321",
        "latitude": 51.492306,
        "longitude": -0.224556,
        "delivery_postcode": "W12 7GF",
        "delivery_address": {
            "address_line1": "12 Shepherd's Bush Green",
            "city": "London",
            "postcode": "W12 7GF"
        },
        "items": [
            {
                "product_id": "prod-mc-project",
                "quantity": 2,
                "selected_modifiers": []
            }
        ]
    }

    res_order = client.post("/api/v1/orders", json=order_payload)
    assert res_order.status_code == 200
    order = res_order.json()
    assert order["branch_id"] == "branch-westfield-002"
    assert order["order_type"] == "DELIVERY"
    assert order["status"] == "PENDING_PAYMENT"
    assert order["total_amount"] > 0
