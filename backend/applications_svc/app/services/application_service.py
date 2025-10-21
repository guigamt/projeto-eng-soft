from datetime import datetime
from typing import List, Optional

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models.application import Application, ApplicationStatus
from app.schemas.application import ApplicationCreate, ApplicationUpdate


def create_application(
    session: Session, collaborator_id: int, payload: ApplicationCreate
) -> Application:
    application = Application(
        collaborator_id=collaborator_id,
        project_id=payload.project_id,
        pitch=payload.pitch,
        status=ApplicationStatus.SUBMITTED,
    )
    session.add(application)
    session.commit()
    session.refresh(application)
    return application


def get_application(session: Session, application_id: int) -> Optional[Application]:
    return session.get(Application, application_id)


def list_by_collaborator(session: Session, collaborator_id: int) -> List[Application]:
    statement = select(Application).where(Application.collaborator_id == collaborator_id)
    return list(session.exec(statement).all())


def update_application(
    session: Session, application_id: int, payload: ApplicationUpdate
) -> Application:
    application = get_application(session, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Application not found."
        )
    application.status = payload.status
    application.updated_at = datetime.utcnow()
    session.add(application)
    session.commit()
    session.refresh(application)
    return application

