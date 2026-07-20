export type StatusTorneio = 'em_breve' | 'inscricoes_abertas' | 'em_andamento' | 'finalizado';

export type FormatoTorneio = 'grupos_playoffs' | 'mata_mata' | 'todos_contra_todos' | 'outro';

export interface Torneio {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  status: StatusTorneio;
  formatoTipo: FormatoTorneio; // define como o site organiza a exibição (classificação vs. só chaves)
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
  capitao: string;
  contato: string;
  jogadores: string[];
  grupo?: string; // ex: "Grupo A"
  criadoEm: number;
}

export interface Partida {
  id: string;
  torneioId: string;
  fase: string; // "Grupo A", "Semifinal", "Final"
  timeA: string; // id do time
  timeB: string;
  placarA?: number;
  placarB?: number;
  data?: string;
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
