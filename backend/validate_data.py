import csv
import os

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def validate_data():
    errors = []

    # Check files exist
    files = ["ngos.csv", "csr_projects.csv", "locations.csv"]
    for file in files:
        if not os.path.exists(os.path.join(DATA_DIR, file)):
            errors.append(f"Missing file: {file}")
            
    if errors:
        return errors

    # Validate ngos.csv
    ngo_ids = set()
    with open(os.path.join(DATA_DIR, "ngos.csv"), "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        required_cols = {"ngo_id", "ngo_name", "description", "sectors", "locations", "beneficiary_types", "experience"}
        if not required_cols.issubset(set(reader.fieldnames or [])):
            errors.append(f"ngos.csv: Missing required columns. Expected: {required_cols}")
        else:
            for row in reader:
                ngo_id = row.get("ngo_id")
                if not ngo_id:
                    errors.append("ngos.csv: Empty ngo_id found")
                elif ngo_id in ngo_ids:
                    errors.append(f"ngos.csv: Duplicate ngo_id {ngo_id}")
                else:
                    ngo_ids.add(ngo_id)
                
                if not row.get("ngo_name") or not row["ngo_name"].strip():
                    errors.append(f"ngos.csv: Empty ngo_name for ID {ngo_id}")
                if not row.get("locations") or not row["locations"].strip():
                    errors.append(f"ngos.csv: Empty locations for ID {ngo_id}")

    # Validate csr_projects.csv
    project_ids = set()
    with open(os.path.join(DATA_DIR, "csr_projects.csv"), "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        required_cols = {"project_id", "company", "category", "location", "ngo", "description", "year"}
        if not required_cols.issubset(set(reader.fieldnames or [])):
            errors.append(f"csr_projects.csv: Missing required columns. Expected: {required_cols}")
        else:
            for row in reader:
                pid = row.get("project_id")
                if not pid:
                    errors.append("csr_projects.csv: Empty project_id found")
                elif pid in project_ids:
                    errors.append(f"csr_projects.csv: Duplicate project_id {pid}")
                else:
                    project_ids.add(pid)
                
                year = row.get("year")
                if not year or not year.isdigit() or len(year) != 4:
                    errors.append(f"csr_projects.csv: Invalid year '{year}' for ID {pid}")
                
                cat = row.get("category")
                if not cat or not cat.strip():
                    errors.append(f"csr_projects.csv: Empty category for ID {pid}")

    # Validate locations.csv
    loc_ids = set()
    with open(os.path.join(DATA_DIR, "locations.csv"), "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        required_cols = {"location_id", "state", "district", "city", "locality"}
        if not required_cols.issubset(set(reader.fieldnames or [])):
            errors.append(f"locations.csv: Missing required columns. Expected: {required_cols}")
        else:
            for row in reader:
                lid = row.get("location_id")
                if not lid:
                    errors.append("locations.csv: Empty location_id found")
                elif lid in loc_ids:
                    errors.append(f"locations.csv: Duplicate location_id {lid}")
                else:
                    loc_ids.add(lid)
                    
    return errors

if __name__ == "__main__":
    errors = validate_data()
    if errors:
        print("DATA VALIDATION: FAIL")
        for err in errors:
            print(f"- {err}")
    else:
        print("DATA VALIDATION: PASS")
