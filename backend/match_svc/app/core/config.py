from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    api_prefix: str = Field(default="/match")
    app_name: str = Field(default="Match Service")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
