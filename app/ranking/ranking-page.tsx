import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { listarRanking, listarTodosOsTimes } from '@/lib/data';

export const revalidate = 60;

export default async function RankingPage() {
  const [ranking, times] = await Promise.all([
    listarRanking().catch((err) => { console.error('Erro ao buscar ranking:', err); return []; }),
    listarTodosOsTimes().catch((err) => { console.error('Erro ao buscar times do ranking:', err); return []; }),
  ]);
  const timesPorId = Object.fromEntries(times.map((t) => [t.id, t]));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="eyebrow mb-2">Circuit Power Rankings</p>
        <h1 className="font-display text-4xl font-semibold uppercase">Ranking</h1>
        <p className="mt-3 max-w-xl text-muted">
          Avaliação da staff sobre o momento de cada time, com base em desempenho recente nos torneios.
        </p>

        <div className="mt-10 space-y-2">
          {ranking.length === 0 && <p className="text-muted">O ranking ainda não foi publicado.</p>}
          {ranking.map((r) => {
            const time = timesPorId[r.timeId];
            if (!time) return null;
            return (
              <Link
                key={r.id}
                href={`/times/${time.id}`}
                className="card group flex items-center gap-4 p-4 transition hover:border-signal/50 hover:-translate-y-0.5 transition-transform duration-200 ease-in-out will-change-transform"
              >
                <span className="w-8 flex-shrink-0 text-center font-display text-2xl font-semibold text-signal">
                  {r.posicao}
                </span>
                {time.logo ? (
                  <img src={time.logo} alt={time.nome} loading="lazy" decoding="async" className="h-11 w-11 flex-shrink-0 object-cover" />
                ) : (
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-surface2 font-mono text-xs text-muted">
                    {time.tag.slice(0, 3)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-semibold uppercase tracking-wide group-hover:text-signal">
                    {time.nome}
                  </p>
                  {r.comentario && <p className="mt-0.5 truncate text-sm text-muted">{r.comentario}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
