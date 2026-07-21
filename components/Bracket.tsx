import Link from 'next/link';
import { Partida, Time } from '@/types';

// Ordem canônica de fases de mata-mata — fases não listadas aqui mantêm a ordem em que foram criadas
const ORDEM_FASES = ['oitavas', 'quartas', 'semifinal', 'terceiro', 'final'];

export function ordenarFasesPlayoff(fases: string[]): string[] {
  return [...fases].sort((a, b) => {
    const posA = ORDEM_FASES.findIndex((termo) => a.toLowerCase().includes(termo));
    const posB = ORDEM_FASES.findIndex((termo) => b.toLowerCase().includes(termo));
    if (posA === -1 && posB === -1) return 0;
    if (posA === -1) return 1;
    if (posB === -1) return -1;
    return posA - posB;
  });
}

function SlotTime({ time }: { time?: Time }) {
  if (!time) {
    return (
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="h-5 w-5 flex-shrink-0 border border-dashed border-line" />
        <span className="truncate font-mono text-xs uppercase tracking-wider text-muted">A definir</span>
      </div>
    );
  }
  return (
    <Link href={`/times/${time.id}`} className="flex items-center gap-2 px-3 py-2 hover:text-signal">
      {time.logo ? (
        <img src={time.logo} alt="" className="h-5 w-5 flex-shrink-0 object-cover" />
      ) : (
        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center bg-surface2 font-mono text-[9px] text-muted">
          {time.tag.slice(0, 2)}
        </div>
      )}
      <span className="truncate text-sm font-medium">{time.nome}</span>
    </Link>
  );
}

export function Bracket({
  fases,
  partidas,
  timesPorId,
}: {
  fases: string[];
  partidas: Partida[];
  timesPorId: Record<string, Time>;
}) {
  const fasesOrdenadas = ordenarFasesPlayoff(fases);

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {fasesOrdenadas.map((fase) => {
        const partidasDaFase = partidas.filter((p) => p.fase === fase);
        return (
          <div key={fase} className="flex w-64 flex-shrink-0 flex-col justify-around gap-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-signal">{fase}</p>
            <div className="flex flex-1 flex-col justify-around gap-6">
              {partidasDaFase.map((p) => {
                const a = timesPorId[p.timeA];
                const b = timesPorId[p.timeB];
                const aVenceu = p.finalizada && (p.placarA ?? 0) > (p.placarB ?? 0);
                const bVenceu = p.finalizada && (p.placarB ?? 0) > (p.placarA ?? 0);
                return (
                  <div key={p.id} className="border border-line bg-surface">
                    <div className={aVenceu ? 'bg-signal/5' : ''}>
                      <div className="flex items-center justify-between">
                        <SlotTime time={a} />
                        {p.finalizada && (
                          <span className={`pr-3 font-mono text-sm font-semibold ${aVenceu ? 'text-signal' : 'text-muted'}`}>
                            {p.placarA}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-line" />
                    <div className={bVenceu ? 'bg-signal/5' : ''}>
                      <div className="flex items-center justify-between">
                        <SlotTime time={b} />
                        {p.finalizada && (
                          <span className={`pr-3 font-mono text-sm font-semibold ${bVenceu ? 'text-signal' : 'text-muted'}`}>
                            {p.placarB}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
