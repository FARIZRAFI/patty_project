from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field


class PaymentResponse(BaseModel):
    id: str
    order_id: str
    provider: str
    transaction_id: Optional[str] = None
    idempotency_key: Optional[str] = None
    amount: float
    currency: str = "GBP"
    status: str
    payment_method_type: Optional[str] = None
    raw_response: Optional[Dict[str, Any]] = None
    error_code: Optional[str] = None
    error_message: Optional[str] = None
    refunded_amount: float = 0.0
    created_at: Any
    updated_at: Any

    class Config:
        from_attributes = True


class PaymentSessionCreateRequest(BaseModel):
    order_id: str = Field(..., description="The ID of the order to create a payment session for")
    payment_method_type: Optional[str] = Field("CARD", description="Payment method type (CARD, APPLE_PAY, GOOGLE_PAY)")
    idempotency_key: Optional[str] = Field(None, description="Optional body idempotency key (header is preferred)")


class PaymentSessionResponse(BaseModel):
    provider: str
    order_id: str
    payment_id: str
    transaction_id: str
    amount: float
    currency: str = "GBP"
    status: str
    client_secret: Optional[str] = None
    payment_url: Optional[str] = None


class PaymentRefundRequest(BaseModel):
    amount: Optional[float] = None
    reason: Optional[str] = None


class PaymentWebhookPayload(BaseModel):
    order_id: Optional[str] = None
    transaction_id: Optional[str] = None
    status: str  # SUCCESS, PAID, FAILED, CANCELLED
    error_code: Optional[str] = None
    error_message: Optional[str] = None
    raw_event: Optional[Dict[str, Any]] = None
