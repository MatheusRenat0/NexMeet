import { formatarData } from './mockData'

// Horário comercial: valor provisório até existir a configuração do Administrador (N-07a, RN-02).
export const HORARIO_COMERCIAL = { inicio: '08:00', fim: '18:00' }

/**
 * Validação de UX no cliente. A regra oficial é aplicada pelo backend (N-03).
 * Cobre RN-01 (conflito), RN-02 (horário comercial), RN-04 (manutenção),
 * RN-05 (capacidade). RN-03 (feriados) depende da N-07a.
 * @returns {Object} mapa campo -> mensagem; vazio quando válido
 */
export function validarReserva(dados, { salas, reservas }) {
  const erros = {}
  const { salaId, data, inicio, fim, participantes, titulo } = dados

  if (!titulo || !titulo.trim()) erros.titulo = 'Informe o motivo da reunião.'

  const sala = salas.find((s) => s.id === Number(salaId))
  if (!salaId) erros.salaId = 'Selecione uma sala.'
  else if (!sala) erros.salaId = 'Sala inválida.'
  else if (sala.status === 'manutencao') erros.salaId = 'Sala em manutenção não pode ser reservada.'

  if (!data) erros.data = 'Informe a data.'
  else if (data < formatarData(new Date())) erros.data = 'A data não pode estar no passado.'

  if (!inicio) erros.inicio = 'Informe o horário de início.'
  if (!fim) erros.fim = 'Informe o horário de término.'

  if (inicio && fim) {
    if (fim <= inicio) erros.fim = 'O término deve ser depois do início.'
    else if (inicio < HORARIO_COMERCIAL.inicio || fim > HORARIO_COMERCIAL.fim) {
      erros.inicio = `Reservas só podem ocorrer entre ${HORARIO_COMERCIAL.inicio} e ${HORARIO_COMERCIAL.fim}.`
    }
  }

  const qtd = Number(participantes)
  if (!participantes || !Number.isInteger(qtd) || qtd < 1) erros.participantes = 'Informe o número de participantes.'
  else if (sala && qtd > sala.capacidade) erros.participantes = `A sala comporta no máximo ${sala.capacidade} pessoas.`

  if (!erros.salaId && !erros.data && !erros.inicio && !erros.fim && sala) {
    const conflito = reservas.find(
      (r) => r.salaId === sala.id && r.data === data && r.status !== 'cancelada' && inicio < r.fim && fim > r.inicio,
    )
    if (conflito) erros.inicio = `Conflito com "${conflito.titulo}" (${conflito.inicio}–${conflito.fim}) nesta sala.`
  }

  return erros
}
