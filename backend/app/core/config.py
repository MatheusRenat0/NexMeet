from pydantic import model_validator
from pydantic_settings import BaseSettings

DEV_JWT_SECRET = "dev-secret-troque-em-producao"


class Settings(BaseSettings):
    app_name: str = "NexMeet API"
    environment: str = "development"

    jwt_secret_key: str = DEV_JWT_SECRET
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    cors_origins: list[str] = ["http://localhost:5173"]

    class Config:
        env_file = ".env"
        extra = "ignore"

    @model_validator(mode="after")
    def exigir_segredo_fora_de_desenvolvimento(self):
        if self.environment != "development" and self.jwt_secret_key == DEV_JWT_SECRET:
            raise ValueError(
                "JWT_SECRET_KEY deve ser definido fora do ambiente de desenvolvimento"
            )
        return self


settings = Settings()
