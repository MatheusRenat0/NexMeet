<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-surface dark:bg-surface-dark">
    <header class="bg-primary">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <span class="text-white font-bold text-lg">NexMeet</span>
        <button
          @click="handleLogout"
          class="text-sm text-white/80 hover:text-white transition"
        >
          Sair
        </button>
      </div>
    </header>

    <main class="max-w-5xl mx-auto p-6">
      <div class="bg-white dark:bg-ink rounded-xl shadow-sm p-8">
        <h1 class="text-xl font-bold text-ink dark:text-ink-dark mb-1">
          Bem-vindo ao NexMeet
        </h1>
        <p class="text-sm text-ink/60 dark:text-ink-dark/60">
          Logado como
          <span class="font-medium text-ink dark:text-ink-dark">{{ auth.email }}</span>
        </p>
        <p class="text-sm text-ink/40 dark:text-ink-dark/40 mt-2">
          Calendário e reservas entram aqui nas próximas fases.
        </p>
      </div>
    </main>
  </div>
</template>