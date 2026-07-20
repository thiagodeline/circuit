import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { StatusBadge } from '@/components/StatusBadge';
import { listarTorneios } from '@/lib/data';

export const revalidate = 60;

export default async function TorneiosPage() {
  let torneios: Awaited<ReturnType<typeof listarTorneios>> = [];
  try {
    torneios = await listarTorneios();
  } catch {}

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="eyebrow mb-2">Todos os campeonatos</p>
        <h1 className="font-display text-4xl font-semibold">Torneios</h1>
        <p className="mt-3 max-w-xl text-muted">
          Do Circuit Zen às próximas temporadas — acompanhe formato, status e resultados de cada campeonato.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {torneios.length === 0 && (
            <div className="card col-span-2 p-10 text-center text-muted">Nenhum torneio publicado ainda.</div>
          )}
          {torneios.map((t) => (
            <Link key={t.id} href={`/torneios/${t.slug}`} className="card group p-6 transition hover:border-signal/50">
              <div className="mb-4 flex items-center justify-between">
                <StatusBadge status={t.status} />
                <span className="font-mono text-xs text-muted">{t.formato}</span>
              </div>
              <h3 className="font-display text-xl font-semibold group-hover:text-signal">{t.nome}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{t.descricao}</p>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
