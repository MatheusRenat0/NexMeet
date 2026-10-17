<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logoMono from '../assets/branding/logo-mono.svg'

const auth = useAuthStore()
const router = useRouter()
const menuAberto = ref(false)

// Filtro por perfil depende do perfil no JWT (F-01); por ora todos os itens implementados aparecem.
const itensMenu = [
  { to: '/', label: 'Dashboard', icone: 'M3 12 12 3l9 9M5 10v10h5v-6h4v6h5V10' },
  { to: '/salas', label: 'Salas', icone: 'M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M2 21h20M8 9h3M8 13h3' },
]

function sair() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-surface dark:bg-surface-dark md:flex">
    <!-- Fundo escurecido do drawer (mobile) -->
    <div
      v-if="menuAberto"
      class="fixed inset-0 bg-ink/50 z-30 md:hidden"
      @click="menuAberto = false"
    ></div>

    <!-- Menu lateral -->
    <aside
      data-testid="sidebar"
      class="fixed inset-y-0 left-0 z-40 w-64 bg-primary text-white flex flex-col transition-transform duration-200 md:static md:translate-x-0"
      :class="menuAberto ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="px-6 py-5 flex items-center gap-3 border-b border-white/10">
        <img :src="logoMono" alt="NexMeet" class="h-9 w-auto" />
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1" aria-label="Navegação principal">
        <RouterLink
          v-for="item in itensMenu"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white transition-colors"
          active-class="!bg-white/15 !text-white"
          exact-active-class="!bg-white/15 !text-white"
          @click="menuAberto = false"
        >
          <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path :d="item.icone" />
          </svg>
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="px-3 py-4 border-t border-white/10">
        <button
          class="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white transition-colors"
          @click="sair"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Sair
        </button>
      </div>
    </aside>

    <div class="flex-1 min-w-0 flex flex-col">
      <!-- Topo -->
      <header class="h-16 bg-white dark:bg-ink border-b border-ink/10 flex items-center justify-between px-4 md:px-8">
        <button
          class="md:hidden p-2 -ml-2 text-ink dark:text-ink-dark"
          aria-label="Abrir menu"
          @click="menuAberto = true"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span class="hidden md:block"></span>

        <div class="flex items-center gap-4">
          <button class="relative p-2 text-ink/60 dark:text-ink-dark/60 hover:text-ink dark:hover:text-ink-dark transition-colors" aria-label="Notificações">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0" />
            </svg>
          </button>
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-secondary/20 text-primary font-semibold text-sm flex items-center justify-center uppercase">
              {{ (auth.email || '?').charAt(0) }}
            </span>
            <span class="hidden sm:block text-sm text-ink dark:text-ink-dark" data-testid="usuario-logado">{{ auth.email || 'Usuário' }}</span>
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
