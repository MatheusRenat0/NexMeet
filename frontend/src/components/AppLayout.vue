<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'
import iconApp from '../assets/branding/icon-app.svg'

const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()

const drawerAberto = ref(false)
const dropdownAberto = ref(null) // 'notif' | 'help' | 'user' | null

// Filtro por perfil depende do perfil no JWT (F-01); por ora todos os itens implementados aparecem.
const secoes = [
  {
    titulo: null,
    itens: [
      { to: '/', label: 'Início', icone: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'] },
    ],
  },
  {
    titulo: 'Reservas',
    itens: [
      {
        to: '/calendario',
        label: 'Calendário',
        icone: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4', 'M8 2v4', 'M3 10h18'],
      },
      {
        to: '/reservas/nova',
        label: 'Nova reserva',
        icone: ['M12 5v14', 'M5 12h14'],
      },
      {
        to: '/salas',
        label: 'Salas',
        icone: ['M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16', 'M15 9h4a1 1 0 0 1 1 1v11', 'M2 21h20', 'M8 9h3', 'M8 13h3'],
      },
    ],
  },
  {
    titulo: 'Administração',
    itens: [
      {
        to: '/usuarios',
        label: 'Usuários',
        icone: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
      },
    ],
  },
]

const nome = computed(() => auth.email || 'Usuário')
const iniciais = computed(() => nome.value.replace(/[^a-zA-Z]/g, '').slice(0, 2) || '?')

function alternarMenu() {
  if (window.innerWidth > 992) {
    ui.toggleSidebarCollapsed()
  } else {
    drawerAberto.value = !drawerAberto.value
  }
}

function alternarDropdown(nomeDropdown) {
  dropdownAberto.value = dropdownAberto.value === nomeDropdown ? null : nomeDropdown
}

function fecharDropdowns(event) {
  if (!event.target.closest('.nm-dropdown')) dropdownAberto.value = null
}

onMounted(() => document.addEventListener('click', fecharDropdowns))
onBeforeUnmount(() => document.removeEventListener('click', fecharDropdowns))

function sair() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div>
    <div class="sidebar-overlay" :class="{ active: drawerAberto }" data-testid="overlay" @click="drawerAberto = false"></div>

    <div class="mbx-layout" :class="{ collapsed: ui.sidebarCollapsed }" data-testid="layout">
      <!-- SIDEBAR -->
      <aside class="mbx-sidebar" :class="{ active: drawerAberto }" data-testid="sidebar">
        <div class="sidebar-logo">
          <img :src="iconApp" alt="NexMeet" />
          <span>NexMeet</span>
        </div>

        <nav class="sidebar-nav" aria-label="Navegação principal">
          <template v-for="(secao, i) in secoes" :key="i">
            <div v-if="secao.titulo" class="sidebar-section-title">{{ secao.titulo }}</div>
            <RouterLink
              v-for="item in secao.itens"
              :key="item.to"
              :to="item.to"
              class="sidebar-item"
              :title="item.label"
              @click="drawerAberto = false"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path v-for="d in item.icone" :key="d" :d="d" />
              </svg>
              <span>{{ item.label }}</span>
            </RouterLink>
          </template>
        </nav>
      </aside>

      <!-- ÁREA DIREITA -->
      <div class="mbx-content-area">
        <header class="mbx-navbar">
          <button class="navbar-toggle-btn" title="Alternar menu" aria-label="Alternar menu" @click="alternarMenu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px" aria-hidden="true">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div class="navbar-actions">
            <!-- Notificações -->
            <div class="nm-dropdown">
              <button class="nav-icon-btn" title="Notificações" aria-label="Notificações" @click.stop="alternarDropdown('notif')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
              <div class="nm-dropdown-menu" :class="{ active: dropdownAberto === 'notif' }" data-testid="menu-notif" @click.stop>
                <div class="notif-header">Notificações</div>
                <div class="notif-empty">Você não tem novas notificações.</div>
              </div>
            </div>

            <!-- Ajuda -->
            <div class="nm-dropdown">
              <button class="nav-icon-btn" title="Central de ajuda" aria-label="Central de ajuda" @click.stop="alternarDropdown('help')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </button>
              <div class="nm-dropdown-menu" :class="{ active: dropdownAberto === 'help' }" data-testid="menu-help" @click.stop>
                <div class="user-dropdown-header">
                  <div class="user-info">
                    <div class="user-name" style="font-size: 1.05rem">Central de Ajuda</div>
                    <div class="user-sub">Dúvidas frequentes e materiais de treinamento estarão disponíveis em breve.</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Usuário -->
            <div class="nm-dropdown user" style="margin-left: 5px">
              <button class="user-avatar-btn" aria-label="Menu do usuário" data-testid="avatar" @click.stop="alternarDropdown('user')">
                {{ iniciais }}
              </button>
              <div class="nm-dropdown-menu" :class="{ active: dropdownAberto === 'user' }" data-testid="menu-user" @click.stop>
                <div class="user-dropdown-header">
                  <div class="user-avatar-lg">{{ iniciais }}</div>
                  <div class="user-info">
                    <div class="user-name" :title="nome" data-testid="usuario-logado">{{ nome }}</div>
                  </div>
                </div>

                <div class="dropdown-divider"></div>

                <div class="dropdown-item" style="justify-content: space-between" role="switch" :aria-checked="ui.isDark" tabindex="0" data-testid="tema" @click="ui.setTheme(ui.isDark ? 'light' : 'dark')" @keydown.enter="ui.setTheme(ui.isDark ? 'light' : 'dark')">
                  <div style="display: flex; align-items: center; gap: 14px">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                    </svg>
                    Modo Escuro
                  </div>
                  <span class="switch" :class="{ on: ui.isDark }"><span class="slider"></span></span>
                </div>

                <div class="dropdown-divider"></div>

                <button class="dropdown-item" data-testid="sair" @click="sair">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sair
                </button>
              </div>
            </div>
          </div>
        </header>

        <main class="mbx-main-card">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>
