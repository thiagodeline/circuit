import { Partida } from '@/types';

/**
 * Ordena partidas: jogos sem data definida (ainda não marcados) e os mais
 * recentes vêm primeiro; jogos mais antigos ficam mais abaixo na lista.
 */
export function ordenarPartidasPorData(partidas: Partida[]): Partida[] {
  return [...partidas].sort((a, b) => {
    const dataA = a.data ? new Date(a.data).getTime() : null;
    const dataB = b.data ? new Date(b.data).getTime() : null;

    if (dataA === null && dataB === null) return b.criadoEm - a.criadoEm;
    if (dataA === null) return -1; // sem data definida sobe pro topo
    if (dataB === null) return 1;
    return dataB - dataA; // data mais recente primeiro
  });
}
