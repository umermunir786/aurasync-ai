from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class ActivityLog(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    activity_type = Column(String, index=True) # e.g., Running, Cycling, Walking
    image_url = Column(String, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    intensity = Column(String, nullable=True) # e.g., Low, Medium, High
    calories_burned = Column(Float, nullable=True)
    quantity = Column(Float, nullable=True)
    unit = Column(String, nullable=True) # e.g., ml, oz, serving
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")

class UserGoal(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    goal_type = Column(String, index=True) # e.g., daily_calories, daily_protein, weekly_exercise
    target_value = Column(Float)
    unit = Column(String) # e.g., kcal, g, minutes
    period = Column(String) # e.g., daily, weekly
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")
