from sqlalchemy.orm import Session
from app.models import CSRNeed, NGO, Match, Recommendation
from typing import List, Dict, Any
import json
from app.services.gemini_service import generate_match_explanation

def _build_input_data(need: CSRNeed, ngo: NGO, match: Match) -> Dict[str, Any]:
    return {
        "need_category": need.category,
        "need_beneficiary": need.beneficiary_type,
        "need_state": need.state,
        "need_district": need.district,
        "need_city": need.city_locality,
        "need_description": need.description,
        "ngo_name": ngo.name,
        "ngo_sectors": ngo.sectors,
        "ngo_locations": ngo.locations,
        "ngo_beneficiaries": ngo.beneficiary_types,
        "ngo_experience": ngo.experience,
        "ngo_description": ngo.description,
        "match_score": match.match_score,
        "sector_score": match.sector_match,
        "location_score": match.location_match,
        "beneficiary_score": match.beneficiary_match,
        "experience_score": match.experience_match,
    }

def generate_recommendations_for_csr_need(db: Session, csr_need_id: int):
    need = db.query(CSRNeed).filter(CSRNeed.id == csr_need_id).first()
    if not need:
        return None
        
    matches = db.query(Match).filter(Match.csr_need_id == csr_need_id).all()
    if not matches:
        return {"csr_need_id": csr_need_id, "recommendations": []}
        
    matches.sort(key=lambda x: (
        -x.match_score,
        -x.sector_match,
        -x.location_match,
        x.ngo_id
    ))
    
    # Delete existing recommendations for this CSR need safely
    db.query(Recommendation).filter(Recommendation.csr_need_id == csr_need_id).delete()
    db.commit()
    
    saved_recs = []
    
    from app.models import StatusEnum, StatusHistory
    
    for match in matches:
        ngo = db.query(NGO).filter(NGO.id == match.ngo_id).first()
        if not ngo:
            continue
            
        input_data = _build_input_data(need, ngo, match)
        
        try:
            explanation_data = generate_match_explanation(input_data)
            
            rec = Recommendation(
                csr_need_id=need.id,
                ngo_id=ngo.id,
                match_id=match.id,
                explanation=json.dumps(explanation_data)
            )
            db.add(rec)
            db.commit()
            db.refresh(rec)
            saved_recs.append(rec)
        except Exception as e:
            # Handle partial failure safely: skip this one and continue
            db.rollback()
            print(f"Failed to generate explantion for NGO {ngo.id}: {e}")
            
    if saved_recs and need.status != StatusEnum.RECOMMENDED:
        need.status = StatusEnum.RECOMMENDED
        status_hist = StatusHistory(csr_need_id=need.id, status=need.status)
        db.add(status_hist)
        db.commit()
            
    return _format_recommendations(csr_need_id, saved_recs, matches)

def get_recommendations_for_csr_need(db: Session, csr_need_id: int):
    need = db.query(CSRNeed).filter(CSRNeed.id == csr_need_id).first()
    if not need:
        return None
        
    recs = db.query(Recommendation).filter(Recommendation.csr_need_id == csr_need_id).all()
    matches = db.query(Match).filter(Match.csr_need_id == csr_need_id).all()
    
    # Sort recs by original match criteria to preserve Stage 7 ranking exactly
    match_lookup = {m.id: m for m in matches}
    recs.sort(key=lambda r: (
        -match_lookup[r.match_id].match_score if r.match_id in match_lookup else 0,
        -match_lookup[r.match_id].sector_match if r.match_id in match_lookup else 0,
        -match_lookup[r.match_id].location_match if r.match_id in match_lookup else 0,
        r.ngo_id
    ))
    
    return _format_recommendations(csr_need_id, recs, matches)

def _format_recommendations(csr_need_id: int, recs: List[Recommendation], matches: List[Match]) -> Dict[str, Any]:
    match_dict = {m.id: m for m in matches}
    
    results = []
    for r in recs:
        m = match_dict.get(r.match_id)
        if not m:
            continue
            
        ngo = m.ngo
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
            "ngo_id": r.ngo_id,
            "match_id": r.match_id,
            "ngo_name": ngo.name if ngo else "",
            "match_score": m.match_score,
            "explanation": expl
        })
        
    return {
        "csr_need_id": csr_need_id,
        "recommendations": results
    }
