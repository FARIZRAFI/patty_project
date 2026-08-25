# Loyalty RBAC Security Hardening Report

**Project**: Patty Project  
**Date**: 2026-08-26  
**Status**: LOYALTY RBAC SECURITY HARDENING VERIFIED  
**Author**: Principal Security Engineer & Senior Full-Stack Engineer  

---

## 1. Original Vulnerabilities

| Vulnerability ID | Severity | Title | Description |
| :--- | :--- | :--- | :--- |
| **SEC-LOYALTY-01** | HIGH | Unauthenticated Guest Checkout Point Theft | In `POST /api/v1/orders`, when `current_user` was `None`, the backend looked up a customer profile by `request.customer_email` and allowed deducting loyalty points without cryptographic proof that the requester authenticated as or owned that account. |
| **SEC-LOYALTY-02** | MEDIUM | Global Customer PII & Loyalty Ledger Exposure to Branch Admins | `BRANCH_ADMIN` accounts had unbounded visibility into `GET /api/v1/customers` and `GET /api/v1/customers/{customer_id}`, allowing inspection of customer profiles, order histories, and full loyalty transaction ledgers outside their authorized branch scope. |
| **SEC-LOYALTY-03** | LOW | Frontend / Backend Customer Menu RBAC Mismatch | `AdminSidebar.tsx` marked the `Customers` navigation item as `superAdminOnly: true`, preventing Branch Admins from accessing the customer list even though backend RBAC permitted them. |
| **SEC-LOYALTY-04** | INFO | Missing Explicit Automated Tests for Loyalty RBAC Isolation | Test coverage lacked end-to-end negative test scenarios for guest redemption attacks, customer identity tampering, and branch-isolated customer/loyalty scoping. |

---

## 2. Root Causes

1. **Email-Based Authorization Fallback**: `create_order` in `orders.py` resolved `resolved_user` via `db.query(User).filter(User.email == request.customer_email)` if `current_user` was `None`. It then permitted loyalty redemption (`redeem_points > 0`) against that resolved user.
2. **Missing Relational Scope Filters**: `list_customers` and `get_customer_detail` in `customers.py` applied role checks for `[SUPER_ADMIN, BRANCH_ADMIN]`, but lacked query filters against `BranchUser` assignments to restrict `BRANCH_ADMIN` to branch-associated customers.
3. **Sidebar Flag Desynchronization**: The frontend sidebar menu definition erroneously restricted `Customers` exclusively to `SUPER_ADMIN`.

---

## 3. Authoritative Authorization Model

- **Identity Source**: All customer authorizations derive strictly from cryptographically verified JWT access tokens (`sub` claim maps to `User.id`).
- **Role Hierarchy**:
  - `SUPER_ADMIN`: Unbounded global administrative access across all stores, customers, products, and loyalty programs.
  - `BRANCH_ADMIN`: Access strictly scoped to physical branches assigned in `branch_users`.
  - `CUSTOMER`: Access strictly isolated to own user profile, own orders, and own loyalty account.
  - `GUEST` (Anonymous): Allowed standard ordering with `redeem_points == 0`. Strictly denied point redemption (`HTTP 401`).

---

## 4. Loyalty Redemption Authorization

In `backend/app/api/endpoints/orders.py`:
- When `request.redeem_points > 0`:
  1. `current_user` check: If `current_user is None`, immediately abort with `HTTP 401 Unauthorized`.
  2. Mismatch protection: If `request.customer_email` is supplied and does not match `current_user.email`, abort with `HTTP 403 Forbidden`.
  3. Authoritative resolution: `LoyaltyAccount` is retrieved strictly via `current_user.id`.
  4. Business rule verification: Minimum threshold (4,000 points), increment validation (1,000-point multiples), and balance verification (`available_points >= redeem_points`).
  5. Atomic deduction: Deduction via `validate_and_redeem_points` within the database transaction bound strictly to `current_user.id`.
- When `request.redeem_points == 0` or `None`:
  - Normal guest and authenticated checkouts proceed unimpeded.

---

## 5. Customer Branch Isolation

In `backend/app/api/endpoints/customers.py`:
- **`GET /api/v1/customers`**:
  - For `SUPER_ADMIN`: Returns all registered customers globally.
  - For `BRANCH_ADMIN`: Retrieves `assigned_branch_ids = [bu.branch_id for bu in current_user.branch_assignments]`. Queries only customers who have placed at least one order at an assigned branch (`Order.branch_id.in_(assigned_branch_ids)`).
  - Customer order counts are scoped exclusively to orders placed at the administrator's authorized branches.
- **`GET /api/v1/customers/{customer_id}`**:
  - For `SUPER_ADMIN`: Returns full customer profile.
  - For `BRANCH_ADMIN`: Checks if the customer has placed at least one order at the admin's assigned branches. If not, returns `HTTP 404 Not Found` (preventing ID enumeration).
  - Scopes `recent_orders` strictly to orders placed at the admin's assigned branches.

---

## 6. Loyalty Data Isolation

- **Customer Endpoints** (`GET /api/v1/loyalty/balance`, `GET /api/v1/loyalty/history`, `POST /api/v1/loyalty/redeem`):
  - Identity is derived strictly from JWT `current_user.id`. Any client-supplied `user_id`, `customer_id`, or `loyalty_account_id` is ignored.
- **Admin Customer Detail Endpoint** (`GET /api/v1/customers/{customer_id}`):
  - For `BRANCH_ADMIN`: `loyalty_transactions` are filtered to only show ledger entries associated with orders placed at the administrator's assigned branches (`LoyaltyTransaction.order_id.in_(branch_order_ids)`). Transactions from other stores remain completely hidden.
- **Admin Loyalty Configuration & CRUD Endpoints** (`/loyalty/admin/*`):
  - Strictly protected with `require_role([UserRole.SUPER_ADMIN])`. Requests by `BRANCH_ADMIN` or `CUSTOMER` receive `HTTP 403 Forbidden`.

---

## 7. Admin RBAC Behavior & Frontend Alignment

- `frontend/admin/src/components/admin/AdminSidebar.tsx`: `Customers` item made visible to `BRANCH_ADMIN`.
- `frontend/src/components/admin/AdminSidebar.tsx`: Synchronized with `frontend/admin`.
- Menu items for `Loyalty Points`, `Coupons`, and `Offers` remain `superAdminOnly: true`.

---

## 8. Files Changed

| File Path | Type | Summary of Changes |
| :--- | :--- | :--- |
| `backend/app/api/endpoints/orders.py` | Backend | Enforced authenticated session for `redeem_points > 0`, blocked guest point theft (401), blocked account mismatch (403), bound deduction to `current_user.id`. |
| `backend/app/api/endpoints/customers.py` | Backend | Scoped `list_customers` and `get_customer_detail` for `BRANCH_ADMIN` to assigned branches via `branch_users`; isolated loyalty transaction history to branch orders. |
| `frontend/admin/src/components/admin/AdminSidebar.tsx` | Frontend | Removed `superAdminOnly` restriction from `Customers` nav item. |
| `frontend/src/components/admin/AdminSidebar.tsx` | Frontend | Synchronized `Customers` nav item visibility. |
| `backend/app/tests/test_loyalty_rbac_security.py` | Test Suite | Added 41 comprehensive automated security test scenarios across Groups A through E. |

---

## 9. Database / Schema Impact

- **PostgreSQL Schema**: Zero structural alterations. No new migrations required.
- **Existing Balances**: Untouched.
- **Existing Invariants**: Preserved (1:1 `User` to `LoyaltyAccount`, foreign keys, atomicity).

---

## 10. Test Results

### Dedicated Loyalty RBAC Suite
Executed `pytest app/tests/test_loyalty_rbac_security.py -v`:
- **Total Tests**: 41
- **Passed**: 41
- **Failed**: 0
- **Time**: 44.80s

**Coverage by Group**:
- **Group A (Direct Loyalty Isolation)**: 9 tests (own balance, history, token authority, admin 403s, Super Admin 200).
- **Group B (Guest Redemption Security)**: 8 tests (guest checkout OK, guest redeem 401, own redeem 200, cross-user 403, email tampering 403, ID tampering, minimum threshold, step increments).
- **Group C (Customer Directory RBAC)**: 9 tests (customer 403, unauthenticated 401, Super Admin global, Branch Admin branch-scoped, cross-branch 404, query param bypass immunity).
- **Group D (Data Leakage & Ledger Privacy)**: 3 tests (no ledger leak on 404, branch-scoped order history, branch-scoped loyalty transactions).
- **Group E (Regression & Business Logic)**: 12 tests (earning on paid, reversal on refund, restoration on cancel, campaign multipliers, milestone public endpoint, Super Admin CRUD, expired/invalid tokens, branch search isolation, zero-order user scoping).

---

## 11. Regression Results

### Backend Full Suite
Executed `pytest app/tests -v`:
- **Total Tests**: 295
- **Passed**: 295
- **Failed**: 0
- **Duration**: 125.84s (0:02:05)

### Frontend Builds
- `frontend/admin`: `npm run build` -> **0 errors** (built in 7.23s)
- `frontend/customer`: `npm run build` -> **0 errors** (built in 20.05s)
- `frontend` (root): `npm run build` -> **0 errors** (built in 2.66s)

---

## 12. Remaining Risks

- None identified. All endpoints enforce server-side relational authorization; guest checkout operates without points; loyalty redemption is strictly authenticated and atomic.
