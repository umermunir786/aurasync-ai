from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.db.base_class import Base

class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)
    is_verified = Column(Boolean(), default=False)
    otp = Column(String, nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
    onboarded = Column(Boolean(), default=False)
    weight = Column(Integer, nullable=True) # in kg
    height = Column(Integer, nullable=True) # in cm
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    subscription_tier = Column(String, default="free")
    subscription_end_date = Column(DateTime, nullable=True)