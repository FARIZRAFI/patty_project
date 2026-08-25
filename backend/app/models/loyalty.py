import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class LoyaltyAccount(Base):
    __tablename__ = "loyalty_accounts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    available_points = Column(Integer, default=0)
    lifetime_points = Column(Integer, default=0)
    tier = Column(String(50), default="BRONZE")  # Preserved for backward-compat
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="loyalty_account")
    transactions = relationship("LoyaltyTransaction", back_populates="loyalty_account", cascade="all, delete-orphan")

class LoyaltyTransaction(Base):
    __tablename__ = "loyalty_transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    loyalty_account_id = Column(String(36), ForeignKey("loyalty_accounts.id"), nullable=False)
    order_id = Column(String(36), nullable=True)
    campaign_id = Column(String(36), nullable=True)
    admin_id = Column(String(36), nullable=True)
    admin_email = Column(String(255), nullable=True)
    points = Column(Integer, nullable=False)  # +100 earned, -4000 redeemed, etc.
    transaction_type = Column(String(50), nullable=False)  # EARN, REDEEM, REVERSE, REFUND_ADJUSTMENT, MANUAL_CREDIT, MANUAL_DEBIT, BONUS, DOUBLE_POINTS, TRIPLE_POINTS
    description = Column(String(255), nullable=True)
    resulting_balance = Column(Integer, nullable=True)
    metadata_json = Column(JSON, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    loyalty_account = relationship("LoyaltyAccount", back_populates="transactions")

class LoyaltyReward(Base):
    __tablename__ = "loyalty_rewards"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    points_required = Column(Integer, nullable=False)
    reward_type = Column(String(50), nullable=False)
    discount_value = Column(Float, default=0.0)
    product_id = Column(String(36), nullable=True)
    is_active = Column(Boolean, default=True)

class LoyaltyProgramConfig(Base):
    __tablename__ = "loyalty_program_configs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    is_enabled = Column(Boolean, default=True, nullable=False)
    earning_rate_pence_per_point = Column(Integer, default=1, nullable=False)  # 1p = 1 point
    points_per_pound_reward = Column(Integer, default=1000, nullable=False)   # 1000 points = £1
    min_redemption_points = Column(Integer, default=4000, nullable=False)    # 4000 points min (£4)
    redemption_increment_points = Column(Integer, default=1000, nullable=False) # 1000 point increments (£1)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    updated_by = Column(String(255), nullable=True)

class LoyaltyCampaign(Base):
    __tablename__ = "loyalty_campaigns"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    campaign_type = Column(String(50), nullable=False, default="DOUBLE_POINTS")  # DOUBLE_POINTS, TRIPLE_POINTS, BONUS_POINTS, MULTIPLIER
    multiplier = Column(Float, default=2.0)
    bonus_points = Column(Integer, default=0)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    eligible_products = Column(JSON, nullable=True)    # list of product IDs, empty/None means all
    excluded_products = Column(JSON, nullable=True)    # list of product IDs
    eligible_categories = Column(JSON, nullable=True)  # list of category IDs, empty/None means all
    excluded_categories = Column(JSON, nullable=True)  # list of category IDs
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class LoyaltyMilestone(Base):
    __tablename__ = "loyalty_milestones"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)  # e.g. "First Redemption Milestone"
    points_required = Column(Integer, nullable=False, default=4000)
    reward_type = Column(String(50), nullable=False, default="REWARD_DISCOUNT")  # REWARD_DISCOUNT, FREE_ITEM
    reward_value = Column(Float, default=4.0)  # £4.00
    description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
