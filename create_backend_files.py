import os

base_dir = r'C:\Users\balag\.gemini\antigravity\scratch\inspectra'

files = {
    'backend/app/main.py': '''from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(title="Inspectra API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Inspectra API is running"}
''',
    'backend/app/core/config.py': '''from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Inspectra"
    DATABASE_URL: str
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
''',
    'backend/app/db/database.py': '''from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
''',
    'backend/app/models/__init__.py': '''from app.db.database import Base
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from datetime import datetime, timezone

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)

class CSRNeed(Base):
    __tablename__ = "csr_needs"
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String)
    category = Column(String)
    description = Column(Text)
    beneficiary_type = Column(String)
    beneficiary_count = Column(Integer)
    urgency = Column(String)
    priority = Column(String)
    status = Column(String, default="NEED IDENTIFIED")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class NGO(Base):
    __tablename__ = "ngos"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    sectors = Column(String) # JSON or comma separated
    locations = Column(String)
    beneficiary_types = Column(String)
    experience = Column(String)
    projects = Column(String)

class Match(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True, index=True)
    csr_need_id = Column(Integer, ForeignKey("csr_needs.id"))
    ngo_id = Column(Integer, ForeignKey("ngos.id"))
    match_score = Column(Float)
    sector_match = Column(Float)
    location_match = Column(Float)
    beneficiary_match = Column(Float)
    experience_match = Column(Float)

class StatusHistory(Base):
    __tablename__ = "status_history"
    id = Column(Integer, primary_key=True, index=True)
    csr_need_id = Column(Integer, ForeignKey("csr_needs.id"))
    status = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class CSRProject(Base):
    __tablename__ = "csr_projects"
    id = Column(Integer, primary_key=True, index=True)
    csr_need_id = Column(Integer, ForeignKey("csr_needs.id"))
    ngo_id = Column(Integer, ForeignKey("ngos.id"))

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"))
    explanation = Column(Text)
''',
    'backend/.env.example': '''DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inspectra
GEMINI_API_KEY=your_gemini_api_key_here
''',
    'backend/.env': '''DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inspectra
GEMINI_API_KEY=mocked_key
''',
    'backend/app/__init__.py': '',
    'backend/app/api/__init__.py': '',
    'backend/app/core/__init__.py': '',
    'backend/app/schemas/__init__.py': '',
    'backend/app/services/__init__.py': '',
    'backend/app/db/__init__.py': '',
    '.env.example': '''# Inspectra Environment Variables
# Backend
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inspectra
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend
VITE_API_BASE_URL=http://localhost:8000
'''
}

for rel_path, content in files.items():
    path = os.path.join(base_dir, rel_path)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if not os.path.exists(path):
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
