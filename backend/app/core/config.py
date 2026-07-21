from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    app_name: str = "NexMeet API"
    environment: str = "development"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
