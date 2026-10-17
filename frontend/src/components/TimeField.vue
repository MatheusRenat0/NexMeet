<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' }, // HH:MM
  id: { type: String, default: undefined },
  de: { type: String, default: '00:00' },
  ate: { type: String, default: '23:30' },
  passo: { type: Number, default: 30 }, // minutos
  invalid: { type: Boolean, default: false },
  placeholder: { type: String, default: '--:--' },
})
const emit = defineEmits(['update:modelValue'])

const aberto = ref(false)
const raiz = ref(null)
const lista = ref(null)

const paraMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const paraTexto = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

const opcoes = computed(() => {
  const r = []
  for (let m = paraMinutos(props.de); m <= paraMinutos(props.ate); m += props.passo) r.push(paraTexto(m))
  return r
})

// Ao abrir, rola até o horário selecionado.
watch(aberto, async (v) => {
  if (!v) return
  await nextTick()
  lista.value?.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: 'center' })
})

function escolher(h) {
  emit('update:modelValue', h)
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
      aria-haspopup="listbox"
      :aria-expanded="aberto"
      @click="aberto = !aberto"
    >
      <span :class="modelValue ? 'text-fg' : 'text-muted'" data-testid="hora-valor">{{ modelValue || placeholder }}</span>
      <svg class="w-4 h-4 text-muted shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    </button>

    <ul v-if="aberto" ref="lista" role="listbox" data-testid="hora-lista" class="absolute z-50 mt-2 w-full max-h-56 overflow-y-auto bg-panel border border-line rounded-xl shadow-2xl p-1">
      <li
        v-for="h in opcoes"
        :key="h"
        role="option"
        data-testid="hora-opcao"
        :aria-selected="h === modelValue"
        class="px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors"
        :class="h === modelValue ? 'bg-accent text-white font-semibold' : 'text-fg hover:bg-hover'"
        @click="escolher(h)"
      >
        {{ h }}
      </li>
    </ul>
  </div>
</template>
