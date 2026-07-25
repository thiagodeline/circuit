import { StatusTorneio } from '@/types';

const estilos: Record<StatusTorneio, { label: string; className: string }> = {
  em_breve: { label: 'Em breve', className: 'text-muted' },
  inscricoes_abertas: { label: 'Inscrições abertas', className: 'text-signal' },
  em_andamento: { label: 'Em andamento', className: 'text-live' },
  finalizado: { label: 'Finalizado', className: 'text-muted' },
};

export function StatusBadge({ status }: { status: StatusTorneio }) {
  const e = estilos[status];
  return (
    <span className={`pill font-medium uppercase tracking-wider ${e.className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {e.label}
    </span>
  );
}
