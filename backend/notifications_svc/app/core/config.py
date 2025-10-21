from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    api_prefix: str = Field(default="/notifications")
    app_name: str = Field(default="Notifications Service")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
