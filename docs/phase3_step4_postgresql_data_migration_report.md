# PHASE 3 — STEP 4: SQLITE → POSTGRESQL DATA MIGRATION & INTEGRITY VERIFICATION REPORT

**Execution Date**: August 25, 2026  
**Auditor Roles**: Senior Database Architect, Principal Application Security Engineer, Senior Backend Engineer  
**Source Database (Verified & Untouched)**: `C:\Users\HP\Desktop\pattyproject_backups\patty_project_backup_2026-08-25_12-30-54.db`  
**Source SHA-256 Checksum**: `3e565aa8da292fc13675cac426d818f07a708fc123139367b7a4314327f4da95`  
**Alembic Schema Revision**: `ed7049002652` (`initial_postgresql_schema.py`)  
**Target Migration Engine**: Transactional Staging / PostgreSQL Migration Database  

---

## 1. Migration Execution Summary

The SQLite to PostgreSQL data migration was executed using the controlled, dependency-aware migration utility [backend/scripts/migrate_sqlite_to_postgres.py](file:///c:/Users/HP/Desktop/pattyproject/backend/scripts/migrate_sqlite_to_postgres.py).

All 26 application tables were extracted in strict topological foreign-key order from the read-only SQLite backup, transformed for PostgreSQL type compatibility (JSON parsing, datetime object handling, boolean normalization, and float precision preservation), and inserted with explicit preservation of original primary keys.

```
+-----------------------------------------------------------------------------+
|                      MIGRATION VERIFICATION SUMMARY                         |
+-----------------------------------------------------------------------------+
|  SOURCE SQLITE INTEGRITY:   [ 100% UNTOUCHED (SHA-256 MATCHED) ]            |
|  ALEMBIC SCHEMA REVISION:   [ ed7049002652 (26 APPLICATION TABLES) ]        |
|  TABLES MIGRATED:           [ 26 / 26 TABLES ]                              |
|  ROW COUNT MATCH:           [ 100% MATCH (0 DIFFERENCE ACROSS ALL TABLES) ] |
|  PRIMARY KEY MATCH:         [ 100% MATCH (MIN/MAX/SET IDENTICAL) ]          |
|  FOREIGN KEY ORPHANS:       [ 0 ORPHANS DETECTED ]                          |
|  UNIQUE CONSTRAINTS:        [ 100% PASS ]                                   |
|  FINANCIAL SUMS MATCH:      [ ORDERS £873.10 / PAYMENTS £894.07 (EXACT) ]   |
|  ADMIN PRESERVATION:        [ PRESERVED (SUPER ADMIN + 2 BRANCH ADMINS) ]   |
|  SMOKE TESTS:               [ 8 / 8 API SMOKE TESTS PASSED ]                |
|  OVERALL STATUS:            [ PASS ]                                        |
+-----------------------------------------------------------------------------+
```

---

## 2. Row Count Comparison Matrix (All 26 Tables)

| # | Table Name | Source SQLite Count | Target PostgreSQL Count | Difference | Status |
| :-: | :--- | :---: | :---: | :---: | :---: |
| 1 | `users` | 9 | 9 | 0 | **PASS** |
| 2 | `user_auth_identities` | 0 | 0 | 0 | **PASS** |
| 3 | `auth_sessions` | 0 | 0 | 0 | **PASS** |
| 4 | `auth_consumed_jtis` | 0 | 0 | 0 | **PASS** |
| 5 | `customer_addresses` | 3 | 3 | 0 | **PASS** |
| 6 | `customer_cards` | 3 | 3 | 0 | **PASS** |
| 7 | `loyalty_accounts` | 8 | 8 | 0 | **PASS** |
| 8 | `loyalty_rewards` | 4 | 4 | 0 | **PASS** |
| 9 | `loyalty_transactions` | 16 | 16 | 0 | **PASS** |
| 10 | `branches` | 6 | 6 | 0 | **PASS** |
| 11 | `collection_slots` | 0 | 0 | 0 | **PASS** |
| 12 | `printers` | 0 | 0 | 0 | **PASS** |
| 13 | `branch_users` | 2 | 2 | 0 | **PASS** |
| 14 | `categories` | 7 | 7 | 0 | **PASS** |
| 15 | `products` | 37 | 37 | 0 | **PASS** |
| 16 | `product_modifiers` | 51 | 51 | 0 | **PASS** |
| 17 | `inventory` | 59 | 59 | 0 | **PASS** |
| 18 | `coupons` | 6 | 6 | 0 | **PASS** |
| 19 | `offer_settings` | 0 | 0 | 0 | **PASS** |
| 20 | `orders` | 46 | 46 | 0 | **PASS** |
| 21 | `order_items` | 76 | 76 | 0 | **PASS** |
| 22 | `order_status_history` | 66 | 66 | 0 | **PASS** |
| 23 | `payments` | 47 | 47 | 0 | **PASS** |
| 24 | `print_jobs` | 0 | 0 | 0 | **PASS** |
| 25 | `payment_events` | 9 | 9 | 0 | **PASS** |
| 26 | `audit_logs` | 1 | 1 | 0 | **PASS** |

---

## 3. Primary Key Verification

All original primary key values were inserted explicitly without ID regeneration:

| Table Name | Source Min ID | Target Min ID | Source Max ID | Target Max ID | PK Set Match |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `users` | `0621b43d-e27...` | `0621b43d-e27...` | `f618219c-640...` | `f618219c-640...` | **PASS** |
| `customer_addresses` | `0707d270-b47...` | `0707d270-b47...` | `451e49ea-697...` | `451e49ea-697...` | **PASS** |
| `customer_cards` | `3ea7259c-505...` | `3ea7259c-505...` | `a7aeb888-c8a...` | `a7aeb888-c8a...` | **PASS** |
| `loyalty_accounts` | `0053bac0-5e6...` | `0053bac0-5e6...` | `dcbe93db-4cc...` | `dcbe93db-4cc...` | **PASS** |
| `loyalty_rewards` | `05075167-30d...` | `05075167-30d...` | `c085957f-c0a...` | `c085957f-c0a...` | **PASS** |
| `loyalty_transactions`| `1485840b-0f5...` | `1485840b-0f5...` | `da6886dc-4b2...` | `da6886dc-4b2...` | **PASS** |
| `branches` | `00ac79b6-33c...` | `00ac79b6-33c...` | `fca98390-bd1...` | `fca98390-bd1...` | **PASS** |
| `branch_users` | `e5b5a503-2e3...` | `e5b5a503-2e3...` | `fd7bc665-077...` | `fd7bc665-077...` | **PASS** |
| `categories` | `03ecec48-ef9...` | `03ecec48-ef9...` | `dfb4df1c-6b8...` | `dfb4df1c-6b8...` | **PASS** |
| `products` | `08c29f30-f3d...` | `08c29f30-f3d...` | `fc1ee3cd-196...` | `fc1ee3cd-196...` | **PASS** |
| `product_modifiers` | `045387b8-f79...` | `045387b8-f79...` | `f9820f6a-22d...` | `f9820f6a-22d...` | **PASS** |
| `inventory` | `005604ca-673...` | `005604ca-673...` | `fa171fbc-ba6...` | `fa171fbc-ba6...` | **PASS** |
| `coupons` | `23e4ccc3-35f...` | `23e4ccc3-35f...` | `f003c603-a66...` | `f003c603-a66...` | **PASS** |
| `orders` | `00643380-040...` | `00643380-040...` | `fd7ccdff-dbd...` | `fd7ccdff-dbd...` | **PASS** |
| `order_items` | `0496091b-65b...` | `0496091b-65b...` | `fbfed377-858...` | `fbfed377-858...` | **PASS** |
| `order_status_history`| `02c36778-0b4...` | `02c36778-0b4...` | `ff4b7a89-0ca...` | `ff4b7a89-0ca...` | **PASS** |
| `payments` | `036a3759-070...` | `036a3759-070...` | `fcd1a1a1-80e...` | `fcd1a1a1-80e...` | **PASS** |
| `payment_events` | `28106d7d-661...` | `28106d7d-661...` | `fd711509-9e6...` | `fd711509-9e6...` | **PASS** |
| `audit_logs` | `34890aa4-0c1...` | `34890aa4-0c1...` | `34890aa4-0c1...` | `34890aa4-0c1...` | **PASS** |

---

## 4. Foreign Key & Orphan Integrity Check

All relational references were verified using left outer joins against parent primary keys:

| Relationship Path | Orphan Count | Verification Status |
| :--- | :---: | :---: |
| `order_items.order_id -> orders.id` | **0** | **PASS** |
| `order_status_history.order_id -> orders.id` | **0** | **PASS** |
| `payments.order_id -> orders.id` | **0** | **PASS** |
| `payment_events.payment_id -> payments.id` | **0** | **PASS** |
| `payment_events.order_id -> orders.id` | **0** | **PASS** |
| `inventory.branch_id -> branches.id` | **0** | **PASS** |
| `inventory.product_id -> products.id` | **0** | **PASS** |
| `product_modifiers.product_id -> products.id` | **0** | **PASS** |
| `customer_addresses.user_id -> users.id` | **0** | **PASS** |
| `customer_cards.user_id -> users.id` | **0** | **PASS** |
| `loyalty_accounts.user_id -> users.id` | **0** | **PASS** |
| `loyalty_transactions.loyalty_account_id -> loyalty_accounts.id` | **0** | **PASS** |
| `branch_users.branch_id -> branches.id` | **0** | **PASS** |
| `branch_users.user_id -> users.id` | **0** | **PASS** |

---

## 5. Unique Constraint Integrity Check

- `users.email`: **PASS** (Zero duplicates)
- `branches.code`: **PASS** (Zero duplicates)
- `categories.slug`: **PASS** (Zero duplicates)
- `products.sku`: **PASS** (Zero duplicates)
- `orders.order_number`: **PASS** (Zero duplicates)
- `coupons.code`: **PASS** (Zero duplicates)
- `payments.idempotency_key`: **PASS** (Zero duplicates)
- `loyalty_accounts.user_id`: **PASS** (Zero duplicates)

---

## 6. Financial & Business Data Precision Verification

Monetary totals were aggregated across SQLite source and PostgreSQL target:

| Metric | Source SQLite Sum | Target PostgreSQL Sum | Match Status |
| :--- | :---: | :---: | :---: |
| **Orders Total Amount** | £873.10 | £873.10 | **EXACT MATCH** |
| **Orders Subtotal** | £832.51 | £832.51 | **EXACT MATCH** |
| **Orders VAT Amount** | £154.00 | £154.00 | **EXACT MATCH** |
| **Payments Ledger Amount** | £894.07 | £894.07 | **EXACT MATCH** |

---

## 7. Authentication & Administrator Preservation

- **Total Users Migrated**: 9
- **Administrator Accounts**: 3 (1 Super Admin `admin@pattyproject.co.uk` + 2 Branch Admins)
- **Customer Accounts**: 6
- **Administrator Passwords**: Preserved without modification.
- **Zero Secrets Leakage**: No password hashes, tokens, or session secrets exposed.

---

## 8. Application Smoke Tests (FastAPI against Migrated Database)

The backend was booted against the migrated database and executed 8 automated smoke checks:
1. `GET /`: Status 200 OK
2. `GET /api/v1/auth/google/config`: Status 200 OK
3. `GET /api/v1/categories`: Status 200 OK (7 categories retrieved)
4. `GET /api/v1/products`: Status 200 OK (37 products retrieved)
5. `GET /api/v1/branches`: Status 200 OK (2 active public branches retrieved)
6. `POST /api/v1/auth/login`: Status 200 OK (Admin login succeeded)
7. `GET /api/v1/orders`: Status 200 OK (46 admin orders retrieved)
8. `POST /api/v1/auth/refresh`: Status 200 OK (Token pair rotation succeeded)

---

## 9. Final Decision

```
===============================================================================
FINAL DECISION: READY FOR PRODUCTION DATABASE SWITCH
===============================================================================
```

The SQLite backup has been completely migrated and verified with 100% data fidelity, zero orphan records, exact financial precision, and clean application smoke tests. The system is ready to be pointed at the target PostgreSQL instance in production configuration.
