import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TimeField from './TimeField.vue'

function montar(props = {}) {
  return mount(TimeField, { attachTo: document.body, props: { id: 'hora', modelValue: '09:00', de: '08:00', ate: '10:00', ...props } })
}

const opcoes = (w) => w.findAll('[data-testid="hora-opcao"]').map((o) => o.text())

describe('TimeField', () => {
  it('mostra o valor ou o placeholder', () => {
    expect(montar().find('[data-testid="hora-valor"]').text()).toBe('09:00')
    expect(montar({ modelValue: '' }).find('[data-testid="hora-valor"]').text()).toBe('--:--')
  })

  it('lista horários de 30 em 30 minutos dentro do intervalo', async () => {
    const w = montar()
    await w.find('button#hora').trigger('click')
    expect(opcoes(w)).toEqual(['08:00', '08:30', '09:00', '09:30', '10:00'])
  })

  it('respeita um passo diferente', async () => {
    const w = montar({ passo: 60 })
    await w.find('button#hora').trigger('click')
    expect(opcoes(w)).toEqual(['08:00', '09:00', '10:00'])
  })

  it('marca a opção selecionada', async () => {
    const w = montar()
    await w.find('button#hora').trigger('click')
    const marcada = w.findAll('[data-testid="hora-opcao"]').filter((o) => o.attributes('aria-selected') === 'true')
    expect(marcada.map((o) => o.text())).toEqual(['09:00'])
  })

  it('escolhe um horário, emite o valor e fecha', async () => {
    const w = montar()
    await w.find('button#hora').trigger('click')
    await w.findAll('[data-testid="hora-opcao"]')[3].trigger('click')
    expect(w.emitted('update:modelValue')[0]).toEqual(['09:30'])
    expect(w.find('[data-testid="hora-lista"]').exists()).toBe(false)
  })

  it('fecha ao clicar fora e com Esc', async () => {
    const w = montar()
    await w.find('button#hora').trigger('click')
    document.body.click()
    await w.vm.$nextTick()
    expect(w.find('[data-testid="hora-lista"]').exists()).toBe(false)
    await w.find('button#hora').trigger('click')
    await w.find('button#hora').trigger('keydown', { key: 'Escape' })
    expect(w.find('[data-testid="hora-lista"]').exists()).toBe(false)
  })

  it('marca o estado inválido na borda', () => {
    expect(montar({ invalid: true }).find('button#hora').classes()).toContain('border-alert')
  })
})
