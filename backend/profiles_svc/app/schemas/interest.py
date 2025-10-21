from sqlmodel import SQLModel


class InterestBase(SQLModel):
    slug: str
    label: str


class InterestCreate(InterestBase):
    pass


class InterestRead(InterestBase):
    id: int

    class Config:
        orm_mode = True

