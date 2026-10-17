<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

/**
 * Seletor de lista no padrão do sistema (mesmo visual de DateField e TimeField).
 * options: [{ value, label, descricao?, disabled? }]
 */
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, required: true },
  id: { type: String, default: undefined },
  placeholder: { type: String, default: 'Selecione' },
  invalid: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const aberto = ref(false)
const raiz = ref(null)
const lista = ref(null)

const selecionada = computed(() => props.options.find((o) => o.value === props.modelValue))

watch(aberto, async (v) => {
  if (!v) return
  await nextTick()
  lista.value?.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: 'nearest' })
})

function escolher(o) {
  if (o.disabled) return
  emit('update:modelValue', o.value)
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
      <span class="truncate" :class="selecionada ? 'text-fg' : 'text-muted'" data-testid="select-valor">{{ selecionada ? selecionada.label : placeholder }}</span>
      <svg class="w-4 h-4 text-muted shrink-0 transition-transform" :class="{ 'rotate-180': aberto }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <ul v-if="aberto" ref="lista" role="listbox" data-testid="select-lista" class="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto bg-panel border border-line rounded-xl shadow-2xl p-1">
      <li
        v-for="o in options"
        :key="o.value"
        role="option"
        data-testid="select-opcao"
        :aria-selected="o.value === modelValue"
        :aria-disabled="!!o.disabled"
        class="px-3 py-2 rounded-lg transition-colors"
        :class="[
          o.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
          o.value === modelValue ? 'bg-accent text-white' : o.disabled ? 'text-fg' : 'text-fg hover:bg-hover',
        ]"
        @click="escolher(o)"
      >
        <p class="text-sm" :class="{ 'font-semibold': o.value === modelValue }">{{ o.label }}</p>
        <p v-if="o.descricao" class="text-xs mt-0.5" :class="o.value === modelValue ? 'text-white/80' : 'text-muted'">{{ o.descricao }}</p>
      </li>
    </ul>
  </div>
</template>
