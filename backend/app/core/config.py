from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Inspectra"
    DATABASE_URL: str
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
