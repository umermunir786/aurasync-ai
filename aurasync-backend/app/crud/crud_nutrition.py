from typing import List
from sqlalchemy.orm import Session
from app.models.nutrition import NutritionLog
from app.schemas.nutrition import NutritionLogCreate

def create_nutrition_log(db: Session, *, obj_in: NutritionLogCreate, user_id: int) -> NutritionLog:
    db_obj = NutritionLog(
        user_id=user_id,
        item_name=obj_in.item_name,
        calories=obj_in.calories,
        protein=obj_in.protein,
        carbs=obj_in.carbs,
        fat=obj_in.fat,
        confidence=obj_in.confidence
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_multi_by_user(db: Session, *, user_id: int, skip: int = 0, limit: int = 10) -> List[NutritionLog]:
    return db.query(NutritionLog).filter(NutritionLog.user_id == user_id).order_by(NutritionLog.created_at.desc()).offset(skip).limit(limit).all()
