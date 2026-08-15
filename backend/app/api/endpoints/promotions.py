from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.promotion import Coupon
from app.schemas.promotion import CouponCreateRequest, CouponResponse

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

@router.get("/coupons", response_model=List[CouponResponse])
@router.get("", response_model=List[CouponResponse])
def get_coupons(db: Session = Depends(get_db)):
    """List all active coupons."""
    return db.query(Coupon).filter(Coupon.is_active == True).order_by(Coupon.created_at.desc()).all()

@router.post("/coupons", response_model=CouponResponse)
@router.post("", response_model=CouponResponse)
def create_coupon(request: CouponCreateRequest, db: Session = Depends(get_db)):
    """Create a new coupon."""
    clean_code = request.code.strip().upper()
    existing = db.query(Coupon).filter(Coupon.code == clean_code, Coupon.is_active == True).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Coupon code '{clean_code}' already exists.")

    new_coupon = Coupon(
        code=clean_code,
        name=request.name.strip(),
        coupon_type=request.coupon_type,
        discount_value=request.discount_value,
        min_order_value=request.min_order_value or 0.0,
        usage_limit=request.usage_limit or 1000,
        used_count=0,
        is_active=True
    )
    db.add(new_coupon)
    db.commit()
    db.refresh(new_coupon)
    return new_coupon

@router.delete("/coupons/{coupon_id}")
@router.delete("/{coupon_id}")
def delete_coupon(coupon_id: str, db: Session = Depends(get_db)):
    """Soft delete / deactivate a coupon."""
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found.")
    coupon.is_active = False
    db.commit()
    return {"message": "Coupon deleted successfully"}
