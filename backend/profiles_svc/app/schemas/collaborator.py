from __future__ import annotations

from typing import List, Optional

from sqlmodel import SQLModel

from app.models.collaborator_profile import WorkMode
from app.schemas.interest import InterestRead
from app.schemas.portfolio import PortfolioItemRead
from app.schemas.skill import SkillRead


class CollaboratorBase(SQLModel):
    headline: Optional[str] = None
    bio: Optional[str] = None
    location_city: Optional[str] = None
    location_state: Optional[str] = None
    availability_hours_per_week: Optional[int] = None
    work_mode: Optional[WorkMode] = None


class CollaboratorCreate(CollaboratorBase):
    pass


class CollaboratorUpdate(CollaboratorBase):
    pass


class CollaboratorRead(CollaboratorBase):
    id: int
    user_id: int
    skills: List[SkillRead] = []
    interests: List[InterestRead] = []
    portfolio_items: List[PortfolioItemRead] = []

    class Config:
        orm_mode = True

