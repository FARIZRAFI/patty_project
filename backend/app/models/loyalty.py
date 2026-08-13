import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class LoyaltyAccount(Base):
    __tablename__ = "loyalty_accounts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    available_points = Column(Integer, default=0)
    lifetime_points = Column(Integer, default=0)
    tier = Column(String(50), default="BRONZE")  # BRONZE, SILVER, GOLD, PLATINUM
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="loyalty_account")
    transactions = relationship("LoyaltyTransaction", back_populates="loyalty_account", cascade="all, delete-orphan")

class LoyaltyTransaction(Base):
    __tablename__ = "loyalty_transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    loyalty_account_id = Column(String(36), ForeignKey("loyalty_accounts.id"), nullable=False)
    order_id = Column(String(36), nullable=True)
    points = Column(Integer, nullable=False)  # +100 earned, -50 redeemed
    transaction_type = Column(String(50), nullable=False)  # EARNED, REDEEMED, EXPIRED, REVERSED
    description = Column(String(255), nullable=True)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    loyalty_account = relationship("LoyaltyAccount", back_populates="transactions")

class LoyaltyReward(Base):
    __tablename__ = "loyalty_rewards"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(100), nullable=False)  # e.g. Free Fries, Free Burger, Free Milkshake
    description = Column(String(255), nullable=True)
    points_required = Column(Integer, nullable=False)  # e.g. 500, 750, 1500
    reward_type = Column(String(50), nullable=False)  # FREE_ITEM, DISCOUNT_AMOUNT
    discount_value = Column(Float, default=0.0)
    product_id = Column(String(36), nullable=True)
    is_active = Column(Boolean, default=True)
