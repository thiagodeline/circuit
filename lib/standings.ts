import { Partida, Time } from '@/types';

export interface LinhaTabela {
  time: Time;
  vitorias: number;
  empates: number;
  derrotas: number;
  saldo: number;
  pontos: number;
  jogos: number;
  posicao: number;
  zona: 'permanece' | 'rebaixamento' | 'promocao' | 'neutro';
}

/**
 * Calcula a tabela de classificação de um grupo único (pontos corridos, sem
 * playoffs) — usada nas páginas /serie-a e /serie-b. Vitória vale 3 pontos,
 * empate vale 1 ponto pra cada time, derrota não pontua.
 *
 * Zona de rebaixamento/promoção é sempre "os 2 últimos" ou "os 2 primeiros"
 * colocados, calculado dinamicamente pelo tamanho real do grupo (funciona com
 * 8, 10 ou qualquer quantidade de times cadastrados).
 */
export function calcularTabelaLiga(
  times: Time[],
  partidas: Partida[],
  tipo: 'serie-a' | 'serie-b'
): LinhaTabela[] {
  const base = times.map((time) => ({
    time,
    vitorias: 0,
    empates: 0,
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
    } else {
      // Empate — MD2 pode terminar 1x1
      linhaA.empates += 1;
      linhaB.empates += 1;
      linhaA.pontos += 1;
      linhaB.pontos += 1;
    }
  }

  const ordenada = base.sort((a, b) => b.pontos - a.pontos || b.saldo - a.saldo || b.vitorias - a.vitorias);
  const total = ordenada.length;

  return ordenada.map((l, i) => {
    const posicao = i + 1;
    let zona: LinhaTabela['zona'] = 'neutro';
    if (tipo === 'serie-a') {
      zona = posicao > total - 2 ? 'rebaixamento' : 'permanece';
    } else {
      zona = posicao <= 2 ? 'promocao' : 'neutro';
    }
    return { ...l, posicao, zona };
  });
}
