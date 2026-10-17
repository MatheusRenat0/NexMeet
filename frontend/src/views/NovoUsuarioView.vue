<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import SelectField from '../components/SelectField.vue'
import { usuariosService } from '../services'
import { validarUsuario, SENHA_MINIMA } from '../services/usuarios'
import { PERFIS } from '../services/mockUsuarios'

const router = useRouter()

const usuarios = ref([])
const form = reactive({ nome: '', email: '', perfil: '', senha: '', confirmarSenha: '' })
const erros = ref({})
const enviado = ref(false)
const salvando = ref(false)
const mostrarSenha = ref(false)

const DESCRICAO = {
  Administrador: 'Acesso total: usuários, salas e configurações.',
  Coordenador: 'Aprova reservas de salas executivas e vê o dashboard.',
  Colaborador: 'Cria e gerencia as próprias reservas.',
  Visitante: 'Somente consulta a disponibilidade; não cria reservas.',
}
const opcoesPerfil = PERFIS.map((p) => ({ value: p, label: p, descricao: DESCRICAO[p] }))

onMounted(async () => {
  usuarios.value = await usuariosService.listar()
})

function validar() {
  erros.value = validarUsuario(form, { usuarios: usuarios.value })
}

// Validação inline: depois da primeira tentativa de envio, revalida a cada alteração.
watch(form, () => enviado.value && validar())

const tipoSenha = computed(() => (mostrarSenha.value ? 'text' : 'password'))

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
  'w-full rounded-lg border bg-body px-4 py-2.5 text-sm text-fg focus:outline-none focus:ring-2 focus:ring-secondary/30'
const borda = (k) => (erros.value[k] ? 'border-alert' : 'border-line focus:border-secondary')
const rotulo = 'block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide'
</script>

<template>
  <section>
    <div class="flex items-center gap-3 mb-1">
      <h1 class="text-2xl font-bold font-[family-name:var(--font-heading)] text-fg">Novo usuário</h1>
      <span class="text-[11px] font-medium rounded-full px-2 py-0.5 bg-accent-soft text-accent" title="O cadastro é simulado e some ao recarregar a página">Demonstração</span>
    </div>
    <p class="text-sm text-muted mb-8">Cadastre uma pessoa e defina o perfil de acesso.</p>

    <form class="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-5" novalidate autocomplete="off" @submit.prevent="enviar">
      <p v-if="erros.geral" class="lg:col-span-12 text-sm text-alert" role="alert">{{ erros.geral }}</p>

      <div class="lg:col-span-6">
        <label for="nome" :class="rotulo">Nome completo</label>
        <input id="nome" v-model="form.nome" type="text" autocomplete="off" :class="[campo, borda('nome')]" placeholder="Ex.: Maria da Silva" />
        <p v-if="erros.nome" data-testid="erro-nome" class="text-xs text-alert mt-1">{{ erros.nome }}</p>
      </div>

      <div class="lg:col-span-6">
        <label for="email" :class="rotulo">E-mail</label>
        <input id="email" v-model="form.email" type="email" autocomplete="off" :class="[campo, borda('email')]" placeholder="maria@empresa.com" />
        <p v-if="erros.email" data-testid="erro-email" class="text-xs text-alert mt-1">{{ erros.email }}</p>
      </div>

      <div class="lg:col-span-4">
        <label for="perfil" :class="rotulo">Perfil</label>
        <SelectField id="perfil" v-model="form.perfil" :options="opcoesPerfil" placeholder="Selecione um perfil" :invalid="!!erros.perfil" />
        <p v-if="erros.perfil" data-testid="erro-perfil" class="text-xs text-alert mt-1">{{ erros.perfil }}</p>
      </div>

      <div class="lg:col-span-4">
        <label for="senha" :class="rotulo">Senha temporária</label>
        <div class="relative">
          <input id="senha" v-model="form.senha" :type="tipoSenha" autocomplete="new-password" :class="[campo, 'pr-11', borda('senha')]" :placeholder="`Mínimo de ${SENHA_MINIMA} caracteres`" />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg transition-colors"
            :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'"
            data-testid="alternar-senha"
            @click="mostrarSenha = !mostrarSenha"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle v-if="mostrarSenha" cx="12" cy="12" r="3" />
              <path v-else d="m4 4 16 16" />
            </svg>
          </button>
        </div>
        <p v-if="erros.senha" data-testid="erro-senha" class="text-xs text-alert mt-1">{{ erros.senha }}</p>
      </div>

      <div class="lg:col-span-4">
        <label for="confirmarSenha" :class="rotulo">Confirmar senha</label>
        <input id="confirmarSenha" v-model="form.confirmarSenha" :type="tipoSenha" autocomplete="new-password" :class="[campo, borda('confirmarSenha')]" placeholder="Repita a senha" />
        <p v-if="erros.confirmarSenha" data-testid="erro-confirmarSenha" class="text-xs text-alert mt-1">{{ erros.confirmarSenha }}</p>
      </div>

      <p class="lg:col-span-12 text-xs text-muted" data-testid="aviso-primeiro-acesso">
        No primeiro acesso, o usuário será solicitado a trocar essa senha.
      </p>

      <div class="lg:col-span-12 flex items-center justify-end gap-3 pt-5 border-t border-line">
        <RouterLink to="/usuarios" class="text-sm font-medium text-muted hover:text-fg px-4 py-2.5">Cancelar</RouterLink>
        <button type="submit" :disabled="salvando" class="bg-primary hover:bg-primary/90 disabled:opacity-70 text-white text-sm font-semibold rounded-lg px-5 py-2.5 transition-all">
          {{ salvando ? 'Cadastrando...' : 'Cadastrar usuário' }}
        </button>
      </div>
    </form>
  </section>
</template>
