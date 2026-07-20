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

  const torneiosAtivos = torneios.filter((t) => t.status === 'em_andamento').length;

  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-line bg-circuit-trace bg-[length:120px_120px]">
          <div className="mx-auto max-w-6xl px-6 pb-12 pt-20">
            <p className="eyebrow mb-5">Organização de torneios de Valorant</p>
            <h1 className="max-w-4xl font-display text-6xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
              Cada campeonato
              <br />
              é um <span className="text-signal">circuito.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted">
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

          {/* FAIXA DE ESTATÍSTICAS */}
          <div className="border-t border-line bg-surface/60">
            <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-line px-6">
              <div className="px-6 py-6">
                <p className="font-display text-3xl font-semibold">{torneios.length}</p>
                <p className="font-mono text-xs uppercase tracking-wider text-muted">Torneios cadastrados</p>
              </div>
              <div className="px-6 py-6">
                <p className="font-display text-3xl font-semibold text-live">{torneiosAtivos}</p>
                <p className="font-mono text-xs uppercase tracking-wider text-muted">Em andamento agora</p>
              </div>
              <div className="px-6 py-6">
                <p className="font-display text-3xl font-semibold text-signal">Circuit Zen</p>
                <p className="font-mono text-xs uppercase tracking-wider text-muted">Temporada de estreia</p>
              </div>
            </div>
          </div>
        </section>

        {/* TORNEIOS EM DESTAQUE */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-sm text-muted">01</span>
              <div>
                <p className="eyebrow mb-2">Temporada atual</p>
                <h2 className="font-display text-3xl font-semibold uppercase">Torneios</h2>
              </div>
            </div>
            <Link href="/torneios" className="font-mono text-xs uppercase tracking-wider text-signal hover:underline">
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
