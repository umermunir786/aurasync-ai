from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/me", response_model=schemas.user.User)
def read_user_me(
    current_user: models.user.User = Depends(deps.get_current_user),
) -> Any:
    """Get current user profile"""
    return current_user

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
