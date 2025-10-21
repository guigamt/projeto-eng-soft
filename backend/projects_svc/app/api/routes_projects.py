from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session

from app.core.security import get_current_user_id
from app.db.session import get_session
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from app.services import project_service

router = APIRouter()


@router.get(
    "",
    response_model=List[ProjectRead],
    tags=["projects"],
)
def list_projects(
    tag: Optional[str] = Query(default=None, description="Filter by tag"),
    session: Session = Depends(get_session),
):
    return project_service.list_projects(session, tag)


@router.get(
    "/{project_id}",
    response_model=ProjectRead,
    tags=["projects"],
)
def get_project(
    project_id: int,
    session: Session = Depends(get_session),
):
    project = project_service.get_project(session, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found."
        )
    return project


@router.post(
    "",
    response_model=ProjectRead,
    status_code=status.HTTP_201_CREATED,
    tags=["projects"],
)
def create_project(
    payload: ProjectCreate,
    owner_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    return project_service.create_project(session, payload, owner_id)


@router.put(
    "/{project_id}",
    response_model=ProjectRead,
    tags=["projects"],
)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    owner_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    return project_service.update_project(session, project_id, owner_id, payload)


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["projects"],
)
def delete_project(
    project_id: int,
    owner_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    project_service.delete_project(session, project_id, owner_id)
