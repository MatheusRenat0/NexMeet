import { describe, it, expect } from 'vitest'
import { validarUsuario } from './usuarios'

const usuarios = [{ id: 1, nome: 'Ana Souza', email: 'ana@empresa.com', perfil: 'Colaborador', ativo: true }]
const valido = () => ({ nome: 'Maria da Silva', email: 'maria@empresa.com', perfil: 'Colaborador' })
const validar = (d) => validarUsuario(d, { usuarios })

describe('validarUsuario', () => {
  it('aceita um cadastro válido', () => {
    expect(validar(valido())).toEqual({})
  })

  it('exige nome, e-mail e perfil', () => {
    expect(Object.keys(validar({ nome: '', email: '', perfil: '' })).sort()).toEqual(['email', 'nome', 'perfil'])
  })

  it('rejeita nome muito curto e nome só com espaços', () => {
    expect(validar({ ...valido(), nome: 'Al' }).nome).toBeDefined()
    expect(validar({ ...valido(), nome: '   ' }).nome).toBe('Informe o nome completo.')
  })

  it('rejeita e-mail inválido', () => {
    for (const email of ['maria', 'maria@', 'maria@empresa', '@empresa.com', 'ma ria@empresa.com']) {
      expect(validar({ ...valido(), email }).email).toBe('Informe um e-mail válido.')
    }
  })

  it('rejeita e-mail já cadastrado, ignorando maiúsculas e espaços', () => {
    expect(validar({ ...valido(), email: '  ANA@empresa.com ' }).email).toContain('Já existe')
  })

  it('rejeita perfil fora da lista (RN-10)', () => {
    expect(validar({ ...valido(), perfil: 'Root' }).perfil).toBe('Perfil inválido.')
  })
})
