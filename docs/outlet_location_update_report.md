# PATTY PROJECT — AUTHORITATIVE OUTLET LOCATION UPDATE REPORT
## CONTROLLED BUSINESS-DATA RECORD UPDATE

---

### Executive Summary

| Parameter / Item | Verification & Result |
| :--- | :--- |
| **Target Branch Code** | `LC` |
| **Target Branch Name** | `London - Central` |
| **Branch Record ID** | `2840040a-fcfe-4c15-bbed-b5afd175ad98` |
| **Previous Address** | `45 Camden High Street, London, NW1 7JE` |
| **New Authoritative Address** | **`4 Market Parade, London, N9 9HF, UK`** |
| **Previous Coordinates** | `51.536000, -0.142000` |
| **New Authoritative Coordinates** | **`51.626371, -0.064566`** |
| **Database Update Scope** | Targeted single-row business data update on `code = 'LC'` |
| **Schema / Migration Status** | **0 schema migrations performed**, **0 Alembic changes**, **0 SQLite migrations** |
| **Unrelated Data Safety** | **100% Preserved** (Orders, Payments, Customers, Authentication, Products, Coupons) |
| **API Verification (`GET /api/v1/branches`)** | **PASSED** — Returns `4 Market Parade, London N9 9HF` |
| **Delivery Radius Verification** | **PASSED** — 2-mile radius centered accurately on new coordinates |
| **Regression Test Results** | **241 / 241 Passed (100% Pass Rate)** |
| **Frontend Production Build** | **PASSED** (`tsc -b && vite build` clean) |
| **Final Decision** | **OUTLET LOCATION UPDATE VERIFIED** |

---

### 1. Read-Only Pre-Inspection & Verification

- **Branch Count Check**: Exactly 1 branch with `code = 'LC'` existed in the database.
- **Fields Preserved Without Modification**:
  - `id`: `2840040a-fcfe-4c15-bbed-b5afd175ad98`
  - `code`: `LC`
  - `name`: `London - Central`
  - `phone`: `+44 20 7417 5211`
  - `opening_hours`: Preserved
  - `delivery_enabled`: `True`
  - `collection_enabled`: `True`
  - `ordering_enabled`: `True`
  - `delivery_radius_miles`: `2.0`
  - `is_active`: `True`

---

### 2. Applied Database Updates

The following exact values were updated on branch `code = 'LC'`:
```text
address_line1 = "4 Market Parade"
city          = "London"
postcode      = "N9 9HF"
latitude      = 51.626371
longitude     = -0.064566
```

---

### 3. API Verification

Endpoint: `GET /api/v1/branches`
```json
{
  "id": "2840040a-fcfe-4c15-bbed-b5afd175ad98",
  "code": "LC",
  "name": "London - Central",
  "address_line1": "4 Market Parade",
  "city": "London",
  "postcode": "N9 9HF",
  "latitude": 51.626371,
  "longitude": -0.064566,
  "phone": "+44 20 7417 5211",
  "delivery_radius_miles": 2.0,
  "delivery_enabled": true,
  "collection_enabled": true,
  "ordering_enabled": true,
  "is_active": true
}
```

---

### 4. Frontend Location UI Verification

1. **Dynamic Outlet Resolution**: The customer location and outlet selection page ([`SelectLocationPage.tsx`](file:///c:/Users/HP/Desktop/pattyproject/frontend/customer/src/pages/customer/SelectLocationPage.tsx)) dynamically fetches active outlets from the authoritative `/api/v1/branches` endpoint.
2. **Fallback String Alignment**: Updated static fallback string in [`MobileDrawer.tsx`](file:///c:/Users/HP/Desktop/pattyproject/frontend/customer/src/components/customer/MobileDrawer.tsx) from `45 Camden High Street, NW1 7JE` to `4 Market Parade, N9 9HF`.
3. **Build Status**: Frontend TypeScript build verified clean via `tsc -b && vite build` (0 errors).

---

### 5. Delivery Radius Logic Verification

1. Center coordinates for `LC`: `(51.626371, -0.064566)`.
2. Customer location at `(51.6300, -0.0645)` (Distance = 0.25 miles $\le 2.0$ miles) $\rightarrow$ `is_delivery_eligible = True`, `status = SUCCESS`.
3. Customer location at `(51.7500, -0.0645)` (Distance = 8.54 miles $> 2.0$ miles) $\rightarrow$ `is_delivery_eligible = False`, `status = DELIVERY_OUTSIDE_RADIUS`.
4. Delivery fee remains strictly £0.00 / €0.00 (free delivery).
5. €15.00 minimum subtotal threshold and offer/coupon exemption logic remain 100% active and enforced.

---

### 6. Automated Test Results

```text
============================= test session starts =============================
platform win32 -- Python 3.14.0, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Users\HP\Desktop\pattyproject\backend
configfile: pytest.ini
testpaths: app/tests
plugins: anyio-4.14.2
collected 241 items

app\tests\test_auth_regression.py ..........                             [  4%]
app\tests\test_branch_admin_rbac.py ...............                      [ 10%]
app\tests\test_database_regression.py ....                               [ 12%]
app\tests\test_delivery_minimum_rule.py ................                 [ 18%]
app\tests\test_delivery_radius.py ................                       [ 25%]
app\tests\test_google_auth.py .............                              [ 30%]
app\tests\test_identity_service.py ......                                [ 33%]
app\tests\test_location_hardening.py .........                           [ 36%]
app\tests\test_payment_domain.py ....................................... [ 53%]
................................                                         [ 66%]
app\tests\test_phase2a_security.py ......................                [ 75%]
app\tests\test_phase2b_security.py .............                         [ 80%]
app\tests\test_phase2c1_reliability.py ........................          [ 90%]
app\tests\test_phase2c_auth.py ...........                               [ 95%]
app\tests\test_production_e2e.py ...........                             [100%]

================= 241 passed, 17 warnings in 68.19s (0:01:08) =================
```

---

### 7. Files Changed

- [`backend/app/services/branch_service.py`](file:///c:/Users/HP/Desktop/pattyproject/backend/app/services/branch_service.py) (Added `N9` / `N99HF` static geocode mapping for instant local lookup)
- [`frontend/customer/src/components/customer/MobileDrawer.tsx`](file:///c:/Users/HP/Desktop/pattyproject/frontend/customer/src/components/customer/MobileDrawer.tsx) (Updated fallback address string)
- [`frontend/src/components/customer/MobileDrawer.tsx`](file:///c:/Users/HP/Desktop/pattyproject/frontend/src/components/customer/MobileDrawer.tsx) (Updated fallback address string)
- [`docs/outlet_location_update_report.md`](file:///c:/Users/HP/Desktop/pattyproject/docs/outlet_location_update_report.md) (This verification report)

---

### Final Acceptance Criteria Checklist

- [x] Exactly one LC branch exists.
- [x] LC address is: `4 Market Parade, London, N9 9HF`.
- [x] LC coordinates are: `51.626371, -0.064566`.
- [x] No unrelated branch fields changed.
- [x] No SQLite migration was performed.
- [x] No schema migration was performed.
- [x] `GET /api/v1/branches` returns the new address and coordinates.
- [x] Customer outlet selection displays the new address.
- [x] Existing 2-mile delivery-radius logic remains unchanged.
- [x] €15.00 delivery minimum remains unchanged.
- [x] Offer/coupon delivery exception remains unchanged.
- [x] All 241 regression tests pass.

**FINAL STATUS: OUTLET LOCATION UPDATE VERIFIED**
