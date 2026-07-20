import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { listarTorneios, listarTimesPorTorneio } from '@/lib/data';

export const revalidate = 60;

export default async function TimesPage() {
  const torneios = await listarTorneios().catch(() => []);
  const gruposDeTimes = await Promise.all(
    torneios.map(async (t) => ({ torneio: t, times: await listarTimesPorTorneio(t.id).catch(() => []) }))
  );

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="eyebrow mb-2">Competidores</p>
        <h1 className="font-display text-4xl font-semibold">Times</h1>

        <div className="mt-12 space-y-14">
          {gruposDeTimes
            .filter((g) => g.times.length > 0)
            .map(({ torneio, times }) => (
              <div key={torneio.id}>
                <h2 className="mb-5 font-display text-xl font-semibold text-signal">{torneio.nome}</h2>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {times.map((t) => (
                    <Link key={t.id} href={`/times/${t.id}`} className="card group flex items-center gap-3 p-4 transition hover:border-signal/50">
                      {t.logo ? (
                        <img src={t.logo} alt={t.nome} className="h-10 w-10 flex-shrink-0 rounded-md object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-surface2 font-mono text-xs text-muted">
                          {t.tag.slice(0, 3)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-display font-semibold group-hover:text-signal">{t.nome}</p>
                        <p className="font-mono text-xs text-muted">{t.tag}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          {gruposDeTimes.every((g) => g.times.length === 0) && (
            <p className="text-muted">Nenhum time cadastrado ainda.</p>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
