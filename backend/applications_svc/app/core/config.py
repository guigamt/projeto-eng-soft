from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Configuration for the applications microservice."""

    sql_database_url: str = Field(
        default="sqlite:///./applications.db", env="APPLICATIONS_DATABASE_URL"
    )
    api_prefix: str = Field(default="/applications")
    app_name: str = Field(default="Applications Service")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
