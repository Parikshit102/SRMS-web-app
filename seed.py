"""
Run this script once to seed demo users into the database.
Usage: python seed.py
"""
from database import SessionLocal, engine
import models, auth

models.Base.metadata.create_all(bind=engine)

SEED_USERS = [
    {"name": "Admin User",   "email": "admin@college.edu",   "password": "admin123", "role": "admin",   "department": "Administration"},
    {"name": "Staff Member", "email": "staff@college.edu",   "password": "staff123", "role": "staff",   "department": "Computer Science"},
    {"name": "Arjun Sharma", "email": "student@college.edu", "password": "student123","role": "student", "department": "Computer Science"},
    {"name": "Priya Patel",  "email": "priya@college.edu",   "password": "priya123", "role": "student", "department": "Engineering"},
    {"name": "Rohit Kumar",  "email": "rohit@college.edu",   "password": "rohit123", "role": "student", "department": "Business"},
]

def seed():
    db = SessionLocal()
    try:
        for u in SEED_USERS:
            existing = db.query(models.User).filter(models.User.email == u["email"]).first()
            if not existing:
                db_user = models.User(
                    name=u["name"],
                    email=u["email"],
                    hashed_password=auth.hash_password(u["password"]),
                    role=u["role"],
                    department=u["department"],
                )
                db.add(db_user)
                print(f"  ✅ Created {u['role']}: {u['email']}")
            else:
                print(f"  ⚠️  Already exists: {u['email']}")
        db.commit()
        print("\n🎉 Seeding complete!")
    finally:
        db.close()

if __name__ == "__main__":
    print("🌱 Seeding database...\n")
    seed()
