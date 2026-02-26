from app.db.base_class import Base
from app.db.session import engine
from app.models.nutrition import NutritionLog
from app.models.activity_goal import ActivityLog, UserGoal
from app.models.user import User

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully.")
