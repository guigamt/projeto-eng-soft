from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.core.security import get_current_user_id
from app.db.session import get_session
from app.schemas.application import (
    ApplicationCreate,
    ApplicationRead,
    ApplicationUpdate,
)
from app.services import application_service

router = APIRouter()


@router.post(
    "",
    response_model=ApplicationRead,
    status_code=status.HTTP_201_CREATED,
    tags=["applications"],
)
def create_application(
    payload: ApplicationCreate,
    collaborator_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    return application_service.create_application(session, collaborator_id, payload)


@router.get(
    "/me",
    response_model=List[ApplicationRead],
    tags=["applications"],
)
def list_my_applications(
    collaborator_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    return application_service.list_by_collaborator(session, collaborator_id)


@router.get(
    "/{application_id}",
    response_model=ApplicationRead,
    tags=["applications"],
)
def get_application(
    application_id: int,
    session: Session = Depends(get_session),
):
    application = application_service.get_application(session, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Application not found."
        )
    return application


@router.patch(
    "/{application_id}",
    response_model=ApplicationRead,
    tags=["applications"],
)
def update_application_status(
    application_id: int,
    payload: ApplicationUpdate,
    session: Session = Depends(get_session),
):
    return application_service.update_application(session, application_id, payload)
