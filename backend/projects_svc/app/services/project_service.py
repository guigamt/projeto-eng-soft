from datetime import datetime
from typing import List, Optional

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


def list_projects(session: Session, tag: Optional[str] = None) -> List[Project]:
    projects = list(session.exec(select(Project)).all())
    if tag:
        tag_lower = tag.lower()
        return [
            project
            for project in projects
            if any(t.lower() == tag_lower for t in project.tags)
        ]
    return projects


def get_project(session: Session, project_id: int) -> Optional[Project]:
    return session.get(Project, project_id)


def create_project(session: Session, payload: ProjectCreate, owner_id: int) -> Project:
    project = Project(
        owner_id=owner_id,
        name=payload.name,
        headline=payload.headline,
        description=payload.description,
        tags=payload.tags,
        slots=payload.slots,
        work_mode=payload.work_mode,
        remote=payload.remote,
        location=payload.location,
    )
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


def update_project(
    session: Session, project_id: int, owner_id: int, payload: ProjectUpdate
) -> Project:
    project = get_project(session, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found."
        )
    if project.owner_id != owner_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only project owner can update it.",
        )

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(project, field, value)
    project.updated_at = datetime.utcnow()

    session.add(project)
    session.commit()
    session.refresh(project)
    return project


def delete_project(session: Session, project_id: int, owner_id: int) -> None:
    project = get_project(session, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found."
        )
    if project.owner_id != owner_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only project owner can delete it.",
        )
    session.delete(project)
    session.commit()
