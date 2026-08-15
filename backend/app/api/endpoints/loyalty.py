import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.loyalty import LoyaltyAccount, LoyaltyReward, LoyaltyTransaction
from app.api.endpoints.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/balance")
def get_loyalty_balance(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns loyalty point balance, tier progress, rewards, and transaction history for logged-in customer."""
    account = db.query(LoyaltyAccount).filter(LoyaltyAccount.user_id == current_user.id).first()
    if not account:
        account = LoyaltyAccount(user_id=current_user.id, available_points=100, lifetime_points=100, tier="BRONZE")
        db.add(account)
        db.commit()
        db.refresh(account)

    # Recalculate tier based on lifetime_points
    if account.lifetime_points >= 5000:
        account.tier = "PLATINUM"
    elif account.lifetime_points >= 2500:
        account.tier = "GOLD"
    elif account.lifetime_points >= 1000:
        account.tier = "SILVER"
    else:
        account.tier = "BRONZE"
    db.commit()

    # Determine next milestone tier & progress calculation
    if account.lifetime_points < 1000:
        next_tier_name = "SILVER"
        next_tier_points = 1000
    elif account.lifetime_points < 2500:
        next_tier_name = "GOLD"
        next_tier_points = 2500
    elif account.lifetime_points < 5000:
        next_tier_name = "PLATINUM"
        next_tier_points = 5000
    else:
        next_tier_name = "PLATINUM"
        next_tier_points = 5000

    points_to_next_tier = max(0, next_tier_points - account.lifetime_points)
    progress_percent = min(100.0, round((account.lifetime_points / next_tier_points) * 100, 1))

    rewards = db.query(LoyaltyReward).filter(LoyaltyReward.is_active == True).order_by(LoyaltyReward.points_required.asc()).all()
    
    formatted_rewards = []
    for r in rewards:
        unlocked = account.available_points >= r.points_required
        points_needed = max(0, r.points_required - account.available_points)
        formatted_rewards.append({
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "points_required": r.points_required,
            "reward_type": r.reward_type,
            "discount_value": r.discount_value,
            "unlocked": unlocked,
            "points_needed": points_needed,
        })

    transactions = db.query(LoyaltyTransaction).filter(LoyaltyTransaction.loyalty_account_id == account.id).order_by(LoyaltyTransaction.created_at.desc()).limit(15).all()

    return {
        "available_points": account.available_points,
        "lifetime_points": account.lifetime_points,
        "tier": account.tier,
        "next_tier_name": next_tier_name,
        "next_tier_points": next_tier_points,
        "points_to_next_tier": points_to_next_tier,
        "progress_percent": progress_percent,
        "rewards": formatted_rewards,
        "transactions": transactions
    }

@router.post("/redeem")
def redeem_loyalty_reward(
    reward_id: str = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Redeems an unlocked milestone offer with loyalty points and returns a reward promo code."""
    account = db.query(LoyaltyAccount).filter(LoyaltyAccount.user_id == current_user.id).first()
    if not account:
        raise HTTPException(status_code=400, detail="Loyalty account not found")

    reward = db.query(LoyaltyReward).filter(LoyaltyReward.id == reward_id, LoyaltyReward.is_active == True).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Milestone reward not found")

    if account.available_points < reward.points_required:
        raise HTTPException(status_code=400, detail=f"Insufficient points. You need {reward.points_required} points for this offer.")

    # Deduct points
    account.available_points -= reward.points_required

    # Record redemption transaction
    tx = LoyaltyTransaction(
        loyalty_account_id=account.id,
        points=-reward.points_required,
        transaction_type="REDEEMED",
        description=f"Redeemed reward: {reward.title}"
    )
    db.add(tx)
    db.commit()

    promo_code = f"LOYALTY{random.randint(100, 999)}"

    return {
        "message": f"Successfully claimed '{reward.title}'!",
        "coupon_code": promo_code,
        "remaining_points": account.available_points,
        "reward_title": reward.title
    }
