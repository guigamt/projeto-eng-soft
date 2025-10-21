from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.collaborator_profile import CollaboratorProfile


class Skill(SQLModel, table=True):
    """Technical or soft skill linked to a collaborator profile."""

    id: Optional[int] = Field(default=None, primary_key=True)
    collaborator_id: int = Field(foreign_key="collaboratorprofile.id", index=True)
    name: str = Field(max_length=80)
    level: int = Field(ge=1, le=5)

    collaborator: "CollaboratorProfile" = Relationship(back_populates="skills")
