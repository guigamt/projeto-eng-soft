from typing import Optional

from sqlmodel import SQLModel


class SkillBase(SQLModel):
    name: str
    level: int


class SkillCreate(SkillBase):
    pass


class SkillRead(SkillBase):
    id: int

    class Config:
        orm_mode = True

