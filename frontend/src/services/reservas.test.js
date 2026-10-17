import { describe, it, expect } from 'vitest'
import { validarReserva, HORARIO_COMERCIAL } from './reservas'
import { formatarData } from './mockData'

const salas = [
  { id: 1, nome: 'A', capacidade: 8, status: 'disponivel' },
  { id: 2, nome: 'B', capacidade: 4, status: 'manutencao' },
]

function futuro(dias = 10) {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return formatarData(d)
}

const reservas = [{ id: 1, titulo: 'Existente', salaId: 1, data: futuro(), inicio: '10:00', fim: '11:00', status: 'confirmada' }]

const valida = () => ({
  titulo: 'Reunião',
  salaId: 1,
  data: futuro(),
  inicio: '13:00',
  fim: '14:00',
  participantes: 5,
})

const validar = (dados) => validarReserva(dados, { salas, reservas })

describe('validarReserva', () => {
  it('aceita uma reserva válida', () => {
    expect(validar(valida())).toEqual({})
  })

  it('exige os campos obrigatórios', () => {
    const erros = validar({ titulo: '', salaId: '', data: '', inicio: '', fim: '', participantes: '' })
    expect(Object.keys(erros).sort()).toEqual(['data', 'fim', 'inicio', 'participantes', 'salaId', 'titulo'])
  })

  it('rejeita data no passado', () => {
    expect(validar({ ...valida(), data: '2000-01-01' }).data).toBeDefined()
  })

  it('rejeita término antes ou igual ao início', () => {
    expect(validar({ ...valida(), inicio: '14:00', fim: '14:00' }).fim).toBeDefined()
    expect(validar({ ...valida(), inicio: '15:00', fim: '14:00' }).fim).toBeDefined()
  })

  it('RN-02: rejeita fora do horário comercial', () => {
    const cedo = validar({ ...valida(), inicio: '06:00', fim: '07:00' })
    expect(cedo.inicio).toContain(HORARIO_COMERCIAL.inicio)
    expect(validar({ ...valida(), inicio: '17:30', fim: '19:00' }).inicio).toBeDefined()
  })

  it('RN-04: rejeita sala em manutenção', () => {
    expect(validar({ ...valida(), salaId: 2 }).salaId).toContain('manutenção')
  })

  it('RN-05: rejeita participantes acima da capacidade', () => {
    expect(validar({ ...valida(), participantes: 9 }).participantes).toContain('8')
  })

  it('RN-01: rejeita sobreposição de horário na mesma sala', () => {
    expect(validar({ ...valida(), inicio: '10:30', fim: '11:30' }).inicio).toContain('Conflito')
    expect(validar({ ...valida(), inicio: '09:00', fim: '12:00' }).inicio).toContain('Conflito')
  })

  it('RN-01: horários adjacentes não conflitam', () => {
    expect(validar({ ...valida(), inicio: '11:00', fim: '12:00' })).toEqual({})
    expect(validar({ ...valida(), inicio: '09:00', fim: '10:00' })).toEqual({})
  })

  it('RN-01: reserva cancelada não conflita', () => {
    const canceladas = [{ ...reservas[0], status: 'cancelada' }]
    expect(validarReserva({ ...valida(), inicio: '10:00', fim: '11:00' }, { salas, reservas: canceladas })).toEqual({})
  })

  it('RN-01: mesma hora em outra sala ou outro dia não conflita', () => {
    const outroDia = { ...valida(), data: futuro(11), inicio: '10:00', fim: '11:00' }
    expect(validar(outroDia)).toEqual({})
  })
})
