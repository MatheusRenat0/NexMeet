# Modelagem do Banco de Dados — NexMeet

## 1. Diagrama Entidade-Relacionamento (simplificado)

```
usuarios ──< reservas >── salas ──< sala_recurso >── recursos
   │            │
   │            └──< participantes
   │
   └──< logs_auditoria

salas ──< sala_fotos
```

## 2. Tabelas

### `usuarios`
| Campo | Tipo | Observação |
|---|---|---|
| id | UUID/PK | |
| nome | varchar | |
| email | varchar | único |
| senha_hash | varchar | bcrypt |
| perfil | enum | administrador, coordenador, colaborador, visitante |
| ativo | boolean | default true |
| criado_em | timestamp | |
| atualizado_em | timestamp | |

### `salas`
| Campo | Tipo | Observação |
|---|---|---|
| id | UUID/PK | |
| nome | varchar | |
| capacidade | int | |
| andar / localizacao | varchar | |
| executiva | boolean | define se exige aprovação (RN-06) |
| status | enum | disponível, manutenção, inativa |
| criado_em | timestamp | |

### `recursos`
| Campo | Tipo | Observação |
|---|---|---|
| id | UUID/PK | |
| nome | varchar | TV, HDMI, webcam, projetor, ar-condicionado, quadro, microfone |

### `sala_recurso` (N:N)
| Campo | Tipo |
|---|---|
| sala_id | FK → salas |
| recurso_id | FK → recursos |

### `sala_fotos`
| Campo | Tipo |
|---|---|
| id | UUID/PK |
| sala_id | FK → salas |
| url | varchar |

### `reservas`
| Campo | Tipo | Observação |
|---|---|---|
| id | UUID/PK | |
| usuario_id | FK → usuarios | criador |
| sala_id | FK → salas | |
| inicio | timestamp | |
| fim | timestamp | |
| status | enum | pendente, confirmada, cancelada |
| motivo | varchar | |
| recorrencia | enum, nullable | diária, semanal, mensal |
| recorrencia_grupo_id | UUID, nullable | agrupa instâncias de uma série recorrente |
| aprovado_por | FK → usuarios, nullable | coordenador que aprovou |
| criado_em | timestamp | |

### `participantes`
| Campo | Tipo |
|---|---|
| id | UUID/PK |
| reserva_id | FK → reservas |
| nome | varchar |
| email | varchar |

### `feriados`
| Campo | Tipo |
|---|---|
| id | UUID/PK |
| data | date |
| descricao | varchar |

### `logs_auditoria`
| Campo | Tipo | Observação |
|---|---|---|
| id | UUID/PK | |
| usuario_id | FK → usuarios | quem executou |
| entidade | varchar | ex.: "reserva", "usuario", "sala" |
| entidade_id | UUID | |
| acao | enum | criação, edição, cancelamento, exclusão, login |
| detalhes | jsonb | payload antes/depois |
| criado_em | timestamp | |

## 3. Índices recomendados

- `reservas (sala_id, inicio, fim)` — para checagem rápida de conflito de horário.
- `usuarios (email)` — único, para login.
- `logs_auditoria (entidade, entidade_id)` — para consulta de histórico por registro.

## 4. Observações de modelagem

- Conflito de horário (RN-01) deve ser validado na camada de Service, mas o índice em `(sala_id, inicio, fim)` acelera a query de checagem.
- `recorrencia_grupo_id` permite cancelar/editar toda a série sem duplicar lógica (RN-08).
- `logs_auditoria` é apenas inserção (append-only), nunca update/delete, para garantir imutabilidade (RN-18).
