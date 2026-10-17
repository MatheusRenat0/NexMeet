<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { usuariosService } from '../services'
import { validarUsuario } from '../services/usuarios'
import { PERFIS } from '../services/mockUsuarios'

const router = useRouter()

const usuarios = ref([])
const form = reactive({ nome: '', email: '', perfil: '' })
const erros = ref({})
const enviado = ref(false)
const salvando = ref(false)

const DESCRICAO = {
  Administrador: 'Acesso total: gerencia usuários, salas e configurações.',
  Coordenador: 'Aprova reservas de salas executivas e vê o dashboard.',
  Colaborador: 'Cria e gerencia as próprias reservas.',
  Visitante: 'Somente consulta a disponibilidade; não cria reservas.',
}

onMounted(async () => {
  usuarios.value = await usuariosService.listar()
})

function validar() {
  erros.value = validarUsuario(form, { usuarios: usuarios.value })
}

// Validação inline: depois da primeira tentativa de envio, revalida a cada alteração.
watch(form, () => enviado.value && validar())

async function enviar() {
  enviado.value = true
  validar()
  if (Object.keys(erros.value).length) return

  salvando.value = true
  try {
    await usuariosService.criar({ ...form })
    router.push('/usuarios')
  } catch (e) {
    erros.value = e.erros ?? { geral: 'Não foi possível cadastrar o usuário.' }
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
    <h1 class="text-2xl font-bold font-[family-name:var(--font-heading)] text-fg">Novo usuário</h1>
    <p class="text-sm text-muted mb-2">Cadastre uma pessoa e defina o perfil de acesso.</p>
    <p class="text-xs text-muted mb-6">Dados de demonstração — o cadastro é simulado e some ao recarregar a página.</p>

    <form class="bg-hover border border-line rounded-xl p-6 space-y-5" novalidate @submit.prevent="enviar">
      <p v-if="erros.geral" class="text-sm text-alert" role="alert">{{ erros.geral }}</p>

      <div>
        <label for="nome" class="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Nome completo</label>
        <input id="nome" v-model="form.nome" type="text" autocomplete="off" :class="[campo, borda('nome')]" placeholder="Ex.: Maria da Silva" />
        <p v-if="erros.nome" data-testid="erro-nome" class="text-xs text-alert mt-1">{{ erros.nome }}</p>
      </div>

      <div>
        <label for="email" class="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">E-mail</label>
        <input id="email" v-model="form.email" type="email" autocomplete="off" :class="[campo, borda('email')]" placeholder="maria@empresa.com" />
        <p v-if="erros.email" data-testid="erro-email" class="text-xs text-alert mt-1">{{ erros.email }}</p>
      </div>

      <div>
        <label for="perfil" class="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Perfil</label>
        <select id="perfil" v-model="form.perfil" :class="[campo, borda('perfil')]">
          <option value="">Selecione um perfil</option>
          <option v-for="p in PERFIS" :key="p" :value="p">{{ p }}</option>
        </select>
        <p v-if="erros.perfil" data-testid="erro-perfil" class="text-xs text-alert mt-1">{{ erros.perfil }}</p>
        <p v-else-if="form.perfil" data-testid="perfil-descricao" class="text-xs text-muted mt-1">{{ DESCRICAO[form.perfil] }}</p>
      </div>

      <p class="text-xs text-muted">
        O usuário é criado como ativo. A definição de senha será feita por convite via e-mail, que ainda não está disponível.
      </p>

      <div class="flex items-center justify-end gap-3 pt-2">
        <RouterLink to="/usuarios" class="text-sm font-medium text-muted hover:text-fg px-4 py-2.5">Cancelar</RouterLink>
        <button type="submit" :disabled="salvando" class="bg-primary hover:bg-primary/90 disabled:opacity-70 text-white text-sm font-semibold rounded-lg px-5 py-2.5 transition-all">
          {{ salvando ? 'Cadastrando...' : 'Cadastrar usuário' }}
        </button>
      </div>
    </form>
  </section>
</template>
