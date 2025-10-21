from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.db.session import get_session
from app.core.security import get_current_user_id
from app.services import collaborator_service as service
from app.schemas.collaborator import (
    CollaboratorCreate,
    CollaboratorRead,
    CollaboratorUpdate,
)
from app.schemas.interest import InterestCreate, InterestRead
from app.schemas.portfolio import PortfolioItemCreate, PortfolioItemRead
from app.schemas.skill import SkillCreate, SkillRead

router = APIRouter()


def ensure_profile(session: Session, user_id: int):
    profile = service.get_profile_by_user_id(session, user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaborator profile not found.",
        )
    return profile


@router.get(
    "/profiles/collaborators/me", response_model=CollaboratorRead, tags=["profiles"]
)
def get_my_profile(
    user_id: int = Depends(get_current_user_id), session: Session = Depends(get_session)
):
    profile = service.get_profile_by_user_id(session, user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaborator profile not found.",
        )
    return profile


@router.post(
    "/profiles/collaborators",
    response_model=CollaboratorRead,
    status_code=status.HTTP_201_CREATED,
    tags=["profiles"],
)
def create_my_profile(
    payload: CollaboratorCreate,
    user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    profile = service.create_profile(session, user_id=user_id, data=payload)
    return profile


@router.put(
    "/profiles/collaborators/me",
    response_model=CollaboratorRead,
    tags=["profiles"],
)
def update_my_profile(
    payload: CollaboratorUpdate,
    user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    profile = ensure_profile(session, user_id)
    return service.update_profile(session, profile, payload)


@router.post(
    "/profiles/collaborators/me/skills",
    response_model=SkillRead,
    status_code=status.HTTP_201_CREATED,
    tags=["skills"],
)
def add_skill_to_profile(
    payload: SkillCreate,
    user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    profile = ensure_profile(session, user_id)
    return service.add_skill(session, profile, payload)


@router.delete(
    "/profiles/collaborators/me/skills/{skill_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["skills"],
)
def remove_skill_from_profile(
    skill_id: int,
    user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    profile = ensure_profile(session, user_id)
    service.remove_skill(session, profile, skill_id)


@router.post(
    "/profiles/collaborators/me/interests",
    response_model=InterestRead,
    status_code=status.HTTP_201_CREATED,
    tags=["interests"],
)
def add_interest_to_profile(
    payload: InterestCreate,
    user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    profile = ensure_profile(session, user_id)
    return service.add_interest(session, profile, payload)


@router.delete(
    "/profiles/collaborators/me/interests/{interest_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["interests"],
)
def remove_interest_from_profile(
    interest_id: int,
    user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    profile = ensure_profile(session, user_id)
    service.remove_interest(session, profile, interest_id)


@router.post(
    "/profiles/collaborators/me/portfolio",
    response_model=PortfolioItemRead,
    status_code=status.HTTP_201_CREATED,
    tags=["portfolio"],
)
def add_portfolio_item_to_profile(
    payload: PortfolioItemCreate,
    user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    profile = ensure_profile(session, user_id)
    return service.add_portfolio_item(session, profile, payload)


@router.delete(
    "/profiles/collaborators/me/portfolio/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["portfolio"],
)
def remove_portfolio_item_from_profile(
    item_id: int,
    user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    profile = ensure_profile(session, user_id)
    service.remove_portfolio_item(session, profile, item_id)

