import { PontosCircuito, Time } from '@/types';

export interface LinhaRankingCircuito {
  time: Time;
  total: number;
  lancamentos: PontosCircuito[]; // ordenados do maior pro menor, para exibir o extrato
}

/**
 * Agrupa os lançamentos de pontos por time, soma o total de cada um, e ordena
 * o ranking automaticamente do maior pro menor total — nunca por posição manual.
 * Times sem nenhum lançamento não aparecem no ranking.
 */
export function calcularRankingCircuito(times: Time[], lancamentos: PontosCircuito[]): LinhaRankingCircuito[] {
  const porTime = new Map<string, PontosCircuito[]>();

  for (const lancamento of lancamentos) {
    const lista = porTime.get(lancamento.timeId) ?? [];
    lista.push(lancamento);
    porTime.set(lancamento.timeId, lista);
  }

  const linhas: LinhaRankingCircuito[] = [];
  for (const [timeId, lista] of porTime) {
    const time = times.find((t) => t.id === timeId);
    if (!time) continue; // time pode ter sido removido — ignora o lançamento órfão

    const total = lista.reduce((soma, l) => soma + l.pontos, 0);
    const lancamentosOrdenados = [...lista].sort((a, b) => b.pontos - a.pontos);

    linhas.push({ time, total, lancamentos: lancamentosOrdenados });
  }

  return linhas.sort((a, b) => b.total - a.total);
}

/** Monta o rótulo de exibição de um lançamento, ex: "Circuit Qualifier #1". */
export function rotuloOrigem(lancamento: PontosCircuito): string {
  return lancamento.edicao ? `${lancamento.fase} ${lancamento.edicao}` : lancamento.fase;
}
