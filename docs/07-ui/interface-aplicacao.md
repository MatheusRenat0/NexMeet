# Interface da Aplicação — NexMeet

> Este documento descreve as telas planejadas do frontend. Complementa `01-product/identidade-visual.md` (paleta, tipografia, tom de voz).

## 1. Mapa de telas

| Tela | Acesso | Descrição |
|---|---|---|
| Login / Recuperação de senha | Público | Autenticação e recuperação de acesso |
| Calendário de reservas | Todos os perfis | Tela principal — visão diária/semanal/mensal, drag-and-drop |
| Nova reserva | Colaborador+ | Formulário: sala, data, horário, motivo, participantes |
| Detalhe da reserva | Dono / Coordenador / Administrador | Dados da reserva, ações de aprovar/cancelar/editar |
| Lista de salas | Todos os perfis | Cards com foto, capacidade, recursos, status |
| Cadastro/edição de sala | Administrador | Formulário completo + upload de fotos |
| Gestão de usuários | Administrador | Listagem, criação, ativação/inativação, perfil |
| Dashboard executivo | Administrador / Coordenador | KPIs, gráficos (Chart.js), ranking de salas |
| Relatórios | Administrador | Filtros + exportação PDF/Excel |
| Auditoria | Administrador | Tabela de logs com filtros |
| Configurações | Administrador | Horário de funcionamento, feriados |

## 2. Navegação

- **Layout base:** menu lateral fixo (ícones + labels) + topo com notificações e usuário logado.
- **Perfis com menu reduzido:** Visitante vê apenas Calendário (somente leitura); Colaborador não vê Dashboard/Usuários/Auditoria.

## 3. Padrões de componente

- Formulários com validação inline (erro aparece abaixo do campo, não em alert).
- Ações destrutivas (cancelar reserva, inativar usuário) sempre com modal de confirmação.
- Tabelas longas (usuários, auditoria, relatórios) com paginação e filtro por coluna.
- Estados vazios ("nenhuma reserva encontrada") com ilustração simples + call-to-action.

## 4. Responsividade

- Breakpoint mobile: menu lateral vira bottom navigation ou drawer.
- Calendário em mobile: visão padrão "dia" (visão "mês" fica em desktop).

## 5. Acessibilidade (base mínima)

- Contraste mínimo AA na paleta definida.
- Navegação por teclado nos formulários principais (login, nova reserva).
- Textos alternativos em ícones de ação (aprovar, cancelar, editar).
