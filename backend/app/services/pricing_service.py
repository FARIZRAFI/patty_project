from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.product import Product, ProductModifier
from app.models.promotion import Coupon
from app.models.loyalty import LoyaltyReward

def calculate_order_totals(
    db: Session,
    items: List[Dict[str, Any]],
    order_type: str = "DELIVERY",
    coupon_code: Optional[str] = None,
    redeem_reward_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Authoritative server-side price calculator.
    Recalculates product prices, add-on modifiers, coupons, delivery fees, and VAT.
    """
    subtotal = 0.0
    item_breakdown = []

    for item in items:
        product_id = item.get("product_id")
        quantity = max(1, int(item.get("quantity", 1)))
        
        product = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
        if not product:
            continue

        unit_price = product.base_price
        modifier_details = []

        # Add modifier costs
        selected_mods = item.get("selected_modifiers", [])
        for mod_input in selected_mods:
            mod_name = mod_input.get("name") if isinstance(mod_input, dict) else str(mod_input)
            db_mod = db.query(ProductModifier).filter(
                ProductModifier.product_id == product.id,
                ProductModifier.name == mod_name,
                ProductModifier.is_active == True
            ).first()
            if db_mod:
                unit_price += db_mod.price
                modifier_details.append({"name": db_mod.name, "price": db_mod.price})
            else:
                modifier_details.append({"name": mod_name, "price": 0.0})

        line_total = round(unit_price * quantity, 2)
        subtotal += line_total

        item_breakdown.append({
            "product_id": product.id,
            "product_name": product.name,
            "quantity": quantity,
            "unit_price": round(unit_price, 2),
            "total_price": line_total,
            "selected_modifiers": modifier_details
        })

    subtotal = round(subtotal, 2)
    discount_amount = 0.0
    delivery_fee = 2.50 if order_type == "DELIVERY" else 0.0
    service_fee = 0.99 if subtotal > 0 else 0.0

    # Apply Coupon Discount if valid
    if coupon_code:
        coupon = db.query(Coupon).filter(
            Coupon.code == coupon_code.upper(),
            Coupon.is_active == True
        ).first()
        if coupon and subtotal >= coupon.min_order_value:
            if coupon.coupon_type == "PERCENTAGE":
                discount_amount = round(subtotal * (coupon.discount_value / 100.0), 2)
            elif coupon.coupon_type == "FIXED_AMOUNT":
                discount_amount = min(subtotal, coupon.discount_value)
            elif coupon.coupon_type == "FREE_SHIPPING":
                delivery_fee = 0.0

    # Apply Loyalty Reward Redemption if requested
    if redeem_reward_id:
        reward = db.query(LoyaltyReward).filter(LoyaltyReward.id == redeem_reward_id, LoyaltyReward.is_active == True).first()
        if reward and reward.reward_type == "FREE_ITEM" and reward.product_id:
            # Discount the price of one instance of the product
            target_prod = db.query(Product).filter(Product.id == reward.product_id).first()
            if target_prod:
                discount_amount += min(subtotal, target_prod.base_price)

    discount_amount = min(subtotal, round(discount_amount, 2))
    taxable_amount = max(0.0, subtotal - discount_amount)
    vat_amount = round(taxable_amount * 0.20, 2)  # Standard 20% UK VAT included calculation reference

    total_amount = round(max(0.0, subtotal - discount_amount + delivery_fee + service_fee), 2)
    points_earned = int(subtotal * 10)  # £1 = 10 points

    return {
        "subtotal": subtotal,
        "delivery_fee": delivery_fee,
        "service_fee": service_fee,
        "discount_amount": discount_amount,
        "vat_amount": vat_amount,
        "total_amount": total_amount,
        "points_earned": points_earned,
        "items": item_breakdown
    }
