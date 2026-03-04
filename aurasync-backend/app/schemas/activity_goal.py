from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

# Activity Schemas
class ActivityLogBase(BaseModel):
    activity_type: str
    duration_minutes: Optional[int] = None
    intensity: Optional[str] = None
    calories_burned: Optional[float] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    image_url: Optional[str] = None

class ActivityLogCreate(ActivityLogBase):
    pass

class ActivityLog(ActivityLogBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Goal Schemas
class UserGoalBase(BaseModel):
    goal_type: str
    target_value: float
    unit: str
    period: str

class UserGoalCreate(UserGoalBase):
    pass

class UserGoal(UserGoalBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
