# Arquitetura do Sistema — NexMeet

## 1. Visão Geral

Arquitetura em camadas, containerizada, com processamento assíncrono para tarefas que não precisam bloquear a resposta ao usuário (e-mails, relatórios, notificações).

```
                         Internet
                            │
                      Nginx (Docker)
                            │
              ┌─────────────┴─────────────┐
              │                           │
          Vue.js 3                    FastAPI
        (Frontend SPA)               (Backend API)
              │                           │
              │                     SQLAlchemy / Alembic
              │                           │
              │              ┌────────────┼────────────┐
              │              │            │             │
              │           Redis       RabbitMQ          │
              │          (cache)     (fila de msgs)      │
              │              │            │             │
              │              └─────Celery Workers───────┘
              │                           │
              └─────────────────── PostgreSQL ───────────┘
```

Toda a stack sobe via **Docker Compose**.

## 2. Componentes

| Componente | Responsabilidade |
|---|---|
| **Nginx** | Reverse proxy, ponto único de entrada, serve o build estático do frontend |
| **Frontend (Vue.js 3)** | SPA: telas de reserva, calendário (FullCalendar), dashboard (Chart.js) |
| **Backend (FastAPI)** | API REST, autenticação JWT, regras de negócio, validações |
| **PostgreSQL** | Persistência principal (usuários, salas, reservas, auditoria) |
| **Redis** | Cache de disponibilidade de salas e sessões; broker auxiliar |
| **RabbitMQ** | Fila de mensagens para tarefas assíncronas |
| **Celery** | Workers que processam envio de e-mail, geração de relatórios, lembretes |

## 3. Arquitetura em Camadas (Backend)

```
Router (FastAPI)  →  Service (regras de negócio)  →  Repository (acesso a dados)  →  Model (SQLAlchemy)
                              ↑
                          Schema (Pydantic) — validação de entrada/saída
```

- **Router**: define endpoints, recebe requisição, delega para o Service.
- **Service**: contém regras de negócio (RN-XX), orquestra repositórios.
- **Repository**: encapsula queries SQLAlchemy, isola o Service do ORM.
- **Schema (Pydantic)**: contratos de entrada/saída da API.
- **Core/Auth**: geração/validação de JWT, dependências de autenticação e RBAC.

## 4. Fluxo assíncrono (exemplo: criação de reserva)

1. Frontend envia `POST /reservas`.
2. Backend valida conflito, horário e capacidade (síncrono, resposta imediata).
3. Reserva é persistida no PostgreSQL.
4. Backend publica evento "reserva_criada" no RabbitMQ.
5. Worker Celery consome o evento e dispara e-mail de confirmação.
6. Backend emite evento via WebSocket para atualizar o calendário em tempo real de outros usuários conectados.

## 5. Comunicação em tempo real

- WebSocket dedicado para eventos de calendário (nova reserva, sala indisponível, cancelamento).
- Frontend assina o canal da sala/setor relevante e atualiza a UI sem reload.

## 6. Ambientes

| Ambiente | Uso |
|---|---|
| **Desenvolvimento** | Docker Compose local, hot-reload no frontend e backend |
| **CI** | GitHub Actions — build, lint, testes automatizados |
| **Produção** | Docker Compose (ou orquestrador futuro), Nginx com HTTPS |
