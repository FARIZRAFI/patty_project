from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.promotion import Coupon

router = APIRouter()

@router.get("/validate")
def validate_coupon(code: str = Query(...), subtotal: float = Query(...), db: Session = Depends(get_db)):
    """Validates coupon code against current subtotal."""
    coupon = db.query(Coupon).filter(Coupon.code == code.strip().upper(), Coupon.is_active == True).first()
    if not coupon:
        raise HTTPException(status_code=400, detail="Invalid promo code")

    if subtotal < coupon.min_order_value:
        raise HTTPException(status_code=400, detail=f"Code requires minimum order of £{coupon.min_order_value:.2f}")

    if coupon.used_count >= coupon.usage_limit:
        raise HTTPException(status_code=400, detail="Coupon usage limit reached")

    discount = 0.0
    if coupon.coupon_type == "PERCENTAGE":
        discount = round(subtotal * (coupon.discount_value / 100.0), 2)
    elif coupon.coupon_type == "FIXED_AMOUNT":
        discount = min(subtotal, coupon.discount_value)

    return {
        "valid": True,
        "code": coupon.code,
        "coupon_type": coupon.coupon_type,
        "discount_value": coupon.discount_value,
        "calculated_discount": discount,
        "message": f"Applied {coupon.name} (-£{discount:.2f})"
    }
