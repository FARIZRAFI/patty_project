import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Printer(Base):
    __tablename__ = "printers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    branch_id = Column(String(36), ForeignKey("branches.id"), nullable=False)
    name = Column(String(100), nullable=False)  # e.g. Kitchen Thermal Printer 1
    ip_address = Column(String(50), nullable=True)
    paper_width_mm = Column(Integer, default=80)
    is_active = Column(Boolean, default=True)

    branch = relationship("Branch", back_populates="printers")
    print_jobs = relationship("PrintJob", back_populates="printer", cascade="all, delete-orphan")

class PrintJob(Base):
    __tablename__ = "print_jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    branch_id = Column(String(36), ForeignKey("branches.id"), nullable=False)
    printer_id = Column(String(36), ForeignKey("printers.id"), nullable=True)
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False)
    status = Column(String(50), default="PENDING")  # PENDING, PRINTED, FAILED
    attempts = Column(Integer, default=0)
    max_attempts = Column(Integer, default=5)
    payload_escpos = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    printed_at = Column(DateTime, nullable=True)

    printer = relationship("Printer", back_populates="print_jobs")
    order = relationship("Order", back_populates="print_jobs")
