<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { reservasService, salasService } from '../services'
import { formatarData } from '../services/mockData'

const hoje = new Date()
const mes = ref(new Date(hoje.getFullYear(), hoje.getMonth(), 1))
const selecionado = ref(formatarData(hoje))
const reservas = ref([])
const salas = ref([])

onMounted(async () => {
  ;[reservas.value, salas.value] = await Promise.all([reservasService.listar(), salasService.listar()])
})

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const titulo = computed(() => {
  const t = mes.value.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  return t.charAt(0).toUpperCase() + t.slice(1)
})

const dias = computed(() => {
  const ano = mes.value.getFullYear()
  const m = mes.value.getMonth()
  const vazios = new Date(ano, m, 1).getDay()
  const total = new Date(ano, m + 1, 0).getDate()
  const lista = Array.from({ length: vazios }, () => null)
  for (let d = 1; d <= total; d++) {
    const data = formatarData(new Date(ano, m, d))
    lista.push({ dia: d, data, qtd: reservas.value.filter((r) => r.data === data).length })
  }
  return lista
})

const doDia = computed(() =>
  reservas.value.filter((r) => r.data === selecionado.value).sort((a, b) => a.inicio.localeCompare(b.inicio)),
)

const tituloDia = computed(() => {
  const [a, m, d] = selecionado.value.split('-').map(Number)
  return new Date(a, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
})

const nomeSala = (id) => salas.value.find((s) => s.id === id)?.nome ?? 'Sala'

function mudarMes(delta) {
  mes.value = new Date(mes.value.getFullYear(), mes.value.getMonth() + delta, 1)
}
function irParaHoje() {
  mes.value = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  selecionado.value = formatarData(hoje)
}
</script>

<template>
  <section>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-1">
      <h1 class="text-2xl font-bold font-[family-name:var(--font-heading)] text-fg">Calendário</h1>
      <RouterLink
        :to="{ path: '/reservas/nova', query: { data: selecionado } }"
        data-testid="nova-reserva"
        class="bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-all"
      >
        Nova reserva
      </RouterLink>
    </div>
    <p class="text-sm text-muted mb-2">Reservas de salas por dia.</p>
    <p class="text-xs text-muted mb-4">Dados de demonstração — a integração com a API vem nas próximas fases.</p>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-2 bg-hover border border-line rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-fg" data-testid="mes-titulo">{{ titulo }}</h2>
          <div class="flex items-center gap-1">
            <button class="nav-icon-btn" aria-label="Mês anterior" @click="mudarMes(-1)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button class="text-xs font-medium text-accent px-2 py-1 rounded hover:opacity-80" @click="irParaHoje">Hoje</button>
            <button class="nav-icon-btn" aria-label="Próximo mês" @click="mudarMes(1)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1 text-center text-xs text-muted mb-1">
          <span v-for="d in DIAS_SEMANA" :key="d">{{ d }}</span>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <template v-for="(d, i) in dias" :key="i">
            <span v-if="!d"></span>
            <button
              v-else
              data-testid="dia"
              class="aspect-square rounded-lg border text-sm flex flex-col items-center justify-center gap-1 transition-colors"
              :class="[
                d.data === selecionado ? 'border-accent bg-accent-soft text-fg font-semibold' : 'border-transparent hover:bg-panel text-fg',
                d.data === formatarData(hoje) ? 'ring-1 ring-accent' : '',
              ]"
              :aria-label="`Dia ${d.dia}, ${d.qtd} reservas`"
              @click="selecionado = d.data"
            >
              {{ d.dia }}
              <span v-if="d.qtd" class="w-1.5 h-1.5 rounded-full bg-accent"></span>
              <span v-else class="w-1.5 h-1.5"></span>
            </button>
          </template>
        </div>
      </div>

      <div class="bg-hover border border-line rounded-xl p-5">
        <h2 class="font-semibold text-fg capitalize mb-4" data-testid="dia-titulo">{{ tituloDia }}</h2>
        <div v-if="!doDia.length" data-testid="dia-vazio" class="text-center py-8">
          <p class="font-medium text-fg">Nenhuma reserva neste dia</p>
          <p class="text-sm text-muted mt-1">Escolha outro dia no calendário.</p>
        </div>
        <ul v-else class="space-y-3">
          <li v-for="r in doDia" :key="r.id" data-testid="reserva-dia" class="bg-panel border border-line rounded-lg p-3">
            <div class="flex items-start justify-between gap-2">
              <p class="text-sm font-medium text-fg">{{ r.titulo }}</p>
              <span
                class="text-[11px] font-medium rounded-full px-2 py-0.5 whitespace-nowrap"
                :class="r.status === 'pendente' ? 'bg-alert/15 text-alert' : 'bg-accent-soft text-accent'"
              >
                {{ r.status === 'pendente' ? 'Pendente' : 'Confirmada' }}
              </span>
            </div>
            <p class="text-xs text-muted mt-1">{{ r.inicio }} – {{ r.fim }} · {{ nomeSala(r.salaId) }}</p>
            <p class="text-xs text-muted">{{ r.responsavel }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
