import { PERFIS } from './mockUsuarios'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Tamanho mínimo provisório: a política de senha oficial ainda não foi definida.
export const SENHA_MINIMA = 8

/**
 * Validação de UX no cliente (RF-06, RN-10). A regra oficial vem do backend (N-01).
 * @returns {Object} mapa campo -> mensagem; vazio quando válido
 */
export function validarUsuario(dados, { usuarios }) {
  const erros = {}
  const nome = (dados.nome || '').trim()
  const email = (dados.email || '').trim().toLowerCase()

  if (!nome) erros.nome = 'Informe o nome completo.'
  else if (nome.length < 3) erros.nome = 'O nome deve ter ao menos 3 caracteres.'

  if (!email) erros.email = 'Informe o e-mail.'
  else if (!EMAIL.test(email)) erros.email = 'Informe um e-mail válido.'
  else if (usuarios.some((u) => u.email.toLowerCase() === email)) erros.email = 'Já existe um usuário com este e-mail.'

  if (!dados.perfil) erros.perfil = 'Selecione um perfil.'
  else if (!PERFIS.includes(dados.perfil)) erros.perfil = 'Perfil inválido.'

  const senha = dados.senha || ''
  if (!senha) erros.senha = 'Defina uma senha temporária.'
  else if (senha.length < SENHA_MINIMA) erros.senha = `A senha deve ter ao menos ${SENHA_MINIMA} caracteres.`

  if (!erros.senha && dados.confirmarSenha !== senha) erros.confirmarSenha = 'As senhas não conferem.'

  return erros
}
