
from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime
from .database import Base
import datetime

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    cron = Column(String)
    script_type = Column(String)
    script_content = Column(Text)
    status = Column(Boolean, default=True)
    timeout = Column(Integer, default=60)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class JobLog(Base):
    __tablename__ = "job_logs"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, index=True)
    status = Column(String)
    output = Column(Text)
    execution_time = Column(DateTime, default=datetime.datetime.utcnow)
