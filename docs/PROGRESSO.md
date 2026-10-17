# Progresso de execução — NexMeet

Base: plano de execução da auditoria (ondas 0 a 7). Decisões Q1 a Q6 ainda não respondidas; valem os padrões do plano. Q5: o usuário confirmou que não há segredo real a rotacionar.

| ID | Pri. | Estado | Commit | Arquivos | Testes | Pendências |
|---|---|---|---|---|---|---|
| C-01 | P1 | Concluída | `633aa0c` | `.gitignore`, índice do git | `git ls-files` sem `node_modules` e `.pyc` | Mensagem do commit cita 16 `.pyc`; o correto é 10. Falta rodar `npm install` e conferir `git status`. |
| S-05 | P3 | Auditoria concluída; correção pendente (precisa de autorização) | (docs) | Nenhum código alterado | `pip-audit`: pyjwt 2.9.0 (21 vulns, correção em 2.15.0) e starlette 0.38.6 (14 vulns, correção em 1.3.1). `npm audit`: 5 high (nanoid, source-map-js e outras, todas com `npm audit fix`). Versões do `package.json` existem no registro (pinia 4.1.0, vite 8.3.4, axios 1.20.0). | Atualizar pyjwt, fastapi (traz o starlette) e rodar `npm audit fix`: exige autorização e testes. |
| Layout de referência (UI) | P3 | Concluído (visual não verificado no navegador) | `95c08ca` | `style.css`, `main.js`, `stores/ui.js`, `components/AppLayout.vue` (+ teste), `views/DashboardView.vue`, `views/SalasView.vue` | `npm test`: 25 passaram. `npm run build` OK; classes dos tokens presentes no CSS gerado. | `LoginView` não foi redesenhada (herda o tema escuro por padrão). Perfil, Alterar senha e FAQ não existem ainda. Push notifications/PWA da referência não foram portados. |
| N-08 (parcial) + telas Dashboard e Salas | P3 | Parcial: UI com dados simulados | `232d39f` | `components/AppLayout.vue`, `views/DashboardView.vue`, `views/SalasView.vue`, `services/`, `router/index.js`, remove `HomeView.vue`, 3 arquivos de teste | `npm test`: 22 passaram (6 arquivos). `npm run build` OK. Aparência não verificada no navegador. | Menu por perfil depende de F-01. Dados são fictícios (`services/mockData.js`). Falta cadastro de sala, reservas e calendário. Infra (C-03) adiada a pedido do usuário para o fim. |
| T-02 | P1 | Concluída | `6904b94` | `frontend/package.json`, `package-lock.json`, `vite.config.js`, `src/stores/auth.test.js`, `src/router/index.test.js`, `src/views/LoginView.test.js` | `npm test`: 13 passaram (3 arquivos). `npm run build` OK. | Sem cobertura de `HomeView`; CI fica para T-03. |
| C-02 | P0 | Concluída | `ccdb436` | `backend/app/core/config.py`, `main.py`, `.env.example`, `tests/test_config.py` | Pytest: 4 passaram. Import do app OK. `production` sem segredo falha ao iniciar. | `class Config` do pydantic em desuso (O-02). |

## Próximas tarefas (onda 1)
- Telas adicionais a definir com o usuário (Calendário, Nova reserva, Usuários) e integração com a API real.
- C-03 (Docker) fica para o final, a pedido do usuário.
- Aguardando autorização para atualizar dependências vulneráveis (S-05).
