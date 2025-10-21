from __future__ import annotations

import enum
from datetime import datetime
from typing import List, Optional

from sqlalchemy import Column, JSON
from sqlmodel import Field, SQLModel


class WorkMode(str, enum.Enum):
    REMOTE = "REMOTE"
    HYBRID = "HYBRID"
    ONSITE = "ONSITE"


class Project(SQLModel, table=True):
    """Project metadata available for collaborators."""

    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(index=True)
    name: str = Field(max_length=120)
    headline: str = Field(max_length=180)
    description: str = Field(max_length=1500)
    tags: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    slots: int = Field(default=1, ge=1)
    work_mode: WorkMode = Field(default=WorkMode.REMOTE)
    remote: bool = Field(default=True)
    location: Optional[str] = Field(default=None, max_length=120)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

