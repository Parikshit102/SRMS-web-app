from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ── User ──────────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "student"
    department: Optional[str] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    department: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# ── Complaint ──────────────────────────────────────────────
class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str
    priority: str = "medium"

class StatusUpdate(BaseModel):
    status: str
    response: Optional[str] = None

class ComplaintOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    status: str
    priority: str
    staff_response: Optional[str]
    user_id: int
    user: Optional[UserOut]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# ── Review ─────────────────────────────────────────────────
class ReviewCreate(BaseModel):
    title: str
    content: str
    category: str
    rating: float

class ReviewOut(BaseModel):
    id: int
    title: str
    content: str
    category: str
    rating: float
    user_id: int
    user: Optional[UserOut]
    created_at: datetime

    class Config:
        from_attributes = True
