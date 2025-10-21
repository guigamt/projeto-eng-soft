from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Settings for the projects microservice."""

    sql_database_url: str = Field(
        default="sqlite:///./projects.db", env="PROJECTS_DATABASE_URL"
    )
    api_prefix: str = Field(default="/projects")
    app_name: str = Field(default="Projects Service")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
