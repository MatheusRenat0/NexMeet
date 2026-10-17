import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppLayout from './AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'

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
  const wrapper = mount(AppLayout, { attachTo: document.body, global: { plugins: [pinia, router] } })
  return { wrapper, router, auth, ui: useUiStore() }
}

describe('AppLayout', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    document.body.innerHTML = ''
    window.innerWidth = 1280
  })

  it('mostra o menu, as seções e o usuário logado', async () => {
    const { wrapper } = await montar()
    const nav = wrapper.find('nav')
    expect(nav.text()).toContain('Início')
    expect(nav.text()).toContain('Reservas')
    expect(nav.text()).toContain('Salas')
    expect(wrapper.find('[data-testid="usuario-logado"]').text()).toBe('ana@empresa.com')
    expect(wrapper.find('[data-testid="avatar"]').text()).toBe('an')
  })

  it('navega ao clicar em um item do menu', async () => {
    const { wrapper, router } = await montar()
    await wrapper.findAll('nav a')[1].trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/salas')
  })

  it('sair encerra a sessão e vai para o login', async () => {
    const { wrapper, router, auth } = await montar()
    await wrapper.find('[data-testid="sair"]').trigger('click')
    await flushPromises()
    expect(auth.isAuthenticated).toBe(false)
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('no desktop, o botão do menu recolhe e expande a sidebar e persiste a escolha', async () => {
    const { wrapper } = await montar()
    const layout = wrapper.find('[data-testid="layout"]')
    expect(layout.classes()).not.toContain('collapsed')
    await wrapper.find('button[aria-label="Alternar menu"]').trigger('click')
    expect(layout.classes()).toContain('collapsed')
    expect(localStorage.getItem('nexmeet-sidebar-collapsed')).toBe('true')
    await wrapper.find('button[aria-label="Alternar menu"]').trigger('click')
    expect(layout.classes()).not.toContain('collapsed')
  })

  it('no mobile, o botão do menu abre e fecha o drawer', async () => {
    window.innerWidth = 500
    const { wrapper } = await montar()
    const sidebar = wrapper.find('[data-testid="sidebar"]')
    expect(sidebar.classes()).not.toContain('active')
    await wrapper.find('button[aria-label="Alternar menu"]').trigger('click')
    expect(sidebar.classes()).toContain('active')
    await wrapper.find('[data-testid="overlay"]').trigger('click')
    expect(sidebar.classes()).not.toContain('active')
  })

  it('abre um dropdown por vez e fecha ao clicar fora', async () => {
    const { wrapper } = await montar()
    await wrapper.find('button[aria-label="Notificações"]').trigger('click')
    expect(wrapper.find('[data-testid="menu-notif"]').classes()).toContain('active')
    await wrapper.find('[data-testid="avatar"]').trigger('click')
    expect(wrapper.find('[data-testid="menu-notif"]').classes()).not.toContain('active')
    expect(wrapper.find('[data-testid="menu-user"]').classes()).toContain('active')
    document.body.click()
    await flushPromises()
    expect(wrapper.find('[data-testid="menu-user"]').classes()).not.toContain('active')
  })

  it('alterna o modo escuro e aplica data-theme', async () => {
    const { wrapper, ui } = await montar()
    expect(ui.theme).toBe('dark')
    await wrapper.find('[data-testid="tema"]').trigger('click')
    expect(ui.theme).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(localStorage.getItem('nexmeet-theme')).toBe('light')
  })
})
