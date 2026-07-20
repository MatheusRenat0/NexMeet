# ADR-0002 — Arquitetura em camadas + RBAC no backend

**Status:** Aceito
**Data:** 2026-07-20

## Contexto
O sistema tem múltiplos perfis de acesso (Administrador, Coordenador, Colaborador, Visitante) com regras de negócio sensíveis (aprovação de reserva executiva, validação de conflito). É necessário garantir que a autorização não dependa apenas do frontend.

## Decisão
- Backend organizado em camadas: **Router → Service → Repository → Model**, com **Schemas Pydantic** para contratos de entrada/saída.
- RBAC validado como dependência do FastAPI em nível de rota, checado no **backend**, nunca apenas ocultando elementos no frontend.

## Alternativas consideradas
- **Lógica de autorização apenas no frontend** — rejeitada por ser trivialmente contornável (RNF-05 exige validação no backend).
- **Arquitetura monolítica sem separação Service/Repository** — rejeitada por dificultar testes unitários isolados (RNF-13).

## Consequências
- Positivas: regras de negócio centralizadas e testáveis; autorização confiável.
- Negativas / trade-offs: mais boilerplate por endpoint (router + service + repository + schema) comparado a uma abordagem mais direta.
