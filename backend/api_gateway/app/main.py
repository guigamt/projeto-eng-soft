from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_gateway import router as gateway_router
from app.core.config import settings


def create_app() -> FastAPI:
    application = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        description="Simple API gateway placeholder exposing service registry for the platform.",
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(gateway_router, prefix=settings.api_prefix)

    @application.get("/health", tags=["system"])
    def healthcheck() -> dict[str, str]:
        return {"status": "ok"}

    return application


app = create_app()

