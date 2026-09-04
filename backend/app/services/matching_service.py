from sqlalchemy.orm import Session
from app.models import CSRNeed, NGO, Match, StatusEnum
from typing import List, Dict, Any

def calculate_sector_score(need_category: str, ngo_sectors_str: str) -> float:
    if not need_category or not ngo_sectors_str:
        return 0.0
    need_category = need_category.strip().lower()
    ngo_sectors = [s.strip().lower() for s in ngo_sectors_str.split('|')]
    if need_category in ngo_sectors:
        return 100.0
    return 0.0

def calculate_location_score(need_state: str, need_district: str, need_city: str, ngo_locations_str: str) -> float:
    if not ngo_locations_str:
        return 0.0
        
    need_state = need_state.strip().lower() if need_state else ""
    need_district = need_district.strip().lower() if need_district else ""
    need_city = need_city.strip().lower() if need_city else ""
    
    ngo_locations = [loc.strip().lower() for loc in ngo_locations_str.split('|')]
    
    best_score = 0.0
    for ngo_loc in ngo_locations:
        if need_city and need_city in ngo_loc:
            best_score = max(best_score, 100.0)
        elif need_district and need_district in ngo_loc:
            best_score = max(best_score, 75.0)
        elif need_state and need_state in ngo_loc:
            best_score = max(best_score, 50.0)
            
    return best_score

def calculate_beneficiary_score(need_beneficiary: str, ngo_beneficiaries_str: str) -> float:
    if not need_beneficiary or not ngo_beneficiaries_str:
        return 0.0
    need_beneficiary = need_beneficiary.strip().lower()
    ngo_beneficiaries = [b.strip().lower() for b in ngo_beneficiaries_str.split('|')]
    if need_beneficiary in ngo_beneficiaries:
        return 100.0
    return 0.0

def calculate_experience_score(ngo_experience: str) -> float:
    if not ngo_experience:
        return 0.0
    import re
    digits = re.findall(r'[\d.]+', ngo_experience)
    if digits:
        try:
            exp_years = float(digits[0])
            if exp_years >= 5:
                return 100.0
            if exp_years >= 1:
                return 50.0
        except ValueError:
            pass
            
    exp_lower = ngo_experience.strip().lower()
    if 'strong' in exp_lower or 'extensive' in exp_lower or 'expert' in exp_lower or 'proven' in exp_lower or 'years' in exp_lower:
        return 100.0
    if 'some' in exp_lower or 'related' in exp_lower or 'moderate' in exp_lower or 'general' in exp_lower:
        return 50.0
        
    return 0.0

def calculate_final_score(sector: float, location: float, beneficiary: float, experience: float) -> float:
    return round(
        (sector * 0.35) +
        (location * 0.30) +
        (beneficiary * 0.20) +
        (experience * 0.15),
        2
    )

def generate_matches_for_csr_need(db: Session, csr_need_id: int):
    need = db.query(CSRNeed).filter(CSRNeed.id == csr_need_id).first()
    if not need:
        return None
        
    db.query(Match).filter(Match.csr_need_id == csr_need_id).delete()
    db.commit()
    
    ngos = db.query(NGO).all()
    scores = []
    
    for ngo in ngos:
        sector_score = calculate_sector_score(need.category, ngo.sectors)
        location_score = calculate_location_score(need.state, need.district, need.city_locality, ngo.locations)
        beneficiary_score = calculate_beneficiary_score(need.beneficiary_type, ngo.beneficiary_types)
        experience_score = calculate_experience_score(ngo.experience)
        
        final_score = calculate_final_score(sector_score, location_score, beneficiary_score, experience_score)
        
        scores.append({
            "ngo": ngo,
            "final_score": final_score,
            "sector": sector_score,
            "location": location_score,
            "beneficiary": beneficiary_score,
            "experience": experience_score
        })
        
    scores.sort(key=lambda x: (
        -x['final_score'],
        -x['sector'],
        -x['location'],
        x['ngo'].id
    ))
    
    top_5 = scores[:5]
    matches_out = []
    
    for s in top_5:
        match = Match(
            csr_need_id=need.id,
            ngo_id=s['ngo'].id,
            match_score=s['final_score'],
            sector_match=s['sector'],
            location_match=s['location'],
            beneficiary_match=s['beneficiary'],
            experience_match=s['experience']
        )
        db.add(match)
        matches_out.append(match)
        
    if need.status in [StatusEnum.NEED_IDENTIFIED, StatusEnum.AI_ASSESSMENT, StatusEnum.PRIORITIZED]:
        need.status = StatusEnum.MATCHED
        from app.models import StatusHistory
        status_hist = StatusHistory(csr_need_id=need.id, status=need.status)
        db.add(status_hist)
        
    db.commit()
    for match in matches_out:
        db.refresh(match)
        
    return format_matches_response(csr_need_id, matches_out)

def get_matches_for_csr_need(db: Session, csr_need_id: int):
    need = db.query(CSRNeed).filter(CSRNeed.id == csr_need_id).first()
    if not need:
        return None
        
    matches = db.query(Match).filter(Match.csr_need_id == csr_need_id).all()
    matches.sort(key=lambda x: (
        -x.match_score,
        -x.sector_match,
        -x.location_match,
        x.ngo_id
    ))
    return format_matches_response(csr_need_id, matches)

def format_matches_response(csr_need_id: int, matches: List[Match]) -> Dict[str, Any]:
    return {
        "csr_need_id": csr_need_id,
        "matches": [
            {
                "ngo_id": m.ngo_id,
                "ngo_name": m.ngo.name if m.ngo else "",
                "match_score": m.match_score,
                "sector_score": m.sector_match,
                "location_score": m.location_match,
                "beneficiary_score": m.beneficiary_match,
                "experience_score": m.experience_match
            } for m in matches
        ]
    }
