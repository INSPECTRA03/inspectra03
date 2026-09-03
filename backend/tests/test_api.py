import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.models import Base, CSRNeed, NGO, Match, CSRProject, Recommendation, StatusHistory
import json

# API Testing Setup
import os
if os.path.exists("./test_api.db"):
    os.remove("./test_api.db")
engine = create_engine("sqlite:///./test_api.db", connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture(autouse=True)
def setup_dependencies():
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()

client = TestClient(app)

def test_create_csr_need():
    payload = {
        "state": "Tamil Nadu",
        "district": "Coimbatore",
        "city_locality": "Peelamedu",
        "category": "Education",
        "beneficiary_type": "Students",
        "beneficiary_count": 50,
        "urgency": "HIGH",
        "description": "Need new computers for village school."
    }
    response = client.post("/api/csr-needs", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["location"]["state"] == "Tamil Nadu"
    assert data["status"] == "NEED_IDENTIFIED"
    assert data["priority"] is None
    
def test_get_csr_needs():
    response = client.get("/api/csr-needs")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "location" in data[0]

def test_get_individual_csr_need():
    # First create
    res = client.post("/api/csr-needs", json={
        "state": "KA", "district": "Blr", "city_locality": "Koramangala",
        "category": "Healthcare", "beneficiary_type": "Children", "beneficiary_count": 100, 
        "urgency": "MEDIUM", "description": "Needs"
    })
    need_id = res.json()["id"]

    # Get
    response = client.get(f"/api/csr-needs/{need_id}")
    assert response.status_code == 200
    assert response.json()["id"] == need_id
    assert response.json()["status"] == "NEED_IDENTIFIED"


# --- AI Analysis Tests ---

class MockGeminiResponse:
    def __init__(self, text):
        self.text = text

class MockGeminiModel:
    def __init__(self, response_text):
        self.response_text = response_text
        
    def generate_content(self, prompt, generation_config=None):
        if self.response_text == "API_ERROR":
            raise Exception("Mocked Gemini API Error")
        return MockGeminiResponse(self.response_text)

def test_analyze_csr_need_not_found():
    response = client.post("/api/ai/analyze-need", json={"csr_need_id": 99999})
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()

def test_analyze_csr_need_missing_api_key(monkeypatch):
    from app.core.config import settings
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "")
    
    res = client.post("/api/csr-needs", json={
        "state": "TN", "district": "CBE", "city_locality": "City",
        "category": "Education", "beneficiary_type": "Kids", "beneficiary_count": 50, 
        "urgency": "LOW", "description": "Needs"
    })
    need_id = res.json()["id"]
    
    response = client.post("/api/ai/analyze-need", json={"csr_need_id": need_id})
    assert response.status_code == 500
    assert "missing" in response.json()["detail"].lower()

def test_analyze_csr_need_api_failure(monkeypatch):
    import google.generativeai as genai
    monkeypatch.setattr(genai, "GenerativeModel", lambda *a, **k: MockGeminiModel("API_ERROR"))
    
    res = client.get("/api/csr-needs")
    need_id = res.json()[0]["id"]
    
    response = client.post("/api/ai/analyze-need", json={"csr_need_id": need_id})
    assert response.status_code == 500
    assert "Mocked Gemini API Error" in response.json()["detail"]

def test_analyze_csr_need_invalid_json(monkeypatch):
    import google.generativeai as genai
    monkeypatch.setattr(genai, "GenerativeModel", lambda *a, **k: MockGeminiModel("Not JSON format"))
    
    res = client.get("/api/csr-needs")
    need_id = res.json()[0]["id"]
    
    response = client.post("/api/ai/analyze-need", json={"csr_need_id": need_id})
    assert response.status_code == 500
    assert "Failed to parse" in response.json()["detail"]

def test_analyze_csr_need_missing_fields(monkeypatch):
    import google.generativeai as genai
    invalid_json = '{"summary": "test"}' # Missing other fields
    monkeypatch.setattr(genai, "GenerativeModel", lambda *a, **k: MockGeminiModel(invalid_json))
    
    res = client.get("/api/csr-needs")
    need_id = res.json()[0]["id"]
    
    response = client.post("/api/ai/analyze-need", json={"csr_need_id": need_id})
    assert response.status_code == 500
    assert "missing required fields" in response.json()["detail"]

def test_analyze_csr_need_success(monkeypatch):
    import google.generativeai as genai
    valid_json = '''
    {
      "summary": "Need summary.",
      "identified_category": "Education",
      "beneficiary_group": "Children",
      "required_intervention": "Buy books",
      "key_need": "Books",
      "analysis": "Great project."
    }
    '''
    monkeypatch.setattr(genai, "GenerativeModel", lambda *a, **k: MockGeminiModel(valid_json))
    
    res = client.get("/api/csr-needs")
    need_id = res.json()[0]["id"]
    
    response = client.post("/api/ai/analyze-need", json={"csr_need_id": need_id})
    assert response.status_code == 200
    data = response.json()
    assert data["csr_need_id"] == need_id
    assert data["analysis"]["summary"] == "Need summary."
    assert data["analysis"]["key_need"] == "Books"
    
    # Check that status was updated in DB
    need_res = client.get(f"/api/csr-needs/{need_id}")
    assert need_res.json()["status"] == "AI_ASSESSMENT"

# --- Priority Engine Tests ---

def test_priority_missing_ai_analysis():
    # create new need
    res = client.post("/api/csr-needs", json={
        "state": "TS", "district": "HYD", "city_locality": "Banjara",
        "category": "Education", "beneficiary_type": "Kids", "beneficiary_count": 50, 
        "urgency": "LOW", "description": "Needs"
    })
    need_id = res.json()["id"]
    
    # Assess priority
    response = client.post(f"/api/csr-needs/{need_id}/priority")
    assert response.status_code == 400
    assert "AI analysis is required" in response.json()["detail"]

def test_priority_calculation_low(monkeypatch):
    import google.generativeai as genai
    monkeypatch.setattr(genai, "GenerativeModel", lambda *a, **k: MockGeminiModel('{"summary":"t","identified_category":"t","beneficiary_group":"t","required_intervention":"t","key_need":"t","analysis":"t"}'))
    
    res = client.post("/api/csr-needs", json={"state": "TS", "district": "HYD", "city_locality": "Banjara", "category": "Education", "beneficiary_type": "Kids", "beneficiary_count": 50, "urgency": "LOW", "description": "Needs"})
    need_id = res.json()["id"]
    client.post("/api/ai/analyze-need", json={"csr_need_id": need_id})
    
    # Assess priority -> LOW urgency (10) + small ben (10) = 20 -> LOW
    response = client.post(f"/api/csr-needs/{need_id}/priority")
    assert response.status_code == 200
    data = response.json()
    assert data["priority_score"] == 20
    assert data["priority"] == "LOW"
    assert "Low urgency combined with a small beneficiary population (1-100)" in data["reason"]

def test_priority_calculation_high(monkeypatch):
    import google.generativeai as genai
    monkeypatch.setattr(genai, "GenerativeModel", lambda *a, **k: MockGeminiModel('{"summary":"t","identified_category":"t","beneficiary_group":"t","required_intervention":"t","key_need":"t","analysis":"t"}'))
    
    res = client.post("/api/csr-needs", json={"state": "TS", "district": "HYD", "city_locality": "Banjara", "category": "Healthcare", "beneficiary_type": "Kids", "beneficiary_count": 550, "urgency": "HIGH", "description": "Needs"})
    need_id = res.json()["id"]
    client.post("/api/ai/analyze-need", json={"csr_need_id": need_id})
    
    # Assess priority -> HIGH urgency (30) + large ben (30) = 60 -> HIGH
    response = client.post(f"/api/csr-needs/{need_id}/priority")
    assert response.status_code == 200
    data = response.json()
    assert data["priority_score"] == 60
    assert data["priority"] == "HIGH"
    assert "High urgency combined with a large beneficiary population (500+)" in data["reason"]

# --- NGO / Project Query Tests ---

def test_get_ngos_with_filters():
    # Insert some NGOs
    db = TestingSessionLocal()
    ngo1 = NGO(name="Health First", description="A health NGO.", sectors="Healthcare", locations="Chennai", beneficiary_types="Patients", experience="10 years")
    ngo2 = NGO(name="EduCore", description="School education.", sectors="Education, Technology", locations="Chennai, Bangalore", beneficiary_types="Students, Teachers", experience="5 years")
    ngo3 = NGO(name="Nature Protect", description="Green revolution.", sectors="Environment", locations="Coimbatore", beneficiary_types="Community", experience="2 years")
    db.add(ngo1)
    db.add(ngo2)
    db.add(ngo3)
    db.commit()
    db.close()
    
    # Test search
    res = client.get("/api/ngos?search=EduCore")
    print("RESTEST", res.json())
    assert res.status_code == 200
    assert len(res.json()) == 1
    assert res.json()[0]["name"] == "EduCore"
    
    res = client.get("/api/ngos?search=school")
    assert res.status_code == 200
    assert len(res.json()) == 1
    assert res.json()[0]["name"] == "EduCore"
    
    # Test sector
    res = client.get("/api/ngos?sector=Healthcare")
    assert len(res.json()) == 1
    
    # Test location + sector
    res = client.get("/api/ngos?sector=Education&location=Chennai")
    assert len(res.json()) == 1
    assert res.json()[0]["name"] == "EduCore"
    
    # Test beneficiary type
    res = client.get("/api/ngos?beneficiary_type=Students")
    assert len(res.json()) == 1
    
    # Test empty combination
    res = client.get("/api/ngos?sector=Environment&location=Chennai")
    assert len(res.json()) == 0

def test_get_csr_projects_by_ngo():
    db = TestingSessionLocal()
    ngo = NGO(name="Test NGO", description="desc", sectors="x", locations="y", beneficiary_types="z", experience="a")
    db.add(ngo)
    db.commit()
    db.refresh(ngo)
    
    p1 = CSRProject(company="A", category="EDU", location="Chennai", description="d1", year=2025, ngo="Test NGO")
    p2 = CSRProject(company="A", category="EDU", location="Chennai", description="d2", year=2025, ngo="Test NGO")
    p3 = CSRProject(company="B", category="HLT", location="Bangalore", description="d3", year=2025, ngo="Other NGO")
    db.add_all([p1, p2, p3])
    db.commit()
    db.close()
    
    res = client.get("/api/csr-projects?ngo_name=Test NGO")
    print("RESTEST PROJECTS", res.json())
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 2
    assert "d1" in [p["description"] for p in data]
