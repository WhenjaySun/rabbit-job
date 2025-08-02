
import json
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.orm import Session
from . import crud, schemas
import subprocess
import datetime

scheduler = AsyncIOScheduler()

def run_script(db: Session, job_id: int, script_type: str, script_content: str, timeout: int):
    try:
        if script_type == "shell":
            result = subprocess.run(script_content, shell=True, capture_output=True, text=True, timeout=timeout)
            output = result.stdout + result.stderr
            status = "success" if result.returncode == 0 else "failed"
        elif script_type == "python":
            result = subprocess.run(["python", "-c", script_content], capture_output=True, text=True, timeout=timeout)
            output = result.stdout + result.stderr
            status = "success" if result.returncode == 0 else "failed"
        else:
            status = "failed"
            output = f"Unsupported script type: {script_type}"
    except subprocess.TimeoutExpired:
        status = "failed"
        output = "Script timed out"
    except Exception as e:
        status = "failed"
        output = str(e)

    log = schemas.JobLogCreate(job_id=job_id, status=status, output=output)
    crud.create_job_log(db, log)

def schedule_job(db: Session, job):
    if job.status and job.cron:
        try:
            cron_data = json.loads(job.cron)
            scheduler.add_job(run_script, "cron", id=str(job.id), args=[db, job.id, job.script_type, job.script_content, job.timeout], **cron_data)
        except json.JSONDecodeError:
            print(f"Skipping job {job.id} due to invalid cron string.")

def reschedule_job(db: Session, job):
    scheduler.remove_job(str(job.id))
    schedule_job(db, job)

def remove_job_from_scheduler(job_id: int):
    scheduler.remove_job(str(job_id))
