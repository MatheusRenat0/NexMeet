<script setup>
import { ref, onMounted, computed } from 'vue'
import { salasService } from '../services'

const salas = ref([])
const busca = ref('')
const status = ref('todos')

const ROTULOS = { disponivel: 'Disponível', ocupada: 'Ocupada', manutencao: 'Em manutenção' }
const CORES = {
  disponivel: 'bg-accent-soft text-accent',
  ocupada: 'bg-line text-fg',
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
    <h1 class="text-2xl font-bold font-[family-name:var(--font-heading)] text-fg">Salas</h1>
    <p class="text-sm text-muted mb-6">Encontre a sala certa para a sua reunião.</p>

    <p class="text-xs text-muted mb-4">Dados de demonstração — a integração com a API vem nas próximas fases.</p>

    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        v-model="busca"
        type="search"
        placeholder="Buscar sala pelo nome"
        aria-label="Buscar sala pelo nome"
        class="flex-1 rounded-lg border border-line bg-panel px-4 py-2.5 text-sm text-fg focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30"
      />
      <select
        v-model="status"
        aria-label="Filtrar por status"
        class="rounded-lg border border-line bg-panel px-4 py-2.5 text-sm text-fg focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30"
      >
        <option value="todos">Todos os status</option>
        <option value="disponivel">Disponível</option>
        <option value="ocupada">Ocupada</option>
        <option value="manutencao">Em manutenção</option>
      </select>
    </div>

    <div v-if="!filtradas.length" data-testid="vazio" class="bg-hover border border-line rounded-xl p-10 text-center">
      <p class="font-medium text-fg">Nenhuma sala encontrada</p>
      <p class="text-sm text-muted mt-1">Ajuste a busca ou o filtro de status.</p>
      <button
        class="mt-4 text-sm font-medium text-accent hover:opacity-80"
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
        class="bg-hover border border-line rounded-xl overflow-hidden flex flex-col"
      >
        <div class="h-28 bg-gradient-to-br from-primary to-secondary/70 flex items-end p-4">
          <span class="text-white/90 text-xs">{{ s.andar }}</span>
        </div>
        <div class="p-5 flex-1 flex flex-col">
          <div class="flex items-start justify-between gap-2">
            <h2 class="font-semibold text-fg">{{ s.nome }}</h2>
            <span class="text-xs font-medium rounded-full px-2.5 py-1 whitespace-nowrap" :class="CORES[s.status]">
              {{ ROTULOS[s.status] }}
            </span>
          </div>
          <p class="text-sm text-muted mt-1">Capacidade: {{ s.capacidade }} pessoas</p>
          <ul class="flex flex-wrap gap-1.5 mt-3">
            <li
              v-for="r in s.recursos"
              :key="r"
              class="text-xs text-muted bg-panel border border-line rounded-md px-2 py-1"
            >
              {{ r }}
            </li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>
