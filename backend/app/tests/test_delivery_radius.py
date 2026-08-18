import pytest
import math
import sys
import os
import pathlib

# Ensure backend root is on sys.path
backend_root = pathlib.Path(__file__).resolve().parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from fastapi.testclient import TestClient

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db
from app.models.branch import Branch
from app.models.product import Product, Category
from app.models.user import User, UserRole
from app.core.security import get_password_hash
from app.services.branch_service import (
    find_nearest_eligible_branch,
    calculate_haversine_miles,
    is_valid_coordinate,
    MAX_DELIVERY_RADIUS_MILES
)

# In-memory SQLite Database for Fast, Isolated Testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # Clear all data
    for table in reversed(Base.metadata.sorted_tables):
        db.execute(table.delete())
    db.commit()

    # Seed test branches
    # Branch 1: Camden (Lat: 51.5360, Lng: -0.1420)
    camden = Branch(
        id="branch-camden-001",
        code="LC",
        name="London - Camden",
        address_line1="45 Camden High Street",
        postcode="NW1 7JE",
        city="London",
        latitude=51.5360,
        longitude=-0.1420,
        phone="+44 20 7417 5211",
        delivery_enabled=True,
        collection_enabled=True,
        ordering_enabled=True,
        delivery_radius_miles=2.0,
        is_active=True
    )

    # Branch 2: Westfield (Lat: 51.5074, Lng: -0.2217)
    westfield = Branch(
        id="branch-westfield-002",
        code="LW",
        name="London - Westfield",
        address_line1="Ariel Way, Shepherd's Bush",
        postcode="W12 7GF",
        city="London",
        latitude=51.5074,
        longitude=-0.2217,
        phone="+44 20 8749 8899",
        delivery_enabled=True,
        collection_enabled=True,
        ordering_enabled=True,
        delivery_radius_miles=2.0,
        is_active=True
    )

    # Category and Product for order tests
    cat = Category(
        id="cat-burgers",
        name="Burgers",
        slug="burgers",
        icon="hamburger",
        display_order=1
    )

    prod = Product(
        id="prod-mc-project",
        category_id="cat-burgers",
        name="Mc Project",
        sku="BURG001",
        base_price=8.95,
        rating=4.8,
        reviews_count=100,
        is_active=True
    )

    db.add_all([camden, westfield, cat, prod])
    db.commit()
    db.close()

    yield

    Base.metadata.drop_all(bind=engine)


# --------------------------------------------------------------------------
# UNIT TESTS: Distance Calculation & Branch Eligibility Logic
# --------------------------------------------------------------------------

def test_haversine_distance_calculation():
    """Validates Earth radius 3958.8 miles Haversine formula against known coordinates."""
    # Distance between Camden (51.5360, -0.1420) and a point ~1.0 mile north (51.5505, -0.1420)
    dist = calculate_haversine_miles(51.5360, -0.1420, 51.5505, -0.1420)
    assert 0.95 <= dist <= 1.05


def test_customer_under_2_miles_eligible():
    """Test 1: Customer ~1.0 mile from nearest branch -> Delivery ENABLED."""
    db = TestingSessionLocal()
    # 1.0 mile north of Camden
    lat = 51.5505
    lng = -0.1420
    result = find_nearest_eligible_branch(db, lat=lat, lng=lng)

    assert result["is_delivery_eligible"] is True
    assert result["status"] == "SUCCESS"
    assert result["distance_miles"] <= 2.0
    assert result["assigned_branch"] is not None
    assert result["assigned_branch"].id == "branch-camden-001"
    db.close()


def test_customer_exactly_2_miles_eligible():
    """Test 2: Customer exactly 2.0 miles from nearest branch -> Delivery ENABLED."""
    db = TestingSessionLocal()
    # Exactly 2.0 miles north of Camden using Earth radius 3958.8 miles
    lat = 51.5360 + math.degrees(2.0 / 3958.8)
    lng = -0.1420
    dist = calculate_haversine_miles(51.5360, -0.1420, lat, lng)
    # Check that calculated distance is exactly 2.0 miles
    assert round(dist, 2) == 2.0

    result = find_nearest_eligible_branch(db, lat=lat, lng=lng)
    assert result["is_delivery_eligible"] is True
    assert result["assigned_branch"] is not None
    assert result["distance_miles"] == 2.0
    db.close()


def test_customer_over_2_miles_ineligible():
    """Test 3: Customer 2.01 / 2.1 miles / 5.0 miles -> Delivery DISABLED, message 'WE PROVIDE DELIVERY UP TO 2 MILES ONLY'."""
    db = TestingSessionLocal()
    # 2.05 miles north of Camden
    lat = 51.5360 + math.degrees(2.05 / 3958.8)
    lng = -0.1420

    result = find_nearest_eligible_branch(db, lat=lat, lng=lng)
    assert result["is_delivery_eligible"] is False
    assert result["status"] == "DELIVERY_OUTSIDE_RADIUS"
    assert result["message"] == "WE PROVIDE DELIVERY UP TO 2 MILES ONLY"
    assert result["assigned_branch"] is None
    # Nearest branch is provided for collection recommendation
    assert result["nearest_branch"] is not None
    assert result["nearest_branch"].id == "branch-camden-001"
    assert result["distance_miles"] > 2.0
    db.close()



def test_multiple_branches_nearest_selection():
    """Test 4: Checks against ALL active branches and assigns the closest one."""
    db = TestingSessionLocal()
    # Point very close to Westfield (0.3 miles away), but ~4.5 miles from Camden
    lat = 51.5074
    lng = -0.2150

    result = find_nearest_eligible_branch(db, lat=lat, lng=lng)
    assert result["is_delivery_eligible"] is True
    assert result["assigned_branch"].id == "branch-westfield-002"
    assert result["distance_miles"] < 1.0
    db.close()


def test_invalid_coordinates_fail_closed():
    """Test 5: Invalid coordinates (out of range, NaN, None) fail closed."""
    db = TestingSessionLocal()
    assert is_valid_coordinate(999.0, -0.1420) is False
    assert is_valid_coordinate(None, -0.1420) is False
    assert is_valid_coordinate(float('nan'), -0.1420) is False

    result = find_nearest_eligible_branch(db, lat=999.0, lng=999.0)
    assert result["is_delivery_eligible"] is False
    assert result["status"] == "INVALID_LOCATION"
    assert "Location access is required" in result["message"]
    db.close()


def test_no_active_branches_fail_closed():
    """Test 6: When all branches are inactive, Delivery is disabled."""
    db = TestingSessionLocal()
    db.query(Branch).update({Branch.is_active: False})
    db.commit()

    result = find_nearest_eligible_branch(db, lat=51.5360, lng=-0.1420)
    assert result["is_delivery_eligible"] is False
    assert result["status"] == "NO_BRANCHES_AVAILABLE"
    db.close()


# --------------------------------------------------------------------------
# INTEGRATION TESTS: FastAPI REST Endpoints & Order Enforcement
# --------------------------------------------------------------------------

def test_api_nearest_branch_endpoint_within_radius():
    """API test: POST /api/v1/branches/nearest within 2 miles."""
    res = client.post("/api/v1/branches/nearest", json={
        "latitude": 51.5400,
        "longitude": -0.1420
    })
    assert res.status_code == 200
    data = res.json()
    assert data["is_delivery_eligible"] is True
    assert data["status"] == "SUCCESS"
    assert data["assigned_branch"] is not None
    assert data["distance_miles"] <= 2.0


def test_api_nearest_branch_endpoint_outside_radius():
    """API test: POST /api/v1/branches/nearest outside 2 miles."""
    res = client.post("/api/v1/branches/nearest", json={
        "latitude": 51.7000,
        "longitude": -0.1420
    })
    assert res.status_code == 200
    data = res.json()
    assert data["is_delivery_eligible"] is False
    assert data["status"] == "DELIVERY_OUTSIDE_RADIUS"
    assert data["message"] == "WE PROVIDE DELIVERY UP TO 2 MILES ONLY"
    assert data["assigned_branch"] is None
    assert data["nearest_branch"] is not None


def test_backend_order_delivery_inside_radius_succeeds():
    """Test 7: Direct order creation for delivery <= 2 miles succeeds."""
    order_payload = {
        "branch_id": "branch-camden-001",
        "order_type": "DELIVERY",
        "customer_name": "Alice Tester",
        "customer_email": "alice@example.com",
        "customer_phone": "+44 7123456789",
        "latitude": 51.5400,
        "longitude": -0.1420,
        "delivery_postcode": "NW1 7JE",
        "delivery_address": {
            "address_line1": "10 High Street",
            "city": "London",
            "postcode": "NW1 7JE"
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
    assert res.status_code == 200
    order_data = res.json()
    assert order_data["order_type"] == "DELIVERY"
    assert order_data["branch_id"] == "branch-camden-001"


def test_backend_order_delivery_bypass_outside_radius_rejected():
    """Test 8: Client bypass attempt for delivery > 2 miles is strictly rejected with HTTP 400."""
    order_payload = {
        "branch_id": "branch-camden-001",
        "order_type": "DELIVERY",
        "customer_name": "Mallory Hacker",
        "customer_email": "mallory@example.com",
        "customer_phone": "+44 7123456789",
        "latitude": 51.7500,  # ~15 miles away
        "longitude": -0.1420,
        "delivery_postcode": "AL1 1AA",
        "delivery_address": {
            "address_line1": "Far Away Street",
            "city": "St Albans",
            "postcode": "AL1 1AA"
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
    err = res.json()["detail"]
    assert err["success"] is False
    assert err["code"] == "DELIVERY_OUTSIDE_RADIUS"
    assert err["message"] == "WE PROVIDE DELIVERY UP TO 2 MILES ONLY"
    assert "nearest_branch" in err
    assert err["nearest_branch"]["name"] is not None


def test_backend_order_collection_outside_radius_allowed():
    """Collection orders are always allowed regardless of distance."""
    order_payload = {
        "branch_id": "branch-camden-001",
        "order_type": "COLLECTION",
        "customer_name": "Bob Collector",
        "customer_email": "bob@example.com",
        "customer_phone": "+44 7123456789",
        "latitude": 51.7500,  # Far away
        "longitude": -0.1420,
        "items": [
            {
                "product_id": "prod-mc-project",
                "quantity": 1,
                "selected_modifiers": []
            }
        ]
    }

    res = client.post("/api/v1/orders", json=order_payload)
    assert res.status_code == 200
    order_data = res.json()
    assert order_data["order_type"] == "COLLECTION"
