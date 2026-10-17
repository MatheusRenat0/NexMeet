<script setup>
import { ref, onMounted, computed } from 'vue'
import { dashboardService } from '../services'

const indicadores = ref(null)
const proximas = ref([])
const ranking = ref([])

onMounted(async () => {
  const [ind, prox, rank] = await Promise.all([
    dashboardService.indicadores(),
    dashboardService.proximasReservas(),
    dashboardService.rankingSalas(),
  ])
  indicadores.value = ind
  proximas.value = prox
  ranking.value = rank
})

const maxReservas = computed(() => Math.max(1, ...ranking.value.map((r) => r.reservas)))

const cartoes = computed(() =>
  indicadores.value
    ? [
        { rotulo: 'Reservas hoje', valor: indicadores.value.reservasHoje, cor: 'text-primary' },
        { rotulo: 'Taxa de ocupação', valor: `${indicadores.value.taxaOcupacao}%`, cor: 'text-primary' },
        { rotulo: 'Salas disponíveis', valor: indicadores.value.salasDisponiveis, cor: 'text-secondary' },
        { rotulo: 'Aguardando aprovação', valor: indicadores.value.pendentesAprovacao, cor: 'text-alert' },
      ]
    : [],
)
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold font-[family-name:var(--font-heading)] text-ink dark:text-ink-dark">Dashboard</h1>
    <p class="text-sm text-ink/60 dark:text-ink-dark/60 mb-6">Visão geral das reservas e do uso das salas.</p>

    <p class="text-xs text-ink/40 dark:text-ink-dark/40 mb-4">Dados de demonstração — a integração com a API vem nas próximas fases.</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div
        v-for="c in cartoes"
        :key="c.rotulo"
        data-testid="kpi"
        class="bg-white dark:bg-ink rounded-xl shadow-sm p-5"
      >
        <p class="text-xs uppercase tracking-wide text-ink/50 dark:text-ink-dark/50">{{ c.rotulo }}</p>
        <p class="text-3xl font-extrabold mt-2" :class="c.cor">{{ c.valor }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-ink rounded-xl shadow-sm p-6">
        <h2 class="font-semibold text-ink dark:text-ink-dark mb-4">Próximas reservas</h2>
        <p v-if="!proximas.length" class="text-sm text-ink/50 dark:text-ink-dark/50">Nenhuma reserva para hoje.</p>
        <ul v-else class="divide-y divide-ink/10">
          <li v-for="r in proximas" :key="r.id" data-testid="reserva" class="py-3 flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-ink dark:text-ink-dark">{{ r.titulo }}</p>
              <p class="text-xs text-ink/50 dark:text-ink-dark/50">{{ r.sala }} · {{ r.responsavel }}</p>
            </div>
            <span class="text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-1 whitespace-nowrap">
              {{ r.inicio }} – {{ r.fim }}
            </span>
          </li>
        </ul>
      </div>

      <div class="bg-white dark:bg-ink rounded-xl shadow-sm p-6">
        <h2 class="font-semibold text-ink dark:text-ink-dark mb-4">Salas mais reservadas</h2>
        <ul class="space-y-4">
          <li v-for="s in ranking" :key="s.nome" data-testid="ranking-item">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-ink dark:text-ink-dark">{{ s.nome }}</span>
              <span class="text-ink/50 dark:text-ink-dark/50">{{ s.reservas }}</span>
            </div>
            <div class="h-2 rounded-full bg-ink/10 overflow-hidden">
              <div class="h-full rounded-full bg-secondary" :style="{ width: `${(s.reservas / maxReservas) * 100}%` }"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
