import pytest
from pydantic import ValidationError

from app.core.config import DEV_JWT_SECRET, Settings


def _settings(**kw):
    return Settings(_env_file=None, **kw)


def test_dev_permite_segredo_padrao():
    assert _settings(environment="development").jwt_secret_key == DEV_JWT_SECRET


def test_producao_sem_segredo_falha():
    with pytest.raises(ValidationError):
        _settings(environment="production")


def test_producao_com_segredo_proprio_ok():
    s = _settings(environment="production", jwt_secret_key="x" * 48)
    assert s.jwt_secret_key == "x" * 48


def test_cors_vem_da_configuracao(monkeypatch):
    monkeypatch.setenv("CORS_ORIGINS", '["https://app.exemplo.com"]')
    assert _settings().cors_origins == ["https://app.exemplo.com"]
