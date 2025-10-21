from datetime import datetime
from typing import Dict

from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/services", tags=["gateway"])
def list_registered_services() -> Dict[str, str]:
    return settings.services


@router.get("/status", tags=["gateway"])
def gateway_status():
    return {
        "timestamp": datetime.utcnow(),
        "services_monitored": list(settings.services.keys()),
        "note": "This gateway provides static service discovery for MVP. "
        "Use an API gateway (Kong/Traefik) for production routing.",
    }

