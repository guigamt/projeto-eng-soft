from datetime import datetime
from typing import Any, Dict

from fastapi import APIRouter, status

router = APIRouter()


@router.post(
    "/email",
    status_code=status.HTTP_202_ACCEPTED,
    tags=["notifications"],
)
def schedule_email_notification(payload: Dict[str, Any]):
    return {
        "type": "email",
        "accepted_at": datetime.utcnow(),
        "payload": payload,
        "status": "queued",
    }


@router.post(
    "/in-app",
    status_code=status.HTTP_202_ACCEPTED,
    tags=["notifications"],
)
def schedule_in_app_notification(payload: Dict[str, Any]):
    return {
        "type": "in-app",
        "accepted_at": datetime.utcnow(),
        "payload": payload,
        "status": "queued",
    }

