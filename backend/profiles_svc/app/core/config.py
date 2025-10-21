from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application-wide configuration loaded from environment variables."""

    sql_database_url: str = Field(
        default="sqlite:///./profiles.db", env="PROFILES_DATABASE_URL"
    )
    api_prefix: str = Field(default="/api")
    app_name: str = Field(default="Collaborator Profiles Service")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
