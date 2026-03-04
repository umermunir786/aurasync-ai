from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class WeightLogBase(BaseModel):
    weight: float

class WeightLogCreate(WeightLogBase):
    pass

class WeightLog(WeightLogBase):
    id: int
    user_id: int
    recorded_at: datetime

    class Config:
        from_attributes = True
