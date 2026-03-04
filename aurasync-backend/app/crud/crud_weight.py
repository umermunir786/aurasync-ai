from typing import List
from sqlalchemy.orm import Session
from app.models.weight import WeightLog
from app.schemas.weight import WeightLogCreate

def create_weight_log(db: Session, *, obj_in: WeightLogCreate, user_id: int) -> WeightLog:
    db_obj = WeightLog(
        weight=obj_in.weight,
        user_id=user_id,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_weight_history(db: Session, *, user_id: int, limit: int = 30) -> List[WeightLog]:
    return (
        db.query(WeightLog)
        .filter(WeightLog.user_id == user_id)
        .order_by(WeightLog.recorded_at.asc())
        .limit(limit)
        .all()
    )
