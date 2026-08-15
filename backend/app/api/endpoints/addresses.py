from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, CustomerAddress
from app.api.endpoints.auth import get_current_user
from app.schemas.address import AddressCreate, AddressUpdate, AddressResponse

router = APIRouter()

@router.get("", response_model=List[AddressResponse])
@router.get("/", response_model=List[AddressResponse])
def get_user_addresses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all saved delivery addresses for the logged-in customer."""
    addresses = db.query(CustomerAddress).filter(CustomerAddress.user_id == current_user.id).order_by(CustomerAddress.is_default.desc(), CustomerAddress.created_at.desc()).all()
    return addresses

@router.post("", response_model=AddressResponse)
@router.post("/", response_model=AddressResponse)
def create_address(
    request: AddressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new delivery address for the logged-in customer."""
    existing_addresses = db.query(CustomerAddress).filter(CustomerAddress.user_id == current_user.id).all()
    
    # If this is the user's first address or marked as default, handle default flag
    should_be_default = request.is_default or len(existing_addresses) == 0

    if should_be_default:
        db.query(CustomerAddress).filter(CustomerAddress.user_id == current_user.id).update({"is_default": False})

    new_address = CustomerAddress(
        user_id=current_user.id,
        label=request.label,
        address_line1=request.address_line1,
        address_line2=request.address_line2,
        city=request.city,
        postcode=request.postcode,
        phone=request.phone or current_user.phone,
        is_default=should_be_default
    )
    db.add(new_address)
    db.commit()
    db.refresh(new_address)
    return new_address

@router.put("/{address_id}", response_model=AddressResponse)
def update_address(
    address_id: str,
    request: AddressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an existing delivery address for the logged-in customer."""
    address = db.query(CustomerAddress).filter(
        CustomerAddress.id == address_id,
        CustomerAddress.user_id == current_user.id
    ).first()

    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    update_data = request.model_dump(exclude_unset=True)

    if update_data.get("is_default") is True:
        db.query(CustomerAddress).filter(CustomerAddress.user_id == current_user.id).update({"is_default": False})

    for key, value in update_data.items():
        setattr(address, key, value)

    db.commit()
    db.refresh(address)
    return address

@router.patch("/{address_id}/default", response_model=AddressResponse)
def set_default_address(
    address_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Set a specific address as default for the logged-in customer."""
    target_address = db.query(CustomerAddress).filter(
        CustomerAddress.id == address_id,
        CustomerAddress.user_id == current_user.id
    ).first()

    if not target_address:
        raise HTTPException(status_code=404, detail="Address not found")

    # Clear previous defaults
    db.query(CustomerAddress).filter(CustomerAddress.user_id == current_user.id).update({"is_default": False})

    target_address.is_default = True
    db.commit()
    db.refresh(target_address)
    return target_address

@router.delete("/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_address(
    address_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a saved address for the logged-in customer."""
    address = db.query(CustomerAddress).filter(
        CustomerAddress.id == address_id,
        CustomerAddress.user_id == current_user.id
    ).first()

    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    was_default = address.is_default
    db.delete(address)
    db.commit()

    # If we deleted default, promote another address to default if any exist
    if was_default:
        remaining = db.query(CustomerAddress).filter(CustomerAddress.user_id == current_user.id).order_by(CustomerAddress.created_at.desc()).first()
        if remaining:
            remaining.is_default = True
            db.commit()

    return None
