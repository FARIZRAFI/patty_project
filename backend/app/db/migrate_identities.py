"""
Database Migration Script for Authentication Identities (Phase 3).

Safely introduces the 'user_auth_identities' table with dynamic pre- and post-migration
invariant validation to ensure complete zero data loss across users, loyalty accounts, and orders.
"""
import sys
import pathlib

# Ensure app package is accessible
backend_root = pathlib.Path(__file__).resolve().parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from sqlalchemy import inspect
from app.core.database import engine, Base, SessionLocal
from app.models.user import User, UserAuthIdentity
from app.models.loyalty import LoyaltyAccount
from app.models.order import Order


def run_migration(custom_engine=None):
    """
    Executes the migration to create 'user_auth_identities' table and validates invariants.
    """
    target_engine = custom_engine or engine
    db = SessionLocal(bind=target_engine)
    
    print("=== PATTY PHASE 3: AUTHENTICATION IDENTITY MIGRATION ===")
    
    try:
        # Step 1: Pre-migration dynamic state capture
        users_before = db.query(User).count()
        loyalty_before = db.query(LoyaltyAccount).count()
        orders_before = db.query(Order).count()
        
        user_ids_before = {u.id for u in db.query(User.id).all()}
        loyalty_user_ids_before = {la.user_id for la in db.query(LoyaltyAccount.user_id).all()}
        
        print(f"Pre-migration verification:")
        print(f"  - Users: {users_before}")
        print(f"  - Loyalty Accounts: {loyalty_before}")
        print(f"  - Orders: {orders_before}")

        # Step 2: Create 'user_auth_identities' table
        print("\nApplying schema changes: Creating 'user_auth_identities' table...")
        Base.metadata.create_all(bind=target_engine, tables=[UserAuthIdentity.__table__])

        # Step 3: Post-migration dynamic invariant verification
        users_after = db.query(User).count()
        loyalty_after = db.query(LoyaltyAccount).count()
        orders_after = db.query(Order).count()
        
        user_ids_after = {u.id for u in db.query(User.id).all()}
        loyalty_user_ids_after = {la.user_id for la in db.query(LoyaltyAccount.user_id).all()}

        print(f"\nPost-migration verification:")
        print(f"  - Users: {users_after} (Delta: {users_after - users_before})")
        print(f"  - Loyalty Accounts: {loyalty_after} (Delta: {loyalty_after - loyalty_before})")
        print(f"  - Orders: {orders_after} (Delta: {orders_after - orders_before})")

        # Invariant Assertions
        assert users_after == users_before, f"CRITICAL: User count changed from {users_before} to {users_after}!"
        assert loyalty_after == loyalty_before, f"CRITICAL: Loyalty count changed from {loyalty_before} to {loyalty_after}!"
        assert orders_after == orders_before, f"CRITICAL: Order count changed from {orders_before} to {orders_after}!"
        assert user_ids_after == user_ids_before, "CRITICAL: User IDs modified during migration!"
        assert loyalty_user_ids_after == loyalty_user_ids_before, "CRITICAL: Loyalty user relationships modified!"

        # Verify new table schema and index
        inspector = inspect(target_engine)
        tables = inspector.get_table_names()
        assert "user_auth_identities" in tables, "CRITICAL: 'user_auth_identities' table was not created!"
        
        columns = [col["name"] for col in inspector.get_columns("user_auth_identities")]
        expected_columns = ["id", "user_id", "provider", "provider_subject", "created_at", "updated_at"]
        for col in expected_columns:
            assert col in columns, f"CRITICAL: Missing expected column '{col}' in 'user_auth_identities'!"

        print("\n[SUCCESS] Migration completed safely with zero regressions.")
        return True
    finally:
        db.close()


def rollback_migration(custom_engine=None):
    """
    Rolls back the migration by dropping 'user_auth_identities' while verifying preservation of core data.
    """
    target_engine = custom_engine or engine
    db = SessionLocal(bind=target_engine)
    
    print("=== PATTY PHASE 3: ROLLING BACK AUTHENTICATION IDENTITY MIGRATION ===")
    
    try:
        users_before = db.query(User).count()
        loyalty_before = db.query(LoyaltyAccount).count()
        orders_before = db.query(Order).count()

        print("Dropping 'user_auth_identities' table...")
        UserAuthIdentity.__table__.drop(bind=target_engine, checkfirst=True)

        users_after = db.query(User).count()
        loyalty_after = db.query(LoyaltyAccount).count()
        orders_after = db.query(Order).count()

        assert users_after == users_before, "CRITICAL: Users affected during rollback!"
        assert loyalty_after == loyalty_before, "CRITICAL: Loyalty accounts affected during rollback!"
        assert orders_after == orders_before, "CRITICAL: Orders affected during rollback!"

        inspector = inspect(target_engine)
        assert "user_auth_identities" not in inspector.get_table_names(), "CRITICAL: Table still exists after rollback!"

        print("[SUCCESS] Rollback completed safely. Core data 100% intact.")
        return True
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "rollback":
        rollback_migration()
    else:
        run_migration()
