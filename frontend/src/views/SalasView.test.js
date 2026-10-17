import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import SalasView from './SalasView.vue'

async function montar() {
  const wrapper = mount(SalasView)
  await flushPromises()
  return wrapper
}

describe('SalasView', () => {
  it('lista todas as salas', async () => {
    const w = await montar()
    expect(w.findAll('[data-testid="sala"]')).toHaveLength(6)
  })

  it('filtra pelo nome', async () => {
    const w = await montar()
    await w.find('input[type="search"]').setValue('aurora')
    const cards = w.findAll('[data-testid="sala"]')
    expect(cards).toHaveLength(1)
    expect(cards[0].text()).toContain('Sala Aurora')
  })

  it('filtra pelo status', async () => {
    const w = await montar()
    await w.find('select').setValue('manutencao')
    const cards = w.findAll('[data-testid="sala"]')
    expect(cards).toHaveLength(1)
    expect(cards[0].text()).toContain('Em manutenção')
  })

  it('mostra estado vazio e limpa os filtros', async () => {
    const w = await montar()
    await w.find('input[type="search"]').setValue('inexistente')
    expect(w.find('[data-testid="vazio"]').exists()).toBe(true)
    await w.find('[data-testid="vazio"] button').trigger('click')
    expect(w.findAll('[data-testid="sala"]')).toHaveLength(6)
  })
})
