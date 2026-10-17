// DADOS SIMULADOS — substituir pela API real quando os módulos de salas e reservas existirem (N-02, N-03).
export const salas = [
  { id: 1, nome: 'Sala Aurora', andar: '1º andar', capacidade: 8, recursos: ['Projetor', 'Videoconferência', 'Quadro branco'], status: 'disponivel' },
  { id: 2, nome: 'Sala Horizonte', andar: '1º andar', capacidade: 12, recursos: ['TV 65"', 'Videoconferência', 'Ar-condicionado'], status: 'ocupada' },
  { id: 3, nome: 'Sala Atlântico', andar: '2º andar', capacidade: 20, recursos: ['Projetor', 'Microfones', 'Videoconferência'], status: 'disponivel' },
  { id: 4, nome: 'Sala Cedro', andar: '2º andar', capacidade: 4, recursos: ['TV 42"', 'Quadro branco'], status: 'disponivel' },
  { id: 5, nome: 'Sala Safira', andar: '3º andar', capacidade: 6, recursos: ['Projetor', 'Ar-condicionado'], status: 'manutencao' },
  { id: 6, nome: 'Auditório Nex', andar: 'Térreo', capacidade: 60, recursos: ['Palco', 'Microfones', 'Projetor', 'Videoconferência'], status: 'ocupada' },
]

export const proximasReservas = [
  { id: 101, titulo: 'Planejamento semanal', sala: 'Sala Aurora', inicio: '09:00', fim: '10:00', responsavel: 'Ana Souza' },
  { id: 102, titulo: 'Demo para cliente', sala: 'Sala Atlântico', inicio: '10:30', fim: '12:00', responsavel: 'Carlos Lima' },
  { id: 103, titulo: 'Entrevista técnica', sala: 'Sala Cedro', inicio: '14:00', fim: '15:00', responsavel: 'Marina Alves' },
  { id: 104, titulo: 'Treinamento de onboarding', sala: 'Auditório Nex', inicio: '15:30', fim: '17:30', responsavel: 'Paulo Reis' },
]

export const indicadores = {
  reservasHoje: 14,
  taxaOcupacao: 68,
  salasDisponiveis: 3,
  pendentesAprovacao: 2,
}

export const rankingSalas = [
  { nome: 'Sala Atlântico', reservas: 42 },
  { nome: 'Sala Aurora', reservas: 36 },
  { nome: 'Auditório Nex', reservas: 25 },
  { nome: 'Sala Horizonte', reservas: 19 },
  { nome: 'Sala Cedro', reservas: 11 },
]
