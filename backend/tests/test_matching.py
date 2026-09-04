import pytest
from app.services.matching_service import (
    calculate_sector_score,
    calculate_location_score,
    calculate_beneficiary_score,
    calculate_experience_score,
    calculate_final_score
)

def test_sector_score():
    assert calculate_sector_score("Education", "Education|Livelihood") == 100.0
    assert calculate_sector_score("Healthcare", "Environment|Education") == 0.0
    assert calculate_sector_score("education", "EDUCATION") == 100.0

def test_location_score():
    assert calculate_location_score("Tamil Nadu", "Coimbatore", "Coimbatore", "Coimbatore|Chennai") == 100.0
    assert calculate_location_score("Tamil Nadu", "Coimbatore", "SomeCity", "Coimbatore|Chennai") == 75.0
    assert calculate_location_score("Tamil Nadu", "Coimbatore", "SomeCity", "Tamil Nadu|Chennai") == 50.0
    assert calculate_location_score("Tamil Nadu", "Coimbatore", "Coimbatore", "Kerala|Delhi") == 0.0

def test_beneficiary_score():
    assert calculate_beneficiary_score("Children", "Women|Children|Elderly") == 100.0
    assert calculate_beneficiary_score("Youth", "Women|Children|Elderly") == 0.0

def test_experience_score():
    assert calculate_experience_score("5") == 100.0
    assert calculate_experience_score("10+") == 100.0
    assert calculate_experience_score("1") == 50.0
    assert calculate_experience_score("Strong experience") == 100.0
    assert calculate_experience_score("Some related experience") == 50.0
    assert calculate_experience_score("No experience") == 0.0

def test_final_score():
    assert calculate_final_score(100.0, 75.0, 100.0, 50.0) == 85.0
