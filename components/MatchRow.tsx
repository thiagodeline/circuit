import Link from 'next/link';
import { Partida, Time } from '@/types';

function TimeSlot({ time, alinhamento }: { time?: Time; alinhamento: 'esquerda' | 'direita' }) {
  const conteudo = (
    <>
      {time?.logo ? (
        <img src={time.logo} alt="" className="h-7 w-7 flex-shrink-0 object-cover" />
      ) : (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center bg-surface2 font-mono text-[10px] text-muted">
          {time?.tag.slice(0, 3) ?? '—'}
        </div>
      )}
      <span className="truncate font-display text-sm font-semibold uppercase tracking-wide">
        {time?.nome ?? 'A definir'}
      </span>
    </>
  );

  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2.5 ${
        alinhamento === 'direita' ? 'flex-row-reverse text-right' : ''
      }`}
    >
      {conteudo}
    </div>
  );
}

export function MatchRow({ partida, timesPorId }: { partida: Partida; timesPorId: Record<string, Time> }) {
  const a = timesPorId[partida.timeA];
  const b = timesPorId[partida.timeB];
  const aVenceu = partida.finalizada && (partida.placarA ?? 0) > (partida.placarB ?? 0);
  const bVenceu = partida.finalizada && (partida.placarB ?? 0) > (partida.placarA ?? 0);

  return (
    <div className="border border-line bg-surface transition hover:border-signal/40">
      <div className="flex items-center gap-4 px-4 py-3.5 sm:gap-6 sm:px-5">
        <div className={aVenceu ? 'opacity-100' : partida.finalizada ? 'opacity-50' : ''}>
          <TimeSlot time={a} alinhamento="esquerda" />
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 font-mono text-lg font-semibold">
          <span className={aVenceu ? 'text-ink' : 'text-muted'}>
            {partida.finalizada ? partida.placarA : '-'}
          </span>
          <span className="text-line">/</span>
          <span className={bVenceu ? 'text-ink' : 'text-muted'}>
            {partida.finalizada ? partida.placarB : '-'}
          </span>
        </div>

        <div className={bVenceu ? 'opacity-100' : partida.finalizada ? 'opacity-50' : ''}>
          <TimeSlot time={b} alinhamento="direita" />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-line px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted sm:px-5">
        <span>{partida.fase}</span>
        <span>{partida.finalizada ? 'Encerrada' : 'A definir'}</span>
      </div>
    </div>
  );
}
