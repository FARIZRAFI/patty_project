"""
Internal Authentication Identity Service for Patty.

Provides safe persistence, resolution, and constraint enforcement for external
authentication identities (e.g., GOOGLE, APPLE).
All operations in this module are internal backend primitives designed to operate
strictly on already-verified identity data.
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.user import User, UserAuthIdentity, AuthProvider


class IdentityServiceError(Exception):
    """Base exception for Identity Service errors."""
    pass


class IdentityConflictError(IdentityServiceError):
    """Raised when an identity record already exists or violates uniqueness constraints."""
    pass


class IdentityNotFoundError(IdentityServiceError):
    """Raised when an identity record cannot be found."""
    pass


class UserNotFoundError(IdentityServiceError):
    """Raised when the target user does not exist."""
    pass


def find_identity(db: Session, provider: str, provider_subject: str) -> Optional[UserAuthIdentity]:
    """
    Look up an identity record by provider and stable provider_subject.
    
    :param db: Database session.
    :param provider: Identity provider string (e.g. 'GOOGLE', 'APPLE').
    :param provider_subject: Immutable provider subject ID.
    :return: UserAuthIdentity or None.
    """
    if not provider or not provider_subject:
        return None
    
    provider_clean = provider.strip().upper()
    subject_clean = str(provider_subject).strip()
    
    return db.query(UserAuthIdentity).filter(
        UserAuthIdentity.provider == provider_clean,
        UserAuthIdentity.provider_subject == subject_clean
    ).first()


def find_user_identities(db: Session, user_id: str) -> List[UserAuthIdentity]:
    """
    Retrieve all authentication identities associated with a user.
    
    :param db: Database session.
    :param user_id: Target user ID.
    :return: List of UserAuthIdentity instances.
    """
    if not user_id:
        return []
    return db.query(UserAuthIdentity).filter(UserAuthIdentity.user_id == user_id).all()


def identity_exists(db: Session, provider: str, provider_subject: str) -> bool:
    """
    Check whether an identity record already exists for a provider and subject.
    
    :param db: Database session.
    :param provider: Identity provider string.
    :param provider_subject: Immutable provider subject ID.
    :return: Boolean indicating existence.
    """
    return find_identity(db, provider, provider_subject) is not None


def resolve_user_from_identity(db: Session, provider: str, provider_subject: str) -> Optional[User]:
    """
    Resolve and return the Patty User corresponding to an external identity.
    
    :param db: Database session.
    :param provider: Identity provider string.
    :param provider_subject: Immutable provider subject ID.
    :return: User instance or None if not found or inactive.
    """
    identity = find_identity(db, provider, provider_subject)
    if not identity:
        return None
    return identity.user


def create_identity_for_user(
    db: Session,
    user_id: str,
    provider: str,
    provider_subject: str
) -> UserAuthIdentity:
    """
    Internal persistence primitive to associate a verified provider identity with a user.
    
    Enforces:
    1. Existence of target user.
    2. Database uniqueness of (provider, provider_subject).
    3. Proper transaction rollback and controlled domain exception on collision.
    
    :param db: Database session.
    :param user_id: ID of existing Patty user.
    :param provider: Identity provider string (e.g. 'GOOGLE', 'APPLE').
    :param provider_subject: Immutable provider subject ID.
    :return: Newly created UserAuthIdentity instance.
    :raises UserNotFoundError: If user_id does not exist.
    :raises IdentityConflictError: If (provider, provider_subject) already exists.
    """
    if not provider or not provider_subject:
        raise ValueError("Provider and provider_subject are required.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise UserNotFoundError(f"User with ID '{user_id}' does not exist.")

    provider_clean = provider.strip().upper()
    subject_clean = str(provider_subject).strip()

    # Pre-check existence for fast path conflict detection
    existing = find_identity(db, provider_clean, subject_clean)
    if existing:
        raise IdentityConflictError(
            f"Identity ({provider_clean}, {subject_clean}) is already registered."
        )

    auth_identity = UserAuthIdentity(
        user_id=user.id,
        provider=provider_clean,
        provider_subject=subject_clean
    )
    db.add(auth_identity)
    
    try:
        db.flush()
    except IntegrityError as exc:
        db.rollback()
        raise IdentityConflictError(
            f"Database conflict creating identity ({provider_clean}, {subject_clean}): {exc}"
        ) from exc

    return auth_identity
