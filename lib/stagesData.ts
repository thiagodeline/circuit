// Dados estruturados do modelo de liga (Série A / Série B) usados no Manual Circuit

export const REGRAS_SERIE_A = {
  formato: '10 equipes · Pontos corridos (todos contra todos) · Partidas em MD2',
  inscricao: 'R$ 150,00 por time',
  premiacaoTotal: 'R$ 1000,00',
  premiacao1: 'R$ 800,00 para o 1º colocado',
  premiacao2: 'R$ 200,00 para o 2º colocado',
  permanencia: '1º ao 6º lugar garantem vaga na Série A do próximo Split',
  rebaixamento: '7º e 8º lugar são rebaixados para a Série B',
};

export const REGRAS_SERIE_B = {
  formato: '10 equipes · 2 rebaixados da Série A + 6 vagas abertas',
  inscricao: 'R$ 150,00 por time (vagas abertas)',
  acesso: 'Os 2 melhores colocados da Série B sobem para a Série A no Split seguinte',
};

export const DIVISAO_PREMIACAO_SERIE_A = [
  { colocacao: '1º lugar', valor: 'R$ 800,00' },
  { colocacao: '2º lugar', valor: 'R$ 200,00' },
];
