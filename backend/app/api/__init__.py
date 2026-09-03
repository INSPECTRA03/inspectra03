from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models import CSRNeed, NGO, CSRProject, StatusHistory, StatusEnum
from app.schemas import CSRNeedResponse, CSRNeedCreate, NGOResponse, CSRProjectResponse, LocationResponse, AnalyzeNeedRequest
import csv
import os

router = APIRouter()

def format_csr_need(need: CSRNeed) -> dict:
    return {
        "id": need.id,
        "location": {
            "state": need.state,
            "district": need.district,
            "city": need.city_locality
        },
        "category": need.category,
        "description": need.description,
        "beneficiary_type": need.beneficiary_type,
        "beneficiary_count": need.beneficiary_count,
        "urgency": need.urgency,
        "priority": need.priority,
        "priority_score": need.priority_score,
        "priority_reason": need.priority_reason,
        "status": need.status,
        "ai_analysis": {
            "summary": need.ai_summary,
            "identified_category": need.ai_identified_category,
            "beneficiary_group": need.ai_beneficiary_group,
            "required_intervention": need.ai_required_intervention,
            "key_need": need.ai_key_need,
            "analysis": need.ai_analysis
        } if need.ai_summary else None,
        "created_at": need.created_at,
        "updated_at": need.updated_at
    }

@router.post("/api/csr-needs", response_model=CSRNeedResponse, status_code=201)
def create_csr_need(need_in: CSRNeedCreate, db: Session = Depends(get_db)):
    db_need = CSRNeed(
        state=need_in.state,
        district=need_in.district,
        city_locality=need_in.city_locality,
        category=need_in.category,
        description=need_in.description,
        beneficiary_type=need_in.beneficiary_type,
        beneficiary_count=need_in.beneficiary_count,
        urgency=need_in.urgency
        # priority, status, created_at, updated_at are default
    )
    db.add(db_need)
    db.commit()
    db.refresh(db_need)
    
    # Also add StatusHistory
    status_hist = StatusHistory(csr_need_id=db_need.id, status=db_need.status)
    db.add(status_hist)
    db.commit()
    
    return format_csr_need(db_need)

@router.get("/api/csr-needs", response_model=List[CSRNeedResponse])
def get_csr_needs(db: Session = Depends(get_db)):
    needs = db.query(CSRNeed).all()
    return [format_csr_need(n) for n in needs]

@router.get("/api/csr-needs/{need_id}", response_model=CSRNeedResponse)
def get_csr_need(need_id: int, db: Session = Depends(get_db)):
    need = db.query(CSRNeed).filter(CSRNeed.id == need_id).first()
    if not need:
        raise HTTPException(status_code=404, detail="CSR Need not found")
    return format_csr_need(need)

@router.get("/api/ngos", response_model=List[NGOResponse])
def get_ngos(
    search: Optional[str] = None,
    sector: Optional[str] = None,
    location: Optional[str] = None,
    beneficiary_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    from sqlalchemy import or_
    query = db.query(NGO)
    if search:
        query = query.filter(or_(
            NGO.name.ilike(f"%{search}%"),
            NGO.description.ilike(f"%{search}%")
        ))
    if sector:
        query = query.filter(NGO.sectors.ilike(f"%{sector}%"))
    if location:
        query = query.filter(NGO.locations.ilike(f"%{location}%"))
    if beneficiary_type:
        query = query.filter(NGO.beneficiary_types.ilike(f"%{beneficiary_type}%"))
    return query.all()

@router.get("/api/ngos/{ngo_id}", response_model=NGOResponse)
def get_ngo(ngo_id: int, db: Session = Depends(get_db)):
    ngo = db.query(NGO).filter(NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    return ngo

@router.get("/api/csr-projects", response_model=List[CSRProjectResponse])
def get_csr_projects(ngo_name: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(CSRProject)
    if ngo_name:
        query = query.filter(CSRProject.ngo.ilike(f"%{ngo_name}%"))
    return query.all()

@router.get("/api/locations", response_model=List[LocationResponse])
def get_locations():
    # Read from data/locations.csv
    file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "data", "locations.csv")
    locations = []
    if os.path.exists(file_path):
        with open(file_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                locations.append(LocationResponse(**row))
    return locations

from app.services.gemini_service import analyze_csr_need

@router.post("/api/ai/analyze-need")
def analyze_need(req: AnalyzeNeedRequest, db: Session = Depends(get_db)):
    need = db.query(CSRNeed).filter(CSRNeed.id == req.csr_need_id).first()
    if not need:
        raise HTTPException(status_code=404, detail="CSR Need not found")
        
    csr_data = {
        "state": need.state,
        "district": need.district,
        "city_locality": need.city_locality,
        "category": need.category,
        "beneficiary_type": need.beneficiary_type,
        "beneficiary_count": need.beneficiary_count,
        "urgency": need.urgency,
        "description": need.description
    }
    
    try:
        analysis_result = analyze_csr_need(csr_data)
        
        need.ai_summary = analysis_result.get("summary")
        need.ai_identified_category = analysis_result.get("identified_category")
        need.ai_beneficiary_group = analysis_result.get("beneficiary_group")
        need.ai_required_intervention = analysis_result.get("required_intervention")
        need.ai_key_need = analysis_result.get("key_need")
        need.ai_analysis = analysis_result.get("analysis")
        
        # Update status
        if need.status == StatusEnum.NEED_IDENTIFIED:
            need.status = StatusEnum.AI_ASSESSMENT
            status_hist = StatusHistory(csr_need_id=need.id, status=need.status)
            db.add(status_hist)
            
        db.commit()
        db.refresh(need)
        
        return {
            "csr_need_id": need.id,
            "analysis": analysis_result
        }
          
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from app.services.priority_service import calculate_priority
from app.models import PriorityEnum

@router.post("/api/csr-needs/{need_id}/priority")
def assess_csr_priority(need_id: int, db: Session = Depends(get_db)):
    need = db.query(CSRNeed).filter(CSRNeed.id == need_id).first()
    if not need:
        raise HTTPException(status_code=404, detail="CSR Need not found")
        
    csr_data = {
        "urgency": need.urgency.name if need.urgency else "LOW",
        "beneficiary_count": need.beneficiary_count,
        "ai_summary": need.ai_summary
    }
    
    try:
        priority_result = calculate_priority(csr_data)
        
        need.priority_score = priority_result["priority_score"]
        need.priority_reason = priority_result["reason"]
        
        # safely parse to enum
        level = priority_result["priority"]
        if level == "HIGH":
            need.priority = PriorityEnum.HIGH
        elif level == "MEDIUM":
            need.priority = PriorityEnum.MEDIUM
        else:
            need.priority = PriorityEnum.LOW
            
        db.commit()
        db.refresh(need)
        
        return {
            "csr_need_id": need.id,
            "priority_score": need.priority_score,
            "priority": need.priority.name if need.priority else level,
            "reason": need.priority_reason
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


