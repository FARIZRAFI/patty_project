from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CouponCreateRequest(BaseModel):
    code: str
    name: str
    coupon_type: str  # PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING
    discount_value: float
    min_order_value: Optional[float] = 0.0
    usage_limit: Optional[int] = 1000
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    is_active: Optional[bool] = True

class CouponResponse(BaseModel):
    id: str
    code: str
    name: str
    coupon_type: str
    discount_value: float
    min_order_value: float
    usage_limit: int
    used_count: int
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
