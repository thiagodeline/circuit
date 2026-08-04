import { Partida, Time } from '@/types';

export interface LinhaGrupo {
  time: Time;
  vitorias: number;
  derrotas: number;
  saldo: number;
  pontos: number;
  jogos: number;
  posicaoNoGrupo: number;
  zona: 'direto' | 'repescagem' | 'eliminado';
}

/**
 * Calcula a classificação de um grupo (ex: "Grupo A") no formato do VCL
 * Qualifier: MD1, vitória = 3 pontos. Nos grupos de 4 times, o Top 1-2 avança
 * direto pro VCL e o Top 3-4 vai pra repescagem — mas a função funciona com
 * qualquer tamanho de grupo, ajustando os cortes proporcionalmente.
 */
export function calcularGrupo(times: Time[], partidas: Partida[]): LinhaGrupo[] {
  const base = times.map((time) => ({
    time,
    vitorias: 0,
    derrotas: 0,
    saldo: 0,
    pontos: 0,
    jogos: 0,
  }));

  const porId = new Map(base.map((l) => [l.time.id, l]));

  for (const p of partidas) {
    if (!p.finalizada || p.placarA === undefined || p.placarB === undefined) continue;
    const linhaA = porId.get(p.timeA);
    const linhaB = porId.get(p.timeB);
    if (!linhaA || !linhaB) continue;

    linhaA.jogos += 1;
    linhaB.jogos += 1;
    linhaA.saldo += p.placarA - p.placarB;
    linhaB.saldo += p.placarB - p.placarA;

    if (p.placarA > p.placarB) {
      linhaA.vitorias += 1;
      linhaA.pontos += 3;
      linhaB.derrotas += 1;
    } else if (p.placarB > p.placarA) {
      linhaB.vitorias += 1;
      linhaB.pontos += 3;
      linhaA.derrotas += 1;
    }
  }

  const ordenada = base.sort((a, b) => b.pontos - a.pontos || b.saldo - a.saldo || b.vitorias - a.vitorias);
  const total = ordenada.length;
  const metade = Math.ceil(total / 2);

  return ordenada.map((l, i) => {
    const posicaoNoGrupo = i + 1;
    // Metade de cima do grupo (ex: Top 1-2 num grupo de 4) qualifica direto;
    // a outra metade vai pra repescagem.
    const zona: LinhaGrupo['zona'] = posicaoNoGrupo <= metade ? 'direto' : 'repescagem';
    return { ...l, posicaoNoGrupo, zona };
  });
}

export interface LinhaRepescagem {
  time: Time;
  vitorias: number;
  derrotas: number;
  saldo: number;
  pontos: number;
  posicao: number;
  classificado: boolean;
}

/**
 * Calcula a repescagem: os times do Top 3-4 de cada grupo se enfrentam de novo
 * (MD1), e os melhores colocados (definidos por `vagasRepescagem`) garantem as
 * últimas vagas no VCL.
 */
export function calcularRepescagem(
  times: Time[],
  partidas: Partida[],
  vagasRepescagem: number
): LinhaRepescagem[] {
  const grupo = calcularGrupo(times, partidas);
  return grupo.map((l, i) => ({
    time: l.time,
    vitorias: l.vitorias,
    derrotas: l.derrotas,
    saldo: l.saldo,
    pontos: l.pontos,
    posicao: i + 1,
    classificado: i < vagasRepescagem,
  }));
}
