export interface FaixaPontuacao {
  colocacao: string;
  pontos: string;
}

export interface DadosEtapa {
  titulo: string;
  requisitoEntrada: string;
  formato: string;
  premiacao: string;
  pontuacao: FaixaPontuacao[];
}

export const stagesData: Record<'qualifiers' | 'copa' | 'series' | 'elite' | 'finals', DadosEtapa> = {
  qualifiers: {
    titulo: 'Circuit Qualifiers',
    requisitoEntrada: 'Inscrição paga (R$ 40/time) — aberta a qualquer equipe',
    formato: 'Eliminatória simples (MD1 | Semifinal e Final em MD3)',
    premiacao: 'R$ 320,00 via PIX para o campeão + vaga na Copa Circuit',
    pontuacao: [
      { colocacao: '1º lugar', pontos: '100 pts' },
      { colocacao: '2º lugar', pontos: '60 pts' },
      { colocacao: '3º-4º lugar', pontos: '30 pts' },
      { colocacao: '5º-8º lugar', pontos: '15 pts' },
      { colocacao: '9º-16º lugar', pontos: '5 pts' },
    ],
  },
  copa: {
    titulo: 'Copa Circuit',
    requisitoEntrada: 'Vaga por mérito — melhores colocados dos Qualifiers ou por Ranking Circuit',
    formato: 'Eliminatória simples (MD1 | Semifinal e Final em MD3)',
    premiacao: 'R$ 800,00 para o campeão + vaga na Circuit Series',
    pontuacao: [
      { colocacao: '1º lugar', pontos: '250 pts' },
      { colocacao: '2º lugar', pontos: '150 pts' },
      { colocacao: '3º-4º lugar', pontos: '80 pts' },
      { colocacao: '5º-8º lugar', pontos: '40 pts' },
      { colocacao: '9º-16º lugar', pontos: '15 pts' },
    ],
  },
  series: {
    titulo: 'Circuit Series',
    requisitoEntrada: 'Vaga por mérito — posição no Ranking Circuit acumulado',
    formato: 'Eliminatória simples (MD3 | Grande Final em MD5)',
    premiacao: 'R$ 1.500,00 para o campeão + vaga no Circuit ELITE',
    pontuacao: [
      { colocacao: '1º lugar', pontos: '500 pts' },
      { colocacao: '2º lugar', pontos: '300 pts' },
      { colocacao: '3º-4º lugar', pontos: '160 pts' },
      { colocacao: '5º-8º lugar', pontos: '80 pts' },
      { colocacao: '9º-16º lugar', pontos: '30 pts' },
    ],
  },
  elite: {
    titulo: 'Circuit ELITE',
    requisitoEntrada: 'Vaga por mérito — Top do Ranking Circuit, sem precisar disputar fases anteriores',
    formato: 'Eliminatória simples (MD3 | Grande Final em MD5)',
    premiacao: 'R$ 3.000,00 para o campeão + vaga no Circuit FINALS',
    pontuacao: [
      { colocacao: '1º lugar', pontos: '800 pts' },
      { colocacao: '2º lugar', pontos: '500 pts' },
      { colocacao: '3º-4º lugar', pontos: '250 pts' },
      { colocacao: '5º-8º lugar', pontos: '120 pts' },
    ],
  },
  finals: {
    titulo: 'Circuit FINALS',
    requisitoEntrada: 'Vaga por mérito — melhores colocados do Circuit ELITE',
    formato: 'Eliminatória simples (todas as fases em MD3 | Grande Final em MD5)',
    premiacao: 'Troféu de Campeão do Ano + premiação especial (definida pela staff a cada temporada)',
    pontuacao: [{ colocacao: 'Todas as posições', pontos: '0 pts (evento definidor do campeão)' }],
  },
};

// Tabela comparativa lado a lado, usada na aba "Visão Geral"
export const ETAPAS_COMPARATIVO: { chave: keyof typeof stagesData; nome: string }[] = [
  { chave: 'qualifiers', nome: 'Qualifiers' },
  { chave: 'copa', nome: 'Copa Circuit' },
  { chave: 'series', nome: 'Circuit Series' },
  { chave: 'elite', nome: 'Circuit ELITE' },
  { chave: 'finals', nome: 'Circuit FINALS' },
];

export const FAIXAS_COMPARATIVO = ['1º lugar', '2º lugar', '3º-4º lugar', '5º-8º lugar', '9º-16º lugar'];

export function pontosNaFaixa(etapa: keyof typeof stagesData, faixa: string): string {
  if (etapa === 'finals') return '—';
  const encontrada = stagesData[etapa].pontuacao.find((p) => p.colocacao === faixa);
  return encontrada ? encontrada.pontos : '—';
}
