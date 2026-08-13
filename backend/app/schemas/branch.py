from typing import Optional, Dict, Any
from pydantic import BaseModel

class BranchBase(BaseModel):
    code: str
    name: str
    address_line1: str
    postcode: str
    city: str = "London"
    latitude: float
    longitude: float
    phone: Optional[str] = None
    opening_hours: Optional[Dict[str, Any]] = None
    delivery_enabled: bool = True
    collection_enabled: bool = True
    ordering_enabled: bool = True
    delivery_radius_miles: float = 2.0
    is_active: bool = True

class BranchCreate(BranchBase):
    pass

class BranchResponse(BranchBase):
    id: str

    class Config:
        from_attributes = True

class NearestBranchRequest(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    postcode: Optional[str] = None

class NearestBranchResponse(BaseModel):
    assigned_branch: Optional[BranchResponse] = None
    distance_miles: Optional[float] = None
    status: str
    message: Optional[str] = None
