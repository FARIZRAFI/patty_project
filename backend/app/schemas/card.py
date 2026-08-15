from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class CardBase(BaseModel):
    card_brand: str = "Mastercard"  # Mastercard, Visa, RuPay, Amex
    cardholder_name: str
    expiry_month: str
    expiry_year: str
    is_default: bool = False

class CardCreate(CardBase):
    card_number: str  # We extract last4 from card_number

class CardUpdate(BaseModel):
    card_brand: Optional[str] = None
    cardholder_name: Optional[str] = None
    expiry_month: Optional[str] = None
    expiry_year: Optional[str] = None
    is_default: Optional[bool] = None

class CardResponse(CardBase):
    id: str
    user_id: str
    last4: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
