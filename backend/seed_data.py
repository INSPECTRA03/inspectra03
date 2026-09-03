import csv
import os
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.models import Base, NGO, CSRProject

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def seed():
    # Only seed if tables exist
    try:
        if not engine.dialect.has_table(engine.connect(), "ngos"):
            print("DATABASE SEED: FAIL - Tables do not exist. Please run alembic migrations.")
            return
    except Exception as e:
        print(f"DATABASE SEED: FAIL - Database connection error: {e}")
        return

    db = SessionLocal()
    try:
        # Seed NGOs
        with open(os.path.join(DATA_DIR, "ngos.csv"), "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            ngo_count = 0
            for row in reader:
                exists = db.query(NGO).filter(NGO.id == row["ngo_id"]).first()
                if not exists:
                    ngo = NGO(
                        id=int(row["ngo_id"]),
                        name=row["ngo_name"],
                        description=row["description"],
                        sectors=row["sectors"],
                        locations=row["locations"],
                        beneficiary_types=row["beneficiary_types"],
                        experience=row["experience"]
                    )
                    db.add(ngo)
                    ngo_count += 1
            db.commit()

        # Seed CSR Projects
        with open(os.path.join(DATA_DIR, "csr_projects.csv"), "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            project_count = 0
            for row in reader:
                exists = db.query(CSRProject).filter(CSRProject.id == row["project_id"]).first()
                if not exists:
                    project = CSRProject(
                        id=int(row["project_id"]),
                        company=row["company"],
                        category=row["category"],
                        location=row["location"],
                        ngo=row["ngo"],
                        description=row["description"],
                        year=int(row["year"])
                    )
                    db.add(project)
                    project_count += 1
            db.commit()

        # Locations are currently not stored in DB, they're read directly via API as per __init__.py /locations endpoint,
        # but if we wanted to count them:
        loc_count = 0
        with open(os.path.join(DATA_DIR, "locations.csv"), "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            loc_count = sum(1 for _ in reader)

        print(f"NGOs loaded: {ngo_count}")
        print(f"CSR projects loaded: {project_count}")
        print(f"Locations loaded: {loc_count}")
        print("\nDATABASE SEED: PASS")

    except Exception as e:
        db.rollback()
        print(f"DATABASE SEED: FAIL - {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    from validate_data import validate_data
    errors = validate_data()
    if errors:
        print("DATABASE SEED: FAIL - Data validation failed before seeding")
        for err in errors:
            print(f"- {err}")
    else:
        seed()
