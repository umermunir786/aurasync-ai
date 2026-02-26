from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AuraSync AI"
    API_V1_STR: str = "/api/v1"
    
    # CORS Origins (Should be a list of URLs or a comma separated string)
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    # Database
    DATABASE_URL: Optional[str] = "sqlite:///./sql_app.db"

    # Security
    SECRET_KEY: Optional[str] = None # Will be loaded from .env
    GEMINI_API_KEY: Optional[str] = None # Will be loaded from .env
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    model_config = SettingsConfigDict(
        env_file=".env", 
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
