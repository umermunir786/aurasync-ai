from typing import Optional, Any
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import string

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

def get_by_email(db: Session, *, email: str) -> Optional[User]:
    """Fetch a user from the database by their email"""
    return db.query(User).filter(User.email == email).first()

def create(db: Session, *, obj_in: UserCreate) -> User:
    """Create a new user in the database"""
    db_obj = User(
        email=obj_in.email,
        hashed_password=get_password_hash(obj_in.password),
        full_name=obj_in.full_name,
        is_superuser=obj_in.is_superuser,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def authenticate(db: Session, *, email: str, password: str) -> Optional[User]:
    """Authenticate a user by checking email and password hash"""
    user = get_by_email(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def update_otp(db: Session, *, db_obj: User) -> str:
    """Generate and update OTP for a user"""
    otp = "".join(random.choices(string.digits, k=6))
    db_obj.otp = otp
    db_obj.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return otp

def verify_otp(db: Session, *, db_obj: User, otp: str) -> bool:
    """Verify if the OTP is valid and not expired"""
    if not db_obj.otp or db_obj.otp != otp:
        return False
    if not db_obj.otp_expires_at or db_obj.otp_expires_at < datetime.utcnow():
        return False
    return True

def update_password(db: Session, *, db_obj: User, password: str) -> User:
    """Update user password and clear OTP"""
    db_obj.hashed_password = get_password_hash(password)
    db_obj.otp = None
    db_obj.otp_expires_at = None
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update(db: Session, *, db_obj: User, obj_in: UserUpdate) -> User:
    """Update user data"""
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.dict(exclude_unset=True)
    
    for field in update_data:
        if hasattr(db_obj, field):
            setattr(db_obj, field, update_data[field])
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get(db: Session, id: Any) -> Optional[User]:
    """Fetch a user by ID"""
    return db.query(User).filter(User.id == id).first()
