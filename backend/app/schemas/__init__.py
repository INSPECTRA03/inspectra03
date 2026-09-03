from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models import UrgencyEnum, PriorityEnum, StatusEnum

# Location
class LocationSchema(BaseModel):
    state: str
    district: str
    city: str

# CSR Need
class CSRNeedBase(BaseModel):
    category: str
    description: str
    beneficiary_type: str
    beneficiary_count: int
    urgency: UrgencyEnum
    priority: Optional[PriorityEnum] = None
    priority_score: Optional[int] = None
    priority_reason: Optional[str] = None
    status: StatusEnum = StatusEnum.NEED_IDENTIFIED

class CSRNeedCreate(CSRNeedBase):
    state: str
    district: str
    city_locality: str

class CSRNeedAnalysis(BaseModel):
    summary: Optional[str] = None
    identified_category: Optional[str] = None
    beneficiary_group: Optional[str] = None
    required_intervention: Optional[str] = None
    key_need: Optional[str] = None
    analysis: Optional[str] = None

class CSRNeedResponse(CSRNeedBase):
    id: int
    location: LocationSchema
    ai_analysis: Optional[CSRNeedAnalysis] = None
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class AnalyzeNeedRequest(BaseModel):
    csr_need_id: int

# NGO
class NGOBase(BaseModel):
    name: str
    description: str
    sectors: str
    locations: str
    beneficiary_types: str
    experience: str

class NGOResponse(NGOBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# CSR Project
class CSRProjectBase(BaseModel):
    company: str
    category: str
    location: str
    ngo: str
    description: str
    year: int

class CSRProjectResponse(CSRProjectBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Location
class LocationResponse(BaseModel):
    location_id: str
    state: str
    district: str
    city: str
    locality: str
