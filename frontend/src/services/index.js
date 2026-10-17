import { salas, proximasReservas, indicadores, rankingSalas, reservas } from './mockData'
import { usuarios } from './mockUsuarios'
import { validarReserva } from './reservas'
import { validarUsuario } from './usuarios'

// Interface assíncrona estável: ao integrar a API, só o corpo destas funções muda.
const resolver = (valor) => Promise.resolve(structuredClone(valor))

export const salasService = {
  listar: () => resolver(salas),
}

export const dashboardService = {
  indicadores: () => resolver(indicadores),
  proximasReservas: () => resolver(proximasReservas),
  rankingSalas: () => resolver(rankingSalas),
}

export const reservasService = {
  listar: () => resolver(reservas),

  /**
   * Cria uma reserva (simulada, em memória). Rejeita com `{ erros }` se inválida.
   * RN-06: sala executiva fica "pendente" até aprovação.
   */
  criar(dados, responsavel) {
    const erros = validarReserva(dados, { salas, reservas })
    if (Object.keys(erros).length) return Promise.reject({ erros })

    const sala = salas.find((s) => s.id === Number(dados.salaId))
    const nova = {
      id: Math.max(0, ...reservas.map((r) => r.id)) + 1,
      titulo: dados.titulo.trim(),
      salaId: sala.id,
      data: dados.data,
      inicio: dados.inicio,
      fim: dados.fim,
      participantes: Number(dados.participantes),
      responsavel,
      status: sala.executiva ? 'pendente' : 'confirmada',
    }
    reservas.push(nova)
    return resolver(nova)
  },
}

export const usuariosService = {
  listar: () => resolver(usuarios),

  /**
   * Cadastra um usuário (RF-06), ativo, com senha temporária. A senha NÃO é guardada no
   * mock; quando o backend existir, o payload { nome, email, perfil, senha } segue para
   * a API, que grava o hash e marca o primeiro acesso para troca obrigatória de senha.
   * Rejeita com `{ erros }` se inválido.
   */
  criar(dados) {
    const erros = validarUsuario(dados, { usuarios })
    if (Object.keys(erros).length) return Promise.reject({ erros })
    const novo = {
      id: Math.max(0, ...usuarios.map((u) => u.id)) + 1,
      nome: dados.nome.trim(),
      email: dados.email.trim().toLowerCase(),
      perfil: dados.perfil,
      ativo: true,
      trocarSenhaNoPrimeiroAcesso: true,
    }
    usuarios.push(novo)
    return resolver(novo)
  },

  /** Ativa ou inativa um usuário (RF-06). Simulado em memória. */
  alterarStatus(id) {
    const u = usuarios.find((x) => x.id === id)
    if (!u) return Promise.reject(new Error('Usuário não encontrado'))
    u.ativo = !u.ativo
    return resolver(u)
  },
}