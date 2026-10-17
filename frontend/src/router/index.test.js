import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

describe('guarda de rota', () => {
  let router

  beforeEach(async () => {
    localStorage.clear()
    sessionStorage.clear()
    setActivePinia(createPinia())
    // reimporta para o router usar a store atual
    const mod = await import('./index.js')
    router = mod.default
  })

  it('redireciona para /login quando não autenticado', async () => {
    await router.push('/')
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('permite acessar / quando autenticado', async () => {
    const { useAuthStore } = await import('../stores/auth')
    useAuthStore().token = 'tok'
    await router.push('/')
    expect(router.currentRoute.value.name).toBe('home')
  })

  it('permite acessar /login sem autenticação', async () => {
    await router.push('/login')
    expect(router.currentRoute.value.name).toBe('login')
  })
})
