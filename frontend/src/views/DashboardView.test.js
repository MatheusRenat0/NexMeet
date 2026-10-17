import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DashboardView from './DashboardView.vue'

describe('DashboardView', () => {
  it('exibe KPIs, próximas reservas e ranking', async () => {
    const w = mount(DashboardView)
    await flushPromises()
    expect(w.findAll('[data-testid="kpi"]')).toHaveLength(4)
    expect(w.findAll('[data-testid="reserva"]').length).toBeGreaterThan(0)
    expect(w.findAll('[data-testid="ranking-item"]')).toHaveLength(5)
    expect(w.text()).toContain('68%')
  })
})
