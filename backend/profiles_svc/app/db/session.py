from contextlib import contextmanager
from typing import Iterator

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings


def _build_engine():
    connect_args = {}
    if settings.sql_database_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False
    return create_engine(settings.sql_database_url, echo=False, connect_args=connect_args)


engine = _build_engine()


def init_db() -> None:
    """Create database tables if they do not exist."""
    SQLModel.metadata.create_all(engine)


@contextmanager
def session_scope() -> Iterator[Session]:
    """Provide a transactional scope around a series of operations."""
    with Session(engine) as session:
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise


def get_session() -> Iterator[Session]:
    """FastAPI dependency that yields a session per request."""
    with Session(engine) as session:
        yield session

