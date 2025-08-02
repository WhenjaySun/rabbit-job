
from pydantic import BaseModel
from typing import Optional
import datetime

class JobBase(BaseModel):
    name: str
    description: Optional[str] = None
    cron: str
    script_type: str
    script_content: str
    status: bool = True
    timeout: int = 60

class JobCreate(JobBase):
    pass

class JobUpdate(JobBase):
    pass

class Job(JobBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        orm_mode = True

class JobLogBase(BaseModel):
    job_id: int
    status: str
    output: str

class JobLogCreate(JobLogBase):
    pass

class JobLog(JobLogBase):
    id: int
    execution_time: datetime.datetime

    class Config:
        orm_mode = True
