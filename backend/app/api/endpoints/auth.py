import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.models.user import User, UserRole, CustomerAddress
from app.models.loyalty import LoyaltyAccount
from app.schemas.auth import (
    LoginRequest, RegisterRequest, SocialLoginRequest, Token, UserResponse,
    GoogleAuthRequest, GoogleNonceResponse, GoogleConfigResponse
)
from app.services.customer_service import create_customer_with_loyalty
from app.services.google_auth_service import (
    generate_nonce_and_state_token,
    consume_state_token,
    verify_google_id_token,
    authenticate_google_customer
)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None or not user.is_active:
        raise credentials_exception
    return user

oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def get_optional_current_user(token: str = Depends(oauth2_scheme_optional), db: Session = Depends(get_db)):
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id:
            return db.query(User).filter(User.id == user_id).first()
    except Exception:
        return None
    return None

def require_role(roles: list):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions for this action"
            )
        return current_user
    return role_checker


@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    email_clean = request.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user and "@" in email_clean:
        # Fallback search for dot-relaxed email variations (e.g., john.smith vs johnsmith)
        all_users = db.query(User).all()
        target_normalized = email_clean.replace(".", "")
        for u in all_users:
            if u.email.lower().replace(".", "") == target_normalized:
                user = u
                break

    if not user or not user.password_hash or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account disabled")

    branch_ids = [bu.branch_id for bu in user.branch_assignments]
    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        phone=user.phone,
        role=user.role,
        is_active=user.is_active,
        branch_ids=branch_ids
    )

    access_token = create_access_token(subject=user.id, roles=[user.role])
    return Token(access_token=access_token, user=user_resp)

@router.post("/register", response_model=Token)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email.strip().lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user, loyalty_acc = create_customer_with_loyalty(
        db=db,
        email=request.email,
        full_name=request.full_name,
        password_hash=get_password_hash(request.password),
        phone=request.phone,
        welcome_points=100
    )
    db.commit()
    db.refresh(user)

    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        phone=user.phone,
        role=user.role,
        is_active=user.is_active,
        branch_ids=[]
    )

    access_token = create_access_token(subject=user.id, roles=[user.role])
    return Token(access_token=access_token, user=user_resp)

@router.get("/google/config", response_model=GoogleConfigResponse)
def get_google_config():
    """
    Returns public Google OAuth Client ID for frontend GIS initialization.
    """
    return GoogleConfigResponse(client_id=settings.GOOGLE_CLIENT_ID)

@router.get("/google/nonce", response_model=GoogleNonceResponse)
def get_google_nonce():
    """
    Generates a cryptographically random nonce and signed state token for Google GIS authentication.
    """
    nonce, state_token = generate_nonce_and_state_token()
    return GoogleNonceResponse(nonce=nonce, state_token=state_token)

@router.post("/google", response_model=Token)
def google_auth(request: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Verifies Google ID Token cryptographically against Google public JWKS,
    validates nonce and replay state, resolves or creates the customer atomically,
    and returns a standard Patty JWT.
    """
    # Validate and consume state token across processes (Anti-Replay)
    expected_nonce = consume_state_token(db=db, state_token=request.state_token)

    # Cryptographically verify Google ID Token claims
    google_payload = verify_google_id_token(id_token=request.id_token, expected_nonce=expected_nonce)

    # Resolve existing customer or create new customer + loyalty + Google identity
    user = authenticate_google_customer(db=db, google_payload=google_payload)

    branch_ids = [bu.branch_id for bu in user.branch_assignments]
    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        phone=user.phone,
        role=user.role,
        is_active=user.is_active,
        branch_ids=branch_ids
    )

    access_token = create_access_token(subject=user.id, roles=[user.role])
    return Token(access_token=access_token, user=user_resp)

@router.post("/social-login", response_model=Token, deprecated=True)
def social_login(request: SocialLoginRequest, db: Session = Depends(get_db)):
    """
    Deprecated: Unverified social login endpoint disabled for security.
    Replaced by verified Google and Apple OAuth in upcoming release.
    """
    raise HTTPException(
        status_code=status.HTTP_410_GONE,
        detail="Unverified social login is deprecated and disabled for security. Verified Google and Apple authentication will be enabled in the next release."
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    branch_ids = [bu.branch_id for bu in current_user.branch_assignments]
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        phone=current_user.phone,
        role=current_user.role,
        is_active=current_user.is_active,
        branch_ids=branch_ids
    )
