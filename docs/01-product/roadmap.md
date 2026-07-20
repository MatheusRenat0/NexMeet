# Roadmap — NexMeet

## Fase 1 — Planejamento ✅
Definição de visão de produto, backlog inicial, requisitos funcionais e não funcionais, regras de negócio, histórias de usuário, modelagem de banco, arquitetura e identidade visual.

## Fase 2 — Infraestrutura
Setup do projeto FastAPI, projeto Vue, Docker (backend, frontend, compose), Nginx.

## Fase 3 — Autenticação
Cadastro, login, logout, JWT, refresh token, recuperação/alteração de senha, RBAC.

## Fase 4 — Usuários
CRUD de usuários, perfis, ativação/inativação, histórico.

## Fase 5 — Salas
Cadastro de salas, capacidade, localização, recursos, fotos, status, manutenção.

## Fase 6 — Reservas *(funcionalidade principal)*
Criar/editar/cancelar/aprovar reserva, validações de conflito/horário/manutenção/capacidade, recorrência, participantes.

## Fase 7 — Calendário
Visualização diária/semanal/mensal, drag-and-drop, filtros, agenda por sala.

## Fase 8 — Dashboard
KPIs de reservas, ocupação, salas mais/menos usadas, horários de pico, reservas por setor.

## Fase 9 — Relatórios
Exportação PDF/Excel, filtros, histórico de reservas.

## Fase 10 — Notificações
E-mail (criação/cancelamento/lembrete), WebSocket em tempo real.

## Fase 11 — Auditoria
Log de login, alterações, exclusões, histórico completo.

## Fase 12 — Administração
Configurações do sistema, horário de funcionamento, feriados, configuração de salas/recursos.

## Fase 13 — Testes
Testes unitários, integração, API (Pytest) e frontend (Vitest).

## Fase 14 — DevOps
Docker Compose, Nginx, GitHub Actions, deploy, variáveis de ambiente, backup do banco.

## Fase 15 — Monitoramento
Logs, health check, Prometheus, Grafana, métricas da API.

## Fase 16 — Melhorias
Modo escuro, i18n, QR Code, integrações (Google Calendar, Outlook, Teams, Meet), PWA.

---

**Organização sugerida no GitHub:** cada fase = 1 Milestone (v1.0.0, v1.1.0...); cada item de fase = 1 Issue.
