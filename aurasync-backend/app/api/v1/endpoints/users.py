from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.schemas import weight as weight_schemas

router = APIRouter()

@router.get("/me", response_model=schemas.User)
def read_user_me(
    current_user: models.user.User = Depends(deps.get_current_user),
) -> Any:
    return current_user

@router.post("/weight", response_model=weight_schemas.WeightLog)
def log_weight(
    *,
    db: Session = Depends(deps.get_db),
    obj_in: weight_schemas.WeightLogCreate,
    current_user: models.user.User = Depends(deps.get_current_user),
) -> Any:
    """
    Log user's current weight.
    """
    # Update current user's weight field as well
    current_user.weight = obj_in.weight
    db.add(current_user)
    return crud.crud_weight.create_weight_log(db, obj_in=obj_in, user_id=current_user.id)

@router.get("/weight/history", response_model=List[weight_schemas.WeightLog])
def get_weight_history(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.user.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get weight history.
    """
    return crud.crud_weight.get_weight_history(db, user_id=current_user.id)

@router.patch("/me", response_model=schemas.user.User)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.user.UserUpdate,
    current_user: models.user.User = Depends(deps.get_current_user),
) -> Any:
    """Update current user profile"""
    user = crud.crud_user.update(db, db_obj=current_user, obj_in=user_in)
    return user
