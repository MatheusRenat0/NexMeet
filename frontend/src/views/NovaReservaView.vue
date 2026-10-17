<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import DateField from '../components/DateField.vue'
import TimeField from '../components/TimeField.vue'
import { reservasService, salasService } from '../services'
import { validarReserva, HORARIO_COMERCIAL } from '../services/reservas'
import { formatarData } from '../services/mockData'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const salas = ref([])
const reservas = ref([])
const enviado = ref(false)
const salvando = ref(false)

const form = reactive({
  titulo: '',
  salaId: '',
  data: typeof route.query.data === 'string' ? route.query.data : formatarData(new Date()),
  inicio: HORARIO_COMERCIAL.inicio,
  fim: '09:00',
  participantes: '',
})
const erros = ref({})

const hoje = formatarData(new Date())
const mudar = (hhmm, delta) => {
  const [h, m] = hhmm.split(':').map(Number)
  const t = h * 60 + m + delta
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}
// O início vai até 30 min antes do fim do expediente; o término começa 30 min após a abertura.
const inicioAte = mudar(HORARIO_COMERCIAL.fim, -30)
const fimDe = mudar(HORARIO_COMERCIAL.inicio, 30)

onMounted(async () => {
  ;[salas.value, reservas.value] = await Promise.all([salasService.listar(), reservasService.listar()])
})

const salaSelecionada = computed(() => salas.value.find((s) => s.id === Number(form.salaId)))

function validar() {
  erros.value = validarReserva(form, { salas: salas.value, reservas: reservas.value })
}

// Validação inline: depois da primeira tentativa de envio, revalida a cada alteração.
function aoAlterar() {
  if (enviado.value) validar()
}

// Os seletores personalizados emitem update:modelValue; revalida quando mudam.
watch(() => [form.data, form.inicio, form.fim], aoAlterar)

async function enviar() {
  enviado.value = true
  validar()
  if (Object.keys(erros.value).length) return

  salvando.value = true
  try {
    await reservasService.criar({ ...form }, auth.email)
    router.push('/calendario')
  } catch (e) {
    erros.value = e.erros ?? { geral: 'Não foi possível criar a reserva.' }
  } finally {
    salvando.value = false
  }
}

const campo =
  'w-full rounded-lg border bg-panel px-4 py-2.5 text-sm text-fg focus:outline-none focus:ring-2 focus:ring-secondary/30'
const borda = (k) => (erros.value[k] ? 'border-alert' : 'border-line focus:border-secondary')
</script>

<template>
  <section class="max-w-2xl">
    <h1 class="text-2xl font-bold font-[family-name:var(--font-heading)] text-fg">Nova reserva</h1>
    <p class="text-sm text-muted mb-2">Reserve uma sala para a sua reunião.</p>
    <p class="text-xs text-muted mb-6">Dados de demonstração — a reserva é simulada e some ao recarregar a página.</p>

    <form class="bg-hover border border-line rounded-xl p-6 space-y-5" novalidate @submit.prevent="enviar">
      <p v-if="erros.geral" class="text-sm text-alert" role="alert">{{ erros.geral }}</p>

      <div>
        <label for="titulo" class="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Motivo da reunião</label>
        <input id="titulo" v-model="form.titulo" type="text" :class="[campo, borda('titulo')]" placeholder="Ex.: Planejamento semanal" @input="aoAlterar" />
        <p v-if="erros.titulo" data-testid="erro-titulo" class="text-xs text-alert mt-1">{{ erros.titulo }}</p>
      </div>

      <div>
        <label for="sala" class="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Sala</label>
        <select id="sala" v-model="form.salaId" :class="[campo, borda('salaId')]" @change="aoAlterar">
          <option value="">Selecione uma sala</option>
          <option v-for="s in salas" :key="s.id" :value="s.id" :disabled="s.status === 'manutencao'">
            {{ s.nome }} — até {{ s.capacidade }} pessoas{{ s.status === 'manutencao' ? ' (em manutenção)' : '' }}
          </option>
        </select>
        <p v-if="erros.salaId" data-testid="erro-salaId" class="text-xs text-alert mt-1">{{ erros.salaId }}</p>
        <p v-else-if="salaSelecionada?.executiva" class="text-xs text-muted mt-1">
          Sala executiva: a reserva ficará pendente até a aprovação de um Coordenador.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label for="data" class="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Data</label>
          <DateField id="data" v-model="form.data" :min="hoje" :invalid="!!erros.data" />
          <p v-if="erros.data" data-testid="erro-data" class="text-xs text-alert mt-1">{{ erros.data }}</p>
        </div>
        <div>
          <label for="inicio" class="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Início</label>
          <TimeField id="inicio" v-model="form.inicio" :de="HORARIO_COMERCIAL.inicio" :ate="inicioAte" :invalid="!!erros.inicio" />
        </div>
        <div>
          <label for="fim" class="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Término</label>
          <TimeField id="fim" v-model="form.fim" :de="fimDe" :ate="HORARIO_COMERCIAL.fim" :invalid="!!erros.fim" />
        </div>
      </div>
      <p v-if="erros.inicio" data-testid="erro-inicio" class="text-xs text-alert -mt-3">{{ erros.inicio }}</p>
      <p v-if="erros.fim" data-testid="erro-fim" class="text-xs text-alert -mt-3">{{ erros.fim }}</p>

      <div>
        <label for="participantes" class="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Participantes</label>
        <input id="participantes" v-model="form.participantes" type="number" min="1" :class="[campo, borda('participantes')]" placeholder="Quantidade de pessoas" @input="aoAlterar" />
        <p v-if="erros.participantes" data-testid="erro-participantes" class="text-xs text-alert mt-1">{{ erros.participantes }}</p>
      </div>

      <div class="flex items-center justify-end gap-3 pt-2">
        <RouterLink to="/calendario" class="text-sm font-medium text-muted hover:text-fg px-4 py-2.5">Cancelar</RouterLink>
        <button type="submit" :disabled="salvando" class="bg-primary hover:bg-primary/90 disabled:opacity-70 text-white text-sm font-semibold rounded-lg px-5 py-2.5 transition-all">
          {{ salvando ? 'Reservando...' : 'Reservar sala' }}
        </button>
      </div>
    </form>
  </section>
</template>
