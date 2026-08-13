import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Float, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Branch(Base):
    __tablename__ = "branches"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(10), unique=True, index=True, nullable=False)  # e.g. LC, LW
    name = Column(String(255), nullable=False)  # e.g. London - Central
    address_line1 = Column(String(255), nullable=False)
    postcode = Column(String(20), nullable=False)
    city = Column(String(100), default="London")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    phone = Column(String(50), nullable=True)
    
    # Store weekly opening hours JSON {"monday": {"open": "10:00", "close": "23:00"}, ...}
    opening_hours = Column(JSON, nullable=True)
    
    delivery_enabled = Column(Boolean, default=True)
    collection_enabled = Column(Boolean, default=True)
    ordering_enabled = Column(Boolean, default=True)  # Emergency order switch
    delivery_radius_miles = Column(Float, default=2.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    branch_users = relationship("BranchUser", back_populates="branch", cascade="all, delete-orphan")
    inventory_items = relationship("Inventory", back_populates="branch", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="branch")
    printers = relationship("Printer", back_populates="branch", cascade="all, delete-orphan")

class BranchUser(Base):
    __tablename__ = "branch_users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    branch_id = Column(String(36), ForeignKey("branches.id"), nullable=False)

    user = relationship("User", back_populates="branch_assignments")
    branch = relationship("Branch", back_populates="branch_users")

class CollectionSlot(Base):
    __tablename__ = "collection_slots"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    branch_id = Column(String(36), ForeignKey("branches.id"), nullable=False)
    slot_time = Column(DateTime, nullable=False, index=True)
    max_orders = Column(Integer, default=5)
    current_orders = Column(Integer, default=0)
    is_available = Column(Boolean, default=True)
