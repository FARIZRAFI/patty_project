# PATTY PROJECT — DELIVERY ELIGIBILITY BUSINESS RULE REPORT
## €15.00 MINIMUM THRESHOLD + OFFER/COUPON EXCEPTION IMPLEMENTATION & VERIFICATION

---

### Executive Summary

| Requirement / Parameter | Specification & Result |
| :--- | :--- |
| **Business Rule** | Cart merchandise subtotal must be $\ge$ €15.00 for delivery orders. |
| **Offer / Coupon Exemption** | Applying a valid promotion/coupon/reward preserves delivery eligibility even if discount reduces payable amount $< €15.00$. |
| **Obsolete Threshold** | €14.99 has been made completely obsolete and strictly fails the minimum delivery threshold. |
| **Precision Model** | `Decimal("15.00")` arithmetic enforced across server-side pricing services. |
| **Backend Enforcement** | `backend/app/services/pricing_service.py` & `backend/app/api/endpoints/orders.py` strictly fail-closed with HTTP 400 (`MINIMUM_DELIVERY_ORDER_REQUIRED`). |
| **Frontend UX & Store** | `frontend/customer/src/store/cartStore.ts`, `CustomerCart.tsx`, `CustomerCheckout.tsx` dynamically guide users and disable ineligible delivery checkout. |
| **Automated Test Results** | **241 / 241 Backend Tests Passed (100% Pass Rate)**, including 16/16 dedicated delivery threshold test cases. |
| **Frontend Build Status** | **Vite + TypeScript Build Clean (0 Errors)**. |
| **14.99 Reference Audit** | Verified: 0 obsolete 14.99 occurrences remain across application code and business logic. |
| **Final Decision** | **DELIVERY MINIMUM RULE IMPLEMENTED & VERIFIED** |

---

### 1. Business Logic Architecture & Mathematical Contract

#### Formal Eligibility Formula
$$\text{Delivery Allowed} = \left(\text{Cart Subtotal} \ge \text{Decimal}("15.00")\right) \lor \left(\text{Valid Offer or Coupon Applied}\right)$$

#### Invariant Rules Enforced:
1. **Merchandise Subtotal Basis**: The minimum €15.00 threshold is evaluated on the merchandise subtotal (sum of unit prices $\times$ quantity + modifiers), not on the final discounted total.
2. **Offer / Coupon Exemption**: If a customer cart has €16.00 or €20.00 in merchandise, and a valid coupon discounts the payable total to €14.00, delivery **remains unlocked and available**.
3. **Fail-Closed Promotion Validation**: Invalid, expired, un-met minimum spend, or fabricated coupon codes do not trigger the exemption.
4. **Authoritative Server Enforcement**: The client cannot bypass this rule by tampering with request payloads (`delivery_fee`, `delivery_allowed`, etc.).

---

### 2. Implementation Summary

#### A. Backend Implementation
- **[`pricing_service.py`](file:///c:/Users/HP/Desktop/pattyproject/backend/app/services/pricing_service.py)**:
  - Defined `MINIMUM_DELIVERY_SUBTOTAL = Decimal("15.00")`.
  - Implemented `is_delivery_eligible_by_subtotal(subtotal: Decimal, has_valid_promotion: bool) -> Tuple[bool, Decimal]`.
  - `calculate_order_totals()` evaluates `is_delivery_subtotal_eligible`, `min_delivery_subtotal`, and `delivery_shortfall`.
- **[`orders.py`](file:///c:/Users/HP/Desktop/pattyproject/backend/app/api/endpoints/orders.py)**:
  - In `create_order()`, when `order_type == "DELIVERY"`, server verifies `totals["is_delivery_subtotal_eligible"]`.
  - If ineligible, rejects with HTTP 400 and structured JSON detail:
    ```json
    {
      "success": false,
      "code": "MINIMUM_DELIVERY_ORDER_REQUIRED",
      "message": "Minimum order value of €15.00 required for delivery. Add €1.00 more to qualify.",
      "min_threshold": 15.00,
      "current_subtotal": 14.00,
      "amount_needed": 1.00
    }
    ```

#### B. Frontend Implementation
- **[`cartStore.ts`](file:///c:/Users/HP/Desktop/pattyproject/frontend/customer/src/store/cartStore.ts)**:
  - Added `MIN_DELIVERY_SUBTOTAL = 15.00`, `isDeliverySubtotalEligible()`, and `getDeliveryShortfall()`.
  - `setOrderType('DELIVERY')` verifies both distance radius ($\le 2.0\text{ miles}$) and subtotal eligibility. Ineligible attempts fall back safely to `COLLECTION` with explanatory messaging.
- **[`CustomerCart.tsx`](file:///c:/Users/HP/Desktop/pattyproject/frontend/customer/src/pages/customer/CustomerCart.tsx)**:
  - Displays dynamic helper banner: `"Minimum delivery cart is €15.00 — Add €X.XX more"`.
  - Displays `"✓ Delivery unlocked via applied offer"` when promo discount brings total below €15.00.
- **[`CustomerCheckout.tsx`](file:///c:/Users/HP/Desktop/pattyproject/frontend/customer/src/pages/customer/CustomerCheckout.tsx)**:
  - Dynamically indicates threshold status on the Delivery selector card.
  - Blocks progression to payment step if cart subtotal is under €15.00 without promo.

---

### 3. Automated Test Verification (Tests 1 through 12)

Created dedicated test suite at [`backend/app/tests/test_delivery_minimum_rule.py`](file:///c:/Users/HP/Desktop/pattyproject/backend/app/tests/test_delivery_minimum_rule.py):

| Test Case | Scenario Description | Expected Outcome | Verification Status |
| :--- | :--- | :--- | :--- |
| **Unit 1** | Subtotal = €14.99, no promo | Ineligible, Shortfall = €0.01 | **PASSED** |
| **Unit 2** | Subtotal = €15.00, no promo | Eligible, Shortfall = €0.00 | **PASSED** |
| **Unit 3** | Subtotal = €15.01, no promo | Eligible, Shortfall = €0.00 | **PASSED** |
| **Unit 4** | Subtotal = €14.00, valid promo | Eligible via exemption | **PASSED** |
| **TEST 1** | Subtotal = €14.00, no offer/coupon | Delivery BLOCKED (HTTP 400) | **PASSED** |
| **TEST 2** | Subtotal = €14.99, no offer/coupon | Delivery BLOCKED (HTTP 400) | **PASSED** |
| **TEST 3** | Subtotal = €15.00, no offer/coupon | Delivery ALLOWED (HTTP 200) | **PASSED** |
| **TEST 4** | Subtotal = €15.01, no offer/coupon | Delivery ALLOWED (HTTP 200) | **PASSED** |
| **TEST 5** | Subtotal = €20.00, €6 coupon, Final = €14.00 | Delivery ALLOWED (HTTP 200) | **PASSED** |
| **TEST 6** | Subtotal = €16.00, €2 offer, Final = €14.00 | Delivery ALLOWED (HTTP 200) | **PASSED** |
| **TEST 7** | Subtotal = €14.99, invalid coupon code | Delivery BLOCKED (HTTP 400) | **PASSED** |
| **TEST 8** | Subtotal = €14.99, expired coupon | Delivery BLOCKED (HTTP 400) | **PASSED** |
| **TEST 9** | Subtotal < €15.00 without coupon | Recalculates & blocks delivery | **PASSED** |
| **TEST 10**| Subtotal €10, coupon requiring min €15 | Coupon rejected, delivery blocked | **PASSED** |
| **TEST 11**| Client tampers with delivery flags/fees | Backend independently rejects (HTTP 400) | **PASSED** |
| **TEST 12**| Subtotal exactly €15.00 boundary | Delivery ALLOWED (HTTP 200) | **PASSED** |

---

### 4. Full Regression Suite Results

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

================= 241 passed, 17 warnings in 74.57s (0:01:14) =================
```

---

### 5. Final Status Confirmation

- **Rule Definition**: Exact €15.00 boundary enforced using `Decimal("15.00")`.
- **Offer Exception**: Preserved for all valid promotions/coupons/rewards.
- **Obsolete €14.99**: Fully removed from business logic and asserted as failing boundary in test suite.
- **Database / Schema / Auth Integrity**: Untouched. Zero regressions across 241 backend tests and frontend production builds.

**FINAL STATUS: DELIVERY MINIMUM RULE IMPLEMENTED & VERIFIED**
