import random, uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.order import Order, OrderItem, OrderStatusHistory, OrderStatus, OrderType, PaymentStatus
from app.models.branch import Branch
from app.schemas.order import OrderCreateRequest, OrderResponse, StatusUpdateRequest
from app.services.pricing_service import calculate_order_totals
from app.services.payment_service import payment_provider
from app.api.endpoints.auth import require_role, get_current_user, get_optional_current_user
from app.models.user import UserRole, User
from app.models.loyalty import LoyaltyAccount, LoyaltyTransaction

from app.services.branch_service import (
    find_nearest_eligible_branch,
    calculate_haversine_miles,
    resolve_postcode_lat_lng,
    MAX_DELIVERY_RADIUS_MILES
)

router = APIRouter()

@router.post("", response_model=OrderResponse)
@router.post("/", response_model=OrderResponse)
def create_order(
    request: OrderCreateRequest,
    db: Session = Depends(get_db)
):
    """
    Creates a new order with server-side pricing recalculation, inventory check, and initial PENDING_PAYMENT status.
    Mandatory backend enforcement of 2-mile delivery radius rule (<= 2.0 miles).
    """
    branch = db.query(Branch).filter(Branch.id == request.branch_id, Branch.is_active == True).first()
    if not branch:
        raise HTTPException(status_code=400, detail="Invalid branch selected")

    if not branch.ordering_enabled:
        raise HTTPException(status_code=400, detail=f"Ordering is currently disabled at {branch.name}.")

    # NON-NEGOTIABLE BACKEND ENFORCEMENT: 2-Mile Delivery Radius Validation
    branch_to_use = branch
    if request.order_type.upper() == "DELIVERY":
        lat = request.latitude
        lng = request.longitude
        pc = request.delivery_postcode

        if (lat is None or lng is None) and isinstance(request.delivery_address, dict):
            lat = request.delivery_address.get("latitude")
            lng = request.delivery_address.get("longitude")
            if not pc:
                pc = request.delivery_address.get("postcode")

        if (lat is None or lng is None) and pc:
            lat, lng = resolve_postcode_lat_lng(pc)

        dist_result = find_nearest_eligible_branch(db, lat=lat, lng=lng, postcode=pc)

        if not dist_result.get("is_delivery_eligible") or dist_result.get("status") != "SUCCESS":
            nearest_b = dist_result.get("nearest_branch") or branch
            dist_val = dist_result.get("distance_miles")
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "code": "DELIVERY_OUTSIDE_RADIUS",
                    "message": "WE PROVIDE DELIVERY UP TO 2 MILES ONLY",
                    "suggestion": "Please collect your food from the nearest store.",
                    "nearest_branch": {
                        "id": nearest_b.id if nearest_b else branch.id,
                        "name": nearest_b.name if nearest_b else branch.name,
                        "distance_miles": dist_val
                    }
                }
            )
        
        if dist_result.get("assigned_branch"):
            branch_to_use = dist_result.get("assigned_branch")

    # Calculate authoritative server totals
    items_input = [{"product_id": item.product_id, "quantity": item.quantity, "selected_modifiers": item.selected_modifiers} for item in request.items]
    totals = calculate_order_totals(
        db=db,
        items=items_input,
        order_type=request.order_type,
        coupon_code=request.coupon_code,
        redeem_reward_id=request.redeem_reward_id
    )

    if not totals["items"]:
        raise HTTPException(status_code=400, detail="Cart contains no valid items")

    order_num = f"#PP{random.randint(1000, 9999)}"

    order = Order(
        order_number=order_num,
        customer_name=request.customer_name,
        customer_email=request.customer_email.strip().lower(),
        customer_phone=request.customer_phone,
        branch_id=branch_to_use.id,
        order_type=request.order_type,
        status=OrderStatus.PENDING_PAYMENT,
        delivery_address=request.delivery_address,

        collection_slot_time=request.collection_slot_time,
        delivery_instructions=request.delivery_instructions,
        subtotal=totals["subtotal"],
        delivery_fee=totals["delivery_fee"],
        service_fee=totals["service_fee"],
        discount_amount=totals["discount_amount"],
        vat_amount=totals["vat_amount"],
        total_amount=totals["total_amount"],
        payment_method="Client Payment Gateway",
        payment_status=PaymentStatus.PENDING,
        coupon_code=request.coupon_code,
        points_earned=totals["points_earned"]
    )
    db.add(order)
    db.flush()

    for item_data in totals["items"]:
        oi = OrderItem(
            order_id=order.id,
            product_id=item_data["product_id"],
            product_name=item_data["product_name"],
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            total_price=item_data["total_price"],
            selected_modifiers=item_data["selected_modifiers"]
        )
        db.add(oi)

    history = OrderStatusHistory(
        order_id=order.id,
        from_status=None,
        to_status=OrderStatus.PENDING_PAYMENT,
        notes="Order created, awaiting payment gateway confirmation"
    )
    db.add(history)

    db.commit()
    db.refresh(order)
    return order

@router.get("/my-orders", response_model=List[OrderResponse])
def get_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Returns order history for the logged-in customer."""
    user_email = current_user.email.strip().lower()
    orders = db.query(Order).filter(
        (Order.customer_id == current_user.id) | (Order.customer_email == user_email)
    ).order_by(Order.created_at.desc()).all()
    return orders

@router.get("/{order_number}", response_model=OrderResponse)
def get_order_by_number(order_number: str, db: Session = Depends(get_db)):
    """Customer live status tracking for an order by order number."""
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("", response_model=List[OrderResponse])
@router.get("/", response_model=List[OrderResponse])
def list_admin_orders(
    branch_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    Branch-Isolated Admin Orders list.
    Branch Admins view orders for their assigned branches.
    """
    query = db.query(Order)

    # Branch Admin Isolation Security Check (if authenticated as branch admin)
    if current_user and current_user.role == UserRole.BRANCH_ADMIN:
        assigned_ids = [bu.branch_id for bu in current_user.branch_assignments]
        if branch_id and branch_id not in assigned_ids:
            raise HTTPException(status_code=403, detail="Access denied to this branch's orders")
        query = query.filter(Order.branch_id.in_(assigned_ids))
    elif branch_id and branch_id != "ALL":
        query = query.filter(Order.branch_id == branch_id)

    if status and status != "ALL":
        query = query.filter(Order.status == status)

    return query.order_by(Order.created_at.desc()).all()

@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    request: StatusUpdateRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Trigger order status transition with audit log."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Branch Admin Isolation check
    if current_user and current_user.role == UserRole.BRANCH_ADMIN:
        assigned_ids = [bu.branch_id for bu in current_user.branch_assignments]
        if order.branch_id not in assigned_ids:
            raise HTTPException(status_code=403, detail="Cannot manage order outside assigned branch")

    old_status = order.status
    new_status = request.status.upper()

    order.status = new_status
    if new_status in [OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED, OrderStatus.COLLECTED, OrderStatus.PAID]:
        order.payment_status = PaymentStatus.PAID

    history = OrderStatusHistory(
        order_id=order.id,
        user_id=current_user.id if current_user else None,
        from_status=old_status,
        to_status=new_status,
        notes=request.notes or f"Status updated to {new_status}" + (f" by {current_user.full_name}" if current_user else "")
    )
    db.add(history)

    db.commit()
    db.refresh(order)
    return order

