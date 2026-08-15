from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class AddressBase(BaseModel):
    label: str = "Home"  # Home, Work, Other
    address_line1: str
    address_line2: Optional[str] = None
    city: str = "London"
    postcode: str
    phone: Optional[str] = None
    is_default: bool = False

class AddressCreate(AddressBase):
    pass

class AddressUpdate(BaseModel):
    label: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    postcode: Optional[str] = None
    phone: Optional[str] = None
    is_default: Optional[bool] = None

class AddressResponse(AddressBase):
    id: str
    user_id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
