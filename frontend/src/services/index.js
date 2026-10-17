import { salas, proximasReservas, indicadores, rankingSalas, reservas } from './mockData'

// Interface assíncrona estável: ao integrar a API, só o corpo destas funções muda.
const resolver = (valor) => Promise.resolve(structuredClone(valor))

export const salasService = {
  listar: () => resolver(salas),
}

export const dashboardService = {
  indicadores: () => resolver(indicadores),
  proximasReservas: () => resolver(proximasReservas),
  rankingSalas: () => resolver(rankingSalas),
}

export const reservasService = {
  listar: () => resolver(reservas),
}
