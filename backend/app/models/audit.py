import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, JSON
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    actor_id = Column(String(36), nullable=False)
    actor_email = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False)  # TOGGLE_BRANCH_ORDERING, UPDATE_PRODUCT_PRICE, etc.
    resource = Column(String(100), nullable=False)
    resource_id = Column(String(36), nullable=True)
    diff_json = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
