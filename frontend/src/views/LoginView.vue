<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import loginIllustration from '../assets/illustrations/login.svg'

const email = ref('')
const senha = ref('')
const mostrarSenha = ref(false)
const lembrarDeMim = ref(false)
const erro = ref('')
const carregando = ref(false)

const auth = useAuthStore()
const router = useRouter()

async function handleSubmit() {
  erro.value = ''
  carregando.value = true
  try {
    await auth.login(email.value, senha.value, lembrarDeMim.value)
    router.push('/')
  } catch (err) {
    erro.value = err.response?.data?.detail || 'Não foi possível fazer login.'
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex bg-white dark:bg-ink">

    <!-- Coluna do Formulário -->
    <div class="w-full md:w-5/12 flex items-center justify-center px-8 py-12 z-10 bg-white dark:bg-ink">
      <div class="w-full max-w-sm">

        <!-- Marca -->
        <div class="flex items-center gap-2 mb-10">
          <div class="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span class="text-white text-sm font-bold">N</span>
          </div>
          <span class="text-sm font-semibold text-ink dark:text-ink-dark tracking-tight">NexMeet</span>
        </div>

        <!-- Cabeçalho do Login -->
        <div class="mb-8">
          <h1 class="text-3xl font-extrabold text-ink dark:text-ink-dark tracking-tight mb-2">Faça seu login</h1>
          <p class="text-sm text-ink/60 dark:text-ink-dark/60">Insira suas credenciais para gerenciar suas reservas.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">

          <!-- Campo E-mail -->
          <div>
            <label class="block text-xs font-medium text-ink/60 dark:text-ink-dark/60 mb-1.5 uppercase tracking-wide">E-mail</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30 dark:text-ink-dark/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 6-10 7L2 6" />
              </svg>
              <input
                v-model="email"
                type="email"
                required
                placeholder="voce@empresa.com"
                class="w-full rounded-lg border border-ink/15 dark:border-ink-dark/20 bg-transparent pl-10 pr-4 py-3 text-sm text-ink dark:text-ink-dark placeholder:text-ink/40 dark:placeholder:text-ink-dark/40 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30 transition-all"
              />
            </div>
          </div>

          <!-- Campo Senha -->
          <div>
            <label class="block text-xs font-medium text-ink/60 dark:text-ink-dark/60 mb-1.5 uppercase tracking-wide">Senha</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30 dark:text-ink-dark/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                v-model="senha"
                :type="mostrarSenha ? 'text' : 'password'"
                required
                placeholder="sua senha"
                class="w-full rounded-lg border border-ink/15 dark:border-ink-dark/20 bg-transparent pl-10 pr-11 py-3 text-sm text-ink dark:text-ink-dark placeholder:text-ink/40 dark:placeholder:text-ink-dark/40 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30 transition-all"
              />
              <button
                type="button"
                @click="mostrarSenha = !mostrarSenha"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70 dark:text-ink-dark/40 dark:hover:text-ink-dark/70 transition-colors"
                :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'"
              >
                <svg v-if="mostrarSenha" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <path d="m4 4 16 16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Ações Secundárias -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 text-ink/70 dark:text-ink-dark/70 cursor-pointer hover:text-ink dark:hover:text-ink-dark transition-colors">
              <input
                v-model="lembrarDeMim"
                type="checkbox"
                class="rounded border-ink/30 text-secondary focus:ring-secondary h-4 w-4"
              />
              Lembrar de mim
            </label>
            <a href="#" class="font-medium text-secondary hover:text-secondary/80 transition-colors">Esqueci a senha</a>
          </div>

          <!-- Alerta de Erro -->
          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div v-if="erro" class="flex items-start gap-2 rounded-lg bg-alert/10 border border-alert/30 px-3 py-2.5">
              <svg class="w-4 h-4 text-alert shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <p class="text-sm text-alert">{{ erro }}</p>
            </div>
          </Transition>

          <!-- Botão Principal -->
          <button
            type="submit"
            :disabled="carregando"
            class="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg py-3 mt-2 transition-all transform active:scale-[0.99]"
          >
            <svg v-if="carregando" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            {{ carregando ? 'Autenticando...' : 'Entrar' }}
          </button>
        </form>

        <p class="text-center text-sm text-ink/50 dark:text-ink-dark/50 mt-6">
          Precisa de ajuda? <a href="#" class="font-medium text-secondary hover:text-secondary/80">Fale com o suporte</a>
        </p>
      </div>
    </div>

    <!-- Coluna Ilustrativa — fundo sólido no estilo pedido -->
    <div class="hidden md:flex flex-1 bg-primary items-center justify-center p-12 relative overflow-hidden">

      <!-- Padrão de grid sutil só pra dar textura no fundo sólido -->
      <div
        class="absolute inset-0 opacity-[0.06]"
        style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 40px 40px;"
      ></div>

      <div class="relative z-10 flex flex-col items-center text-center max-w-md">

        <!-- Bloco claro atrás da ilustração (o SVG é escuro, precisa de fundo claro) -->
        <div class="relative bg-white/95 rounded-3xl shadow-2xl px-10 py-10 mb-8">
          <div class="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-secondary"></div>
          <div class="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-alert/80"></div>
          <img
            :src="loginIllustration"
            alt="Mesa de reunião"
            class="w-full max-w-xs object-contain"
          />
        </div>

        <!-- Frase de efeito -->
        <p class="text-xs font-medium text-white/60 uppercase tracking-wider mb-3">Gestão de salas corporativas</p>
        <h2 class="text-2xl font-extrabold text-white leading-snug">
          A forma mais simples de encontrar e reservar a sala certa.
        </h2>
      </div>
    </div>

  </div>
</template>