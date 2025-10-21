from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel

from app.models.application import ApplicationStatus


class ApplicationBase(SQLModel):
    project_id: int
    pitch: str


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(SQLModel):
    status: ApplicationStatus


class ApplicationRead(ApplicationBase):
    id: int
    collaborator_id: int
    status: ApplicationStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

