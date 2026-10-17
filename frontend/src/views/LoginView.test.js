import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LoginView from './LoginView.vue'
import { useAuthStore } from '../stores/auth'

const push = vi.fn()
vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }))

function montar() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(LoginView, { global: { plugins: [pinia] } })
  return { wrapper, auth: useAuthStore() }
}

async function preencher(wrapper) {
  await wrapper.find('input[type="email"]').setValue('a@b.com')
  await wrapper.find('input[placeholder="sua senha"]').setValue('segredo')
}

describe('LoginView', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    push.mockReset()
  })

  it('login com sucesso redireciona para /', async () => {
    const { wrapper, auth } = montar()
    auth.login = vi.fn().mockResolvedValue()
    await preencher(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(auth.login).toHaveBeenCalledWith('a@b.com', 'segredo', false)
    expect(push).toHaveBeenCalledWith('/')
  })

  it('exibe a mensagem de erro da API', async () => {
    const { wrapper, auth } = montar()
    auth.login = vi.fn().mockRejectedValue({ response: { data: { detail: 'Credenciais inválidas' } } })
    await preencher(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.text()).toContain('Credenciais inválidas')
    expect(push).not.toHaveBeenCalled()
  })

  it('exibe mensagem padrão quando a API não responde', async () => {
    const { wrapper, auth } = montar()
    auth.login = vi.fn().mockRejectedValue(new Error('rede'))
    await preencher(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.text()).toContain('Não foi possível fazer login.')
  })

  it('alterna a visibilidade da senha', async () => {
    const { wrapper } = montar()
    const campo = () => wrapper.find('input[placeholder="sua senha"]')
    expect(campo().attributes('type')).toBe('password')
    await wrapper.find('button[type="button"]').trigger('click')
    expect(campo().attributes('type')).toBe('text')
  })
})
