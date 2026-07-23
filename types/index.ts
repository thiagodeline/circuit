export type StatusTorneio = 'em_breve' | 'inscricoes_abertas' | 'em_andamento' | 'finalizado';

export type ModoTorneio = 'grupos_mata_mata' | 'apenas_mata_mata';

export interface Torneio {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  status: StatusTorneio;
  modoTorneio?: ModoTorneio; // ausência = tratado como 'grupos_mata_mata' (compatibilidade com torneios antigos)
  formato: string; // descrição livre, ex: "8 times · 2 grupos · playoffs"
  dataInicio: string; // ISO date
  dataFim?: string;
  local?: string; // ex: "Online" ou "São Paulo, SP"
  premiacao?: string; // ex: "R$ 2.000 para o campeão"
  regras?: string; // texto livre com regras/observações
  regulamentoUrl?: string; // link para o PDF do regulamento
  streamUrl?: string; // canal da transmissão (Twitch, YouTube, etc)
  valorInscricao?: number; // em reais; vazio/0 = inscrição gratuita
  capa?: string; // URL da imagem de capa
  criadoEm: number;
}

export interface Time {
  id: string;
  torneioId: string;
  nome: string;
  tag: string; // sigla curta, ex: "ZEN"
  logo?: string;
  bio?: string; // curta descrição/história do time
  capitao?: string;
  contato: string;
  jogadores?: string[];
  grupo?: string; // ex: "Grupo A"
  criadoEm: number;
}

export interface MapaJogado {
  nome: string; // ex: "Haven"
  placarA: number;
  placarB: number;
}

export interface Partida {
  id: string;
  torneioId: string;
  fase: string; // "Grupo A", "Semifinal", "Final"
  timeA: string; // id do time
  timeB: string;
  placarA?: number;
  placarB?: number;
  mapas?: MapaJogado[]; // placar mapa a mapa (ex: Haven 13x2, Split 13x5)
  data?: string; // ISO date/datetime da partida
  finalizada: boolean;
  criadoEm: number;
}

export interface Noticia {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  capa?: string;
  publicadoEm: number;
  autor: string;
}

export type StatusInscricao =
  | 'aguardando_pagamento'
  | 'pagamento_recusado'
  | 'pendente'
  | 'aprovada'
  | 'rejeitada';

export interface Inscricao {
  id: string;
  torneioId: string;
  nomeTime: string;
  tag: string;
  capitao: string;
  contato: string;
  jogadores: string[];
  status: StatusInscricao;
  valorPago?: number; // em reais, preenchido quando a inscrição exige pagamento
  paymentId?: string; // id do pagamento no Mercado Pago
  criadoEm: number;
}

// Cadeia oficial de torneios do circuito competitivo da Circuit
export type FaseCircuito =
  | 'Circuit Qualifier'
  | 'Copa Circuit'
  | 'Series'
  | 'Circuit ELITE'
  | 'Circuit FINALS';

export const FASES_CIRCUITO: FaseCircuito[] = [
  'Circuit Qualifier',
  'Copa Circuit',
  'Series',
  'Circuit ELITE',
  'Circuit FINALS',
];

// Um lançamento de pontos de um time em um torneio específico da cadeia.
// O ranking é sempre a SOMA desses lançamentos por time — nunca uma posição fixa.
export interface PontosCircuito {
  id: string;
  timeId: string;
  fase: FaseCircuito;
  edicao?: string; // ex: "#1", "#2" — opcional, usado quando a fase se repete (Qualifiers, Series)
  pontos: number;
  criadoEm: number;
}
