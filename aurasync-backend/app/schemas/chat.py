from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class ChatMessageBase(BaseModel):
    role: str
    content: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: int
    user_id: int
    is_cleared: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ChatHistory(BaseModel):
    messages: List[ChatMessage]
