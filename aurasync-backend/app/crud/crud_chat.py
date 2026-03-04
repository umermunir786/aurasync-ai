from typing import List
from sqlalchemy.orm import Session
from app.models.chat import ChatMessage
from app.schemas.chat import ChatMessageCreate

def create_chat_message(db: Session, *, obj_in: ChatMessageCreate, user_id: int) -> ChatMessage:
    db_obj = ChatMessage(
        content=obj_in.content,
        role=obj_in.role,
        user_id=user_id,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_chat_history(db: Session, *, user_id: int, limit: int = 50) -> List[ChatMessage]:
    return (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user_id, ChatMessage.is_cleared == False)
        .order_by(ChatMessage.created_at.asc())
        .limit(limit)
        .all()
    )

def clear_chat_history(db: Session, *, user_id: int) -> int:
    result = db.query(ChatMessage).filter(ChatMessage.user_id == user_id).update({"is_cleared": True})
    db.commit()
    return result
