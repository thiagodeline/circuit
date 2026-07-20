import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { StatusBadge } from '@/components/StatusBadge';
import { buscarTorneioPorSlug, listarTimesPorTorneio, listarPartidasPorTorneio } from '@/lib/data';

export const revalidate = 30;

export default async function TorneioDetalhePage({ params }: { params: { slug: string } }) {
  const torneio = await buscarTorneioPorSlug(params.slug).catch(() => null);
  if (!torneio) notFound();

  const [times, partidas] = await Promise.all([
    listarTimesPorTorneio(torneio.id).catch(() => []),
    listarPartidasPorTorneio(torneio.id).catch(() => []),
  ]);

  const times_por_id = Object.fromEntries(times.map((t) => [t.id, t]));
  const fases = Array.from(new Set(partidas.map((p) => p.fase)));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-3 flex items-center gap-3">
          <StatusBadge status={torneio.status} />
          <span className="font-mono text-xs text-muted">{torneio.formato}</span>
        </div>
        <h1 className="font-display text-4xl font-semibold">{torneio.nome}</h1>
        <p className="mt-3 max-w-2xl text-muted">{torneio.descricao}</p>

        {/* TIMES */}
        <section className="mt-14">
          <h2 className="mb-6 font-display text-2xl font-semibold">Times inscritos</h2>
          {times.length === 0 ? (
            <p className="text-muted">Nenhum time inscrito ainda.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {times.map((t) => (
                <div key={t.id} className="card p-4">
                  <p className="font-display font-semibold">{t.nome}</p>
                  <p className="font-mono text-xs text-signal">{t.tag}</p>
                  {t.grupo && <p className="mt-1 text-xs text-muted">{t.grupo}</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RESULTADOS / CHAVES */}
        <section className="mt-14">
          <h2 className="mb-6 font-display text-2xl font-semibold">Resultados</h2>
          {fases.length === 0 ? (
            <p className="text-muted">As partidas ainda não foram definidas.</p>
          ) : (
            <div className="space-y-8">
              {fases.map((fase) => (
                <div key={fase}>
                  <p className="eyebrow mb-3">{fase}</p>
                  <div className="space-y-2">
                    {partidas
                      .filter((p) => p.fase === fase)
                      .map((p) => {
                        const a = times_por_id[p.timeA];
                        const b = times_por_id[p.timeB];
                        return (
                          <div key={p.id} className="card flex items-center justify-between p-4">
                            <span className="w-2/5 truncate font-medium">{a?.nome ?? '—'}</span>
                            <span className="font-mono text-signal">
                              {p.finalizada ? `${p.placarA} : ${p.placarB}` : 'vs'}
                            </span>
                            <span className="w-2/5 truncate text-right font-medium">{b?.nome ?? '—'}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
