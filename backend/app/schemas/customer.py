from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class AdminCustomerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    phone: Optional[str] = None
    orders: int = 0
    points: int = 0
    lifetime_points: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None


class AdminCustomerDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    phone: Optional[str] = None
    orders: int = 0
    points: int = 0
    lifetime_points: int = 0
    tier: str = "BRONZE"
    is_active: bool = True
    created_at: Optional[datetime] = None
    recent_orders: List[Dict[str, Any]] = []
    loyalty_transactions: List[Dict[str, Any]] = []
