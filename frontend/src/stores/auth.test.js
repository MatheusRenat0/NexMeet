import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

vi.mock('axios')

describe('store de autenticação', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('começa não autenticado sem token salvo', () => {
    expect(useAuthStore().isAuthenticated).toBe(false)
  })

  it('restaura o token salvo no localStorage', () => {
    localStorage.setItem('nexmeet_token', 'abc')
    const auth = useAuthStore()
    expect(auth.token).toBe('abc')
    expect(auth.isAuthenticated).toBe(true)
  })

  it('login sem "lembrar de mim" usa sessionStorage', async () => {
    axios.post.mockResolvedValue({ data: { access_token: 'tok' } })
    const auth = useAuthStore()
    await auth.login('a@b.com', '123', false)
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.email).toBe('a@b.com')
    expect(sessionStorage.getItem('nexmeet_token')).toBe('tok')
    expect(localStorage.getItem('nexmeet_token')).toBeNull()
  })

  it('login com "lembrar de mim" usa localStorage', async () => {
    axios.post.mockResolvedValue({ data: { access_token: 'tok' } })
    await useAuthStore().login('a@b.com', '123', true)
    expect(localStorage.getItem('nexmeet_token')).toBe('tok')
  })

  it('login com erro propaga a exceção e não autentica', async () => {
    axios.post.mockRejectedValue(new Error('401'))
    const auth = useAuthStore()
    await expect(auth.login('a@b.com', 'x')).rejects.toThrow()
    expect(auth.isAuthenticated).toBe(false)
  })

  it('logout limpa estado e armazenamento', async () => {
    axios.post.mockResolvedValue({ data: { access_token: 'tok' } })
    const auth = useAuthStore()
    await auth.login('a@b.com', '123', true)
    auth.logout()
    expect(auth.isAuthenticated).toBe(false)
    expect(localStorage.getItem('nexmeet_token')).toBeNull()
    expect(sessionStorage.getItem('nexmeet_token')).toBeNull()
  })
})
