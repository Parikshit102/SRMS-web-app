from fastapi import FastAPI, HTTPException, Depends, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas, crud, auth
from database import SessionLocal, engine
import uvicorn

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Complaint & Reviews Management System",
    description="College Complaint & Review Management API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    user = auth.verify_token(token, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user

# ───────────────────────── AUTH ─────────────────────────
@app.post("/auth/register", response_model=schemas.UserOut, status_code=201)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)

@app.post("/auth/login", response_model=schemas.TokenResponse)
def login(creds: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, creds.email, creds.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = auth.create_token(user.id, user.role)
    return {"access_token": token, "token_type": "bearer", "user": user}

# ───────────────────────── USERS ─────────────────────────
@app.get("/users/me", response_model=schemas.UserOut)
def me(current_user=Depends(get_current_user)):
    return current_user

@app.get("/users", response_model=List[schemas.UserOut])
def list_users(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return crud.get_all_users(db)

# ───────────────────────── COMPLAINTS ─────────────────────────
@app.post("/complaints", response_model=schemas.ComplaintOut, status_code=201)
def create_complaint(
    complaint: schemas.ComplaintCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return crud.create_complaint(db, complaint, current_user.id)

@app.get("/complaints", response_model=List[schemas.ComplaintOut])
def list_complaints(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role in ("admin", "staff"):
        return crud.get_all_complaints(db, status=status, category=category)
    return crud.get_user_complaints(db, current_user.id)

@app.get("/complaints/{complaint_id}", response_model=schemas.ComplaintOut)
def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    c = crud.get_complaint(db, complaint_id)
    if not c:
        raise HTTPException(status_code=404, detail="Complaint not found")
    if current_user.role == "student" and c.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return c

@app.patch("/complaints/{complaint_id}/status", response_model=schemas.ComplaintOut)
def update_complaint_status(
    complaint_id: int,
    update: schemas.StatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Staff/Admin only")
    c = crud.update_complaint_status(db, complaint_id, update.status, update.response)
    if not c:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return c

@app.delete("/complaints/{complaint_id}", status_code=204)
def delete_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    if not crud.delete_complaint(db, complaint_id):
        raise HTTPException(status_code=404, detail="Complaint not found")

# ───────────────────────── REVIEWS ─────────────────────────
@app.post("/reviews", response_model=schemas.ReviewOut, status_code=201)
def create_review(
    review: schemas.ReviewCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return crud.create_review(db, review, current_user.id)

@app.get("/reviews", response_model=List[schemas.ReviewOut])
def list_reviews(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return crud.get_all_reviews(db, category=category)

@app.delete("/reviews/{review_id}", status_code=204)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    if not crud.delete_review(db, review_id):
        raise HTTPException(status_code=404, detail="Review not found")

# ───────────────────────── DASHBOARD / STATS ─────────────────────────
@app.get("/stats/dashboard")
def dashboard_stats(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Staff/Admin only")
    return crud.get_dashboard_stats(db)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
