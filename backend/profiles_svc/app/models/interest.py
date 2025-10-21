from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.collaborator_profile import CollaboratorProfile


class Interest(SQLModel, table=True):
    """Domain interest tag linked to a collaborator."""

    id: Optional[int] = Field(default=None, primary_key=True)
    collaborator_id: int = Field(foreign_key="collaboratorprofile.id", index=True)
    slug: str = Field(max_length=60, index=True)
    label: str = Field(max_length=80)

    collaborator: "CollaboratorProfile" = Relationship(back_populates="interests")
