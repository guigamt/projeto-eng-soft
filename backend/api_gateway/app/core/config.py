from typing import Dict

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = Field(default="API Gateway")
    api_prefix: str = Field(default="/gateway")
    services: Dict[str, str] = Field(
        default={
            "auth": "http://localhost:8001/auth",
            "profiles": "http://localhost:8002/api",
            "projects": "http://localhost:8003/projects",
            "applications": "http://localhost:8004/applications",
            "match": "http://localhost:8005/match",
            "notifications": "http://localhost:8006/notifications",
        }
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
