from typing import Optional

from sqlmodel import SQLModel


class PortfolioItemBase(SQLModel):
    title: str
    url: str
    description: Optional[str] = ""
    thumb_url: Optional[str] = ""


class PortfolioItemCreate(PortfolioItemBase):
    pass


class PortfolioItemRead(PortfolioItemBase):
    id: int

    class Config:
        orm_mode = True

