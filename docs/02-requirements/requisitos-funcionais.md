# Requisitos Funcionais — NexMeet

Nomenclatura: `RF-XX`

## Autenticação
- **RF-01** O sistema deve permitir login com e-mail e senha.
- **RF-02** O sistema deve emitir um token JWT de acesso e um refresh token no login.
- **RF-03** O sistema deve permitir logout, invalidando o token ativo.
- **RF-04** O sistema deve permitir recuperação de senha via e-mail.
- **RF-05** O sistema deve permitir alteração de senha pelo usuário autenticado.

## Usuários
- **RF-06** O sistema deve permitir que o Administrador cadastre, edite, ative e inative usuários.
- **RF-07** O sistema deve associar cada usuário a um perfil (Administrador, Coordenador, Colaborador, Visitante).
- **RF-08** O sistema deve manter histórico de alterações de dados do usuário.

## Salas
- **RF-09** O sistema deve permitir o cadastro de salas com nome, capacidade, localização, recursos, fotos e status.
- **RF-10** O sistema deve permitir associar um ou mais recursos (TV, HDMI, webcam, projetor, ar-condicionado, quadro, microfone) a uma sala.
- **RF-11** O sistema deve permitir marcar uma sala como em manutenção, bloqueando novas reservas nesse período.

## Reservas
- **RF-12** O sistema deve permitir que o usuário crie uma reserva informando sala, data, hora inicial, hora final, motivo e participantes.
- **RF-13** O sistema deve validar automaticamente conflito de horário na sala escolhida.
- **RF-14** O sistema deve validar se o horário está dentro do horário comercial configurado.
- **RF-15** O sistema deve impedir reservas em datas marcadas como feriado.
- **RF-16** O sistema deve validar se o número de participantes não excede a capacidade da sala.
- **RF-17** O sistema deve exigir aprovação de um Coordenador para reservas em salas marcadas como executivas.
- **RF-18** O sistema deve permitir edição e cancelamento de reservas pelo próprio criador ou por um Administrador.
- **RF-19** O sistema deve permitir a criação de reservas recorrentes (diária, semanal ou mensal).

## Calendário
- **RF-20** O sistema deve exibir as reservas em modo de visualização diária, semanal e mensal.
- **RF-21** O sistema deve permitir reagendar uma reserva via drag-and-drop no calendário.
- **RF-22** O sistema deve permitir filtrar o calendário por sala e por setor.

## Dashboard
- **RF-23** O sistema deve exibir KPIs de total de reservas, horas reservadas, taxa de ocupação, cancelamentos e média de duração.
- **RF-24** O sistema deve exibir ranking de salas mais e menos utilizadas.
- **RF-25** O sistema deve exibir horários de pico e dias mais movimentados.

## Relatórios
- **RF-26** O sistema deve permitir exportar relatórios de reservas em PDF e Excel.
- **RF-27** O sistema deve permitir filtrar relatórios por período, andar, sala e organizador.

## Notificações
- **RF-28** O sistema deve enviar e-mail ao criar, aprovar ou cancelar uma reserva.
- **RF-29** O sistema deve enviar lembrete por e-mail antes do início da reunião.
- **RF-30** O sistema deve notificar em tempo real (WebSocket) sobre novas reservas e indisponibilidade de sala.

## Auditoria
- **RF-31** O sistema deve registrar quem criou, editou e cancelou cada reserva, e quando.
- **RF-32** O sistema deve manter log de login de usuários.

## Administração
- **RF-33** O sistema deve permitir configurar horário de funcionamento e feriados.
