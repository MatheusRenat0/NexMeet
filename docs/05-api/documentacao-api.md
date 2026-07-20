# Documentação da API — NexMeet

> Este documento descreve o contrato planejado da API REST (FastAPI). Os endpoints serão implementados a partir da Fase 3 em diante; esta é a especificação inicial derivada dos requisitos funcionais.
>
> Quando a API estiver implementada, este documento deve ser substituído/complementado pelo Swagger/OpenAPI gerado automaticamente pelo FastAPI (`/docs` e `/openapi.json`).

## Convenções

- Base path: `/api/v1`
- Autenticação: `Authorization: Bearer <token>` (JWT)
- Formato: JSON
- Paginação: `?page=1&page_size=20` nas listagens
- Erros seguem o padrão:
```json
{ "detail": "mensagem de erro" }
```

## Autenticação — `/auth`
| Método | Rota | Descrição | Requisito |
|---|---|---|---|
| POST | `/auth/login` | Autentica e retorna access + refresh token | RF-01, RF-02 |
| POST | `/auth/refresh` | Renova o access token | RF-02 |
| POST | `/auth/logout` | Invalida o token atual | RF-03 |
| POST | `/auth/forgot-password` | Envia e-mail de recuperação | RF-04 |
| POST | `/auth/reset-password` | Redefine senha via token | RF-04 |
| PUT | `/auth/change-password` | Altera senha do usuário logado | RF-05 |

## Usuários — `/usuarios`
| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| GET | `/usuarios` | Lista usuários | Administrador |
| POST | `/usuarios` | Cria usuário | Administrador |
| GET | `/usuarios/{id}` | Detalha usuário | Administrador |
| PUT | `/usuarios/{id}` | Edita usuário | Administrador |
| PATCH | `/usuarios/{id}/ativar` | Ativa/inativa usuário | Administrador |

## Salas — `/salas`
| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| GET | `/salas` | Lista salas (com filtros) | Todos |
| POST | `/salas` | Cadastra sala | Administrador |
| GET | `/salas/{id}` | Detalha sala | Todos |
| PUT | `/salas/{id}` | Edita sala | Administrador |
| PATCH | `/salas/{id}/manutencao` | Marca em manutenção | Administrador |
| GET | `/salas/{id}/disponibilidade` | Consulta horários livres | Todos |

## Reservas — `/reservas`
| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| GET | `/reservas` | Lista reservas (filtros: sala, período, usuário) | Todos (exceto Visitante cria) |
| POST | `/reservas` | Cria reserva | Colaborador+ |
| GET | `/reservas/{id}` | Detalha reserva | Todos |
| PUT | `/reservas/{id}` | Edita reserva | Dono / Administrador |
| DELETE | `/reservas/{id}` | Cancela reserva | Dono / Administrador |
| PATCH | `/reservas/{id}/aprovar` | Aprova reserva executiva | Coordenador |
| PATCH | `/reservas/{id}/reprovar` | Reprova reserva executiva | Coordenador |

## Dashboard — `/dashboard`
| Método | Rota | Descrição |
|---|---|---|
| GET | `/dashboard/kpis` | KPIs gerais (ocupação, total, cancelamentos) |
| GET | `/dashboard/ranking-salas` | Salas mais/menos usadas |
| GET | `/dashboard/picos` | Horários de pico e dias mais movimentados |

## Relatórios — `/relatorios`
| Método | Rota | Descrição |
|---|---|---|
| GET | `/relatorios/reservas.pdf` | Exporta relatório em PDF |
| GET | `/relatorios/reservas.xlsx` | Exporta relatório em Excel |

## Auditoria — `/auditoria`
| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| GET | `/auditoria` | Lista logs (filtros: entidade, usuário, período) | Administrador |

## WebSocket
| Canal | Descrição |
|---|---|
| `/ws/reservas` | Eventos em tempo real: nova reserva, cancelamento, sala indisponível |
