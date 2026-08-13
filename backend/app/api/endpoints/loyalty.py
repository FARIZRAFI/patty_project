from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.loyalty import LoyaltyAccount, LoyaltyReward, LoyaltyTransaction
from app.api.endpoints.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/balance")
def get_loyalty_balance(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns loyalty point balance, tier, and transaction history for logged-in customer."""
    account = db.query(LoyaltyAccount).filter(LoyaltyAccount.user_id == current_user.id).first()
    if not account:
        account = LoyaltyAccount(user_id=current_user.id, available_points=100, lifetime_points=100)
        db.add(account)
        db.commit()
        db.refresh(account)

    rewards = db.query(LoyaltyReward).filter(LoyaltyReward.is_active == True).all()
    transactions = db.query(LoyaltyTransaction).filter(LoyaltyTransaction.loyalty_account_id == account.id).order_by(LoyaltyTransaction.created_at.desc()).limit(10).all()

    return {
        "available_points": account.available_points,
        "lifetime_points": account.lifetime_points,
        "tier": account.tier,
        "rewards": rewards,
        "transactions": transactions
    }
