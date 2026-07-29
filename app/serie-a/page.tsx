import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { TabelaLiga } from '@/components/TabelaLiga';
import { MatchRow } from '@/components/MatchRow';
import { buscarTorneioPorFase, listarTimesPorTorneio, listarPartidasPorTorneio } from '@/lib/data';
import { calcularTabelaLiga } from '@/lib/standings';
import { ordenarPartidasPorData } from '@/lib/ordenar';
import { DIVISAO_PREMIACAO_SERIE_A } from '@/lib/stagesData';

export const revalidate = 30;

export default async function SerieAPage() {
  const torneio = await buscarTorneioPorFase('Série A').catch(() => null);

  const [times, partidas] = torneio
    ? await Promise.all([
        listarTimesPorTorneio(torneio.id).catch(() => []),
        listarPartidasPorTorneio(torneio.id).catch(() => []),
      ])
    : [[], []];

  const tabela = calcularTabelaLiga(times, partidas, 'serie-a');
  const timesPorId = Object.fromEntries(times.map((t) => [t.id, t]));
  const calendario = ordenarPartidasPorData(partidas);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-3 flex items-center gap-3">
          <span className="pill text-signal">SÉRIE A — ELITE</span>
          {torneio?.status && <span className="pill text-muted">{torneio.status.replace('_', ' ')}</span>}
        </div>
        <h1 className="font-display text-4xl font-semibold uppercase tracking-tight">
          {torneio ? torneio.nome : 'Série A'}
        </h1>

        {/* PREMIAÇÃO EM DESTAQUE */}
        <div className="mt-6 card flex flex-wrap items-center gap-8 p-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Premiação</p>
            <p className="font-display text-2xl font-bold text-signal">R$ 1000,00</p>
          </div>
          {DIVISAO_PREMIACAO_SERIE_A.map((d) => (
            <div key={d.colocacao}>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{d.colocacao}</p>
              <p className="font-display text-lg font-semibold">{d.valor}</p>
            </div>
          ))}
        </div>

        {torneio ? (
          <>
            <section className="mt-12">
              <p className="eyebrow mb-4">Classificação completa</p>
              <TabelaLiga linhas={tabela} tipo="serie-a" />
            </section>

            <section className="mt-12">
              <p className="eyebrow mb-4">Calendário de jogos (MD2)</p>
              {calendario.length === 0 ? (
                <p className="text-muted">Nenhuma partida cadastrada ainda.</p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {calendario.map((p) => (
                    <MatchRow key={p.id} partida={p} timesPorId={timesPorId} />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <div className="card mt-12 p-10 text-center text-muted">
            A Série A ainda não foi configurada no painel admin.
          </div>
        )}

        <div className="mt-12 card p-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Destino final da tabela</p>
          <p className="mt-2 text-sm text-muted">
            1º ao 6º lugar garantem vaga na Série A do próximo Split. 🔻 7º e 8º lugar são
            rebaixados para a{' '}
            <Link href="/serie-b" className="text-signal hover:underline">Série B</Link>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
