from __future__ import annotations

import enum
from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class ApplicationStatus(str, enum.Enum):
    SUBMITTED = "SUBMITTED"
    REVIEWING = "REVIEWING"
    ACCEPTED = "ACCEPTED"
    DECLINED = "DECLINED"
    WITHDRAWN = "WITHDRAWN"


class Application(SQLModel, table=True):
    """Represents a collaborator application for a project."""

    id: Optional[int] = Field(default=None, primary_key=True)
    collaborator_id: int = Field(index=True)
    project_id: int = Field(index=True)
    pitch: str = Field(max_length=1000)
    status: ApplicationStatus = Field(default=ApplicationStatus.SUBMITTED)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

