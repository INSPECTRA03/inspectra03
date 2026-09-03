from app.db.database import Base
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Enum as SQLEnum, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum

class UrgencyEnum(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class PriorityEnum(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class StatusEnum(str, enum.Enum):
    NEED_IDENTIFIED = "NEED_IDENTIFIED"
    AI_ASSESSMENT = "AI_ASSESSMENT"
    NGO_MATCHING = "NGO_MATCHING"
    NGO_SHORTLISTED = "NGO_SHORTLISTED"
    PARTNERSHIP_DISCUSSION = "PARTNERSHIP_DISCUSSION"
    PROJECT_INITIATED = "PROJECT_INITIATED"
    COMPLETED = "COMPLETED"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class CSRNeed(Base):
    __tablename__ = "csr_needs"
    id = Column(Integer, primary_key=True, index=True)
    state = Column(String, index=True, nullable=False)
    district = Column(String, index=True, nullable=False)
    city_locality = Column(String, nullable=False)
    category = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    beneficiary_type = Column(String, nullable=False)
    beneficiary_count = Column(Integer, nullable=False)
    urgency = Column(SQLEnum(UrgencyEnum), nullable=False)
    priority = Column(SQLEnum(PriorityEnum), nullable=True)
    priority_score = Column(Integer, nullable=True)
    priority_reason = Column(Text, nullable=True)
    status = Column(SQLEnum(StatusEnum), index=True, default=StatusEnum.NEED_IDENTIFIED, nullable=False)
    
    # AI Analysis fields
    ai_summary = Column(Text, nullable=True)
    ai_identified_category = Column(String, nullable=True)
    ai_beneficiary_group = Column(String, nullable=True)
    ai_required_intervention = Column(String, nullable=True)
    ai_key_need = Column(String, nullable=True)
    ai_analysis = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint('beneficiary_count >= 0', name='check_beneficiary_count_positive'),
    )

    matches = relationship("Match", back_populates="csr_need")
    recommendations = relationship("Recommendation", back_populates="csr_need")
    status_history = relationship("StatusHistory", back_populates="csr_need")


class NGO(Base):
    __tablename__ = "ngos"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    sectors = Column(String, index=True, nullable=False) # e.g. "Education|Healthcare"
    locations = Column(String, index=True, nullable=False)
    beneficiary_types = Column(String, nullable=False)
    experience = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    matches = relationship("Match", back_populates="ngo")
    recommendations = relationship("Recommendation", back_populates="ngo")


class CSRProject(Base):
    __tablename__ = "csr_projects"
    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, nullable=False)
    category = Column(String, nullable=False)
    location = Column(String, nullable=False)
    ngo = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    year = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Match(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True, index=True)
    csr_need_id = Column(Integer, ForeignKey("csr_needs.id"), nullable=False)
    ngo_id = Column(Integer, ForeignKey("ngos.id"), nullable=False)
    match_score = Column(Float, nullable=False)
    sector_match = Column(Float, nullable=False)
    location_match = Column(Float, nullable=False)
    beneficiary_match = Column(Float, nullable=False)
    experience_match = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    csr_need = relationship("CSRNeed", back_populates="matches")
    ngo = relationship("NGO", back_populates="matches")
    recommendation = relationship("Recommendation", uselist=False, back_populates="match")


class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    csr_need_id = Column(Integer, ForeignKey("csr_needs.id"), nullable=False)
    ngo_id = Column(Integer, ForeignKey("ngos.id"), nullable=False)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=False)
    explanation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    csr_need = relationship("CSRNeed", back_populates="recommendations")
    ngo = relationship("NGO", back_populates="recommendations")
    match = relationship("Match", back_populates="recommendation")


class StatusHistory(Base):
    __tablename__ = "status_history"
    id = Column(Integer, primary_key=True, index=True)
    csr_need_id = Column(Integer, ForeignKey("csr_needs.id"), nullable=False)
    status = Column(SQLEnum(StatusEnum), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    csr_need = relationship("CSRNeed", back_populates="status_history")
