from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.order import Order, OrderStatus, PaymentStatus
from app.services.payment_service import payment_provider
from app.models.loyalty import LoyaltyAccount, LoyaltyTransaction

router = APIRouter()

@router.post("/create-session")
async def create_payment_session(order_id: str, db: Session = Depends(get_db)):
    """Initializes checkout session with pluggable Payment Provider."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    session_data = await payment_provider.create_payment_session(
        order_id=order.id,
        amount=order.total_amount,
        currency="GBP",
        customer_info={"name": order.customer_name, "email": order.customer_email}
    )

    order.payment_transaction_id = session_data.get("transaction_id")
    db.commit()

    return session_data

@router.post("/webhook")
async def payment_gateway_webhook(request: Request, db: Session = Depends(get_db)):
    """Idempotent Webhook Callback endpoint for Pluggable Payment Gateway."""
    raw_body = await request.body()
    headers = dict(request.headers)

    # Signature Validation
    is_valid = await payment_provider.verify_webhook_signature(headers, raw_body)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    payload = await request.json()
    order_id = payload.get("order_id")
    status_event = payload.get("status")  # e.g. "SUCCESS", "PAID"

    if order_id:
        order = db.query(Order).filter(Order.id == order_id).first()
        if order and order.status == OrderStatus.PENDING_PAYMENT:
            order.status = OrderStatus.PAID
            order.payment_status = PaymentStatus.PAID
            
            # Award loyalty points if customer account exists
            if order.customer_id:
                loyalty = db.query(LoyaltyAccount).filter(LoyaltyAccount.user_id == order.customer_id).first()
                if loyalty:
                    loyalty.available_points += order.points_earned
                    loyalty.lifetime_points += order.points_earned
                    tx = LoyaltyTransaction(
                        loyalty_account_id=loyalty.id,
                        order_id=order.id,
                        points=order.points_earned,
                        transaction_type="EARNED",
                        description=f"Points earned from Order {order.order_number}"
                    )
                    db.add(tx)

            db.commit()

    return {"status": "SUCCESS", "message": "Webhook processed idempotently"}
