import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppLayout from './AppLayout.vue'
import { useAuthStore } from '../stores/auth'

async function montar() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const auth = useAuthStore()
  auth.token = 'tok'
  auth.email = 'ana@empresa.com'
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div>dash</div>' } },
      { path: '/salas', component: { template: '<div>salas</div>' } },
      { path: '/login', name: 'login', component: { template: '<div>login</div>' } },
    ],
  })
  router.push('/')
  await router.isReady()
  const wrapper = mount(AppLayout, { global: { plugins: [pinia, router] } })
  return { wrapper, router, auth }
}

describe('AppLayout', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('mostra o menu e o usuário logado', async () => {
    const { wrapper } = await montar()
    const nav = wrapper.find('nav')
    expect(nav.text()).toContain('Dashboard')
    expect(nav.text()).toContain('Salas')
    expect(wrapper.find('[data-testid="usuario-logado"]').text()).toBe('ana@empresa.com')
  })

  it('navega ao clicar em um item do menu', async () => {
    const { wrapper, router } = await montar()
    await wrapper.findAll('nav a')[1].trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/salas')
  })

  it('sair encerra a sessão e vai para o login', async () => {
    const { wrapper, router, auth } = await montar()
    const sair = wrapper.findAll('button').find((b) => b.text() === 'Sair')
    await sair.trigger('click')
    await flushPromises()
    expect(auth.isAuthenticated).toBe(false)
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('abre e fecha o drawer no mobile', async () => {
    const { wrapper } = await montar()
    const sidebar = wrapper.find('[data-testid="sidebar"]')
    expect(sidebar.classes()).toContain('-translate-x-full')
    await wrapper.find('button[aria-label="Abrir menu"]').trigger('click')
    expect(sidebar.classes()).toContain('translate-x-0')
  })
})
