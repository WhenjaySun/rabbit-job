
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, models, schemas, scheduler
from .database import SessionLocal, engine
from typing import List

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
async def startup_event():
    scheduler.scheduler.start()
    db = SessionLocal()
    jobs = crud.get_jobs(db)
    for job in jobs:
        scheduler.schedule_job(db, job)
    db.close()

@app.on_event("shutdown")
async def shutdown_event():
    scheduler.scheduler.shutdown()

@app.post("/jobs/", response_model=schemas.Job)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    db_job = crud.create_job(db=db, job=job)
    scheduler.schedule_job(db, db_job)
    return db_job

@app.get("/jobs/", response_model=List[schemas.Job])
def read_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    jobs = crud.get_jobs(db, skip=skip, limit=limit)
    return jobs

@app.get("/jobs/{job_id}", response_model=schemas.Job)
def read_job(job_id: int, db: Session = Depends(get_db)):
    db_job = crud.get_job(db, job_id=job_id)
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return db_job

@app.put("/jobs/{job_id}", response_model=schemas.Job)
def update_job(job_id: int, job: schemas.JobUpdate, db: Session = Depends(get_db)):
    db_job = crud.update_job(db=db, job_id=job_id, job=job)
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    scheduler.reschedule_job(db, db_job)
    return db_job

@app.delete("/jobs/{job_id}", response_model=schemas.Job)
def delete_job(job_id: int, db: Session = Depends(get_db)):
    db_job = crud.delete_job(db=db, job_id=job_id)
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    scheduler.remove_job_from_scheduler(job_id)
    return db_job

@app.post("/jobs/{job_id}/run")
def run_job_now(job_id: int, db: Session = Depends(get_db)):
    db_job = crud.get_job(db, job_id=job_id)
    if db_job is None:
        raise HTTPException(status_code=44, detail="Job not found")
    scheduler.run_script(db, db_job.id, db_job.script_type, db_job.script_content, db_job.timeout)
    return {"message": "Job executed"}

@app.get("/jobs/{job_id}/logs", response_model=List[schemas.JobLog])
def read_job_logs(job_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logs = crud.get_job_logs(db, job_id=job_id, skip=skip, limit=limit)
    return logs
