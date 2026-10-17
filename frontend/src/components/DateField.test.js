import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DateField from './DateField.vue'
import { formatarData } from '../services/mockData'

function montar(props = {}) {
  return mount(DateField, { attachTo: document.body, props: { id: 'data', modelValue: '2030-05-15', ...props } })
}

const dias = (w) => w.findAll('[data-testid="data-dia"]')

describe('DateField', () => {
  it('mostra a data formatada em dd/mm/aaaa e o placeholder quando vazio', () => {
    expect(montar().find('[data-testid="data-valor"]').text()).toBe('15/05/2030')
    expect(montar({ modelValue: '' }).find('[data-testid="data-valor"]').text()).toBe('Selecione a data')
  })

  it('abre no mês do valor atual e fecha ao clicar de novo', async () => {
    const w = montar()
    expect(w.find('[data-testid="data-popover"]').exists()).toBe(false)
    await w.find('button#data').trigger('click')
    expect(w.find('[data-testid="data-mes"]').text()).toBe('Maio de 2030')
    expect(dias(w)).toHaveLength(31)
    await w.find('button#data').trigger('click')
    expect(w.find('[data-testid="data-popover"]').exists()).toBe(false)
  })

  it('escolhe um dia, emite o valor e fecha', async () => {
    const w = montar()
    await w.find('button#data').trigger('click')
    await dias(w)[19].trigger('click')
    expect(w.emitted('update:modelValue')[0]).toEqual(['2030-05-20'])
    expect(w.find('[data-testid="data-popover"]').exists()).toBe(false)
  })

  it('navega entre meses', async () => {
    const w = montar()
    await w.find('button#data').trigger('click')
    await w.find('button[aria-label="Próximo mês"]').trigger('click')
    expect(w.find('[data-testid="data-mes"]').text()).toBe('Junho de 2030')
    expect(dias(w)).toHaveLength(30)
    await w.find('button[aria-label="Mês anterior"]').trigger('click')
    await w.find('button[aria-label="Mês anterior"]').trigger('click')
    expect(w.find('[data-testid="data-mes"]').text()).toBe('Abril de 2030')
  })

  it('desabilita dias anteriores ao mínimo e não emite ao clicar neles', async () => {
    const w = montar({ min: '2030-05-10' })
    await w.find('button#data').trigger('click')
    const lista = dias(w)
    expect(lista[8].attributes('disabled')).toBeDefined() // dia 9
    expect(lista[9].attributes('disabled')).toBeUndefined() // dia 10
    await lista[8].trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('fecha ao clicar fora e com Esc', async () => {
    const w = montar()
    await w.find('button#data').trigger('click')
    document.body.click()
    await w.vm.$nextTick()
    expect(w.find('[data-testid="data-popover"]').exists()).toBe(false)
    await w.find('button#data').trigger('click')
    await w.find('button#data').trigger('keydown', { key: 'Escape' })
    expect(w.find('[data-testid="data-popover"]').exists()).toBe(false)
  })

  it('marca o estado inválido na borda', () => {
    expect(montar({ invalid: true }).find('button#data').classes()).toContain('border-alert')
    expect(formatarData(new Date())).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
