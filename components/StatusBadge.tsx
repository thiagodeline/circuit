import { StatusTorneio } from '@/types';

const estilos: Record<StatusTorneio, { label: string; className: string }> = {
  em_breve: { label: 'Em breve', className: 'text-muted border-line' },
  inscricoes_abertas: { label: 'Inscrições abertas', className: 'text-signal border-signal/40' },
  em_andamento: { label: 'Ao vivo', className: 'text-live border-live/40' },
  finalizado: { label: 'Finalizado', className: 'text-muted border-line' },
};

export function StatusBadge({ status }: { status: StatusTorneio }) {
  const e = estilos[status];
  return (
    <span
      className={`inline-flex items-center gap-2 border px-3 py-1 font-mono text-xs font-medium uppercase tracking-wider ${e.className}`}
    >
      {status === 'em_andamento' ? (
        <span className="h-1.5 w-1.5 animate-pulse bg-live" />
      ) : (
        <span className="h-1.5 w-1.5 bg-current opacity-60" />
      )}
      {e.label}
    </span>
  );
}
