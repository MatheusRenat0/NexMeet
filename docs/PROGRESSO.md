# Progresso de execução — NexMeet

Base: plano de execução da auditoria (ondas 0 a 7). Decisões Q1 a Q6 ainda não respondidas; valem os padrões do plano. Q5: o usuário confirmou que não há segredo real a rotacionar.

| ID | Pri. | Estado | Commit | Arquivos | Testes | Pendências |
|---|---|---|---|---|---|---|
| C-01 | P1 | Concluída | `633aa0c` | `.gitignore`, índice do git | `git ls-files` sem `node_modules` e `.pyc` | Mensagem do commit cita 16 `.pyc`; o correto é 10. Falta rodar `npm install` e conferir `git status`. |
| S-05 | P3 | Auditoria concluída; correção pendente (precisa de autorização) | (docs) | Nenhum código alterado | `pip-audit`: pyjwt 2.9.0 (21 vulns, correção em 2.15.0) e starlette 0.38.6 (14 vulns, correção em 1.3.1). `npm audit`: 5 high (nanoid, source-map-js e outras, todas com `npm audit fix`). Versões do `package.json` existem no registro (pinia 4.1.0, vite 8.3.4, axios 1.20.0). | Atualizar pyjwt, fastapi (traz o starlette) e rodar `npm audit fix`: exige autorização e testes. |
| T-02 | P1 | Concluída | `6904b94` | `frontend/package.json`, `package-lock.json`, `vite.config.js`, `src/stores/auth.test.js`, `src/router/index.test.js`, `src/views/LoginView.test.js` | `npm test`: 13 passaram (3 arquivos). `npm run build` OK. | Sem cobertura de `HomeView`; CI fica para T-03. |
| C-02 | P0 | Concluída | `ccdb436` | `backend/app/core/config.py`, `main.py`, `.env.example`, `tests/test_config.py` | Pytest: 4 passaram. Import do app OK. `production` sem segredo falha ao iniciar. | `class Config` do pydantic em desuso (O-02). |

## Próximas tarefas (onda 1)
- C-03: Docker (backend, frontend e PostgreSQL), parte da onda 2.
- Aguardando autorização para atualizar dependências vulneráveis (S-05).
