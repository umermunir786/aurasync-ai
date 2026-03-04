from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

# Base Schema (Common fields)
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    full_name: Optional[str] = None
    onboarded: bool = False
    weight: Optional[int] = None
    height: Optional[int] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    subscription_tier: Optional[str] = "free"
    subscription_end_date: Optional[datetime] = None

class UserCreate(UserBase): # Create User (For signup)
    email: EmailStr
    password: str

class UserUpdate(UserBase): # Update User (For API requests)
    password: Optional[str] = None

class TokenPayload(BaseModel):
    sub: Optional[int] = None

class User(UserBase): # Return User (For API responses - no password!)
    id: int
    is_verified: bool
    
    model_config = ConfigDict(from_attributes=True)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str
