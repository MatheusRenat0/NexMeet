import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import NovoUsuarioView from './NovoUsuarioView.vue'
import SelectField from '../components/SelectField.vue'
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
  if (v.perfil !== undefined) await w.findComponent(SelectField).setValue(v.perfil)
  if (v.senha !== undefined) await w.find('#senha').setValue(v.senha)
  if (v.confirmarSenha !== undefined) await w.find('#confirmarSenha').setValue(v.confirmarSenha)
}

const enviar = async (w) => {
  await w.find('form').trigger('submit')
  await flushPromises()
}

const SENHA = 'senha-forte-1'

describe('NovoUsuarioView', () => {
  beforeEach(() => push.mockReset())

  it('não envia e mostra erros inline com o formulário vazio', async () => {
    const w = await montar()
    await enviar(w)
    for (const campo of ['nome', 'email', 'perfil', 'senha']) {
      expect(w.find(`[data-testid="erro-${campo}"]`).exists()).toBe(true)
    }
    expect(push).not.toHaveBeenCalled()
  })

  it('rejeita e-mail inválido', async () => {
    const w = await montar()
    await preencher(w, { nome: 'Maria da Silva', email: 'maria@', perfil: 'Colaborador', senha: SENHA, confirmarSenha: SENHA })
    await enviar(w)
    expect(w.find('[data-testid="erro-email"]').text()).toBe('Informe um e-mail válido.')
    expect(push).not.toHaveBeenCalled()
  })

  it('rejeita e-mail já cadastrado', async () => {
    const w = await montar()
    await preencher(w, { nome: 'Outra Ana', email: 'ANA.SOUZA@empresa.com', perfil: 'Colaborador', senha: SENHA, confirmarSenha: SENHA })
    await enviar(w)
    expect(w.find('[data-testid="erro-email"]').text()).toContain('Já existe')
  })

  it('rejeita senha curta e confirmação diferente', async () => {
    const w = await montar()
    await preencher(w, { nome: 'Maria da Silva', email: 'maria@empresa.com', perfil: 'Colaborador', senha: 'curta', confirmarSenha: 'curta' })
    await enviar(w)
    expect(w.find('[data-testid="erro-senha"]').text()).toContain('8')
    await preencher(w, { senha: SENHA, confirmarSenha: 'diferente-123' })
    expect(w.find('[data-testid="erro-confirmarSenha"]').text()).toBe('As senhas não conferem.')
    expect(push).not.toHaveBeenCalled()
  })

  it('alterna a visibilidade das duas senhas', async () => {
    const w = await montar()
    expect(w.find('#senha').attributes('type')).toBe('password')
    expect(w.find('#confirmarSenha').attributes('type')).toBe('password')
    await w.find('[data-testid="alternar-senha"]').trigger('click')
    expect(w.find('#senha').attributes('type')).toBe('text')
    expect(w.find('#confirmarSenha').attributes('type')).toBe('text')
  })

  it('revalida a cada alteração depois da primeira tentativa', async () => {
    const w = await montar()
    await enviar(w)
    expect(w.find('[data-testid="erro-nome"]').exists()).toBe(true)
    await w.find('#nome').setValue('Maria da Silva')
    expect(w.find('[data-testid="erro-nome"]').exists()).toBe(false)
  })

  it('lista os perfis com descrição no seletor padronizado', async () => {
    const w = await montar()
    await w.find('button#perfil').trigger('click')
    const opcoes = w.findAll('[data-testid="select-opcao"]')
    expect(opcoes.map((o) => o.find('p').text())).toEqual(['Administrador', 'Coordenador', 'Colaborador', 'Visitante'])
    expect(opcoes[3].text()).toContain('não cria reservas')
  })

  it('avisa que a senha deverá ser trocada no primeiro acesso', async () => {
    const w = await montar()
    expect(w.find('[data-testid="aviso-primeiro-acesso"]').text()).toContain('trocar')
  })

  it('cadastra o usuário, marca troca de senha no primeiro acesso e não guarda a senha', async () => {
    const w = await montar()
    await preencher(w, { nome: '  Maria da Silva ', email: ' Maria@Empresa.com ', perfil: 'Coordenador', senha: SENHA, confirmarSenha: SENHA })
    await enviar(w)
    expect(push).toHaveBeenCalledWith('/usuarios')
    const criado = (await usuariosService.listar()).find((u) => u.email === 'maria@empresa.com')
    expect(criado).toMatchObject({ nome: 'Maria da Silva', perfil: 'Coordenador', ativo: true, trocarSenhaNoPrimeiroAcesso: true })
    expect(JSON.stringify(criado)).not.toContain(SENHA)
    expect(criado).not.toHaveProperty('senha')
  })
})
