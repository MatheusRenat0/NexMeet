# Requisitos Não Funcionais — NexMeet

Nomenclatura: `RNF-XX`

## Desempenho
- **RNF-01** As consultas de disponibilidade de sala devem responder em até 500ms sob carga normal.
- **RNF-02** Operações assíncronas (envio de e-mail, geração de relatório) devem ser processadas via fila (Celery + RabbitMQ), sem bloquear a resposta da API.

## Segurança
- **RNF-03** Senhas devem ser armazenadas com hash (bcrypt ou equivalente), nunca em texto plano.
- **RNF-04** Toda rota da API, exceto login e recuperação de senha, deve exigir autenticação JWT válida.
- **RNF-05** O controle de acesso (RBAC) deve ser validado no backend em toda requisição, não apenas no frontend.
- **RNF-06** Tokens JWT de acesso devem ter expiração curta (ex.: 15–30 min); refresh token com expiração maior e revogável.

## Disponibilidade e Confiabilidade
- **RNF-07** O sistema deve manter cache (Redis) para reduzir carga em consultas frequentes de disponibilidade.
- **RNF-08** Falhas no envio de notificação não devem impedir a confirmação da reserva.

## Escalabilidade
- **RNF-09** A aplicação deve ser containerizada (Docker) permitindo escalar backend e workers Celery de forma independente.

## Usabilidade
- **RNF-10** A interface deve ser responsiva, funcionando em desktop e dispositivos móveis.
- **RNF-11** O calendário deve ter usabilidade equivalente a ferramentas de mercado (Outlook/Google Calendar).

## Manutenibilidade
- **RNF-12** O backend deve seguir arquitetura em camadas (router → service → repository → model).
- **RNF-13** O projeto deve manter cobertura de testes automatizados (Pytest no backend, Vitest no frontend).
- **RNF-14** Alterações de schema do banco devem ser versionadas via Alembic (migrations).

## Observabilidade
- **RNF-15** Toda operação sensível (criação, edição, exclusão, login) deve gerar log de auditoria.
- **RNF-16** A API deve expor um endpoint de health check.

## Portabilidade / Infraestrutura
- **RNF-17** Toda a stack deve subir via `docker-compose` em um único comando, sem dependências manuais no host.
- **RNF-18** Variáveis sensíveis (senhas, chaves JWT, strings de conexão) devem ficar em variáveis de ambiente, nunca hardcoded.
