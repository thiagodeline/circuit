export type StatusTorneio = 'em_breve' | 'inscricoes_abertas' | 'em_andamento' | 'finalizado';

export interface Torneio {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  status: StatusTorneio;
  formato: string; // descrição livre, ex: "8 times · 2 grupos · playoffs"
  dataInicio: string; // ISO date
  dataFim?: string;
  local?: string; // ex: "Online" ou "São Paulo, SP"
  premiacao?: string; // ex: "R$ 2.000 para o campeão"
  regras?: string; // texto livre com regras/observações
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

export type StatusInscricao = 'pendente' | 'aprovada' | 'rejeitada';

export interface Inscricao {
  id: string;
  torneioId: string;
  nomeTime: string;
  tag: string;
  capitao: string;
  contato: string;
  jogadores: string[];
  status: StatusInscricao;
  criadoEm: number;
}

export interface RankingEntrada {
  id: string;
  timeId: string;
  posicao: number;
  comentario?: string;
  atualizadoEm: number;
}
