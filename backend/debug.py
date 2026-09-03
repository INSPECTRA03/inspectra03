from app.main import app
from fastapi.testclient import TestClient
from app.db.database import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.models import Base, NGO

engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

db = TestingSessionLocal()
ngo = NGO(name='EduCore', description='test', sectors='Education', locations='Chennai', beneficiary_types='Students', experience='5 years')
db.add(ngo)
db.commit()
db.close()

print(client.get('/api/ngos').json())
print(client.get('/api/ngos?search=EduCore').json())
