import { Partida, Time } from '@/types';

function TimeSlot({ time, alinhamento }: { time?: Time; alinhamento: 'esquerda' | 'direita' }) {
  const conteudo = (
    <>
      {time?.logo ? (
        <img src={time.logo} alt="" loading="lazy" decoding="async" className="h-7 w-7 flex-shrink-0 rounded-full object-cover" />
      ) : (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/5 font-mono text-[10px] text-muted">
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
      className={`flex min-w-0 items-center gap-2.5 ${
        alinhamento === 'direita' ? 'flex-row-reverse justify-self-end text-right' : 'justify-self-start'
      }`}
    >
      {conteudo}
    </div>
  );
}

function formatarData(data: string) {
  const d = new Date(data);
  if (isNaN(d.getTime())) return null;
  const temHora = data.includes('T');
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    ...(temHora ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

export function MatchRow({ partida, timesPorId }: { partida: Partida; timesPorId: Record<string, Time> }) {
  const a = timesPorId[partida.timeA];
  const b = timesPorId[partida.timeB];
  const aVenceu = partida.finalizada && (partida.placarA ?? 0) > (partida.placarB ?? 0);
  const bVenceu = partida.finalizada && (partida.placarB ?? 0) > (partida.placarA ?? 0);
  const dataFormatada = partida.data ? formatarData(partida.data) : null;

  return (
    <div className="card overflow-hidden transition hover:border-signal/30 hover:bg-white/[0.06]">
      {/* grid de 3 colunas com a coluna central de largura fixa garante o placar
          sempre exatamente centralizado, independente do tamanho dos nomes dos times */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-3.5 sm:gap-6 sm:px-5">
        <div className={`min-w-0 ${aVenceu ? 'opacity-100' : partida.finalizada ? 'opacity-50' : ''}`}>
          <TimeSlot time={a} alinhamento="esquerda" />
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 font-mono text-lg font-semibold">
          <span className={aVenceu ? 'text-ink' : 'text-muted'}>
            {partida.finalizada ? partida.placarA : '-'}
          </span>
          <span className="text-white/20">/</span>
          <span className={bVenceu ? 'text-ink' : 'text-muted'}>
            {partida.finalizada ? partida.placarB : '-'}
          </span>
        </div>

        <div className={`min-w-0 ${bVenceu ? 'opacity-100' : partida.finalizada ? 'opacity-50' : ''}`}>
          <TimeSlot time={b} alinhamento="direita" />
        </div>
      </div>

      {/* MAPAS JOGADOS */}
      {partida.mapas && partida.mapas.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-white/5 px-4 py-2.5 sm:px-5">
          {partida.mapas.map((m, i) => (
            <span key={i} className="pill py-0.5 text-[11px] text-muted">
              {m.nome} <span className="text-ink">{m.placarA}</span>
              <span className="text-white/20">x</span>
              <span className="text-ink">{m.placarB}</span>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 border-t border-white/5 px-4 py-2.5 sm:px-5">
        <span className="pill py-0.5 text-[10px] text-signal">{partida.fase}</span>
        <span className="flex items-center gap-2">
          {dataFormatada && <span className="pill py-0.5 text-[10px] text-muted">{dataFormatada}</span>}
          <span className={`pill py-0.5 text-[10px] ${partida.finalizada ? 'text-live' : 'text-muted'}`}>
            {partida.finalizada ? 'Encerrada' : 'A definir'}
          </span>
        </span>
      </div>
    </div>
  );
}
