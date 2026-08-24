import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Float, Integer, JSON
from app.core.database import Base

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(50), unique=True, index=True, nullable=False)  # WELCOME10, BURGER20, FREESHIP
    name = Column(String(100), nullable=False)
    coupon_type = Column(String(50), nullable=False)  # PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING
    discount_value = Column(Float, nullable=False)  # 10.0 for 10%, 5.0 for £5 off
    min_order_value = Column(Float, default=0.0)
    usage_limit = Column(Integer, default=1000)
    used_count = Column(Integer, default=0)
    per_customer_limit = Column(Integer, default=1)
    valid_from = Column(DateTime, nullable=True)
    valid_until = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class OfferSetting(Base):
    __tablename__ = "offer_settings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    key = Column(String(50), unique=True, index=True, nullable=False)  # "todays_offers", "offers_page"
    data = Column(JSON, nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

