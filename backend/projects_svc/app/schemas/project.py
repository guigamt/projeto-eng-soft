from datetime import datetime
from typing import List, Optional

from sqlmodel import SQLModel

from app.models.project import WorkMode


class ProjectBase(SQLModel):
    name: str
    headline: str
    description: str
    tags: List[str] = []
    slots: int = 1
    work_mode: WorkMode = WorkMode.REMOTE
    remote: bool = True
    location: Optional[str] = None


class ProjectCreate(ProjectBase):
    owner_id: Optional[int] = None


class ProjectUpdate(SQLModel):
    name: Optional[str] = None
    headline: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    slots: Optional[int] = None
    work_mode: Optional[WorkMode] = None
    remote: Optional[bool] = None
    location: Optional[str] = None


class ProjectRead(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

