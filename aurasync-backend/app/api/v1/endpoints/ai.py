import base64
import json
import logging
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from google import genai
from google.genai import types
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app import crud, schemas, models
from app.core.config import settings
from app.api import deps
from app.crud import crud_nutrition, crud_activity_goal, crud_chat
from app.schemas import activity_goal as activity_goal_schemas
from app.schemas import chat as chat_schemas

router = APIRouter()

logger = logging.getLogger(__name__)

# Initialize GenAI Client
client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None

class FoodAnalysisResponse(BaseModel):
    item: str
    calories: float
    protein: float
    carbs: float
    fat: float
    confidence: float

class AnalysisRequest(BaseModel):
    image_base64: str

@router.post("/analyze-food", response_model=List[FoodAnalysisResponse])
def analyze_food(
    request: AnalysisRequest,
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    """
    Analyze food image using Gemini 1.5 Flash
    """
    if not client:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini API key not configured",
        )

    try:
        # Prepare the image
        image_data = base64.b64decode(request.image_base64)
        
        prompt = """
        Analyze this food image. Identify each distinct food item and provide an estimate for its calories, protein (g), carbs (g), and fat (g). 
        Return ONLY a JSON array of objects with keys: item, calories, protein, carbs, fat, confidence (0-1).
        Example: [{"item": "Apple", "calories": 95, "protein": 0.5, "carbs": 25, "fat": 0.3, "confidence": 0.95}]
        """

        response = client.models.generate_content(
            model='gemini-flash-latest',
            contents=[
                prompt,
                types.Part.from_bytes(data=image_data, mime_type='image/jpeg')
            ]
        )

        # Extract JSON from response
        content = response.text.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        analysis_results = json.loads(content)
        return analysis_results

    except Exception as e:
        logger.error(f"AI Analysis error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze image: {str(e)}",
        )

@router.post("/log-nutrition", response_model=schemas.nutrition.NutritionLog)
def log_nutrition(
    *,
    db: Session = Depends(deps.get_db),
    obj_in: schemas.nutrition.NutritionLogCreate,
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Save nutrition analysis to database
    """
    return crud_nutrition.create_nutrition_log(db, obj_in=obj_in, user_id=current_user.id)

@router.get("/recent-scans", response_model=List[schemas.nutrition.NutritionLog])
def get_recent_scans(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve user's recent nutrition scans
    """
    return crud_nutrition.get_multi_by_user(db, user_id=current_user.id)

# Activity Endpoints
@router.post("/log-activity", response_model=activity_goal_schemas.ActivityLog)
def log_activity(
    *,
    db: Session = Depends(deps.get_db),
    obj_in: activity_goal_schemas.ActivityLogCreate,
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Save activity log to database
    """
    return crud_activity_goal.create_activity_log(db, obj_in=obj_in, user_id=current_user.id)

@router.get("/recent-activities", response_model=List[activity_goal_schemas.ActivityLog])
def get_recent_activities(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve user's recent activity logs
    """
    return crud_activity_goal.get_activities_by_user(db, user_id=current_user.id)

# Goal Endpoints
@router.post("/upsert-goal", response_model=activity_goal_schemas.UserGoal)
def upsert_goal(
    *,
    db: Session = Depends(deps.get_db),
    obj_in: activity_goal_schemas.UserGoalCreate,
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Create or update a user goal
    """
    return crud_activity_goal.create_user_goal(db, obj_in=obj_in, user_id=current_user.id)

@router.get("/goals", response_model=List[activity_goal_schemas.UserGoal])
def get_goals(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve user's goals
    """
    return crud_activity_goal.get_goals_by_user(db, user_id=current_user.id)

# AI Recommendations Endpoint
@router.get("/recommendations")
def get_ai_recommendations(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Get personalized AI health recommendations based on user data
    """
    if not client:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini API key not configured",
        )

    # Fetch context data - optimized to take only what's necessary
    nutrition_history = crud_nutrition.get_multi_by_user(db, user_id=current_user.id, limit=3)
    activity_history = crud_activity_goal.get_activities_by_user(db, user_id=current_user.id, limit=3)
    goals = crud_activity_goal.get_goals_by_user(db, user_id=current_user.id)

    # Format data for prompt - more concise
    nutrition_str = ",".join([f"{n.item_name}({n.calories}kcal)" for n in nutrition_history])
    activity_str = ",".join([f"{a.activity_type}({a.duration_minutes}m)" for a in activity_history])
    goals_str = ",".join([f"{g.goal_type}:{g.target_value}{g.unit}" for g in goals])

    try:
        prompt = f"""
        Health Assistant. User Data:
        Nutrition: {nutrition_str or "None"}
        Activity: {activity_str or "None"}
        Goals: {goals_str or "None"}
        
        Return ONLY 3 personalized health advice strings in a JSON array.
        """
        response = client.models.generate_content(model='gemini-flash-latest', contents=prompt)
        content = response.text.strip()
        
        # Basic cleanup
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        recommendations = json.loads(content)
        return {"recommendations": recommendations}

    except Exception as e:
        logger.error(f"AI Recommendation error: {str(e)}")
        # Fallback if AI fails or returns invalid JSON
        return {"recommendations": [
            "Keep tracking your meals to get better insights.",
            "Stay hydrated and maintain a consistent sleep schedule.",
            "Try to hit your activity goals for the week."
        ]}

class ChatRequest(BaseModel):
    message: str

@router.get("/chat/history", response_model=List[chat_schemas.ChatMessage])
def get_chat_history(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve user's chat history (not cleared)
    """
    return crud_chat.get_chat_history(db, user_id=current_user.id)

@router.post("/chat/clear")
def clear_chat(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Clear chat history for the user (UI only)
    """
    crud_chat.clear_chat_history(db, user_id=current_user.id)
    return {"msg": "Chat history cleared"}

@router.post("/chat")
def chat_with_coach(
    request: ChatRequest,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Chat with the AI coach using user history for context
    """
    if not client:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini API key not configured",
        )

    # Save user message
    crud_chat.create_chat_message(
        db, 
        obj_in=chat_schemas.ChatMessageCreate(role="user", content=request.message),
        user_id=current_user.id
    )

    # Fetch context data for the chat (health metrics)
    nutrition_history = crud_nutrition.get_multi_by_user(db, user_id=current_user.id, limit=5)
    activity_history = crud_activity_goal.get_activities_by_user(db, user_id=current_user.id, limit=5)
    goals = crud_activity_goal.get_goals_by_user(db, user_id=current_user.id)

    # Fetch recent chat history for conversation context (including cleared for AI memory)
    # The user wants AI to "remember all chat", so we fetch recent history from DB.
    chat_history = db.query(models.chat.ChatMessage).filter(
        models.chat.ChatMessage.user_id == current_user.id
    ).order_by(models.chat.ChatMessage.created_at.desc()).limit(10).all()
    chat_history.reverse()

    # Format data more concisely
    context = f"""
    Context:
    Food(last3): {", ".join([f"{n.item_name}({n.calories}kcal)" for n in nutrition_history[:3]])}
    Acts(last3): {", ".join([f"{a.activity_type}({a.duration_minutes}m)" for a in activity_history[:3]])}
    Goals: {", ".join([f"{g.goal_type}:{g.target_value}{g.unit}" for g in goals])}
    
    ChatHistory:
    {chr(10).join([f"{m.role}:{m.content}" for m in chat_history])}
    """

    try:
        prompt = f"""
        You are AuraSync AI, a friendly and highly knowledgeable health coach. 
        Use the following user data and previous conversation to provide specific, encouraging advice.
        
        {context}
        
        User's question: {request.message}
        """
        response = client.models.generate_content(model='gemini-flash-latest', contents=prompt)
        bot_reply = response.text.strip()

        # Save assistant response
        crud_chat.create_chat_message(
            db, 
            obj_in=chat_schemas.ChatMessageCreate(role="assistant", content=bot_reply),
            user_id=current_user.id
        )

        return {"reply": bot_reply}

    except Exception as e:
        logger.error(f"AI Chat error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to chat: {str(e)}",
        )

@router.post("/chat/recommendation")
def save_recommendation_as_message(
    *,
    db: Session = Depends(deps.get_db),
    recommendation: str,
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Save a recommendation as an AI message in the chat history
    """
    crud_chat.create_chat_message(
        db, 
        obj_in=chat_schemas.ChatMessageCreate(role="assistant", content=recommendation),
        user_id=current_user.id
    )
    return {"msg": "Recommendation saved to chat"}

@router.delete("/reset-data")
def reset_user_data(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    Clear all health-related data for the user (nutrition, activities, goals)
    """
    try:
        # Delete nutrition logs
        db.query(models.nutrition.NutritionLog).filter(
            models.nutrition.NutritionLog.user_id == current_user.id
        ).delete()
        
        # Delete activity logs
        db.query(models.activity_goal.ActivityLog).filter(
            models.activity_goal.ActivityLog.user_id == current_user.id
        ).delete()
        
        # Delete user goals
        db.query(models.activity_goal.UserGoal).filter(
            models.activity_goal.UserGoal.user_id == current_user.id
        ).delete()
        
        db.commit()
        return {"msg": "All health data has been reset successfully"}
    except Exception as e:
        db.rollback()
        logger.error(f"Data reset error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reset data: {str(e)}",
        )
