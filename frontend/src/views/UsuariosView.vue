<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { usuariosService } from '../services'
import { PERFIS } from '../services/mockUsuarios'

const TAMANHO_PAGINA = 5

const usuarios = ref([])
const busca = ref('')
const perfil = ref('todos')
const status = ref('todos')
const pagina = ref(1)
const alvo = ref(null) // usuário aguardando confirmação

onMounted(async () => {
  usuarios.value = await usuariosService.listar()
})

const filtrados = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  return usuarios.value.filter(
    (u) =>
      (perfil.value === 'todos' || u.perfil === perfil.value) &&
      (status.value === 'todos' || (status.value === 'ativo') === u.ativo) &&
      (!termo || u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo)),
  )
})

const totalPaginas = computed(() => Math.max(1, Math.ceil(filtrados.value.length / TAMANHO_PAGINA)))
const visiveis = computed(() => filtrados.value.slice((pagina.value - 1) * TAMANHO_PAGINA, pagina.value * TAMANHO_PAGINA))

// Qualquer mudança de filtro volta para a primeira página.
watch([busca, perfil, status], () => (pagina.value = 1))

const iniciais = (nome) =>
  nome
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

async function confirmar() {
  const atualizado = await usuariosService.alterarStatus(alvo.value.id)
  const i = usuarios.value.findIndex((u) => u.id === atualizado.id)
  usuarios.value[i] = atualizado
  alvo.value = null
}

function limpar() {
  busca.value = ''
  perfil.value = 'todos'
  status.value = 'todos'
}

const entrada =
  'rounded-lg border border-line bg-panel px-4 py-2.5 text-sm text-fg focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30'
</script>

<template>
  <section>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-1">
      <h1 class="text-2xl font-bold font-[family-name:var(--font-heading)] text-fg">Usuários</h1>
      <RouterLink
        to="/usuarios/novo"
        data-testid="novo-usuario"
        class="bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-all"
      >
        Novo usuário
      </RouterLink>
    </div>
    <p class="text-sm text-muted mb-2">Gerencie quem tem acesso ao NexMeet.</p>
    <p class="text-xs text-muted mb-4">Dados de demonstração — a integração com a API vem nas próximas fases.</p>

    <div class="flex flex-col md:flex-row gap-3 mb-5">
      <input v-model="busca" type="search" placeholder="Buscar por nome ou e-mail" aria-label="Buscar por nome ou e-mail" :class="[entrada, 'flex-1']" />
      <select v-model="perfil" aria-label="Filtrar por perfil" :class="entrada">
        <option value="todos">Todos os perfis</option>
        <option v-for="p in PERFIS" :key="p" :value="p">{{ p }}</option>
      </select>
      <select v-model="status" aria-label="Filtrar por status" :class="entrada">
        <option value="todos">Todos os status</option>
        <option value="ativo">Ativos</option>
        <option value="inativo">Inativos</option>
      </select>
    </div>

    <div v-if="!filtrados.length" data-testid="vazio" class="bg-hover border border-line rounded-xl p-10 text-center">
      <p class="font-medium text-fg">Nenhum usuário encontrado</p>
      <p class="text-sm text-muted mt-1">Ajuste a busca ou os filtros.</p>
      <button class="mt-4 text-sm font-medium text-accent hover:opacity-80" @click="limpar">Limpar filtros</button>
    </div>

    <div v-else class="bg-hover border border-line rounded-xl overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-xs uppercase tracking-wide text-muted border-b border-line">
            <th class="px-5 py-3 font-medium">Usuário</th>
            <th class="px-5 py-3 font-medium">Perfil</th>
            <th class="px-5 py-3 font-medium">Status</th>
            <th class="px-5 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-line">
          <tr v-for="u in visiveis" :key="u.id" data-testid="usuario">
            <td class="px-5 py-3">
              <div class="flex items-center gap-3">
                <span class="w-9 h-9 rounded-full bg-panel border border-line text-fg text-xs font-semibold flex items-center justify-center uppercase shrink-0">{{ iniciais(u.nome) }}</span>
                <div class="min-w-0">
                  <p class="font-medium text-fg truncate">{{ u.nome }}</p>
                  <p class="text-xs text-muted truncate">{{ u.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-3 text-muted">{{ u.perfil }}</td>
            <td class="px-5 py-3">
              <span class="text-xs font-medium rounded-full px-2.5 py-1" :class="u.ativo ? 'bg-accent-soft text-accent' : 'bg-alert/15 text-alert'" data-testid="status">
                {{ u.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="px-5 py-3 text-right">
              <button
                class="text-xs font-medium px-3 py-1.5 rounded-lg border border-line text-muted hover:text-fg hover:bg-panel transition-colors"
                :aria-label="`${u.ativo ? 'Inativar' : 'Ativar'} ${u.nome}`"
                data-testid="alternar"
                @click="alvo = u"
              >
                {{ u.ativo ? 'Inativar' : 'Ativar' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex items-center justify-between px-5 py-3 border-t border-line text-xs text-muted">
        <span data-testid="resumo">{{ filtrados.length }} usuário(s) · página {{ pagina }} de {{ totalPaginas }}</span>
        <div class="flex gap-2">
          <button class="px-3 py-1.5 rounded-lg border border-line disabled:opacity-40 hover:bg-panel" :disabled="pagina === 1" data-testid="anterior" @click="pagina--">Anterior</button>
          <button class="px-3 py-1.5 rounded-lg border border-line disabled:opacity-40 hover:bg-panel" :disabled="pagina === totalPaginas" data-testid="proxima" @click="pagina++">Próxima</button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmação (ação sensível: inativar/ativar usuário) -->
    <div v-if="alvo" class="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60" data-testid="modal" @click.self="alvo = null">
      <div class="w-full max-w-sm bg-panel border border-line rounded-2xl p-6" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <h2 id="modal-titulo" class="font-semibold text-fg text-lg">{{ alvo.ativo ? 'Inativar' : 'Ativar' }} usuário?</h2>
        <p class="text-sm text-muted mt-2">
          <template v-if="alvo.ativo">{{ alvo.nome }} deixará de conseguir acessar o sistema.</template>
          <template v-else>{{ alvo.nome }} voltará a ter acesso ao sistema.</template>
        </p>
        <div class="flex justify-end gap-3 mt-6">
          <button class="text-sm font-medium text-muted hover:text-fg px-4 py-2" data-testid="cancelar" @click="alvo = null">Cancelar</button>
          <button class="text-sm font-semibold text-white rounded-lg px-4 py-2" :class="alvo.ativo ? 'bg-alert hover:bg-alert/90' : 'bg-primary hover:bg-primary/90'" data-testid="confirmar" @click="confirmar">
            {{ alvo.ativo ? 'Inativar' : 'Ativar' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
