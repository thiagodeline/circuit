import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { listarPontosCircuito, listarTodosOsTimes } from '@/lib/data';
import { calcularRankingCircuito, rotuloOrigem } from '@/lib/circuitPoints';

export const revalidate = 60;

export default async function RankingPage() {
  const [lancamentos, times] = await Promise.all([
    listarPontosCircuito().catch((err) => {
      console.error('Erro ao buscar pontos de circuito:', err);
      return [];
    }),
    listarTodosOsTimes().catch((err) => {
      console.error('Erro ao buscar times do ranking:', err);
      return [];
    }),
  ]);

  const ranking = calcularRankingCircuito(times, lancamentos);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="eyebrow mb-2">Circuit Points</p>
        <h1 className="font-display text-4xl font-semibold uppercase">Ranking</h1>
        <p className="mt-3 max-w-xl text-muted">
          Classificação geral por Pontos de Circuito, acumulados ao longo da cadeia oficial de
          torneios: Circuit Qualifier → Copa Circuit → Series → Circuit ELITE → Circuit FINALS.
        </p>

        <div className="mt-10 space-y-3">
          {ranking.length === 0 && <p className="text-muted">Nenhum time pontuou ainda.</p>}
          {ranking.map((linha, i) => (
            <div key={linha.time.id} className="card overflow-hidden">
              <Link
                href={`/times/${linha.time.id}`}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-white/5"
              >
                <span className="w-8 flex-shrink-0 text-center font-display text-2xl font-semibold text-signal">
                  {i + 1}
                </span>
                {linha.time.logo ? (
                  <img
                    src={linha.time.logo}
                    alt={linha.time.nome}
                    loading="lazy"
                    decoding="async"
                    className="h-11 w-11 flex-shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 font-mono text-xs text-muted">
                    {linha.time.tag.slice(0, 3)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-semibold uppercase tracking-wide">{linha.time.nome}</p>
                  <p className="font-mono text-xs text-muted">{linha.time.tag}</p>
                </div>
                <span className="flex-shrink-0 font-display text-xl font-bold text-signal">
                  {linha.total} <span className="text-xs font-normal uppercase text-muted">pts</span>
                </span>
              </Link>

              {/* EXTRATO / ORIGEM DOS PONTOS */}
              <div className="border-t border-white/5 px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {linha.lancamentos.map((l) => (
                    <span key={l.id} className="pill text-[11px] text-muted">
                      <span className="font-semibold text-signal">{l.pontos} Pts</span> — {rotuloOrigem(l)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
