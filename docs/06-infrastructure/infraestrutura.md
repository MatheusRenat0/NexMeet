# Infraestrutura — NexMeet

## 1. Visão geral

Toda a aplicação roda em containers Docker, orquestrados via `docker-compose`, atrás de um reverse proxy Nginx.

## 2. Serviços (docker-compose)

| Serviço | Imagem base | Porta interna | Função |
|---|---|---|---|
| `nginx` | nginx:alpine | 80/443 | Reverse proxy, serve frontend estático |
| `frontend` | node (build) → nginx | 8080 | SPA Vue.js |
| `backend` | python:3.12-slim | 8000 | API FastAPI |
| `postgres` | postgres:16 | 5432 | Banco de dados |
| `redis` | redis:7-alpine | 6379 | Cache e broker auxiliar |
| `rabbitmq` | rabbitmq:3-management | 5672 / 15672 | Fila de mensagens |
| `celery-worker` | mesma imagem do backend | — | Processa tarefas assíncronas |

## 3. Variáveis de ambiente

Centralizadas em `.env` (não versionado), com `.env.example` como referência. Categorias:

- **Banco de dados:** `DATABASE_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- **JWT:** `JWT_SECRET_KEY`, `JWT_ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `REFRESH_TOKEN_EXPIRE_DAYS`
- **Redis:** `REDIS_URL`
- **RabbitMQ/Celery:** `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`
- **E-mail (SMTP):** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
- **Frontend:** `VITE_API_URL`, `VITE_WS_URL`

## 4. Ambientes

| Ambiente | Como sobe | Observações |
|---|---|---|
| Desenvolvimento | `docker-compose up` | hot-reload no backend (`--reload`) e frontend (Vite dev server) |
| CI | GitHub Actions | build das imagens + testes automatizados a cada PR |
| Produção | `docker-compose -f docker-compose.prod.yml up -d` | Nginx com HTTPS (Let's Encrypt/Certbot), sem hot-reload |

## 5. Backup

- Backup diário do PostgreSQL via `pg_dump`, armazenado fora do container (volume dedicado ou storage externo).
- Retenção sugerida: 7 backups diários + 4 semanais.

## 6. Deploy (visão geral)

1. Push na branch principal dispara o workflow do GitHub Actions.
2. Pipeline roda lint + testes (Pytest/Vitest).
3. Build das imagens Docker (backend e frontend).
4. Deploy via `docker-compose pull && docker-compose up -d` no servidor de destino.

Detalhamento do pipeline de CI/CD fica registrado como Issue/Milestone da **Fase 14 — DevOps**.
