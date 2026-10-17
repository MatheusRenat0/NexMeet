import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import NovoUsuarioView from './NovoUsuarioView.vue'
import { usuariosService } from '../services'

const push = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
  RouterLink: { template: '<a><slot /></a>' },
}))

async function montar() {
  const w = mount(NovoUsuarioView, { global: { stubs: { RouterLink: RouterLinkStub } } })
  await flushPromises()
  return w
}

async function preencher(w, v) {
  if (v.nome !== undefined) await w.find('#nome').setValue(v.nome)
  if (v.email !== undefined) await w.find('#email').setValue(v.email)
  if (v.perfil !== undefined) await w.find('#perfil').setValue(v.perfil)
}

const enviar = async (w) => {
  await w.find('form').trigger('submit')
  await flushPromises()
}

describe('NovoUsuarioView', () => {
  beforeEach(() => push.mockReset())

  it('não envia e mostra erros inline com o formulário vazio', async () => {
    const w = await montar()
    await enviar(w)
    expect(w.find('[data-testid="erro-nome"]').exists()).toBe(true)
    expect(w.find('[data-testid="erro-email"]').exists()).toBe(true)
    expect(w.find('[data-testid="erro-perfil"]').exists()).toBe(true)
    expect(push).not.toHaveBeenCalled()
  })

  it('rejeita e-mail inválido', async () => {
    const w = await montar()
    await preencher(w, { nome: 'Maria da Silva', email: 'maria@', perfil: 'Colaborador' })
    await enviar(w)
    expect(w.find('[data-testid="erro-email"]').text()).toBe('Informe um e-mail válido.')
    expect(push).not.toHaveBeenCalled()
  })

  it('rejeita e-mail já cadastrado', async () => {
    const w = await montar()
    await preencher(w, { nome: 'Outra Ana', email: 'ANA.SOUZA@empresa.com', perfil: 'Colaborador' })
    await enviar(w)
    expect(w.find('[data-testid="erro-email"]').text()).toContain('Já existe')
  })

  it('revalida a cada alteração depois da primeira tentativa', async () => {
    const w = await montar()
    await enviar(w)
    expect(w.find('[data-testid="erro-nome"]').exists()).toBe(true)
    await w.find('#nome').setValue('Maria da Silva')
    expect(w.find('[data-testid="erro-nome"]').exists()).toBe(false)
  })

  it('descreve o perfil escolhido', async () => {
    const w = await montar()
    await preencher(w, { perfil: 'Visitante' })
    expect(w.find('[data-testid="perfil-descricao"]').text()).toContain('não cria reservas')
  })

  it('cadastra o usuário ativo, normaliza o e-mail e volta para a listagem', async () => {
    const w = await montar()
    await preencher(w, { nome: '  Maria da Silva ', email: ' Maria@Empresa.com ', perfil: 'Coordenador' })
    await enviar(w)
    expect(push).toHaveBeenCalledWith('/usuarios')
    const criado = (await usuariosService.listar()).find((u) => u.email === 'maria@empresa.com')
    expect(criado).toMatchObject({ nome: 'Maria da Silva', perfil: 'Coordenador', ativo: true })
  })
})
