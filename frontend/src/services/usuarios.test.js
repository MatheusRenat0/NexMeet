import { describe, it, expect } from 'vitest'
import { validarUsuario, SENHA_MINIMA } from './usuarios'

const usuarios = [{ id: 1, nome: 'Ana Souza', email: 'ana@empresa.com', perfil: 'Colaborador', ativo: true }]
const valido = () => ({
  nome: 'Maria da Silva',
  email: 'maria@empresa.com',
  perfil: 'Colaborador',
  senha: 'senha-forte-1',
  confirmarSenha: 'senha-forte-1',
})
const validar = (d) => validarUsuario(d, { usuarios })

describe('validarUsuario', () => {
  it('aceita um cadastro válido', () => {
    expect(validar(valido())).toEqual({})
  })

  it('exige nome, e-mail, perfil e senha', () => {
    const erros = validar({ nome: '', email: '', perfil: '', senha: '', confirmarSenha: '' })
    expect(Object.keys(erros).sort()).toEqual(['email', 'nome', 'perfil', 'senha'])
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

  it('rejeita senha curta', () => {
    const curta = 'a'.repeat(SENHA_MINIMA - 1)
    expect(validar({ ...valido(), senha: curta, confirmarSenha: curta }).senha).toContain(String(SENHA_MINIMA))
    const ok = 'a'.repeat(SENHA_MINIMA)
    expect(validar({ ...valido(), senha: ok, confirmarSenha: ok })).toEqual({})
  })

  it('rejeita confirmação diferente da senha', () => {
    expect(validar({ ...valido(), confirmarSenha: 'outra-senha-1' }).confirmarSenha).toBe('As senhas não conferem.')
  })

  it('não acusa divergência de confirmação enquanto a senha em si é inválida', () => {
    const erros = validar({ ...valido(), senha: 'abc', confirmarSenha: 'xyz' })
    expect(erros.senha).toBeDefined()
    expect(erros.confirmarSenha).toBeUndefined()
  })
})
