import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NovaReservaView from './NovaReservaView.vue'
import { reservasService } from '../services'
import { formatarData } from '../services/mockData'
import { useAuthStore } from '../stores/auth'

const push = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
  useRoute: () => ({ query: {} }),
  RouterLink: { template: '<a><slot /></a>' },
}))

function futuro(dias) {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return formatarData(d)
}

async function montar() {
  const pinia = createPinia()
  setActivePinia(pinia)
  useAuthStore().email = 'ana@empresa.com'
  const w = mount(NovaReservaView, { global: { plugins: [pinia], stubs: { RouterLink: RouterLinkStub } } })
  await flushPromises()
  return w
}

async function preencher(w, v) {
  if (v.titulo !== undefined) await w.find('#titulo').setValue(v.titulo)
  if (v.sala !== undefined) await w.find('#sala').setValue(String(v.sala))
  if (v.data !== undefined) await w.find('#data').setValue(v.data)
  if (v.inicio !== undefined) await w.find('#inicio').setValue(v.inicio)
  if (v.fim !== undefined) await w.find('#fim').setValue(v.fim)
  if (v.participantes !== undefined) await w.find('#participantes').setValue(String(v.participantes))
}

const enviar = async (w) => {
  await w.find('form').trigger('submit')
  await flushPromises()
}

describe('NovaReservaView', () => {
  beforeEach(() => push.mockReset())

  it('não envia e mostra erros inline com o formulário vazio', async () => {
    const w = await montar()
    await enviar(w)
    expect(w.find('[data-testid="erro-titulo"]').exists()).toBe(true)
    expect(w.find('[data-testid="erro-salaId"]').exists()).toBe(true)
    expect(w.find('[data-testid="erro-participantes"]').exists()).toBe(true)
    expect(push).not.toHaveBeenCalled()
  })

  it('RN-05: informa o limite de capacidade da sala', async () => {
    const w = await montar()
    await preencher(w, { titulo: 'X', sala: 4, data: futuro(10), inicio: '10:00', fim: '11:00', participantes: 10 })
    await enviar(w)
    expect(w.find('[data-testid="erro-participantes"]').text()).toContain('4')
    expect(push).not.toHaveBeenCalled()
  })

  it('RN-01: bloqueia conflito com reserva existente', async () => {
    const w = await montar()
    // reserva simulada #1: Sala Aurora (id 1), hoje, 09:00–10:00
    await preencher(w, { titulo: 'X', sala: 1, data: futuro(0), inicio: '09:30', fim: '10:30', participantes: 2 })
    await enviar(w)
    expect(w.find('[data-testid="erro-inicio"]').text()).toContain('Conflito')
  })

  it('revalida a cada alteração depois da primeira tentativa', async () => {
    const w = await montar()
    await enviar(w)
    expect(w.find('[data-testid="erro-titulo"]').exists()).toBe(true)
    await w.find('#titulo').setValue('Agora preenchido')
    expect(w.find('[data-testid="erro-titulo"]').exists()).toBe(false)
  })

  it('cria a reserva, confirma em sala comum e volta ao calendário', async () => {
    const w = await montar()
    await preencher(w, { titulo: 'Reunião nova', sala: 1, data: futuro(10), inicio: '13:00', fim: '14:00', participantes: 3 })
    await enviar(w)
    expect(push).toHaveBeenCalledWith('/calendario')
    const criada = (await reservasService.listar()).find((r) => r.titulo === 'Reunião nova')
    expect(criada).toMatchObject({ salaId: 1, status: 'confirmada', responsavel: 'ana@empresa.com' })
  })

  it('RN-06: sala executiva cria a reserva como pendente e avisa o usuário', async () => {
    const w = await montar()
    await preencher(w, { sala: 2 })
    expect(w.text()).toContain('ficará pendente')
    await preencher(w, { titulo: 'Diretoria', data: futuro(12), inicio: '09:00', fim: '10:00', participantes: 5 })
    await enviar(w)
    const criada = (await reservasService.listar()).find((r) => r.titulo === 'Diretoria')
    expect(criada.status).toBe('pendente')
  })

  it('sala em manutenção não pode ser escolhida', async () => {
    const w = await montar()
    const opcao = w.findAll('#sala option').find((o) => o.text().includes('Safira'))
    expect(opcao.attributes('disabled')).toBeDefined()
  })
})
