import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { StatusBadge } from '@/components/StatusBadge';
import { listarTorneios } from '@/lib/data';
import { FASES_CIRCUITO, Torneio } from '@/types';

export const revalidate = 60;

export default async function TorneiosPage({ searchParams }: { searchParams: { categoria?: string } }) {
  const torneios = await listarTorneios().catch(() => []);
  const categoriaAtiva = FASES_CIRCUITO.includes(searchParams.categoria as any)
    ? (searchParams.categoria as Torneio['faseCircuito'])
    : undefined;

  const filtrados = categoriaAtiva ? torneios.filter((t) => t.faseCircuito === categoriaAtiva) : torneios;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="eyebrow mb-2">Circuit</p>
        <h1 className="font-display text-4xl font-semibold uppercase tracking-tight">Torneios</h1>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/torneios"
            className={`rounded-xl border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
              !categoriaAtiva ? 'border-signal bg-signal/10 text-signal' : 'border-white/10 bg-white/[0.03] text-muted hover:text-ink'
            }`}
          >
            Todas
          </Link>
          {FASES_CIRCUITO.map((fase) => (
            <Link
              key={fase}
              href={`/torneios?categoria=${encodeURIComponent(fase)}`}
              className={`rounded-xl border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                categoriaAtiva === fase ? 'border-signal bg-signal/10 text-signal' : 'border-white/10 bg-white/[0.03] text-muted hover:text-ink'
              }`}
            >
              {fase}
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {filtrados.length === 0 && (
            <div className="card col-span-2 p-10 text-center text-muted">Nenhum torneio encontrado.</div>
          )}
          {filtrados.map((t) => (
            <Link key={t.id} href={`/torneios/${t.slug}`} className="card group overflow-hidden transition-colors hover:border-signal/50">
              {t.capa && (
                <div className="aspect-[21/9] w-full bg-white/5">
                  <img src={t.capa} alt={t.nome} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={t.status} />
                  {t.faseCircuito && <span className="pill text-signal">{t.faseCircuito} {t.edicao}</span>}
                  {t.vagas && <span className="pill text-muted">{t.vagas} times</span>}
                </div>
                <h3 className="font-display text-xl font-semibold uppercase tracking-wide group-hover:text-signal">{t.nome}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{t.descricao}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
