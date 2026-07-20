import { Partida, Time } from '@/types';

export interface LinhaClassificacao {
  time: Time;
  vitorias: number;
  derrotas: number;
  saldo: number; // diferença de rounds/placar
  jogos: number;
}

/**
 * Calcula a classificação de um grupo/fase a partir das partidas finalizadas.
 * Ordena por vitórias (desc), depois por saldo (desc).
 */
export function calcularClassificacao(times: Time[], partidas: Partida[]): LinhaClassificacao[] {
  const linhas = new Map<string, LinhaClassificacao>();

  for (const t of times) {
    linhas.set(t.id, { time: t, vitorias: 0, derrotas: 0, saldo: 0, jogos: 0 });
  }

  for (const p of partidas) {
    if (!p.finalizada || p.placarA === undefined || p.placarB === undefined) continue;

    const linhaA = linhas.get(p.timeA);
    const linhaB = linhas.get(p.timeB);
    if (!linhaA || !linhaB) continue;

    linhaA.jogos += 1;
    linhaB.jogos += 1;
    linhaA.saldo += p.placarA - p.placarB;
    linhaB.saldo += p.placarB - p.placarA;

    if (p.placarA > p.placarB) {
      linhaA.vitorias += 1;
      linhaB.derrotas += 1;
    } else if (p.placarB > p.placarA) {
      linhaB.vitorias += 1;
      linhaA.derrotas += 1;
    }
  }

  return Array.from(linhas.values()).sort((a, b) => b.vitorias - a.vitorias || b.saldo - a.saldo);
}
