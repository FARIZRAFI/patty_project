import os, pathlib
from typing import List
from pydantic_settings import BaseSettings

BASE_DIR = pathlib.Path(__file__).resolve().parent.parent.parent
DB_PATH = BASE_DIR / "patty_project.db"

class Settings(BaseSettings):
    PROJECT_NAME: str = "Patty Project UK"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "PATTY_PROJECT_SUPER_SECRET_JWT_KEY_2026_UK_BURGER_PLATFORM_SECURE"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database (Absolute SQLite path for consistent dev database)
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*",
    ]

    class Config:
        case_sensitive = True

settings = Settings()
