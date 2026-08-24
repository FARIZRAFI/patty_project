from typing import Optional, List
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str

class SocialLoginRequest(BaseModel):
    provider: str  # google, apple
    email: EmailStr
    full_name: Optional[str] = None
    provider_user_id: Optional[str] = None

class GoogleAuthRequest(BaseModel):
    id_token: str
    state_token: str

class GoogleNonceResponse(BaseModel):
    nonce: str
    state_token: str

class GoogleConfigResponse(BaseModel):
    client_id: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    branch_ids: List[str] = []

    class Config:
        from_attributes = True

Token.model_rebuild()
