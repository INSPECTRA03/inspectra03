from fastapi.responses import FileResponse
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Response, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.db.database import get_db
from app.models import NGODocument, DocumentStatusEnum
import shutil
import uuid
import os
from app.models import CSRNeed, NGO, CSRProject, StatusHistory, StatusEnum
from app.schemas import MatchListResponse, RecommendationListResponse, CSRNeedResponse, StatusHistoryResponse, DashboardSummaryResponse, CSRNeedCreate, NGOResponse, CSRProjectResponse, LocationResponse, AnalyzeNeedRequest
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
from app.services.matching_service import generate_matches_for_csr_need, get_matches_for_csr_need
from app.services.recommendation_service import generate_recommendations_for_csr_need, get_recommendations_for_csr_need

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
            
        # Update status
        if need.status in [StatusEnum.NEED_IDENTIFIED, StatusEnum.AI_ASSESSMENT]:
            need.status = StatusEnum.PRIORITIZED
            status_hist = StatusHistory(csr_need_id=need.id, status=need.status)
            db.add(status_hist)
            
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



@router.post("/api/csr-needs/{csr_need_id}/matches", response_model=MatchListResponse)
def generate_matches(csr_need_id: int, db: Session = Depends(get_db)):
    result = generate_matches_for_csr_need(db, csr_need_id)
    if result is None:
        raise HTTPException(status_code=404, detail="CSR Need not found")
    return result


@router.get("/api/recommendations", response_model=List[Dict[str, Any]])
def get_all_recommendations(db: Session = Depends(get_db)):
    from app.models import Recommendation, Match
    import json
    
    recs = db.query(Recommendation).order_by(Recommendation.created_at.desc()).all()
    if not recs:
        return []
        
    matches = db.query(Match).filter(Match.id.in_([r.match_id for r in recs])).all()
    match_dict = {m.id: m for m in matches}
    
    results = []
    for r in recs:
        m = match_dict.get(r.match_id)
        if not m:
            continue
            
        ngo = m.ngo
        need = r.csr_need
        
        try:
            expl = json.loads(r.explanation)
        except:
            expl = {
                "summary": "Explanation unavailable.", 
                "why_match": [], "strengths": [], "considerations": [], "confidence_note": ""
            }
            
        results.append({
            "id": r.id,
            "csr_need_id": r.csr_need_id,
            "csr_need_category": need.ai_identified_category or need.category if need else "Unknown",
            "csr_need_location": f"{need.city_locality}, {need.district}" if need else "Unknown",
            "csr_need_status": getattr(need.status, 'name', need.status) if hasattr(need, 'status') else "",
            "ngo_id": r.ngo_id,
            "match_id": r.match_id,
            "ngo_name": ngo.name if ngo else "",
            "match_score": m.match_score,
            "explanation": expl
        })
    return results


@router.get("/api/csr-needs/{csr_need_id}/matches", response_model=MatchListResponse)
def get_matches(csr_need_id: int, db: Session = Depends(get_db)):
    result = get_matches_for_csr_need(db, csr_need_id)
    if result is None:
        raise HTTPException(status_code=404, detail="CSR Need not found")
    return result


@router.get("/api/recommendations", response_model=List[Dict[str, Any]])
def get_all_recommendations(db: Session = Depends(get_db)):
    from app.models import Recommendation, Match
    import json
    
    recs = db.query(Recommendation).order_by(Recommendation.created_at.desc()).all()
    if not recs:
        return []
        
    matches = db.query(Match).filter(Match.id.in_([r.match_id for r in recs])).all()
    match_dict = {m.id: m for m in matches}
    
    results = []
    for r in recs:
        m = match_dict.get(r.match_id)
        if not m:
            continue
            
        ngo = m.ngo
        need = r.csr_need
        
        try:
            expl = json.loads(r.explanation)
        except:
            expl = {
                "summary": "Explanation unavailable.", 
                "why_match": [], "strengths": [], "considerations": [], "confidence_note": ""
            }
            
        results.append({
            "id": r.id,
            "csr_need_id": r.csr_need_id,
            "csr_need_category": need.ai_identified_category or need.category if need else "Unknown",
            "csr_need_location": f"{need.city_locality}, {need.district}" if need else "Unknown",
            "csr_need_status": getattr(need.status, 'name', need.status) if hasattr(need, 'status') else "",
            "ngo_id": r.ngo_id,
            "match_id": r.match_id,
            "ngo_name": ngo.name if ngo else "",
            "match_score": m.match_score,
            "explanation": expl
        })
    return results



@router.post("/api/csr-needs/{csr_need_id}/recommendations", response_model=RecommendationListResponse)
def generate_recommendations(csr_need_id: int, db: Session = Depends(get_db)):
    from app.services.recommendation_service import generate_recommendations_for_csr_need
    result = generate_recommendations_for_csr_need(db, csr_need_id)
    if result is None:
        raise HTTPException(status_code=404, detail="CSR Need not found")
    return result


@router.get("/api/recommendations", response_model=List[Dict[str, Any]])
def get_all_recommendations(db: Session = Depends(get_db)):
    from app.models import Recommendation, Match
    import json
    
    recs = db.query(Recommendation).order_by(Recommendation.created_at.desc()).all()
    if not recs:
        return []
        
    matches = db.query(Match).filter(Match.id.in_([r.match_id for r in recs])).all()
    match_dict = {m.id: m for m in matches}
    
    results = []
    for r in recs:
        m = match_dict.get(r.match_id)
        if not m:
            continue
            
        ngo = m.ngo
        need = r.csr_need
        
        try:
            expl = json.loads(r.explanation)
        except:
            expl = {
                "summary": "Explanation unavailable.", 
                "why_match": [], "strengths": [], "considerations": [], "confidence_note": ""
            }
            
        results.append({
            "id": r.id,
            "csr_need_id": r.csr_need_id,
            "csr_need_category": need.ai_identified_category or need.category if need else "Unknown",
            "csr_need_location": f"{need.city_locality}, {need.district}" if need else "Unknown",
            "csr_need_status": getattr(need.status, 'name', need.status) if hasattr(need, 'status') else "",
            "ngo_id": r.ngo_id,
            "match_id": r.match_id,
            "ngo_name": ngo.name if ngo else "",
            "match_score": m.match_score,
            "explanation": expl
        })
    return results


@router.get("/api/csr-needs/{csr_need_id}/recommendations", response_model=RecommendationListResponse)
def get_recommendations(csr_need_id: int, db: Session = Depends(get_db)):
    from app.services.recommendation_service import get_recommendations_for_csr_need
    result = get_recommendations_for_csr_need(db, csr_need_id)
    if result is None:
        raise HTTPException(status_code=404, detail="CSR Need not found")
    return result


@router.get("/api/recommendations", response_model=List[Dict[str, Any]])
def get_all_recommendations(db: Session = Depends(get_db)):
    from app.models import Recommendation, Match
    import json
    
    recs = db.query(Recommendation).order_by(Recommendation.created_at.desc()).all()
    if not recs:
        return []
        
    matches = db.query(Match).filter(Match.id.in_([r.match_id for r in recs])).all()
    match_dict = {m.id: m for m in matches}
    
    results = []
    for r in recs:
        m = match_dict.get(r.match_id)
        if not m:
            continue
            
        ngo = m.ngo
        need = r.csr_need
        
        try:
            expl = json.loads(r.explanation)
        except:
            expl = {
                "summary": "Explanation unavailable.", 
                "why_match": [], "strengths": [], "considerations": [], "confidence_note": ""
            }
            
        results.append({
            "id": r.id,
            "csr_need_id": r.csr_need_id,
            "csr_need_category": need.ai_identified_category or need.category if need else "Unknown",
            "csr_need_location": f"{need.city_locality}, {need.district}" if need else "Unknown",
            "csr_need_status": getattr(need.status, 'name', need.status) if hasattr(need, 'status') else "",
            "ngo_id": r.ngo_id,
            "match_id": r.match_id,
            "ngo_name": ngo.name if ngo else "",
            "match_score": m.match_score,
            "explanation": expl
        })
    return results



@router.get("/api/csr-needs/{csr_need_id}/status-history", response_model=List[StatusHistoryResponse])
def get_status_history(csr_need_id: int, db: Session = Depends(get_db)):
    need = db.query(CSRNeed).filter(CSRNeed.id == csr_need_id).first()
    if not need:
        raise HTTPException(status_code=404, detail="CSR Need not found")
        
    history = db.query(StatusHistory).filter(StatusHistory.csr_need_id == csr_need_id).order_by(StatusHistory.timestamp.asc()).all()
    # Also sort by ID conceptually if timestamps match
    history.sort(key=lambda x: (x.timestamp, x.id))
    return history

@router.get("/api/dashboard/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)):
    from sqlalchemy import func
    from app.models import Match, Recommendation
    
    total_csr_needs = db.query(CSRNeed).count()
    high_priority_needs = db.query(CSRNeed).filter(CSRNeed.priority == PriorityEnum.HIGH).count()
    total_matches = db.query(Match).count()
    total_recommendations = db.query(Recommendation).count()
    
    metrics = {
        "total_csr_needs": total_csr_needs,
        "high_priority_needs": high_priority_needs,
        "total_matches": total_matches,
        "total_recommendations": total_recommendations
    }
    
    status_distribution = db.query(CSRNeed.status, func.count(CSRNeed.id)).group_by(CSRNeed.status).all()
    # Initialize defaults
    status_counts = {
        "NEED_IDENTIFIED": 0,
        "AI_ASSESSMENT": 0,
        "PRIORITIZED": 0,
        "MATCHED": 0,
        "RECOMMENDED": 0
    }
    for stat, count in status_distribution:
        if stat and stat.name in status_counts:
            status_counts[stat.name] = count
            
    priority_distribution = db.query(CSRNeed.priority, func.count(CSRNeed.id)).group_by(CSRNeed.priority).all()
    priority_counts = {
        "HIGH": 0,
        "MEDIUM": 0,
        "LOW": 0
    }
    for prio, count in priority_distribution:
        if prio and prio.name in priority_counts:
            priority_counts[prio.name] = count
            
    recent_db_needs = db.query(CSRNeed).order_by(CSRNeed.id.desc()).limit(5).all()
    recent_needs = [format_csr_need(n) for n in recent_db_needs]
    
    return {
        "metrics": metrics,
        "status_counts": status_counts,
        "priority_counts": priority_counts,
        "recent_needs": recent_needs
    }
