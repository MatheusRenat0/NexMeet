import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const STORAGE_KEY = 'nexmeet_token'

function readStoredToken() {
  return localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY)
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: readStoredToken(),
    email: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    /**
     * @param {string} email
     * @param {string} senha
     * @param {boolean} lembrarDeMim - true: sobrevive ao fechar o navegador
     * (localStorage); false: some ao fechar a aba (sessionStorage).
     */
    async login(email, senha, lembrarDeMim = false) {
      const response = await axios.post(`${API_URL}/auth/login`, { email, senha })
      this.token = response.data.access_token
      this.email = email

      const storage = lembrarDeMim ? localStorage : sessionStorage
      storage.setItem(STORAGE_KEY, this.token)
    },

    logout() {
      this.token = null
      this.email = null
      localStorage.removeItem(STORAGE_KEY)
      sessionStorage.removeItem(STORAGE_KEY)
    },
  },
})