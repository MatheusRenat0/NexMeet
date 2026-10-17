import { describe, it, expect } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import CalendarioView from './CalendarioView.vue'
import { formatarData } from '../services/mockData'

async function montar() {
  const w = mount(CalendarioView, { global: { stubs: { RouterLink: RouterLinkStub } } })
  await flushPromises()
  return w
}

describe('CalendarioView', () => {
  it('mostra o mês atual com todos os dias', async () => {
    const w = await montar()
    const hoje = new Date()
    const total = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate()
    expect(w.findAll('[data-testid="dia"]')).toHaveLength(total)
    expect(w.find('[data-testid="mes-titulo"]').text()).toContain(String(hoje.getFullYear()))
  })

  it('lista as reservas de hoje ordenadas por horário', async () => {
    const w = await montar()
    const itens = w.findAll('[data-testid="reserva-dia"]')
    expect(itens.length).toBe(3)
    expect(itens[0].text()).toContain('09:00')
    expect(itens[2].text()).toContain('15:30')
  })

  it('troca de dia ao clicar e mostra estado vazio quando não há reservas', async () => {
    const w = await montar()
    // escolhe um dia do mês sem reservas (as reservas simuladas ficam a no máximo 4 dias de hoje)
    const livre = w.findAll('[data-testid="dia"]').find((b) => b.attributes('aria-label').endsWith(', 0 reservas'))
    await livre.trigger('click')
    expect(w.find('[data-testid="dia-vazio"]').exists()).toBe(true)
  })

  it('navega entre meses e volta para hoje', async () => {
    const w = await montar()
    const inicial = w.find('[data-testid="mes-titulo"]').text()
    await w.find('button[aria-label="Próximo mês"]').trigger('click')
    expect(w.find('[data-testid="mes-titulo"]').text()).not.toBe(inicial)
    await w.find('button[aria-label="Mês anterior"]').trigger('click')
    await w.find('button[aria-label="Mês anterior"]').trigger('click')
    await w.findAll('button').find((b) => b.text() === 'Hoje').trigger('click')
    expect(w.find('[data-testid="mes-titulo"]').text()).toBe(inicial)
    expect(formatarData(new Date())).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('o botão Nova reserva leva a data selecionada', async () => {
    const w = await montar()
    const link = w.findComponent(RouterLinkStub)
    expect(link.props('to')).toEqual({ path: '/reservas/nova', query: { data: formatarData(new Date()) } })
  })
})