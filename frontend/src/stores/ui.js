import { defineStore } from 'pinia'

const THEME_KEY = 'nexmeet-theme'
const SIDEBAR_KEY = 'nexmeet-sidebar-collapsed'

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    // Padrão escuro, como no layout de referência.
    theme: localStorage.getItem(THEME_KEY) || 'dark',
    sidebarCollapsed: localStorage.getItem(SIDEBAR_KEY) === 'true',
  }),

  getters: {
    isDark: (state) => state.theme === 'dark',
  },

  actions: {
    initTheme() {
      applyTheme(this.theme)
    },

    setTheme(theme) {
      this.theme = theme
      localStorage.setItem(THEME_KEY, theme)
      applyTheme(theme)
    },

    toggleSidebarCollapsed() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      localStorage.setItem(SIDEBAR_KEY, String(this.sidebarCollapsed))
    },
  },
})
