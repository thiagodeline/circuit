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
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs ${e.className}`}>
      {status === 'em_andamento' && <span className="h-1.5 w-1.5 rounded-full bg-live" />}
      {e.label}
    </span>
  );
}
