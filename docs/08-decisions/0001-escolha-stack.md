# ADR-0001 — Escolha da stack tecnológica

**Status:** Aceito
**Data:** 2026-07-20

## Contexto
O NexMeet é um projeto de portfólio; a stack precisa, ao mesmo tempo, resolver bem o problema de negócio (reservas com validação de conflito, tempo real, relatórios) e demonstrar competência técnica ampla (frontend moderno, API assíncrona, banco relacional, containerização, mensageria).

## Decisão
- **Frontend:** Vue.js 3 + Vite + Pinia + Vue Router + Tailwind CSS + Chart.js + FullCalendar.
- **Backend:** Python + FastAPI + SQLAlchemy + Alembic + Pydantic.
- **Banco:** PostgreSQL.
- **Mensageria/assíncrono:** Redis + RabbitMQ + Celery.
- **Infraestrutura:** Docker + Docker Compose + Nginx.

## Alternativas consideradas
- **Next.js/React** no lugar de Vue — descartado por preferência de aprofundar em Vue 3 + Composition API no portfólio.
- **Django** no lugar de FastAPI — descartado por FastAPI oferecer tipagem nativa com Pydantic e melhor fit para API assíncrona/tempo real.
- **MongoDB** no lugar de PostgreSQL — descartado porque o domínio (reservas, conflitos de horário, relacionamentos) é fortemente relacional.

## Consequências
- Positivas: stack moderna, amplamente demandada no mercado; separação clara de responsabilidades (SPA + API REST).
- Negativas / trade-offs: maior complexidade de infraestrutura (5+ serviços) para um projeto individual; exige disciplina de Docker Compose desde o início.
