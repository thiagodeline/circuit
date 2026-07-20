import { Partida, Time } from '@/types';

export interface LinhaClassificacao {
  time: Time;
  vitorias: number;
  derrotas: number;
  mapasVencidos: number;
  mapasPerdidos: number;
  saldo: number; // mapasVencidos - mapasPerdidos
  pontos: number; // 3 por vitória, 0 por derrota
  jogos: number;
}

/**
 * Calcula a classificação de um grupo/fase a partir das partidas finalizadas.
 * placarA/placarB representam o placar em mapas da partida (ex: 2 : 1 numa MD3).
 * Pontuação: vitória = 3 pontos, derrota = 0 pontos.
 * Ordena por pontos (desc), depois saldo de mapas (desc), depois mapas vencidos (desc).
 */
export function calcularClassificacao(times: Time[], partidas: Partida[]): LinhaClassificacao[] {
  const linhas = new Map<string, LinhaClassificacao>();

  for (const t of times) {
    linhas.set(t.id, {
      time: t,
      vitorias: 0,
      derrotas: 0,
      mapasVencidos: 0,
      mapasPerdidos: 0,
      saldo: 0,
      pontos: 0,
      jogos: 0,
    });
  }

  for (const p of partidas) {
    if (!p.finalizada || p.placarA === undefined || p.placarB === undefined) continue;

    const linhaA = linhas.get(p.timeA);
    const linhaB = linhas.get(p.timeB);
    if (!linhaA || !linhaB) continue;

    linhaA.jogos += 1;
    linhaB.jogos += 1;
    linhaA.mapasVencidos += p.placarA;
    linhaA.mapasPerdidos += p.placarB;
    linhaB.mapasVencidos += p.placarB;
    linhaB.mapasPerdidos += p.placarA;
    linhaA.saldo = linhaA.mapasVencidos - linhaA.mapasPerdidos;
    linhaB.saldo = linhaB.mapasVencidos - linhaB.mapasPerdidos;

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

  return Array.from(linhas.values()).sort(
    (a, b) => b.pontos - a.pontos || b.saldo - a.saldo || b.mapasVencidos - a.mapasVencidos
  );
}
