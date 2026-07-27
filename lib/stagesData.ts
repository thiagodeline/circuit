export interface FaixaPontuacao {
  colocacao: string;
  pontos: string;
}

export interface DadosEtapa {
  titulo: string;
  requisitoEntrada: string;
  formato: string;
  premiacao: string;
  classificacao: string; // quem avança para a próxima etapa
  pontuacao: FaixaPontuacao[];
}

export const stagesData: Record<'qualifiers' | 'elite' | 'masters' | 'finals', DadosEtapa> = {
  qualifiers: {
    titulo: 'Circuit Qualifiers',
    requisitoEntrada: 'Inscrição paga — 4 edições por temporada, 8 times por edição',
    formato: 'Eliminatória simples · MD1 nas fases iniciais · MD3 na Final',
    premiacao: 'R$ 300,00 via PIX para o campeão',
    classificacao: 'Top 1-2 avançam para o Circuit Masters · Top 3-4 avançam para o Circuit Elite',
    pontuacao: [
      { colocacao: '1º lugar', pontos: '3 pts' },
      { colocacao: '2º lugar', pontos: '2 pts' },
      { colocacao: '3º-4º lugar', pontos: '1 pt' },
    ],
  },
  elite: {
    titulo: 'Circuit Elite',
    requisitoEntrada: 'Entrada gratuita — vaga via Top 3-4 dos Qualifiers (8 times)',
    formato: 'Eliminatória simples · MD1/MD3 conforme a fase',
    premiacao: 'R$ 200,00, pagos com o Fundo Acumulado da temporada',
    classificacao: 'Top 3 avançam para o Circuit Finals',
    pontuacao: [
      { colocacao: '1º lugar', pontos: '5 pts' },
      { colocacao: '2º lugar', pontos: '4 pts' },
      { colocacao: '3º lugar', pontos: '3 pts' },
      { colocacao: '4º lugar', pontos: '2 pts' },
    ],
  },
  masters: {
    titulo: 'Circuit Masters',
    requisitoEntrada: 'Entrada gratuita — vaga via Top 1-2 dos Qualifiers (8 times)',
    formato: 'Eliminatória simples · MD1/MD3 conforme a fase',
    premiacao: 'R$ 300,00, pagos com o Fundo Acumulado da temporada',
    classificacao: 'Top 3 avançam para o Circuit Finals',
    pontuacao: [
      { colocacao: '1º lugar', pontos: '6 pts' },
      { colocacao: '2º lugar', pontos: '5 pts' },
      { colocacao: '3º lugar', pontos: '4 pts' },
      { colocacao: '4º lugar', pontos: '3 pts' },
    ],
  },
  finals: {
    titulo: 'Circuit Finals (CFT)',
    requisitoEntrada: '6 times: Top 3 do Circuit Elite + Top 3 do Circuit Masters',
    formato: 'Grande evento decisivo da temporada · MD3',
    premiacao: 'R$ 300,00 + Badge Oficial da Temporada para o campeão',
    classificacao: 'Evento final — define o campeão da temporada',
    pontuacao: [{ colocacao: 'Todas as posições', pontos: 'Sem pontos — evento definidor do campeão' }],
  },
};

// Como a taxa de inscrição de cada Circuit Qualifier é dividida (por edição)
export const DIVISAO_FINANCEIRA_QUALIFIERS = [
  { destino: 'Prêmio PIX ao campeão do Qualifier', valor: 'R$ 300' },
  { destino: 'Fundo Acumulado da temporada (paga Elite + Masters)', valor: 'R$ 200' },
  { destino: 'Lucro da organização', valor: 'R$ 100' },
];
