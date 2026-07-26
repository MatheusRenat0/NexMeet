from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.dependencies import get_current_user
from app.auth.jwt import create_access_token
from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])

# TODO: substituir por consulta real no banco (tabela `usuarios`) quando o
# Postgres estiver conectado (Fase 2). Por enquanto valida contra um usuário
# fixo só para exercitar o fluxo de request/response.
_USUARIO_TESTE = {"email": "admin@nexmeet.com", "senha": "123456"}


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    if payload.email != _USUARIO_TESTE["email"] or payload.senha != _USUARIO_TESTE["senha"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos",
        )

    access_token = create_access_token(subject=payload.email)
    return TokenResponse(access_token=access_token)


@router.get("/me")
def read_current_user(current_user_email: str = Depends(get_current_user)):
    """Rota protegida: só responde com um token válido no header
    Authorization. Serve pra confirmar que o fluxo de autenticação
    funciona ponta a ponta."""
    return {"email": current_user_email}