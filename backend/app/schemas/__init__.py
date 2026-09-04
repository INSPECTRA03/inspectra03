from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Optional
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
    model_config = ConfigDict(from_attributes=True)

class AnalyzeNeedRequest(BaseModel):
    csr_need_id: int

# NGO

class NGODocumentBase(BaseModel):
    document_type: str
    file_name: str
    file_type: str
    file_size: int
    status: str

class NGODocumentResponse(NGODocumentBase):
    id: int
    ngo_id: int
    uploaded_at: datetime
    verified_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

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
    model_config = ConfigDict(from_attributes=True)

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
    model_config = ConfigDict(from_attributes=True)

# Location
class LocationResponse(BaseModel):
    location_id: str
    state: str
    district: str
    city: str
    locality: str

from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class MatchResponse(BaseModel):
    ngo_id: int
    ngo_name: str
    match_score: float
    sector_score: float
    location_score: float
    beneficiary_score: float
    experience_score: float

class MatchListResponse(BaseModel):
    csr_need_id: int
    matches: List[MatchResponse]


from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Optional, Any

class RecommendationExplanationSchema(BaseModel):
    summary: str
    why_match: List[str]
    strengths: List[str]
    considerations: List[str]
    confidence_note: str

class RecommendationResponse(BaseModel):
    id: int
    csr_need_id: int
    ngo_id: int
    match_id: int
    ngo_name: str
    match_score: float
    explanation: RecommendationExplanationSchema

    model_config = ConfigDict(from_attributes=True)

class RecommendationListResponse(BaseModel):
    csr_need_id: int
    recommendations: List[RecommendationResponse]


from datetime import datetime

class StatusHistoryResponse(BaseModel):
    id: int
    csr_need_id: int
    status: str
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

from typing import Dict, Any

class DashboardSummaryResponse(BaseModel):
    metrics: Dict[str, int]
    status_counts: Dict[str, int]
    priority_counts: Dict[str, int]
    recent_needs: List[CSRNeedResponse]

    model_config = ConfigDict(from_attributes=True)

