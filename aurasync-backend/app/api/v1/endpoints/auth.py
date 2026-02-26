from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api import deps
from app.core import security
from app.core.config import settings

router = APIRouter()

@router.post("/login/access-token", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """OAuth2 compatible token login, get an access token for future requests"""
    user = crud.crud_user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/signup", response_model=schemas.user.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.user.UserCreate,
) -> Any:
    """Create new user by signup"""
    user = crud.crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this username already exists in the system.",
        )
    user = crud.crud_user.create(db, obj_in=user_in)
    # Initialize default health goals for the new user
    crud.crud_activity_goal.create_default_goals(db, user_id=user.id)
    return user

@router.post("/forgot-password", response_model=schemas.msg.Msg)
def forgot_password(
    *,
    db: Session = Depends(deps.get_db),
    req: schemas.user.ForgotPasswordRequest,
) -> Any:
    """Send OTP to user email (stub)"""
    user = crud.crud_user.get_by_email(db, email=req.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The user with this username does not exist in the system.",
        )
    otp = crud.crud_user.update_otp(db, db_obj=user)
    # Stub: print OTP to console instead of sending email
    print(f"DEBUG: OTP for {req.email} is {otp}")
    return {"msg": "Password recovery OTP sent"}

@router.post("/verify-otp", response_model=schemas.msg.Msg)
def verify_otp(
    *,
    db: Session = Depends(deps.get_db),
    req: schemas.user.VerifyOTPRequest,
) -> Any:
    """Verify OTP for password reset"""
    user = crud.crud_user.get_by_email(db, email=req.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    is_valid = crud.crud_user.verify_otp(db, db_obj=user, otp=req.otp)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    return {"msg": "OTP verified successfully"}

@router.post("/reset-password", response_model=schemas.msg.Msg)
def reset_password(
    *,
    db: Session = Depends(deps.get_db),
    req: schemas.user.ResetPasswordRequest,
) -> Any:
    """Reset password using OTP"""
    user = crud.crud_user.get_by_email(db, email=req.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    is_valid = crud.crud_user.verify_otp(db, db_obj=user, otp=req.otp)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    crud.crud_user.update_password(db, db_obj=user, password=req.new_password)
    return {"msg": "Password updated successfully"}
