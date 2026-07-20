# Regras de Negócio — NexMeet

Nomenclatura: `RN-XX`

## Reservas
- **RN-01** Não é permitido criar duas reservas para a mesma sala com sobreposição de horário, exceto se uma delas estiver com status "cancelada".
- **RN-02** Reservas só podem ser feitas dentro do horário comercial configurado pelo Administrador.
- **RN-03** Reservas não podem ser feitas em datas marcadas como feriado.
- **RN-04** Reservas não podem ser feitas em salas com status "em manutenção".
- **RN-05** O número de participantes informado não pode exceder a capacidade cadastrada da sala.
- **RN-06** Reservas em salas marcadas como "executiva" ficam com status "pendente" até aprovação de um Coordenador.
- **RN-07** Apenas o criador da reserva ou um Administrador podem editá-la ou cancelá-la.
- **RN-08** Reservas recorrentes geram múltiplas instâncias de reserva; o cancelamento pode ser aplicado a uma ocorrência ou à série completa.
- **RN-09** Uma reserva cancelada libera o horário imediatamente para nova reserva.

## Usuários e Perfis
- **RN-10** Um usuário sempre possui exatamente um perfil (Administrador, Coordenador, Colaborador ou Visitante).
- **RN-11** Usuários com perfil "Visitante" não podem criar reservas, apenas consultar disponibilidade.
- **RN-12** Apenas Administradores podem alterar o perfil de outro usuário.
- **RN-13** Usuários inativados não podem autenticar no sistema, mas seu histórico de reservas é preservado.

## Salas e Recursos
- **RN-14** Uma sala não pode ser excluída se possuir reservas futuras ativas; deve ser inativada.
- **RN-15** A alteração de capacidade de uma sala não afeta reservas já confirmadas.

## Notificações
- **RN-16** Toda mudança de status de uma reserva (criada, aprovada, cancelada) deve gerar uma notificação para o solicitante.
- **RN-17** O lembrete de reunião é enviado uma única vez, em intervalo configurável antes do horário de início.

## Auditoria
- **RN-18** Toda operação de criação, edição ou exclusão deve registrar usuário responsável e timestamp, de forma imutável.
