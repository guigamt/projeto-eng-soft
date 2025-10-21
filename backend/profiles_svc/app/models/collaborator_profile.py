import enum
from typing import List, Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.interest import Interest
    from app.models.portfolio import PortfolioItem
    from app.models.skill import Skill


class WorkMode(str, enum.Enum):
    REMOTE = "REMOTE"
    HYBRID = "HYBRID"
    ONSITE = "ONSITE"


class CollaboratorProfile(SQLModel, table=True):
    """Represents the public profile of a collaborator."""

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True, unique=True)
    headline: Optional[str] = Field(default=None, max_length=120)
    bio: Optional[str] = Field(default=None, max_length=500)
    location_city: Optional[str] = Field(default=None, max_length=80)
    location_state: Optional[str] = Field(default=None, max_length=2, description="UF")
    availability_hours_per_week: Optional[int] = Field(default=None, ge=0, le=168)
    work_mode: Optional[WorkMode] = Field(default=None)

    skills: List["Skill"] = Relationship(
        back_populates="collaborator",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    interests: List["Interest"] = Relationship(
        back_populates="collaborator",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    portfolio_items: List["PortfolioItem"] = Relationship(
        back_populates="collaborator",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
