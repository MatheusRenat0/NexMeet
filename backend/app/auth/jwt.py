from datetime import datetime, timedelta, timezone

import jwt

from app.core.config import settings


def create_access_token(subject: str) -> str:
#Gera um JWT contendo `sub` (identificador do usuário, aqui o e-mail) e expiração, conforme RF-02.

    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload = {"sub": subject, "exp": expires_at}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict:

# Decodifica e valida o token. Lança jwt.PyJWTError se inválido/expirado quem chama trata o erro (ver app/auth/dependencies.py).

    return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])