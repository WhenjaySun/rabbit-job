# requests
Act as an expert full-stack developer to build "rabbit-job", a lightweight task scheduling system inspired by xxl-job and Qinglong Panel. Backend: Python 3.11+, FastAPI, APScheduler, Pydantic, SQLAlchemy (with SQLite). Frontend: React (Vite), TypeScript, shadcn/ui, Tailwind CSS, Zod, tanstack-query. Core Features: 1) Task Management: Web UI for CRUD; tasks need name, description, cron, script_type (shell/python), script_content, status, timeout; requires full RESTful API. 2) Scheduling & Execution: Use APScheduler for cron triggers, execute shell/python scripts, and include a "Run Now" button. 3) Logging & Monitoring: Capture stdout/stderr, provide a UI log viewer, and record execution history (time, status, result). 4) Frontend UX: Use shadcn/ui Table for task list, Dialog for add/edit forms with Zod validation, Switch for toggling status, and tanstack-query for data fetching. First, confirm you understand the blueprint; I will then request code step-by-step.

# start frontend
cd frontend

npm run dev

# start backend
cd backend

.venv\\Scripts\\activate

uvicorn app.main:app --reload