from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas, auth
from typing import Optional

# ── Users ──────────────────────────────────────────────────
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_all_users(db: Session):
    return db.query(models.User).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed = auth.hash_password(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed,
        role=user.role,
        department=user.department
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ── Complaints ─────────────────────────────────────────────
def create_complaint(db: Session, complaint: schemas.ComplaintCreate, user_id: int):
    db_c = models.Complaint(**complaint.model_dump(), user_id=user_id)
    db.add(db_c)
    db.commit()
    db.refresh(db_c)
    return db_c

def get_complaint(db: Session, complaint_id: int):
    return db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()

def get_all_complaints(db: Session, status: Optional[str] = None, category: Optional[str] = None):
    q = db.query(models.Complaint)
    if status:
        q = q.filter(models.Complaint.status == status)
    if category:
        q = q.filter(models.Complaint.category == category)
    return q.order_by(models.Complaint.created_at.desc()).all()

def get_user_complaints(db: Session, user_id: int):
    return db.query(models.Complaint).filter(
        models.Complaint.user_id == user_id
    ).order_by(models.Complaint.created_at.desc()).all()

def update_complaint_status(db: Session, complaint_id: int, status: str, response: Optional[str] = None):
    c = get_complaint(db, complaint_id)
    if not c:
        return None
    c.status = status
    if response:
        c.staff_response = response
    db.commit()
    db.refresh(c)
    return c

def delete_complaint(db: Session, complaint_id: int):
    c = get_complaint(db, complaint_id)
    if not c:
        return False
    db.delete(c)
    db.commit()
    return True

# ── Reviews ────────────────────────────────────────────────
def create_review(db: Session, review: schemas.ReviewCreate, user_id: int):
    db_r = models.Review(**review.model_dump(), user_id=user_id)
    db.add(db_r)
    db.commit()
    db.refresh(db_r)
    return db_r

def get_all_reviews(db: Session, category: Optional[str] = None):
    q = db.query(models.Review)
    if category:
        q = q.filter(models.Review.category == category)
    return q.order_by(models.Review.created_at.desc()).all()

def delete_review(db: Session, review_id: int):
    r = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not r:
        return False
    db.delete(r)
    db.commit()
    return True

# ── Dashboard Stats ────────────────────────────────────────
def get_dashboard_stats(db: Session):
    total_complaints = db.query(func.count(models.Complaint.id)).scalar()
    pending = db.query(func.count(models.Complaint.id)).filter(
        models.Complaint.status == "pending").scalar()
    in_progress = db.query(func.count(models.Complaint.id)).filter(
        models.Complaint.status == "in_progress").scalar()
    resolved = db.query(func.count(models.Complaint.id)).filter(
        models.Complaint.status == "resolved").scalar()
    rejected = db.query(func.count(models.Complaint.id)).filter(
        models.Complaint.status == "rejected").scalar()
    total_reviews = db.query(func.count(models.Review.id)).scalar()
    avg_rating = db.query(func.avg(models.Review.rating)).scalar()
    total_users = db.query(func.count(models.User.id)).scalar()

    by_category = db.query(
        models.Complaint.category,
        func.count(models.Complaint.id)
    ).group_by(models.Complaint.category).all()

    return {
        "total_complaints": total_complaints,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "rejected": rejected,
        "total_reviews": total_reviews,
        "avg_rating": round(float(avg_rating), 2) if avg_rating else 0,
        "total_users": total_users,
        "by_category": [{"category": c, "count": n} for c, n in by_category]
    }
