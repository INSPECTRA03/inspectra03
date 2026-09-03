import pytest
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.models import Base, CSRNeed, NGO, Match, Recommendation, StatusHistory, CSRProject, UrgencyEnum, StatusEnum

from app.core.config import settings
# Use an in-memory SQLite database for tests to validate models without needing PostgreSQL available
engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
DB_AVAILABLE = True

# Create all tables in the in-memory database
Base.metadata.create_all(bind=engine)

pytestmark = pytest.mark.skipif(not DB_AVAILABLE, reason="PostgreSQL not available or configured correctly")

@pytest.fixture(scope="function")
def db_session():
    # Provide a fresh transaction for each test
    connection = engine.connect()
    transaction = connection.begin()
    session = SessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

def test_db_connection(db_session):
    assert DB_AVAILABLE

def test_valid_csr_submission(db_session):
    need = CSRNeed(
        state="Tamil Nadu",
        district="Chennai",
        city_locality="Adyar",
        category="Education",
        description="Need books",
        beneficiary_type="Children",
        beneficiary_count=100,
        urgency=UrgencyEnum.HIGH
    )
    db_session.add(need)
    db_session.commit()
    assert need.id is not None
    assert need.status == StatusEnum.NEED_IDENTIFIED # Default status
    assert need.priority is None # null by default

def test_missing_category(db_session):
    from sqlalchemy.exc import IntegrityError
    with pytest.raises(IntegrityError):
        need = CSRNeed(
            state="TN", district="D", city_locality="C",
            description="D", beneficiary_type="B", beneficiary_count=10, urgency=UrgencyEnum.LOW
        )
        db_session.add(need)
        db_session.commit()

def test_missing_location(db_session):
    from sqlalchemy.exc import IntegrityError
    with pytest.raises(IntegrityError):
        need = CSRNeed(
            category="Edu", description="D", beneficiary_type="B", beneficiary_count=10, urgency=UrgencyEnum.LOW
        )
        db_session.add(need)
        db_session.commit()

def test_missing_description(db_session):
    from sqlalchemy.exc import IntegrityError
    with pytest.raises(IntegrityError):
        need = CSRNeed(
            state="TN", district="D", city_locality="C", category="Edu", beneficiary_type="B", beneficiary_count=10, urgency=UrgencyEnum.LOW
        )
        db_session.add(need)
        db_session.commit()

def test_invalid_beneficiary_count(db_session):
    from sqlalchemy.exc import IntegrityError
    with pytest.raises(IntegrityError):
        need = CSRNeed(
            state="TN", district="D", city_locality="C", category="Edu", description="D", beneficiary_type="B", beneficiary_count=-5, urgency=UrgencyEnum.LOW
        )
        db_session.add(need)
        db_session.commit()



