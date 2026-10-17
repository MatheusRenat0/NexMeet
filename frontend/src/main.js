import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { useUiStore } from './stores/ui'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
// Aplica o tema salvo antes de montar, evitando "flash" de tema errado.
useUiStore(pinia).initTheme()

app.use(router)
app.mount('#app')