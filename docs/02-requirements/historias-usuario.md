# Histórias de Usuário — NexMeet

Formato: `Como [perfil], quero [ação], para [benefício]`.

## Autenticação

**US-01**
Como colaborador, quero fazer login com e-mail e senha, para acessar o sistema de reservas.
- Critérios de aceite: credenciais inválidas retornam erro claro; login válido retorna token JWT.

**US-02**
Como usuário, quero recuperar minha senha por e-mail, para voltar a acessar o sistema caso a esqueça.
- Critérios de aceite: link de recuperação expira em 30 minutos; nova senha exige confirmação.

## Reservas

**US-03**
Como colaborador, quero consultar a disponibilidade das salas em tempo real, para escolher um horário livre sem conflitos.
- Critérios de aceite: horários ocupados aparecem visualmente distintos no calendário.

**US-04**
Como colaborador, quero reservar uma sala informando data, horário e participantes, para garantir o ambiente para minha reunião.
- Critérios de aceite: sistema bloqueia reserva em caso de conflito, feriado ou fora do horário comercial.

**US-05**
Como colaborador, quero criar uma reserva recorrente semanal, para não precisar reservar manualmente toda semana.
- Critérios de aceite: é possível cancelar apenas uma ocorrência ou toda a série.

**US-06**
Como coordenador, quero aprovar ou recusar reservas de salas executivas, para controlar o uso desses ambientes.
- Critérios de aceite: reserva fica "pendente" até decisão; solicitante é notificado do resultado.

## Salas

**US-07**
Como administrador, quero cadastrar uma sala com capacidade, localização e recursos, para disponibilizá-la para reservas.
- Critérios de aceite: campos obrigatórios validados; upload de foto opcional.

**US-08**
Como administrador, quero marcar uma sala como "em manutenção", para impedir novas reservas nesse período.
- Critérios de aceite: reservas já existentes nesse período são sinalizadas para remanejamento.

## Calendário

**US-09**
Como colaborador, quero visualizar minhas reservas em um calendário semanal, para me organizar visualmente.
- Critérios de aceite: alternância entre visão dia/semana/mês; drag-and-drop para reagendar.

## Dashboard e Relatórios

**US-10**
Como administrador, quero visualizar um dashboard com taxa de ocupação e salas mais usadas, para tomar decisões sobre o espaço físico.
- Critérios de aceite: gráficos atualizados conforme filtro de período.

**US-11**
Como administrador, quero exportar um relatório de reservas em Excel filtrado por período e sala, para apresentar indicadores à diretoria.

## Notificações

**US-12**
Como colaborador, quero receber um e-mail de confirmação ao reservar uma sala, para ter certeza que minha reserva foi registrada.

**US-13**
Como colaborador, quero receber um lembrete antes da reunião, para não esquecer o compromisso.
