"""
Authentication Regression Test Suite (Phase 3).

Ensures existing Email + Password authentication, password hashing, JWT generation,
JWT validation, role checking, /auth/me, and legacy endpoint decommission remain 100% compliant.
"""
import pytest
from jose import jwt
from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.loyalty import LoyaltyAccount
from app.tests.db import client, TestingSessionLocal


def test_customer_registration_and_loyalty_account():
    """Verify that customer registration creates user and exactly one loyalty account with bonus."""
    db = TestingSessionLocal()
    reg_payload = {
        "full_name": "Alice Wonderland",
        "email": "alice.wonderland@example.com",
        "phone": "+44 7111 222333",
        "password": "SecurePassword123!"
    }
    
    response = client.post("/api/v1/auth/register", json=reg_payload)
    assert response.status_code == 200, response.text
    data = response.json()
    
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "alice.wonderland@example.com"
    assert data["user"]["role"] == UserRole.CUSTOMER

    # Verify database state
    user_in_db = db.query(User).filter(User.email == "alice.wonderland@example.com").first()
    assert user_in_db is not None
    assert user_in_db.full_name == "Alice Wonderland"
    
    # Verify loyalty account creation
    loyalty_acc = db.query(LoyaltyAccount).filter(LoyaltyAccount.user_id == user_in_db.id).first()
    assert loyalty_acc is not None
    assert loyalty_acc.available_points == 100
    assert loyalty_acc.lifetime_points == 100
    db.close()


def test_duplicate_email_registration_fails():
    """Verify that registering with an already existing email returns 400."""
    reg_payload = {
        "full_name": "Admin Clone",
        "email": "admin@pattyproject.co.uk",  # Already seeded
        "password": "Password123!"
    }
    response = client.post("/api/v1/auth/register", json=reg_payload)
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]


def test_successful_login_and_jwt_claims():
    """Verify login with correct credentials returns valid JWT with proper claims."""
    login_payload = {
        "email": "admin@pattyproject.co.uk",
        "password": "Admin123!"
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()
    
    token = data["access_token"]
    assert token is not None
    
    # Decode and verify JWT claims
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert payload["sub"] == "user-superadmin-001"
    assert UserRole.SUPER_ADMIN in payload["roles"]
    assert "exp" in payload


def test_login_with_incorrect_password():
    """Verify that wrong password returns 401 Unauthorized."""
    login_payload = {
        "email": "admin@pattyproject.co.uk",
        "password": "WrongPassword999!"
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_login_with_non_existent_email():
    """Verify login with non-existent email returns 401 Unauthorized."""
    login_payload = {
        "email": "does.not.exist@pattyproject.co.uk",
        "password": "SomePassword123!"
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 401


def test_login_fails_for_user_with_null_password_hash():
    """Verify defensive check: user with NULL password_hash cannot log in with password."""
    db = TestingSessionLocal()
    oauth_user = User(
        email="oauthonly@example.com",
        password_hash=None,
        full_name="OAuth Only User",
        role=UserRole.CUSTOMER,
        is_active=True
    )
    db.add(oauth_user)
    db.commit()
    db.close()

    response = client.post("/api/v1/auth/login", json={
        "email": "oauthonly@example.com",
        "password": "AnyPassword!"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_inactive_user_cannot_login():
    """Verify that disabled accounts cannot authenticate."""
    db = TestingSessionLocal()
    disabled_user = User(
        email="disabled@pattyproject.co.uk",
        password_hash=get_password_hash("Disabled123!"),
        full_name="Disabled User",
        role=UserRole.CUSTOMER,
        is_active=False
    )
    db.add(disabled_user)
    db.commit()
    db.close()

    response = client.post("/api/v1/auth/login", json={
        "email": "disabled@pattyproject.co.uk",
        "password": "Disabled123!"
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Account disabled"


def test_get_me_with_valid_token():
    """Verify GET /api/v1/auth/me returns the current user profile."""
    # Login first
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "admin@pattyproject.co.uk",
        "password": "Admin123!"
    })
    token = login_resp.json()["access_token"]

    response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    user_data = response.json()
    assert user_data["email"] == "admin@pattyproject.co.uk"
    assert user_data["role"] == UserRole.SUPER_ADMIN
    assert user_data["is_active"] is True


def test_get_me_with_invalid_token():
    """Verify GET /api/v1/auth/me rejects invalid bearer token."""
    response = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer invalid_token_xyz"})
    assert response.status_code == 401


def test_legacy_social_login_decommissioned_safely():
    """Verify that legacy unverified social-login endpoint returns 410 GONE and rejects spoofing."""
    spoof_payload = {
        "provider": "google",
        "email": "victim.account@example.com",
        "full_name": "Attacker Impersonator"
    }
    response = client.post("/api/v1/auth/social-login", json=spoof_payload)
    assert response.status_code == 410
    assert "Unverified social login is deprecated" in response.json()["detail"]
