import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.auth.jwt import decode_access_token

# tokenUrl só indica ao Swagger onde obter o token (usado no botão "Authorize")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    """Extrai e valida o JWT do header Authorization. Retorna o `sub`
    (e-mail do usuário) ou levanta 401 se o token for inválido/expirado.

    TODO: quando o banco estiver conectado, trocar o retorno por uma
    consulta real ao usuário (tabela `usuarios`) em vez de só o e-mail.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido ou expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
        return email
    except jwt.PyJWTError:
        raise credentials_exception