from pydantic import BaseModel, EmailStr, ConfigDict # Pydantic v2 way to handle SQLAlchemy models
from typing import Optional

# Base Schema (Common fields)
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    full_name: Optional[str] = None


class UserCreate(UserBase): # Create User (For signup)
    email: EmailStr
    password: str

class UserUpdate(UserBase): # Update User (For API requests)
    password: Optional[str] = None


class User(UserBase): # Return User (For API responses - no password!)
    id: int
    is_verified: bool
    

    model_config = ConfigDict(from_attributes=True)
