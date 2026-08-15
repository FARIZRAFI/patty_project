from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, CustomerCard
from app.api.endpoints.auth import get_current_user
from app.schemas.card import CardCreate, CardUpdate, CardResponse

router = APIRouter()

@router.get("/cards", response_model=List[CardResponse])
def get_user_cards(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all saved payment cards for the logged-in customer."""
    cards = db.query(CustomerCard).filter(CustomerCard.user_id == current_user.id).order_by(CustomerCard.is_default.desc(), CustomerCard.created_at.desc()).all()
    return cards

@router.post("/cards", response_model=CardResponse)
def create_card(
    request: CardCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save a new payment card for the logged-in customer."""
    existing_cards = db.query(CustomerCard).filter(CustomerCard.user_id == current_user.id).all()
    should_be_default = request.is_default or len(existing_cards) == 0

    if should_be_default:
        db.query(CustomerCard).filter(CustomerCard.user_id == current_user.id).update({"is_default": False})

    # Clean card number to extract last 4 digits
    clean_num = "".join(filter(str.isdigit, request.card_number))
    last4 = clean_num[-4:] if len(clean_num) >= 4 else "4242"

    new_card = CustomerCard(
        user_id=current_user.id,
        card_brand=request.card_brand or "Mastercard",
        last4=last4,
        cardholder_name=request.cardholder_name,
        expiry_month=request.expiry_month,
        expiry_year=request.expiry_year,
        is_default=should_be_default
    )
    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    return new_card

@router.put("/cards/{card_id}", response_model=CardResponse)
def update_card(
    card_id: str,
    request: CardUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a saved card for the logged-in customer."""
    card = db.query(CustomerCard).filter(
        CustomerCard.id == card_id,
        CustomerCard.user_id == current_user.id
    ).first()

    if not card:
        raise HTTPException(status_code=404, detail="Saved card not found")

    update_data = request.model_dump(exclude_unset=True)

    if update_data.get("is_default") is True:
        db.query(CustomerCard).filter(CustomerCard.user_id == current_user.id).update({"is_default": False})

    for key, value in update_data.items():
        setattr(card, key, value)

    db.commit()
    db.refresh(card)
    return card

@router.patch("/cards/{card_id}/default", response_model=CardResponse)
def set_default_card(
    card_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Set a specific saved card as default for the logged-in customer."""
    target_card = db.query(CustomerCard).filter(
        CustomerCard.id == card_id,
        CustomerCard.user_id == current_user.id
    ).first()

    if not target_card:
        raise HTTPException(status_code=404, detail="Saved card not found")

    db.query(CustomerCard).filter(CustomerCard.user_id == current_user.id).update({"is_default": False})
    target_card.is_default = True
    db.commit()
    db.refresh(target_card)
    return target_card

@router.delete("/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(
    card_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a saved card for the logged-in customer."""
    card = db.query(CustomerCard).filter(
        CustomerCard.id == card_id,
        CustomerCard.user_id == current_user.id
    ).first()

    if not card:
        raise HTTPException(status_code=404, detail="Saved card not found")

    was_default = card.is_default
    db.delete(card)
    db.commit()

    if was_default:
        remaining = db.query(CustomerCard).filter(CustomerCard.user_id == current_user.id).order_by(CustomerCard.created_at.desc()).first()
        if remaining:
            remaining.is_default = True
            db.commit()

    return None
