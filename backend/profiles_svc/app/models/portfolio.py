from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.collaborator_profile import CollaboratorProfile


class PortfolioItem(SQLModel, table=True):
    """Public project references for a collaborator."""

    id: Optional[int] = Field(default=None, primary_key=True)
    collaborator_id: int = Field(foreign_key="collaboratorprofile.id", index=True)
    title: str = Field(max_length=120)
    url: str = Field(max_length=255)
    description: str = Field(default="", max_length=500)
    thumb_url: str = Field(default="", max_length=255)

    collaborator: "CollaboratorProfile" = Relationship(
        back_populates="portfolio_items"
    )
