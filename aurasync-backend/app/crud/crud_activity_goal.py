from typing import List
from sqlalchemy.orm import Session
from app.models.activity_goal import ActivityLog, UserGoal
from app.schemas.activity_goal import ActivityLogCreate, UserGoalCreate

# Activity CRUD
def create_activity_log(db: Session, *, obj_in: ActivityLogCreate, user_id: int) -> ActivityLog:
    db_obj = ActivityLog(
        user_id=user_id,
        activity_type=obj_in.activity_type,
        duration_minutes=obj_in.duration_minutes,
        intensity=obj_in.intensity,
        calories_burned=obj_in.calories_burned
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_activities_by_user(db: Session, *, user_id: int, skip: int = 0, limit: int = 10) -> List[ActivityLog]:
    return db.query(ActivityLog).filter(ActivityLog.user_id == user_id).order_by(ActivityLog.created_at.desc()).offset(skip).limit(limit).all()

# Goal CRUD
def create_user_goal(db: Session, *, obj_in: UserGoalCreate, user_id: int) -> UserGoal:
    db_obj = UserGoal(
        user_id=user_id,
        goal_type=obj_in.goal_type,
        target_value=obj_in.target_value,
        unit=obj_in.unit,
        period=obj_in.period
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_goals_by_user(db: Session, *, user_id: int) -> List[UserGoal]:
    return db.query(UserGoal).filter(UserGoal.user_id == user_id).all()
