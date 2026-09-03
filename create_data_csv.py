import os

base_dir = r"C:\Users\balag\.gemini\antigravity\scratch\inspectra\data"
os.makedirs(base_dir, exist_ok=True)

ngos_csv = '''ngo_id,ngo_name,description,sectors,locations,beneficiary_types,experience
1,Green Earth NGO,Focuses on environmental conservation and tree planting.,Environment|Education,Coimbatore|Chennai,General Public,10 years of afforestation projects
2,EduCare India,Provides free education to underprivileged children.,Education,Chennai|Madurai,Children,5 years running rural schools
3,HealthPlus Foundation,Offers free medical camps and health awareness.,Healthcare,Coimbatore|Salem,Women|Children,15 years in rural healthcare
4,SkillUp Org,Vocational training for youth empowerment.,Education|Livelihood,Bangalore|Chennai,Youth,8 years in skill development
'''

csr_projects_csv = '''project_id,company,category,location,ngo,description,year
1,TechCorp Inc,Environment,Coimbatore,Green Earth NGO,Planted 10000 trees in urban areas.,2024
2,GlobalTech Ltd,Education,Chennai,EduCare India,Constructed 5 new classrooms in rural school.,2023
3,HealthCare Solutions,Healthcare,Salem,HealthPlus Foundation,Organized 50 free medical camps.,2025
4,Innovate IT,Education,Bangalore,SkillUp Org,Sponsored vocational training for 500 youths.,2023
'''

locations_csv = '''location_id,state,district,city,locality
1,Tamil Nadu,Coimbatore,Coimbatore,Peelamedu
2,Tamil Nadu,Chennai,Chennai,Adyar
3,Tamil Nadu,Madurai,Madurai,Anna Nagar
4,Karnataka,Bangalore Urban,Bangalore,Indiranagar
5,Tamil Nadu,Salem,Salem,Suramangalam
'''

with open(os.path.join(base_dir, 'ngos.csv'), 'w', encoding='utf-8') as f:
    f.write(ngos_csv)
    
with open(os.path.join(base_dir, 'csr_projects.csv'), 'w', encoding='utf-8') as f:
    f.write(csr_projects_csv)

with open(os.path.join(base_dir, 'locations.csv'), 'w', encoding='utf-8') as f:
    f.write(locations_csv)
