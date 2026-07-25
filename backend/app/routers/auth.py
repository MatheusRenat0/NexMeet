from fastapi import APIRouter, HTTPException, status

from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])

# TODO:
#
_USUARIO_TESTE = {"email": "admin@nexmeet.com", "senha": "123456"}

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    if payload.email != _USUARIO_TESTE["email"] or payload.senha != _USUARIO_TESTE["senha"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos",
        )

    # TODO: gerar JWT de verdade (RF-02) quando app/auth/ for implementado.
    return TokenResponse(access_token="token-fake-temporario")