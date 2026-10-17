import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import AppLayout from '../components/AppLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import SalasView from '../views/SalasView.vue'
import CalendarioView from '../views/CalendarioView.vue'
import NovaReservaView from '../views/NovaReservaView.vue'
import UsuariosView from '../views/UsuariosView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'home', component: DashboardView },
        { path: 'calendario', name: 'calendario', component: CalendarioView },
        { path: 'reservas/nova', name: 'nova-reserva', component: NovaReservaView },
        { path: 'salas', name: 'salas', component: SalasView },
        { path: 'usuarios', name: 'usuarios', component: UsuariosView },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.matched.some((r) => r.meta.requiresAuth) && !auth.isAuthenticated) {
    return { name: 'login' }
  }
})

export default router