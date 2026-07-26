from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "NexMeet API"
    environment: str = "development"

    jwt_secret_key: str = "dev-secret-troque-em-producao"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
