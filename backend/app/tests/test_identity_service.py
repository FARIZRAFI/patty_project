"""
Identity Service Internal Primitives & Concurrency Test Suite (Phase 3).

Validates internal identity persistence, lookup, duplicate prevention, multi-provider mapping,
and concurrent creation race-condition handling.
"""
import pytest
from concurrent.futures import ThreadPoolExecutor
from sqlalchemy.exc import IntegrityError
from app.models.user import User, UserRole, AuthProvider, UserAuthIdentity
from app.services.identity_service import (
    create_identity_for_user,
    find_identity,
    find_user_identities,
    identity_exists,
    resolve_user_from_identity,
    IdentityConflictError,
    UserNotFoundError
)
from app.tests.db import TestingSessionLocal


def test_create_identity_success():
    """Verify safe internal creation of Google and Apple identity records."""
    db = TestingSessionLocal()
    user = User(
        email="identity.user@pattyproject.co.uk",
        full_name="Identity User",
        role=UserRole.CUSTOMER,
        is_active=True
    )
    db.add(user)
    db.commit()

    # Create Google identity
    ident = create_identity_for_user(
        db=db,
        user_id=user.id,
        provider=AuthProvider.GOOGLE,
        provider_subject="google_sub_1001"
    )
    db.commit()

    assert ident.id is not None
    assert ident.user_id == user.id
    assert ident.provider == "GOOGLE"
    assert ident.provider_subject == "google_sub_1001"
    db.close()


def test_duplicate_identity_rejected_with_conflict_error():
    """Verify that creating duplicate (provider, provider_subject) raises IdentityConflictError."""
    db = TestingSessionLocal()
    user1 = User(email="user1@example.com", full_name="User 1", role=UserRole.CUSTOMER)
    user2 = User(email="user2@example.com", full_name="User 2", role=UserRole.CUSTOMER)
    db.add_all([user1, user2])
    db.commit()

    # User 1 registers Google subject "common_sub_999"
    create_identity_for_user(db, user1.id, "GOOGLE", "common_sub_999")
    db.commit()

    # Attempting to assign same Google subject "common_sub_999" to User 2 must fail
    with pytest.raises(IdentityConflictError):
        create_identity_for_user(db, user2.id, "GOOGLE", "common_sub_999")
        db.commit()
    
    db.close()


def test_user_can_have_multiple_provider_identities():
    """Verify that a single user can have multiple distinct provider identities (e.g. Google and Apple)."""
    db = TestingSessionLocal()
    user = User(email="multi.provider@example.com", full_name="Multi Provider User", role=UserRole.CUSTOMER)
    db.add(user)
    db.commit()

    # Link Google and Apple
    create_identity_for_user(db, user.id, AuthProvider.GOOGLE, "g_sub_112233")
    create_identity_for_user(db, user.id, AuthProvider.APPLE, "a_sub_445566")
    db.commit()

    user_identities = find_user_identities(db, user.id)
    assert len(user_identities) == 2
    providers = {ident.provider for ident in user_identities}
    assert providers == {"GOOGLE", "APPLE"}
    db.close()


def test_identity_lookup_and_user_resolution():
    """Verify lookup and user resolution from provider identity."""
    db = TestingSessionLocal()
    user = User(email="lookup.test@example.com", full_name="Lookup User", role=UserRole.CUSTOMER)
    db.add(user)
    db.commit()

    create_identity_for_user(db, user.id, "GOOGLE", "lookup_sub_7788")
    db.commit()

    # Find identity (case insensitive provider)
    ident = find_identity(db, "google", "lookup_sub_7788")
    assert ident is not None
    assert ident.user_id == user.id

    # Check existence
    assert identity_exists(db, "GOOGLE", "lookup_sub_7788") is True
    assert identity_exists(db, "GOOGLE", "non_existent_sub") is False

    # Resolve user
    resolved_user = resolve_user_from_identity(db, "GOOGLE", "lookup_sub_7788")
    assert resolved_user is not None
    assert resolved_user.id == user.id
    assert resolved_user.email == "lookup.test@example.com"
    db.close()


def test_create_identity_for_non_existent_user_raises_user_not_found():
    """Verify attempting to create identity for invalid user_id raises UserNotFoundError."""
    db = TestingSessionLocal()
    with pytest.raises(UserNotFoundError):
        create_identity_for_user(db, "non-existent-uuid-999", "GOOGLE", "sub_xyz")
    db.close()


def test_concurrent_duplicate_identity_race_condition(tmp_path):
    """
    Verify concurrency handling: Simultaneous attempts to create the exact same
    (provider, provider_subject) across multiple threads results in exactly 1 persisted record.
    """
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from app.core.database import Base

    test_db_path = tmp_path / "concurrency_test.db"
    c_engine = create_engine(
        f"sqlite:///{test_db_path}",
        connect_args={"check_same_thread": False, "timeout": 30}
    )
    Base.metadata.create_all(bind=c_engine)
    CSession = sessionmaker(autocommit=False, autoflush=False, bind=c_engine)

    init_db = CSession()
    user_a = User(id="concurrency-user-a", email="concurrency.a@example.com", full_name="User A", role=UserRole.CUSTOMER)
    user_b = User(id="concurrency-user-b", email="concurrency.b@example.com", full_name="User B", role=UserRole.CUSTOMER)
    init_db.add_all([user_a, user_b])
    init_db.commit()
    init_db.close()

    target_provider = "GOOGLE"
    target_subject = "race_condition_sub_001"

    def attempt_create(uid):
        t_db = CSession()
        try:
            create_identity_for_user(t_db, uid, target_provider, target_subject)
            t_db.commit()
            return "SUCCESS"
        except (IdentityConflictError, IntegrityError):
            t_db.rollback()
            return "CONFLICT"
        except Exception:
            t_db.rollback()
            return "CONFLICT"
        finally:
            t_db.close()

    # Launch parallel attempts
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = [
            executor.submit(attempt_create, "concurrency-user-a"),
            executor.submit(attempt_create, "concurrency-user-b"),
            executor.submit(attempt_create, "concurrency-user-a"),
            executor.submit(attempt_create, "concurrency-user-b")
        ]
        results = [f.result() for f in futures]

    success_count = results.count("SUCCESS")
    assert success_count == 1, f"Expected exactly 1 success, got {success_count}. Results: {results}"

    # Verify final database state has exactly 1 row
    verify_db = CSession()
    rows = verify_db.query(UserAuthIdentity).filter(
        UserAuthIdentity.provider == target_provider,
        UserAuthIdentity.provider_subject == target_subject
    ).all()
    assert len(rows) == 1
    verify_db.close()
    c_engine.dispose()
