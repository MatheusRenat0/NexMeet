# Progresso de execução — NexMeet

Base: plano de execução da auditoria (ondas 0 a 7). Decisões Q1 a Q6 ainda não respondidas; valem os padrões do plano. Q5: o usuário confirmou que não há segredo real a rotacionar.

| ID | Pri. | Estado | Commit | Arquivos | Testes | Pendências |
|---|---|---|---|---|---|---|
| C-01 | P1 | Concluída | `633aa0c` | `.gitignore`, índice do git | `git ls-files` sem `node_modules` e `.pyc` | Mensagem do commit cita 16 `.pyc`; o correto é 10. Falta rodar `npm install` e conferir `git status`. |
| C-02 | P0 | Concluída | `ccdb436` | `backend/app/core/config.py`, `main.py`, `.env.example`, `tests/test_config.py` | Pytest: 4 passaram. Import do app OK. `production` sem segredo falha ao iniciar. | `class Config` do pydantic em desuso (O-02). |

## Próximas tarefas (onda 1)
- S-05: varredura de dependências (`pip-audit`, `npm audit`).
- T-02: base de testes do frontend (Vitest).
