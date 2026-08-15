from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.branch import Branch
from app.schemas.branch import BranchResponse, BranchCreate, NearestBranchRequest, NearestBranchResponse
from app.api.endpoints.auth import require_role
from app.models.user import UserRole, User
from app.services.branch_service import find_nearest_eligible_branch
from app.models.audit import AuditLog
import random

router = APIRouter()

@router.get("", response_model=List[BranchResponse])
@router.get("/", response_model=List[BranchResponse])
def list_public_branches(db: Session = Depends(get_db)):
    """Returns active public branches."""
    return db.query(Branch).filter(Branch.is_active == True).all()

@router.post("", response_model=BranchResponse)
@router.post("/", response_model=BranchResponse)
def create_branch(
    request: BranchCreate,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Super Admin create new branch."""
    code_val = request.code.upper().strip() if request.code else "".join([w[0] for w in request.name.split()][:2]).upper()
    if not code_val:
        code_val = f"B{random.randint(10, 99)}"

    if db.query(Branch).filter(Branch.code == code_val).first():
        code_val = f"{code_val}{random.randint(1, 9)}"

    branch = Branch(
        code=code_val,
        name=request.name.strip(),
        address_line1=request.address_line1.strip(),
        postcode=request.postcode.strip(),
        city=request.city or "London",
        latitude=request.latitude or 51.5074,
        longitude=request.longitude or -0.1278,
        phone=request.phone or "020 7946 0000",
        delivery_enabled=request.delivery_enabled,
        collection_enabled=request.collection_enabled,
        ordering_enabled=request.ordering_enabled,
        delivery_radius_miles=request.delivery_radius_miles or 2.0,
        is_active=True
    )
    db.add(branch)
    db.commit()
    db.refresh(branch)
    return branch

@router.post("/nearest", response_model=NearestBranchResponse)
def get_nearest_branch(request: NearestBranchRequest, db: Session = Depends(get_db)):
    """Determines nearest eligible branch using Haversine distance & delivery radius validation."""
    result = find_nearest_eligible_branch(
        db=db,
        lat=request.latitude,
        lng=request.longitude,
        postcode=request.postcode
    )
    return NearestBranchResponse(
        assigned_branch=result.get("assigned_branch"),
        distance_miles=result.get("distance_miles"),
        status=result.get("status"),
        message=result.get("message")
    )

@router.patch("/{branch_id}/toggle-ordering", response_model=BranchResponse)
def toggle_branch_ordering(
    branch_id: str,
    ordering_enabled: bool,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN])),
    db: Session = Depends(get_db)
):
    """Emergency ordering toggle for branch admin / super admin."""
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    # Branch Admin RBAC isolation check
    if current_user.role == UserRole.BRANCH_ADMIN:
        assigned_ids = [bu.branch_id for bu in current_user.branch_assignments]
        if branch_id not in assigned_ids:
            raise HTTPException(status_code=403, detail="You do not have permission to manage this branch")

    old_state = branch.ordering_enabled
    branch.ordering_enabled = ordering_enabled
    
    # Record Audit Log
    audit = AuditLog(
        actor_id=current_user.id,
        actor_email=current_user.email,
        action="TOGGLE_BRANCH_ORDERING",
        resource="branches",
        resource_id=branch.id,
        diff_json={"old_ordering_enabled": old_state, "new_ordering_enabled": ordering_enabled}
    )
    db.add(audit)
    db.commit()
    db.refresh(branch)
    return branch

@router.delete("/{branch_id}")
def delete_branch(
    branch_id: str,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN])),
    db: Session = Depends(get_db)
):
    """Super Admin delete branch."""
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    try:
        from app.models.branch import BranchUser
        db.query(BranchUser).filter(BranchUser.branch_id == branch_id).delete(synchronize_session=False)
        branch.is_active = False
        db.commit()
    except Exception:
        db.rollback()
        branch = db.query(Branch).filter(Branch.id == branch_id).first()
        if branch:
            branch.is_active = False
            db.commit()

    return {"message": "Branch deleted successfully", "id": branch_id}
