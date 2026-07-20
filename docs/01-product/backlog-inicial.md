# Backlog Inicial — NexMeet

Backlog organizado por **épicos**, alinhados às fases do roadmap. Cada épico deve virar uma **Milestone** no GitHub, e cada item uma **Issue**.

## Épico 1 — Autenticação e Segurança (Fase 3)
- Cadastro de usuário
- Login / Logout
- Geração e validação de JWT
- Refresh Token
- Recuperação de senha (e-mail)
- Alteração de senha
- Middleware de RBAC (Administrador, Coordenador, Colaborador, Visitante)

## Épico 2 — Usuários (Fase 4)
- CRUD de usuários
- Atribuição de perfil
- Ativar / inativar usuário
- Histórico de alterações do usuário

## Épico 3 — Salas (Fase 5)
- Cadastro de sala (nome, capacidade, localização, status)
- Cadastro de recursos (TV, HDMI, webcam, projetor, ar-condicionado, quadro, microfone)
- Vínculo sala ↔ recursos
- Upload de fotos da sala
- Marcar sala em manutenção

## Épico 4 — Reservas (Fase 6) — *funcionalidade principal*
- Criar / editar / cancelar reserva
- Aprovação obrigatória (salas executivas)
- Validação de conflito de horário
- Validação de horário comercial e feriados
- Validação de capacidade da sala
- Reserva recorrente (diária/semanal/mensal)
- Lista de participantes por reserva

## Épico 5 — Calendário (Fase 7)
- Visualização diária / semanal / mensal
- Drag-and-drop para reagendar
- Filtros por sala / setor
- Agenda por sala

## Épico 6 — Dashboard Executivo (Fase 8)
- KPIs: total de reservas, horas reservadas, taxa de ocupação
- Salas mais e menos utilizadas
- Horários de pico
- Reservas por setor

## Épico 7 — Relatórios (Fase 9)
- Exportação PDF
- Exportação Excel
- Filtros (período, andar, sala, organizador)

## Épico 8 — Notificações (Fase 10)
- E-mail: reserva criada / aprovada / cancelada
- Lembrete antes da reunião
- WebSocket: atualização em tempo real

## Épico 9 — Auditoria (Fase 11)
- Log de login
- Log de criação/edição/exclusão
- Histórico completo por entidade

## Épico 10 — Administração (Fase 12)
- Configuração de horário de funcionamento
- Cadastro de feriados
- Configurações gerais do sistema

## Épico 11 — Qualidade e DevOps (Fases 13–15)
- Testes unitários e de integração (Pytest / Vitest)
- Docker Compose completo
- CI/CD (GitHub Actions)
- Health check e logging

## Priorização sugerida (MoSCoW)

| Prioridade | Épicos |
|---|---|
| **Must have** | Autenticação, Usuários, Salas, Reservas, Calendário |
| **Should have** | Dashboard, Relatórios, Notificações |
| **Could have** | Auditoria, Administração |
| **Won't have (v1)** | Integrações externas, PWA, i18n, QR Code |
