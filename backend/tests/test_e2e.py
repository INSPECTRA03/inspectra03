import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.models import Base, CSRNeed, NGO, Match, CSRProject, Recommendation, StatusHistory

engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
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

class MockOpenAIResponse:
    def __init__(self, text):
        self.message = type('obj', (object,), {'content': text})
        self.choices = [type('obj', (object,), {'message': self.message})]

class MockOpenAIClient:
    def __init__(self, mock_return_text):
        self.mock_return_text = mock_return_text
        self.chat = type('obj', (object,), {'completions': type('obj', (object,), {'create': self.create})})()
        
    def create(self, **kwargs):
        if self.mock_return_text == "API_ERROR":
            raise Exception("Mocked API Error")
        return MockOpenAIResponse(self.mock_return_text)

def mock_get_client_factory(text):
    return lambda: MockOpenAIClient(text)



def test_full_end_to_end_flow(monkeypatch):
    import app.services.gemini_service as gemini_service
    valid_json = '{"summary": "Summary", "identified_category": "Education", "beneficiary_group": "Kids", "required_intervention": "Intervention", "key_need": "Need", "analysis": "Analysis"}'
    monkeypatch.setattr(gemini_service, "get_client", mock_get_client_factory(valid_json))

    # Seed NGOs and Projects
    db = TestingSessionLocal()
    ngo = NGO(name="EduVision", description="Focused on rural education.", sectors="Education", locations="Coimbatore", beneficiary_types="Students", experience="15 years")
    db.add(ngo)
    db.commit()
    db.refresh(ngo)
    
    p = CSRProject(company="TechCorp", category="EDU", location="Coimbatore", description="Built 5 schools", year=2024, ngo="EduVision")
    db.add(p)
    db.commit()
    db.close()

    # 1. Create CSR Need
    payload = {
        "state": "Tamil Nadu",
        "district": "Coimbatore",
        "city_locality": "Sulur",
        "category": "Education",
        "beneficiary_type": "Students",
        "beneficiary_count": 200,
        "urgency": "HIGH",
        "description": "Need tablets for remote learning."
    }
    r = client.post("/api/csr-needs", json=payload)
    assert r.status_code == 201
    need_id = r.json()["id"]

    # 2. Retrieve CSR Need
    r2 = client.get(f"/api/csr-needs/{need_id}")
    assert r2.status_code == 200
    assert r2.json()["status"] == "NEED_IDENTIFIED"

    # 3. Run AI Analysis
    r3 = client.post("/api/ai/analyze-need", json={"csr_need_id": need_id})
    assert r3.status_code == 200
    
    # 4. Verify AI fields
    r4 = client.get(f"/api/csr-needs/{need_id}")
    assert r4.json()["status"] == "AI_ASSESSMENT"
    assert r4.json()["ai_analysis"]["summary"] == "Summary"

    # 5. Calculate Priority
    r5 = client.post(f"/api/csr-needs/{need_id}/priority")
    assert r5.status_code == 200
    
    # 6. Verify priority (HIGH urgency = 30, 200 ben = 20 -> 50 = HIGH)
    assert r5.json()["priority_score"] == 50
    assert r5.json()["priority"] == "HIGH"
    
    r6 = client.get(f"/api/csr-needs/{need_id}")
    assert r6.json()["priority"] == "HIGH"

    # 7 & 8. Open NGO Discovery & Search NGO
    # 9. Apply filters
    r7 = client.get("/api/ngos?search=EduVision&sector=Education&location=Coimbatore")
    assert r7.status_code == 200
    data = r7.json()
    assert len(data) == 1
    assert data[0]["name"] == "EduVision"
    ngo_id = data[0]["id"]

    # 10. Open NGO Detail
    r8 = client.get(f"/api/ngos/{ngo_id}")
    assert r8.status_code == 200
    assert r8.json()["name"] == "EduVision"

    # 11. View related CSR projects
    r9 = client.get("/api/csr-projects?ngo_name=EduVision")
    assert r9.status_code == 200
    assert len(r9.json()) == 1
    assert r9.json()[0]["description"] == "Built 5 schools"
