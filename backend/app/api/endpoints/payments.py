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
        if order and order.status in [OrderStatus.PENDING_PAYMENT, OrderStatus.INCOMING]:
            order.status = OrderStatus.INCOMING
            order.payment_status = PaymentStatus.PAID

            
            # Award loyalty points if customer account exists (matched by customer_id or email)
            from app.models.user import User
            user = None
            if order.customer_id:
                user = db.query(User).filter(User.id == order.customer_id).first()
            elif order.customer_email:
                user = db.query(User).filter(User.email == order.customer_email.strip().lower()).first()

            if user:
                loyalty = db.query(LoyaltyAccount).filter(LoyaltyAccount.user_id == user.id).first()
                if not loyalty:
                    loyalty = LoyaltyAccount(user_id=user.id, available_points=0, lifetime_points=0, tier="BRONZE")
                    db.add(loyalty)
                    db.flush()

                pts = order.points_earned if order.points_earned and order.points_earned > 0 else int(order.total_amount * 10)
                loyalty.available_points += pts
                loyalty.lifetime_points += pts

                # Auto-upgrade tier based on lifetime_points
                if loyalty.lifetime_points >= 5000:
                    loyalty.tier = "PLATINUM"
                elif loyalty.lifetime_points >= 2500:
                    loyalty.tier = "GOLD"
                elif loyalty.lifetime_points >= 1000:
                    loyalty.tier = "SILVER"
                else:
                    loyalty.tier = "BRONZE"

                tx = LoyaltyTransaction(
                    loyalty_account_id=loyalty.id,
                    order_id=order.id,
                    points=pts,
                    transaction_type="EARNED",
                    description=f"Points earned from Order {order.order_number}"
                )
                db.add(tx)

            db.commit()

    return {"status": "SUCCESS", "message": "Webhook processed idempotently"}
