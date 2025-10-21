from typing import Optional

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models.collaborator_profile import CollaboratorProfile
from app.models.interest import Interest
from app.models.portfolio import PortfolioItem
from app.models.skill import Skill
from app.schemas.collaborator import CollaboratorCreate, CollaboratorUpdate
from app.schemas.interest import InterestCreate
from app.schemas.portfolio import PortfolioItemCreate
from app.schemas.skill import SkillCreate


def get_profile_by_user_id(session: Session, user_id: int) -> Optional[CollaboratorProfile]:
    statement = select(CollaboratorProfile).where(CollaboratorProfile.user_id == user_id)
    return session.exec(statement).first()


def create_profile(session: Session, user_id: int, data: CollaboratorCreate) -> CollaboratorProfile:
    existing = get_profile_by_user_id(session, user_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists for this user.",
        )

    profile = CollaboratorProfile(user_id=user_id, **data.dict(exclude_unset=True))
    session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile


def update_profile(
    session: Session, profile: CollaboratorProfile, data: CollaboratorUpdate
) -> CollaboratorProfile:
    for field, value in data.dict(exclude_unset=True).items():
        setattr(profile, field, value)

    session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile


def add_skill(session: Session, profile: CollaboratorProfile, data: SkillCreate) -> Skill:
    skill = Skill(collaborator_id=profile.id, **data.dict())
    session.add(skill)
    session.commit()
    session.refresh(skill)
    return skill


def remove_skill(session: Session, profile: CollaboratorProfile, skill_id: int) -> None:
    statement = select(Skill).where(
        Skill.id == skill_id, Skill.collaborator_id == profile.id
    )
    skill = session.exec(statement).first()
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found.")

    session.delete(skill)
    session.commit()


def add_interest(
    session: Session, profile: CollaboratorProfile, data: InterestCreate
) -> Interest:
    statement = select(Interest).where(
        Interest.collaborator_id == profile.id, Interest.slug == data.slug
    )
    if session.exec(statement).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Interest already added."
        )

    interest = Interest(collaborator_id=profile.id, **data.dict())
    session.add(interest)
    session.commit()
    session.refresh(interest)
    return interest


def remove_interest(session: Session, profile: CollaboratorProfile, interest_id: int) -> None:
    statement = select(Interest).where(
        Interest.id == interest_id, Interest.collaborator_id == profile.id
    )
    interest = session.exec(statement).first()
    if not interest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Interest not found."
        )
    session.delete(interest)
    session.commit()


def add_portfolio_item(
    session: Session, profile: CollaboratorProfile, data: PortfolioItemCreate
) -> PortfolioItem:
    item = PortfolioItem(collaborator_id=profile.id, **data.dict(exclude_unset=True))
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


def remove_portfolio_item(
    session: Session, profile: CollaboratorProfile, item_id: int
) -> None:
    statement = select(PortfolioItem).where(
        PortfolioItem.id == item_id, PortfolioItem.collaborator_id == profile.id
    )
    item = session.exec(statement).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio item not found."
    )
    session.delete(item)
    session.commit()
