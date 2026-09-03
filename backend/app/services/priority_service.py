from typing import Dict, Any

def calculate_priority(csr_need_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Deterministically scores a CSR need based on urgency, beneficiary count,
    and contextual signals from AI analysis.
    
    Weights:
    - Urgency: LOW=1, MEDIUM=2, HIGH=3 (Multiplier x10) => 10, 20, 30
    - Beneficiaries: 1-100=10, 101-500=20, 501+=30
    
    Maximum Score = 60
    
    Thresholds:
    - LOW: < 30
    - MEDIUM: 30 to 49
    - HIGH: >= 50
    """
    
    # Needs AI analysis to exist 
    if not csr_need_data.get('ai_summary'):
        raise ValueError("AI analysis is required before priority assessment.")
        
    urgency = csr_need_data.get('urgency', 'LOW')
    beneficiary_count = csr_need_data.get('beneficiary_count', 0)
    
    # 1. Urgency Score
    urgency_score = 10
    if urgency == "MEDIUM":
        urgency_score = 20
    elif urgency == "HIGH":
        urgency_score = 30
        
    # 2. Beneficiary Score
    beneficiary_score = 10
    bc_desc = "a small beneficiary population (1-100)"
    if beneficiary_count > 500:
        beneficiary_score = 30
        bc_desc = "a large beneficiary population (500+)"
    elif beneficiary_count > 100:
        beneficiary_score = 20
        bc_desc = "a moderately sized beneficiary population (101-500)"
        
    # Total Score
    total_score = urgency_score + beneficiary_score
    
    # Level Assignment
    priority_level = "LOW"
    if total_score >= 50:
        priority_level = "HIGH"
    elif total_score >= 30:
        priority_level = "MEDIUM"
        
    # Generative Deterministic Explanation
    urgency_adj = urgency.lower().capitalize()
    reason = f"{urgency_adj} urgency combined with {bc_desc} resulted in a {priority_level} priority assessment."
    
    return {
        "priority_score": total_score,
        "priority": priority_level,
        "reason": reason
    }
