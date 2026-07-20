# Identidade Visual — NexMeet

## 1. Conceito

Nome "NexMeet" remete a "next meeting" — o sistema como ponte entre a necessidade de uma reunião e o espaço certo para ela. Visual deve transmitir: profissional, direto, confiável — sem parecer um produto genérico de template.

## 2. Paleta de cores sugerida

| Uso | Cor | Hex |
|---|---|---|
| Primária | Azul petróleo | `#0F4C5C` |
| Secundária / ação | Verde-água | `#17C3B2` |
| Alerta / conflito | Coral | `#FE6D73` |
| Neutro escuro (texto) | Grafite | `#1E2129` |
| Neutro claro (fundo) | Cinza-gelo | `#F5F7F8` |

Suporte a **modo escuro** já previsto no roadmap (Fase 16), então a paleta deve ter uma variante dark desde o início (fundo `#12151A`, texto `#E8EAED`).

## 3. Tipografia

- **Títulos:** Inter ou Sora (peso 600–700)
- **Corpo de texto:** Inter (peso 400–500)
- **Dados/dashboard:** fonte tabular (ex.: Inter com `font-variant-numeric: tabular-nums`) para alinhar números em tabelas e KPIs.

## 4. Componentes visuais chave

- **Status de reserva** com cor semântica: confirmada (verde-água), pendente (amarelo), cancelada (coral/cinza).
- **Calendário (FullCalendar):** eventos coloridos por sala ou por setor, com legenda.
- **Dashboard (Chart.js):** gráficos com a paleta acima, sem excesso de cores — reservar coral apenas para alertas.

## 5. Tom de voz da interface

- Direto e funcional (ex.: "Sala reservada com sucesso", não "Uhuul, deu tudo certo!").
- Mensagens de erro sempre explicando o motivo (ex.: "Conflito de horário: Sala 3 já reservada das 14h às 15h").
