from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class NutritionLogBase(BaseModel):
    item_name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    confidence: float

class NutritionLogCreate(NutritionLogBase):
    pass

class NutritionLogUpdate(NutritionLogBase):
    item_name: Optional[str] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None
    confidence: Optional[float] = None

class NutritionLog(NutritionLogBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
