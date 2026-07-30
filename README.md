# HireLens AI

> **AI-Powered Resume Screening & Candidate Intelligence Platform**

HireLens AI is a production-ready, enterprise-grade SaaS application designed to streamline recruiting workflows. It matches candidate resumes to job specifications using semantic matching, detects resume fraud, and analyzes hiring metrics.

---

## 🛠️ Project Status: Step 1 Complete

Currently, **Step 1 (Authentication & Users Module)** and the **Frontend Workspace UI Core** are fully implemented and verified.

### Backend Capabilities:
- **FastAPI Core**: Consistently routed, fully typed backend using Python 3.13.
- **SQLAlchemy 2.0 Async**: Models for `users`, `roles`, `permissions`, `companies`, and `refresh_tokens`.
- **JWT & Password Security**: Hashing using raw `bcrypt` and session tokens with rotation using `jose`.
- **Auto-Migrated Database**: Database updates managed via Alembic (configured with an automatic SQLite fallback for simple local development).

### Frontend Capabilities:
- **Next.js 15 App Router**: Modern SaaS landing page, registration, login, and recruiter/candidate dashboard.
- **Dynamic Job Creation Modal**: Fully interactive dialogue adding new positions dynamically into the recruiter pipeline select dropdown.
- **ATS Resume Upload Evaluator**: Interactive drag-and-drop file picker simulating local NLP schema analysis and rendering color-coded capabilities match, identified skill gaps, and compliance checklists.
- **Seamless Navigation**: Floating top-left back navigation anchors on authentication pages and session-routing middleware.

---

## 🚀 Local Development Setup 

Follow these steps to set up and run the services locally.

### 1. Prerequisites
Ensure you have **Python 3.13** and **Node.js** installed on your system.

### 2. Backend Setup
From the project root:

```bash
# Create Python virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r backend/requirements.txt

# Run database migrations
cd backend
alembic upgrade head

# Start backend server
PYTHONPATH=. python main.py
```
- **API Server Address**: `http://localhost:8000`
- **Interactive OpenAPI Documentation**: `http://localhost:8000/docs`

### 3. Frontend Setup
Open a new terminal session, navigate to the project root, and execute:

```bash
cd frontend

# Install package dependencies
npm install

# Start development server
npm run dev
```
- **Frontend App Address**: `http://localhost:3000`
- **Authentication Pages**: `/login` (pre-filled recruiter/candidate demo accounts), `/register`, and `/dashboard`.

---

## 🧪 Testing

To run the backend integration test suite:
```bash
cd backend
source ../.venv/bin/activate
PYTHONPATH=. pytest
```
All tests use an in-memory SQLite database and execute in under 2 seconds.

---

## 📁 Repository Structure
```
HireLens-AI/
├── backend/                   # FastAPI Backend
│   ├── app/
│   │   ├── api/               # API Router & Middleware (deps.py)
│   │   │   └── endpoints/     # Route handlers (auth.py)
│   │   ├── core/              # Config, database connections, and security logic
│   │   ├── models/            # SQLAlchemy database tables (user.py)
│   │   ├── repositories/      # Database Access Object layer (base.py, user.py)
│   │   ├── schemas/           # Pydantic validation schemas (user.py)
│   │   └── services/          # Core Business logic handlers (user.py)
│   ├── alembic/               # Database migrations folder
│   ├── tests/                 # Integration tests (conftest.py, test_auth.py)
│   ├── alembic.ini            # Alembic configuration
│   ├── pytest.ini             # Pytest config rules
│   ├── requirements.txt       # Dependencies list
│   └── main.py                # App entrypoint
├── frontend/                  # Next.js 15 Frontend App
│   ├── app/                   # App Router views (login, register, dashboard, page.tsx)
│   ├── components/            # Providers and client UI nodes
│   └── package.json           # Frontend dependencies
├── .venv/                     # Python Virtual Environment
├── task.md                    # Core roadmap TODO tracking sheet
├── walkthrough.md             # Implementation & validation log
└── README.md                  # This file
```
