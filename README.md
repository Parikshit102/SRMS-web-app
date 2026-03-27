# 🎓 SCRMS — Smart Complaint & Reviews Management System

A full-stack college complaint and review management portal built with:
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: FastAPI + SQLAlchemy
- **Database**: PostgreSQL

---

## 📁 Project Structure

```
smart-complaints/
├── backend/
│   ├── main.py          ← FastAPI app + all API routes
│   ├── models.py        ← SQLAlchemy database models
│   ├── schemas.py       ← Pydantic request/response schemas
│   ├── crud.py          ← Database CRUD operations
│   ├── auth.py          ← JWT authentication + bcrypt
│   ├── database.py      ← PostgreSQL connection config
│   ├── seed.py          ← Demo data seeder
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx
        ├── utils/
        │   └── api.js
        ├── components/
        │   └── Layout.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── Complaints.jsx
            ├── NewComplaint.jsx
            ├── Reviews.jsx
            ├── NewReview.jsx
            └── AdminPanel.jsx
```

---

## ⚙️ Setup Instructions

### 1. PostgreSQL Setup

Make sure PostgreSQL is installed and running, then:

```sql
CREATE DATABASE smart_complaints_db;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set your database URL (edit database.py or use env variable)
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/smart_complaints_db"

# Run the server
uvicorn main:app --reload --port 8000
```

The API will be available at: http://localhost:8000
Interactive docs at: http://localhost:8000/docs

### 3. Seed Demo Data

```bash
cd backend
python seed.py
```

This creates 5 demo users:
| Email | Password | Role |
|---|---|---|
| admin@college.edu | admin123 | Admin |
| staff@college.edu | staff123 | Staff |
| student@college.edu | student123 | Student |
| priya@college.edu | priya123 | Student |
| rohit@college.edu | rohit123 | Student |

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

App will be available at: http://localhost:5173

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login and get JWT token |
| GET | /users/me | Get current user profile |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /complaints | Submit a new complaint |
| GET | /complaints | List complaints (filtered by role) |
| GET | /complaints/{id} | Get a specific complaint |
| PATCH | /complaints/{id}/status | Update complaint status (staff/admin) |
| DELETE | /complaints/{id} | Delete complaint (admin only) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /reviews | Submit a new review |
| GET | /reviews | List all reviews |
| DELETE | /reviews/{id} | Delete review (admin only) |

### Stats
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /stats/dashboard | Get dashboard statistics |

---

## ✨ Features

- **Role-Based Access Control**: Student / Staff / Admin roles
- **Complaints System**: Submit, filter, prioritize, and track complaints
- **Review System**: Star ratings with category breakdown
- **Dashboard**: Live stats, category charts, per-user views
- **Admin Panel**: User management, full complaints overview
- **JWT Auth**: Secure login with 24-hour token expiry
- **Responsive UI**: Works on desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS |
| HTTP Client | Axios |
| Icons | Lucide React |
| Fonts | Syne (Google Fonts) |
| Backend | FastAPI, Uvicorn |
| ORM | SQLAlchemy 2.0 |
| Database | PostgreSQL |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Validation | Pydantic v2 |
