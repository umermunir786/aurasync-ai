from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS Settings (To allow frontend connections)
# If BACKEND_CORS_ORIGINS is ["*"], we can't use allow_credentials=True in standard FastAPI/Starlette
# So we handle that logic here
cors_origins = [str(origin).rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS] if settings.BACKEND_CORS_ORIGINS else []

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins else ["*"],
    allow_credentials=True if cors_origins and "*" not in cors_origins else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# All routes are included here
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "AuraSync Backend is running!"}
