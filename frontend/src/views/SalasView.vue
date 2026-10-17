<script setup>
import { ref, onMounted, computed } from 'vue'
import { salasService } from '../services'

const salas = ref([])
const busca = ref('')
const status = ref('todos')

const ROTULOS = { disponivel: 'Disponível', ocupada: 'Ocupada', manutencao: 'Em manutenção' }
const CORES = {
  disponivel: 'bg-secondary/15 text-primary',
  ocupada: 'bg-primary/10 text-primary',
  manutencao: 'bg-alert/15 text-alert',
}

onMounted(async () => {
  salas.value = await salasService.listar()
})

const filtradas = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  return salas.value.filter(
    (s) =>
      (status.value === 'todos' || s.status === status.value) &&
      (!termo || s.nome.toLowerCase().includes(termo)),
  )
})
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold font-[family-name:var(--font-heading)] text-ink dark:text-ink-dark">Salas</h1>
    <p class="text-sm text-ink/60 dark:text-ink-dark/60 mb-6">Encontre a sala certa para a sua reunião.</p>

    <p class="text-xs text-ink/40 dark:text-ink-dark/40 mb-4">Dados de demonstração — a integração com a API vem nas próximas fases.</p>

    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        v-model="busca"
        type="search"
        placeholder="Buscar sala pelo nome"
        aria-label="Buscar sala pelo nome"
        class="flex-1 rounded-lg border border-ink/15 bg-white dark:bg-ink px-4 py-2.5 text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30"
      />
      <select
        v-model="status"
        aria-label="Filtrar por status"
        class="rounded-lg border border-ink/15 bg-white dark:bg-ink px-4 py-2.5 text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30"
      >
        <option value="todos">Todos os status</option>
        <option value="disponivel">Disponível</option>
        <option value="ocupada">Ocupada</option>
        <option value="manutencao">Em manutenção</option>
      </select>
    </div>

    <div v-if="!filtradas.length" data-testid="vazio" class="bg-white dark:bg-ink rounded-xl shadow-sm p-10 text-center">
      <p class="font-medium text-ink dark:text-ink-dark">Nenhuma sala encontrada</p>
      <p class="text-sm text-ink/50 dark:text-ink-dark/50 mt-1">Ajuste a busca ou o filtro de status.</p>
      <button
        class="mt-4 text-sm font-medium text-secondary hover:text-secondary/80"
        @click="busca = ''; status = 'todos'"
      >
        Limpar filtros
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <article
        v-for="s in filtradas"
        :key="s.id"
        data-testid="sala"
        class="bg-white dark:bg-ink rounded-xl shadow-sm overflow-hidden flex flex-col"
      >
        <div class="h-28 bg-gradient-to-br from-primary to-secondary/70 flex items-end p-4">
          <span class="text-white/90 text-xs">{{ s.andar }}</span>
        </div>
        <div class="p-5 flex-1 flex flex-col">
          <div class="flex items-start justify-between gap-2">
            <h2 class="font-semibold text-ink dark:text-ink-dark">{{ s.nome }}</h2>
            <span class="text-xs font-medium rounded-full px-2.5 py-1 whitespace-nowrap" :class="CORES[s.status]">
              {{ ROTULOS[s.status] }}
            </span>
          </div>
          <p class="text-sm text-ink/60 dark:text-ink-dark/60 mt-1">Capacidade: {{ s.capacidade }} pessoas</p>
          <ul class="flex flex-wrap gap-1.5 mt-3">
            <li
              v-for="r in s.recursos"
              :key="r"
              class="text-xs text-ink/70 dark:text-ink-dark/70 bg-surface dark:bg-surface-dark rounded-md px-2 py-1"
            >
              {{ r }}
            </li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>
