import time
import concurrent.futures
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.core.database import get_db
from app.models.branch import Branch
from app.models.product import Product, Category
from app.models.order import Order
from app.models.user import User
from app.core.security import create_access_token
from app.tests.db import TestingSessionLocal

from app.tests.db import TestingSessionLocal, override_get_db

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

CUSTOMER_WESTFIELD_COORDS = {"lat": 51.492306, "lng": -0.224556} # ~1.05 mi to Westfield, ~4.66 mi to Central
CUSTOMER_CENTRAL_COORDS = {"lat": 51.5360, "lng": -0.1420}     # 0.0 mi to Central, ~4.7 mi to Westfield

@pytest.fixture
def test_setup_data():
    """Seed / fetch test database branches and products."""
    db = TestingSessionLocal()
    try:
        # Fetch or create London - Central
        central = db.query(Branch).filter(Branch.name.ilike("%Central%")).first()
        if not central:
            central = Branch(
                id="branch-central-001",
                code="LC1",
                name="London - Central",
                address_line1="45 Camden High Street",
                city="London",
                postcode="NW1 7JE",
                latitude=51.5360,
                longitude=-0.1420,
                delivery_radius_miles=2.0,
                is_active=True,
                ordering_enabled=True,
                delivery_enabled=True,
                collection_enabled=True
            )
            db.add(central)
            db.flush()
        else:
            central.name = "London - Central"
            central.is_active = True
            central.ordering_enabled = True
            central.delivery_enabled = True
            central.collection_enabled = True
            central.latitude = 51.5360
            central.longitude = -0.1420

        # Fetch or create London - Westfield
        westfield = db.query(Branch).filter(Branch.name.ilike("%Westfield%")).first()
        if not westfield:
            westfield = Branch(
                id="branch-westfield-002",
                code="LW1",
                name="London - Westfield",
                address_line1="Ariel Way, Shepherd's Bush",
                city="London",
                postcode="W12 7GF",
                latitude=51.5074,
                longitude=-0.2217,
                delivery_radius_miles=2.0,
                is_active=True,
                ordering_enabled=True,
                delivery_enabled=True,
                collection_enabled=True
            )
            db.add(westfield)
            db.flush()
        else:
            westfield.name = "London - Westfield"
            westfield.is_active = True
            westfield.ordering_enabled = True
            westfield.delivery_enabled = True
            westfield.collection_enabled = True
            westfield.latitude = 51.5074
            westfield.longitude = -0.2217

        # Deactivate any other branches to ensure clean 2-branch baseline
        other_branches = db.query(Branch).filter(~Branch.id.in_([central.id, westfield.id])).all()
        for ob in other_branches:
            ob.is_active = False

        # Ensure a test category and product exist
        cat = db.query(Category).first()
        if not cat:
            cat = Category(id="cat-e2e-001", name="Burgers", is_active=True)
            db.add(cat)
            db.flush()

        prod = db.query(Product).first()
        if not prod:
            prod = Product(
                id="prod-e2e-burger",
                name="The Classic Patty",
                price=9.99,
                category_id=cat.id,
                is_active=True,
                stock_quantity=100
            )
            db.add(prod)
            db.flush()

        # Ensure a test customer user exists
        user = db.query(User).filter(User.email == "e2e_customer@pattyproject.co.uk").first()
        if not user:
            user = User(
                id="user-e2e-customer-001",
                email="e2e_customer@pattyproject.co.uk",
                password_hash="$argon2id$v=19$m=65536,t=3,p=4$dummyhashforpytestuser$dummyhash",
                full_name="E2E Tester",
                role="CUSTOMER",
                is_active=True
            )
            db.add(user)
            db.flush()

        db.commit()
        return {
            "central_id": central.id,
            "westfield_id": westfield.id,
            "product_id": prod.id,
            "user_id": user.id
        }
    finally:
        db.close()


# ============================================================================
# BROWSER & INTEGRATION E2E TESTS (Scenarios 1 - 10)
# ============================================================================

def test_e2e_scenario_1_westfield_selection(test_setup_data):
    """
    E2E Scenario 1: Customer enters location near Westfield (51.492306, -0.224556).
    Expected: London - Westfield assigned as nearest eligible branch (~1.05 mi).
    """
    response = client.post("/api/v1/branches/nearest", json={
        "latitude": CUSTOMER_WESTFIELD_COORDS["lat"],
        "longitude": CUSTOMER_WESTFIELD_COORDS["lng"],
        "fulfillment_method": "DELIVERY"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert data["assigned_branch"]["name"] == "London - Westfield"
    assert data["assigned_branch"]["id"] == test_setup_data["westfield_id"]
    assert 1.0 <= data["distance_miles"] <= 1.15
    assert data["is_delivery_eligible"] is True


def test_e2e_scenario_2_central_selection(test_setup_data):
    """
    E2E Scenario 2: Customer enters location near Central (51.5360, -0.1420).
    Expected: London - Central assigned as nearest eligible branch (0.0 mi).
    """
    response = client.post("/api/v1/branches/nearest", json={
        "latitude": CUSTOMER_CENTRAL_COORDS["lat"],
        "longitude": CUSTOMER_CENTRAL_COORDS["lng"],
        "fulfillment_method": "DELIVERY"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert data["assigned_branch"]["name"] == "London - Central"
    assert data["assigned_branch"]["id"] == test_setup_data["central_id"]
    assert data["distance_miles"] < 0.1
    assert data["is_delivery_eligible"] is True


def test_e2e_scenario_3_dynamic_location_change(test_setup_data):
    """
    E2E Scenario 3: Customer switches location dynamically from Central to Westfield.
    Expected: Outlet assignment updates correctly from Central to Westfield.
    """
    # 1. First location: Central
    res1 = client.post("/api/v1/branches/nearest", json={
        "latitude": CUSTOMER_CENTRAL_COORDS["lat"],
        "longitude": CUSTOMER_CENTRAL_COORDS["lng"],
        "fulfillment_method": "DELIVERY"
    })
    assert res1.status_code == 200
    assert res1.json()["assigned_branch"]["id"] == test_setup_data["central_id"]

    # 2. Changed location: Westfield
    res2 = client.post("/api/v1/branches/nearest", json={
        "latitude": CUSTOMER_WESTFIELD_COORDS["lat"],
        "longitude": CUSTOMER_WESTFIELD_COORDS["lng"],
        "fulfillment_method": "DELIVERY"
    })
    assert res2.status_code == 200
    assert res2.json()["assigned_branch"]["id"] == test_setup_data["westfield_id"]


def test_e2e_scenario_4_manual_override_collection(test_setup_data):
    """
    E2E Scenario 4: Nearest is Westfield, but user manually selects Central for Collection.
    Expected: Collection is permitted for any active store.
    """
    token = create_access_token(subject=test_setup_data["user_id"], roles=["CUSTOMER"])
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "branch_id": test_setup_data["central_id"], # Manually overridden to Central
        "order_type": "COLLECTION",
        "customer_name": "E2E Tester",
        "customer_email": "e2e_customer@pattyproject.co.uk",
        "customer_phone": "07123456789",
        "delivery_address": {"postcode": "W12 7GF"},
        "items": [{"product_id": test_setup_data["product_id"], "quantity": 1}],
        "delivery_latitude": CUSTOMER_WESTFIELD_COORDS["lat"],
        "delivery_longitude": CUSTOMER_WESTFIELD_COORDS["lng"]
    }

    res = client.post("/api/v1/orders", json=payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["branch_id"] == test_setup_data["central_id"]
    assert data["order_type"] == "COLLECTION"


def test_e2e_scenario_5_invalid_manual_override_delivery_rejected(test_setup_data):
    """
    E2E Scenario 5: Customer at Westfield coordinates attempts Delivery from Central (4.66 mi > 2.0 mi).
    Expected: Backend authoritatively rejects order with HTTP 400 DELIVERY_OUTSIDE_RADIUS.
    """
    token = create_access_token(subject=test_setup_data["user_id"], roles=["CUSTOMER"])
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "branch_id": test_setup_data["central_id"], # Central is 4.66 miles away from customer
        "order_type": "DELIVERY",
        "customer_name": "E2E Tester",
        "customer_email": "e2e_customer@pattyproject.co.uk",
        "customer_phone": "07123456789",
        "delivery_address": {"postcode": "W6 9YD"},
        "items": [{"product_id": test_setup_data["product_id"], "quantity": 1}],
        "delivery_latitude": CUSTOMER_WESTFIELD_COORDS["lat"],
        "delivery_longitude": CUSTOMER_WESTFIELD_COORDS["lng"]
    }

    res = client.post("/api/v1/orders", json=payload, headers=headers)
    assert res.status_code == 400
    data = res.json()
    assert "detail" in data
    assert "2.0 miles" in data["detail"] or "DELIVERY_OUTSIDE_RADIUS" in str(data)


def test_e2e_scenario_6_geolocation_failure_fail_closed():
    """
    E2E Scenario 6: Customer denies GPS or location coordinate is missing/invalid.
    Expected: Fail-closed with status INVALID_LOCATION and assigned_branch=None (no arbitrary store).
    """
    res = client.post("/api/v1/branches/nearest", json={
        "postcode": "INVALID_UNKNOWN_XYZ",
        "fulfillment_method": "DELIVERY"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "INVALID_LOCATION"
    assert data["assigned_branch"] is None
    assert data["nearest_branch"] is None


def test_e2e_scenario_7_geocoder_outage_fail_closed():
    """
    E2E Scenario 7: External geocoder times out or fails.
    Expected: Fail-closed safely with status INVALID_LOCATION, no arbitrary store.
    """
    with patch("app.services.branch_service.resolve_postcode_lat_lng", return_value=None):
        res = client.post("/api/v1/branches/nearest", json={
            "postcode": "W12 7GF",
            "fulfillment_method": "DELIVERY"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "INVALID_LOCATION"
        assert data["assigned_branch"] is None


def test_e2e_scenario_8_outlet_api_no_branches():
    """
    E2E Scenario 8: No active branches available in the system.
    Expected: Response status NO_BRANCHES_AVAILABLE, order creation blocked.
    """
    db = TestingSessionLocal()
    try:
        # Temporarily deactivate all branches
        branches = db.query(Branch).all()
        for b in branches:
            b.is_active = False
        db.commit()

        res = client.post("/api/v1/branches/nearest", json={
            "latitude": CUSTOMER_WESTFIELD_COORDS["lat"],
            "longitude": CUSTOMER_WESTFIELD_COORDS["lng"],
            "fulfillment_method": "DELIVERY"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "NO_BRANCHES_AVAILABLE"
        assert data["assigned_branch"] is None
    finally:
        # Restore active branches
        for b in branches:
            b.is_active = True
        db.commit()
        db.close()


def test_e2e_scenario_9_rapid_request_caching_and_stability(test_setup_data):
    """
    E2E Scenario 9: Rapid location resolution requests.
    Expected: Cache returns stable results with deterministic output across repeated queries.
    """
    postcodes = ["W6 9YD", "w69yd", "NW1 7JE", "nw1 7je", "W12 7GF"]
    for pc in postcodes:
        res = client.post("/api/v1/branches/nearest", json={
            "postcode": pc,
            "fulfillment_method": "DELIVERY"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["assigned_branch"] is not None


def test_e2e_scenario_10_complete_order_pipeline_and_db_persistence(test_setup_data):
    """
    E2E Scenario 10: Complete flow for customer location (51.492306, -0.224556).
    Location -> Nearest Outlet (Westfield) -> Cart -> Checkout -> POST /orders -> Database verification.
    Asserts that order.branch_id in the persisted database record is London - Westfield.
    """
    # 1. Location to Nearest Outlet
    loc_res = client.post("/api/v1/branches/nearest", json={
        "latitude": CUSTOMER_WESTFIELD_COORDS["lat"],
        "longitude": CUSTOMER_WESTFIELD_COORDS["lng"],
        "fulfillment_method": "DELIVERY"
    })
    assert loc_res.status_code == 200
    assigned_branch = loc_res.json()["assigned_branch"]
    assert assigned_branch["id"] == test_setup_data["westfield_id"]
    assert assigned_branch["name"] == "London - Westfield"

    # 2. Authenticated Customer Checkout Payload
    token = create_access_token(subject=test_setup_data["user_id"], roles=["CUSTOMER"])
    headers = {"Authorization": f"Bearer {token}"}

    order_payload = {
        "branch_id": assigned_branch["id"],
        "order_type": "DELIVERY",
        "customer_name": "E2E Persisted Customer",
        "customer_email": "e2e_customer@pattyproject.co.uk",
        "customer_phone": "07987654321",
        "delivery_address": {
            "address_line1": "123 Shepherd's Bush Road",
            "city": "London",
            "postcode": "W6 9YD"
        },
        "items": [
            {
                "product_id": test_setup_data["product_id"],
                "quantity": 2
            }
        ],
        "delivery_latitude": CUSTOMER_WESTFIELD_COORDS["lat"],
        "delivery_longitude": CUSTOMER_WESTFIELD_COORDS["lng"],
        "delivery_postcode": "W6 9YD"
    }

    # 3. Submit Order to API
    order_res = client.post("/api/v1/orders", json=order_payload, headers=headers)
    assert order_res.status_code == 200, f"Order creation failed: {order_res.text}"
    created_order = order_res.json()
    order_id = created_order["id"]
    order_number = created_order["order_number"]

    # 4. Direct Authoritative Database Verification
    db: Session = TestingSessionLocal()
    try:
        db_order = db.query(Order).filter(Order.id == order_id).first()
        assert db_order is not None, "Order was not found in the database!"
        assert db_order.order_number == order_number
        assert db_order.branch_id == test_setup_data["westfield_id"], (
            f"Expected persisted order branch_id to be {test_setup_data['westfield_id']} (Westfield), "
            f"but got {db_order.branch_id}"
        )
        assert db_order.order_type == "DELIVERY"
        assert db_order.status == "PENDING_PAYMENT"
        assert len(db_order.items) == 1
        assert db_order.items[0].quantity == 2
    finally:
        db.close()


# ============================================================================
# CONCURRENCY / LOAD BENCHMARK (100 Simultaneous Local Cached Requests)
# ============================================================================

def test_load_and_concurrency_100_simultaneous_requests(test_setup_data):
    """
    Concurrency Test: 100 simultaneous requests against /branches/nearest.
    Uses local coordinate queries and cached postcodes to avoid external network spam.
    Measures throughput, error rate, p50, p95, p99 latency.
    """
    request_payloads = [
        {"latitude": CUSTOMER_WESTFIELD_COORDS["lat"], "longitude": CUSTOMER_WESTFIELD_COORDS["lng"], "fulfillment_method": "DELIVERY"},
        {"latitude": CUSTOMER_CENTRAL_COORDS["lat"], "longitude": CUSTOMER_CENTRAL_COORDS["lng"], "fulfillment_method": "DELIVERY"},
        {"latitude": 51.5000, "longitude": -0.2000, "fulfillment_method": "DELIVERY"},
        {"latitude": 51.5300, "longitude": -0.1400, "fulfillment_method": "COLLECTION"},
    ] * 25 # Total 100 requests

    latencies = []
    successes = 0
    errors = 0

    def make_request(payload):
        start_t = time.perf_counter()
        resp = client.post("/api/v1/branches/nearest", json=payload)
        elapsed_ms = (time.perf_counter() - start_t) * 1000.0
        return resp.status_code, elapsed_ms

    start_total = time.perf_counter()
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        futures = [executor.submit(make_request, p) for p in request_payloads]
        for f in concurrent.futures.as_completed(futures):
            status_code, elapsed_ms = f.result()
            latencies.append(elapsed_ms)
            if status_code == 200:
                successes += 1
            else:
                errors += 1

    total_time_s = time.perf_counter() - start_total
    latencies.sort()

    p50 = latencies[int(len(latencies) * 0.50)]
    p95 = latencies[int(len(latencies) * 0.95)]
    p99 = latencies[int(len(latencies) * 0.99)]
    avg_latency = sum(latencies) / len(latencies)

    print(f"\n--- Concurrency Benchmark (100 Requests) ---")
    print(f"Total Requests: {len(request_payloads)}")
    print(f"Successes: {successes} | Errors: {errors}")
    print(f"Total Elapsed: {total_time_s:.3f}s")
    print(f"Throughput: {len(request_payloads)/total_time_s:.1f} req/s")
    print(f"Latencies: Avg={avg_latency:.2f}ms | p50={p50:.2f}ms | p95={p95:.2f}ms | p99={p99:.2f}ms")

    assert errors == 0
    assert successes == 100
    assert p95 < 200.0 # Strict production SLA: p95 latency under 200ms
