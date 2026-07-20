# Visão do Produto — NexMeet

## 1. Problema

Em ambientes corporativos, a reserva de salas de reunião costuma ser feita de forma manual (planilhas, mensagens, agendas físicas), o que gera:

- Conflitos de horário entre times diferentes.
- Falta de visibilidade sobre a disponibilidade real das salas.
- Ausência de indicadores sobre uso e ociosidade dos ambientes.
- Nenhum controle formal de quem reservou, aprovou ou cancelou.

## 2. Solução

O **NexMeet** é uma plataforma web que centraliza o gerenciamento de salas de reunião: colaboradores consultam disponibilidade e reservam em poucos cliques, coordenadores aprovam reservas de salas executivas, e administradores enxergam indicadores de uso através de um dashboard executivo.

## 3. Personas / Perfis de Acesso

| Perfil | Descrição | Principais ações |
|---|---|---|
| **Administrador** | Responsável pela plataforma | Gerencia usuários, salas, recursos e configurações; acesso total |
| **Coordenador** | Líder de área/setor | Aprova reservas de salas executivas; acompanha reservas do time |
| **Colaborador** | Usuário padrão | Consulta disponibilidade e realiza reservas |
| **Visitante** | Acesso restrito | Apenas consulta disponibilidade, sem poder reservar |

## 4. Proposta de Valor

- **Rapidez:** reservar uma sala em menos de 1 minuto, sem fricção.
- **Transparência:** calendário único, visível para todos, sem conflito de horário.
- **Governança:** aprovação obrigatória para salas executivas + auditoria completa de operações.
- **Visibilidade gerencial:** dashboard com KPIs de ocupação, picos de uso e salas mais/menos utilizadas.

## 5. Objetivos do Projeto

Além do valor de produto, o NexMeet é um projeto de portfólio com o objetivo de consolidar conhecimentos em:

- Desenvolvimento Full Stack (Vue.js 3 + FastAPI)
- Arquitetura em camadas
- APIs REST
- Docker e conteinerização
- PostgreSQL e modelagem de dados
- Processamento assíncrono (Celery, RabbitMQ, Redis)
- Controle de acesso (RBAC)
- DevOps, CI/CD e monitoramento
- Boas práticas de engenharia de software

## 6. Escopo — MVP (Versão 1.0)

Funcionalidades que compõem a primeira versão utilizável do sistema:

- Autenticação (JWT + refresh token) e RBAC
- Gestão de usuários
- Gestão de salas e recursos
- Sistema de reservas com validação de conflitos
- Calendário (dia/semana/mês)
- Dashboard executivo
- Relatórios (PDF/Excel)
- Docker + deploy básico
- Documentação completa

## 7. Fora do escopo do MVP (evoluções futuras)

- Integração com Google Calendar / Microsoft Outlook / Teams / Meet
- QR Code para check-in
- Aplicação PWA
- Internacionalização (i18n)
- Monitoramento com Prometheus/Grafana

## 8. Métricas de Sucesso do Produto (simuladas)

- Taxa de ocupação das salas
- Tempo médio para concluir uma reserva
- Percentual de cancelamentos por não comparecimento
- Número de conflitos evitados pelo sistema
