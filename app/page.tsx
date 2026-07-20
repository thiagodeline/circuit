import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { listarTorneios } from '@/lib/data';
import { StatusBadge } from '@/components/StatusBadge';

export const revalidate = 60;

export default async function HomePage() {
  let torneios: Awaited<ReturnType<typeof listarTorneios>> = [];
  try {
    torneios = await listarTorneios();
  } catch {
    // Firebase ainda não configurado — a home segue funcionando sem dados
  }

  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-line bg-circuit-trace bg-[length:120px_120px]">
          <div className="mx-auto max-w-6xl px-6 py-28">
            <p className="eyebrow mb-4">Organização de torneios de Valorant</p>
            <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Cada campeonato é um circuito.
              <br />
              <span className="text-signal">Nós conectamos os pontos.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              A Circuit organiza campeonatos competitivos de Valorant — do Circuit Zen às próximas
              temporadas — com chaves, resultados e times em um só lugar.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/torneios" className="btn-primary">
                Ver torneios ativos
              </Link>
              <Link href="/noticias" className="btn-secondary">
                Últimas notícias
              </Link>
            </div>
          </div>
        </section>

        {/* TORNEIOS EM DESTAQUE */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-2">Temporada atual</p>
              <h2 className="font-display text-3xl font-semibold">Torneios</h2>
            </div>
            <Link href="/torneios" className="text-sm text-signal hover:underline">
              Ver todos →
            </Link>
          </div>

          {torneios.length === 0 ? (
            <div className="card p-10 text-center text-muted">
              Nenhum torneio publicado ainda. Assim que o Firebase estiver configurado e o primeiro
              torneio for cadastrado no painel admin, ele aparece aqui.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {torneios.slice(0, 4).map((t) => (
                <Link
                  key={t.id}
                  href={`/torneios/${t.slug}`}
                  className="card group overflow-hidden transition hover:border-signal/50"
                >
                  {t.capa && (
                    <div className="aspect-[21/9] w-full bg-surface2">
                      <img src={t.capa} alt={t.nome} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <StatusBadge status={t.status} />
                      <span className="font-mono text-xs text-muted">{t.formato}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold group-hover:text-signal">
                      {t.nome}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{t.descricao}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
