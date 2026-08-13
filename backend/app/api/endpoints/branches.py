from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.branch import Branch
from app.schemas.branch import BranchResponse, NearestBranchRequest, NearestBranchResponse
from app.services.branch_service import find_nearest_eligible_branch
from app.api.endpoints.auth import require_role
from app.models.user import UserRole, User
from app.models.audit import AuditLog

router = APIRouter()

@router.get("/", response_model=List[BranchResponse])
def list_public_branches(db: Session = Depends(get_db)):
    """Returns active public branches."""
    return db.query(Branch).filter(Branch.is_active == True).all()

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
