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
        { rotulo: 'Reservas hoje', valor: indicadores.value.reservasHoje, cor: 'text-accent' },
        { rotulo: 'Taxa de ocupação', valor: `${indicadores.value.taxaOcupacao}%`, cor: 'text-accent' },
        { rotulo: 'Salas disponíveis', valor: indicadores.value.salasDisponiveis, cor: 'text-secondary' },
        { rotulo: 'Aguardando aprovação', valor: indicadores.value.pendentesAprovacao, cor: 'text-alert' },
      ]
    : [],
)
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold font-[family-name:var(--font-heading)] text-fg">Dashboard</h1>
    <p class="text-sm text-muted mb-6">Visão geral das reservas e do uso das salas.</p>

    <p class="text-xs text-muted mb-4">Dados de demonstração — a integração com a API vem nas próximas fases.</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div
        v-for="c in cartoes"
        :key="c.rotulo"
        data-testid="kpi"
        class="bg-hover border border-line rounded-xl p-5"
      >
        <p class="text-xs uppercase tracking-wide text-muted">{{ c.rotulo }}</p>
        <p class="text-3xl font-extrabold mt-2" :class="c.cor">{{ c.valor }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-hover border border-line rounded-xl p-6">
        <h2 class="font-semibold text-fg mb-4">Próximas reservas</h2>
        <p v-if="!proximas.length" class="text-sm text-muted">Nenhuma reserva para hoje.</p>
        <ul v-else class="divide-y divide-line">
          <li v-for="r in proximas" :key="r.id" data-testid="reserva" class="py-3 flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-fg">{{ r.titulo }}</p>
              <p class="text-xs text-muted">{{ r.sala }} · {{ r.responsavel }}</p>
            </div>
            <span class="text-xs font-medium text-accent bg-accent-soft rounded-full px-2.5 py-1 whitespace-nowrap">
              {{ r.inicio }} – {{ r.fim }}
            </span>
          </li>
        </ul>
      </div>

      <div class="bg-hover border border-line rounded-xl p-6">
        <h2 class="font-semibold text-fg mb-4">Salas mais reservadas</h2>
        <ul class="space-y-4">
          <li v-for="s in ranking" :key="s.nome" data-testid="ranking-item">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-fg">{{ s.nome }}</span>
              <span class="text-muted">{{ s.reservas }}</span>
            </div>
            <div class="h-2 rounded-full bg-line overflow-hidden">
              <div class="h-full rounded-full bg-secondary" :style="{ width: `${(s.reservas / maxReservas) * 100}%` }"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
