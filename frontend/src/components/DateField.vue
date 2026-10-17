<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { formatarData } from '../services/mockData'

const props = defineProps({
  modelValue: { type: String, default: '' }, // YYYY-MM-DD
  id: { type: String, default: undefined },
  min: { type: String, default: '' }, // YYYY-MM-DD; dias anteriores ficam desabilitados
  invalid: { type: Boolean, default: false },
  placeholder: { type: String, default: 'Selecione a data' },
})
const emit = defineEmits(['update:modelValue'])

const aberto = ref(false)
const raiz = ref(null)

function primeiroDiaDoMes(iso) {
  const [a, m] = (iso || formatarData(new Date())).split('-').map(Number)
  return new Date(a, m - 1, 1)
}
const mes = ref(primeiroDiaDoMes(props.modelValue))

// Ao reabrir, mostra o mês do valor atual.
watch(aberto, (v) => v && (mes.value = primeiroDiaDoMes(props.modelValue)))

const DIAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const hoje = formatarData(new Date())

const titulo = computed(() => {
  const t = mes.value.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  return t.charAt(0).toUpperCase() + t.slice(1)
})

const dias = computed(() => {
  const ano = mes.value.getFullYear()
  const m = mes.value.getMonth()
  const lista = Array.from({ length: new Date(ano, m, 1).getDay() }, () => null)
  for (let d = 1; d <= new Date(ano, m + 1, 0).getDate(); d++) {
    const data = formatarData(new Date(ano, m, d))
    lista.push({ dia: d, data, desabilitado: !!props.min && data < props.min })
  }
  return lista
})

const exibicao = computed(() => {
  if (!props.modelValue) return ''
  const [a, m, d] = props.modelValue.split('-')
  return `${d}/${m}/${a}`
})

function mudarMes(delta) {
  mes.value = new Date(mes.value.getFullYear(), mes.value.getMonth() + delta, 1)
}

function escolher(d) {
  if (d.desabilitado) return
  emit('update:modelValue', d.data)
  aberto.value = false
}

function fora(e) {
  if (raiz.value && !raiz.value.contains(e.target)) aberto.value = false
}
onMounted(() => document.addEventListener('click', fora))
onBeforeUnmount(() => document.removeEventListener('click', fora))
</script>

<template>
  <div ref="raiz" class="relative" @keydown.esc="aberto = false">
    <button
      :id="id"
      type="button"
      class="w-full flex items-center justify-between gap-2 rounded-lg border bg-body px-4 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-secondary/30"
      :class="invalid ? 'border-alert' : 'border-line focus:border-secondary'"
      aria-haspopup="dialog"
      :aria-expanded="aberto"
      @click="aberto = !aberto"
    >
      <span :class="exibicao ? 'text-fg' : 'text-muted'" data-testid="data-valor">{{ exibicao || placeholder }}</span>
      <svg class="w-4 h-4 text-muted shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    </button>

    <div v-if="aberto" role="dialog" aria-label="Escolher data" data-testid="data-popover" class="absolute z-50 mt-2 w-72 bg-panel border border-line rounded-xl shadow-2xl p-4">
      <div class="flex items-center justify-between mb-3">
        <button type="button" class="nav-icon-btn" aria-label="Mês anterior" @click="mudarMes(-1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <span class="text-sm font-semibold text-fg" data-testid="data-mes">{{ titulo }}</span>
        <button type="button" class="nav-icon-btn" aria-label="Próximo mês" @click="mudarMes(1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>

      <div class="grid grid-cols-7 gap-1 text-center text-[11px] text-muted mb-1">
        <span v-for="(d, i) in DIAS" :key="i">{{ d }}</span>
      </div>
      <div class="grid grid-cols-7 gap-1">
        <template v-for="(d, i) in dias" :key="i">
          <span v-if="!d"></span>
          <button
            v-else
            type="button"
            data-testid="data-dia"
            :disabled="d.desabilitado"
            :aria-label="`${d.dia} de ${titulo}`"
            class="h-9 rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            :class="[
              d.data === modelValue ? 'bg-accent text-white font-semibold' : 'text-fg hover:bg-hover',
              d.data === hoje && d.data !== modelValue ? 'ring-1 ring-accent' : '',
            ]"
            @click="escolher(d)"
          >
            {{ d.dia }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
