import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SelectField from './SelectField.vue'

const options = [
  { value: 'a', label: 'Alfa', descricao: 'Primeira' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gama', disabled: true },
]

function montar(props = {}) {
  return mount(SelectField, { attachTo: document.body, props: { id: 'sel', options, modelValue: '', ...props } })
}

const opcoes = (w) => w.findAll('[data-testid="select-opcao"]')

describe('SelectField', () => {
  it('mostra o placeholder ou o rótulo da opção selecionada', () => {
    expect(montar({ placeholder: 'Escolha' }).find('[data-testid="select-valor"]').text()).toBe('Escolha')
    expect(montar({ modelValue: 'b' }).find('[data-testid="select-valor"]').text()).toBe('Beta')
  })

  it('abre a lista com rótulos e descrições', async () => {
    const w = montar()
    expect(w.find('[data-testid="select-lista"]').exists()).toBe(false)
    await w.find('button#sel').trigger('click')
    expect(opcoes(w)).toHaveLength(3)
    expect(opcoes(w)[0].text()).toContain('Primeira')
  })

  it('marca a opção selecionada', async () => {
    const w = montar({ modelValue: 'b' })
    await w.find('button#sel').trigger('click')
    expect(opcoes(w).map((o) => o.attributes('aria-selected'))).toEqual(['false', 'true', 'false'])
  })

  it('escolhe uma opção, emite o valor e fecha', async () => {
    const w = montar()
    await w.find('button#sel').trigger('click')
    await opcoes(w)[1].trigger('click')
    expect(w.emitted('update:modelValue')[0]).toEqual(['b'])
    expect(w.find('[data-testid="select-lista"]').exists()).toBe(false)
  })

  it('não permite escolher opção desabilitada', async () => {
    const w = montar()
    await w.find('button#sel').trigger('click')
    expect(opcoes(w)[2].attributes('aria-disabled')).toBe('true')
    await opcoes(w)[2].trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(w.find('[data-testid="select-lista"]').exists()).toBe(true)
  })

  it('fecha ao clicar fora e com Esc', async () => {
    const w = montar()
    await w.find('button#sel').trigger('click')
    document.body.click()
    await w.vm.$nextTick()
    expect(w.find('[data-testid="select-lista"]').exists()).toBe(false)
    await w.find('button#sel').trigger('click')
    await w.find('button#sel').trigger('keydown', { key: 'Escape' })
    expect(w.find('[data-testid="select-lista"]').exists()).toBe(false)
  })

  it('marca o estado inválido na borda', () => {
    expect(montar({ invalid: true }).find('button#sel').classes()).toContain('border-alert')
  })
})
