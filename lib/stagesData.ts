// Dados estruturados do modelo de liga (Série A / Série B) usados no Manual Circuit

export const REGRAS_SERIE_A = {
  formato: '10 equipes · Grupo único, pontos corridos (todos contra todos) · Partidas em MD2',
  inscricao: 'R$ 150,00 por time',
  premiacaoTotal: 'R$ 1.000,00 em PIX',
  permanencia: '1º ao 8º lugar garantem vaga na Série A do próximo Split',
  rebaixamento: '9º e 10º lugar são rebaixados e fundam a Série B',
  campeao: 'Sem playoffs — o campeão é o time com mais pontos no grupo único',
};

export const REGRAS_SERIE_B = {
  formato: '10 equipes · Grupo único, pontos corridos · 2 rebaixados da Série A + 8 vagas abertas',
  inscricao: 'R$ 150,00 por time (vagas abertas)',
  acesso: 'Os 2 melhores colocados da Série B sobem para a Série A no Split seguinte',
};

export const DIVISAO_PREMIACAO_SERIE_A = [
  { colocacao: '1º lugar', valor: 'R$ 800,00' },
  { colocacao: '2º lugar', valor: 'R$ 200,00' },
];

export const DIVISAO_PREMIACAO_SERIE_B = [
  { colocacao: '1º lugar', valor: 'R$ 500,00' },
  { colocacao: '2º lugar', valor: 'R$ 200,00' },
];
