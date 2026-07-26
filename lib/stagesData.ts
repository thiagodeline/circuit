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

export const stagesData: Record<'qualifiers' | 'masters', DadosEtapa> = {
  qualifiers: {
    titulo: 'Circuit Qualifiers',
    requisitoEntrada: 'Inscrição paga — R$ 40,00 por time (8 vagas)',
    formato: 'Eliminatória simples · Quartas e Semifinal em MD1 · Final em MD3',
    premiacao: 'R$ 190,00 via PIX para o campeão + vaga gratuita no Circuit Masters',
    pontuacao: [
      { colocacao: 'Campeão', pontos: 'Vaga direta no Circuit Masters' },
      { colocacao: 'Top 4', pontos: 'Classificado para o Circuit Masters' },
    ],
  },
  masters: {
    titulo: 'Circuit Masters',
    requisitoEntrada: '4 vagas via Qualifiers (gratuitas) + 4 vagas Wildcard — R$ 100,00/time (8 vagas no total)',
    formato: 'Fase de grupos GSL (MD1/MD3) + Playoffs de eliminação dupla (Upper/Lower Bracket em MD3, Final em MD3)',
    premiacao: 'R$ 420,00 para o campeão + Selo Oficial de Campeão Circuit',
    pontuacao: [{ colocacao: 'Campeão da temporada', pontos: 'Selo de Campeão Circuit' }],
  },
};

// Transparência financeira — como o valor arrecadado nos Qualifiers é dividido
export const DIVISAO_FINANCEIRA_QUALIFIERS = [
  { destino: 'Premiação do Qualifier (PIX ao campeão)', percentual: 60 },
  { destino: 'Pote acumulado para o Circuit Masters', percentual: 20 },
  { destino: 'Organização (custos operacionais)', percentual: 20 },
];
