import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UsuariosView from './UsuariosView.vue'

async function montar() {
  const w = mount(UsuariosView, { attachTo: document.body })
  await flushPromises()
  return w
}

const linhas = (w) => w.findAll('[data-testid="usuario"]')

describe('UsuariosView', () => {
  it('lista a primeira página com 5 usuários e o resumo', async () => {
    const w = await montar()
    expect(linhas(w)).toHaveLength(5)
    expect(w.find('[data-testid="resumo"]').text()).toContain('12 usuário(s)')
    expect(w.find('[data-testid="resumo"]').text()).toContain('página 1 de 3')
  })

  it('pagina para frente e para trás e desabilita os limites', async () => {
    const w = await montar()
    expect(w.find('[data-testid="anterior"]').attributes('disabled')).toBeDefined()
    await w.find('[data-testid="proxima"]').trigger('click')
    expect(w.find('[data-testid="resumo"]').text()).toContain('página 2 de 3')
    await w.find('[data-testid="proxima"]').trigger('click')
    expect(linhas(w)).toHaveLength(2)
    expect(w.find('[data-testid="proxima"]').attributes('disabled')).toBeDefined()
    await w.find('[data-testid="anterior"]').trigger('click')
    expect(w.find('[data-testid="resumo"]').text()).toContain('página 2 de 3')
  })

  it('busca por nome ou e-mail e volta para a primeira página', async () => {
    const w = await montar()
    await w.find('[data-testid="proxima"]').trigger('click')
    await w.find('input[type="search"]').setValue('juliana')
    expect(linhas(w)).toHaveLength(1)
    expect(w.find('[data-testid="resumo"]').text()).toContain('página 1 de 1')
    await w.find('input[type="search"]').setValue('camila.rocha@')
    expect(linhas(w)[0].text()).toContain('Camila Rocha')
  })

  it('filtra por perfil e por status', async () => {
    const w = await montar()
    await w.find('select[aria-label="Filtrar por perfil"]').setValue('Visitante')
    expect(linhas(w)).toHaveLength(2)
    await w.find('select[aria-label="Filtrar por perfil"]').setValue('todos')
    await w.find('select[aria-label="Filtrar por status"]').setValue('inativo')
    expect(linhas(w)).toHaveLength(2)
    linhas(w).forEach((l) => expect(l.find('[data-testid="status"]').text()).toBe('Inativo'))
  })

  it('mostra estado vazio e limpa os filtros', async () => {
    const w = await montar()
    await w.find('input[type="search"]').setValue('zzz')
    expect(w.find('[data-testid="vazio"]').exists()).toBe(true)
    await w.find('[data-testid="vazio"] button').trigger('click')
    expect(linhas(w)).toHaveLength(5)
  })

  it('pede confirmação e permite cancelar sem alterar o status', async () => {
    const w = await montar()
    const primeira = linhas(w)[0]
    await primeira.find('[data-testid="alternar"]').trigger('click')
    expect(w.find('[data-testid="modal"]').exists()).toBe(true)
    await w.find('[data-testid="cancelar"]').trigger('click')
    expect(w.find('[data-testid="modal"]').exists()).toBe(false)
    expect(linhas(w)[0].find('[data-testid="status"]').text()).toBe('Ativo')
  })

  it('inativa e reativa o usuário depois de confirmar', async () => {
    const w = await montar()
    await w.find('input[type="search"]').setValue('carlos.lima')
    await linhas(w)[0].find('[data-testid="alternar"]').trigger('click')
    expect(w.find('[data-testid="modal"]').text()).toContain('deixará de conseguir acessar')
    await w.find('[data-testid="confirmar"]').trigger('click')
    await flushPromises()
    expect(w.find('[data-testid="modal"]').exists()).toBe(false)
    expect(linhas(w)[0].find('[data-testid="status"]').text()).toBe('Inativo')

    await linhas(w)[0].find('[data-testid="alternar"]').trigger('click')
    expect(w.find('[data-testid="modal"]').text()).toContain('voltará a ter acesso')
    await w.find('[data-testid="confirmar"]').trigger('click')
    await flushPromises()
    expect(linhas(w)[0].find('[data-testid="status"]').text()).toBe('Ativo')
  })
})
