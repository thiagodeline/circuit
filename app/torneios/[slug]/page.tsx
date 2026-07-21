import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { StatusBadge } from '@/components/StatusBadge';
import { MatchRow } from '@/components/MatchRow';
import { Bracket } from '@/components/Bracket';
import { buscarTorneioPorSlug, listarTimesPorTorneio, listarPartidasPorTorneio } from '@/lib/data';
import { calcularClassificacao } from '@/lib/classificacao';

export const revalidate = 30;

function ehFaseDeGrupo(fase: string) {
  return /grupo/i.test(fase);
}

export default async function TorneioDetalhePage({ params }: { params: { slug: string } }) {
  const torneio = await buscarTorneioPorSlug(params.slug).catch(() => null);
  if (!torneio) notFound();

  const [times, partidas] = await Promise.all([
    listarTimesPorTorneio(torneio.id).catch(() => []),
    listarPartidasPorTorneio(torneio.id).catch(() => []),
  ]);

  const timesPorId = Object.fromEntries(times.map((t) => [t.id, t]));
  const gruposDeTimes = Array.from(new Set(times.map((t) => t.grupo).filter(Boolean))) as string[];
  const fases = Array.from(new Set(partidas.map((p) => p.fase)));
  const fasesDeGrupo = fases.filter(ehFaseDeGrupo);
  const fasesMataMata = fases.filter((f) => !ehFaseDeGrupo(f));

  // Ordem de navegação lateral: grupos primeiro, depois fases de playoff, depois times
  const itensNav = [
    ...fasesDeGrupo.map((f) => ({ id: `fase-${f}`, label: f })),
    ...(fasesMataMata.length > 0 ? [{ id: 'playoffs', label: 'Playoffs' }] : []),
    { id: 'times', label: 'Times' },
  ];

  return (
    <>
      <SiteHeader />
      <main>
        {/* CAPA / CABEÇALHO DO TORNEIO */}
        <section
          className="relative border-b border-line bg-cover bg-center"
          style={torneio.capa ? { backgroundImage: `url(${torneio.capa})` } : undefined}
        >
          <div className="bg-gradient-to-t from-base via-base/92 to-base/50">
            <div className="mx-auto max-w-[1400px] px-6 py-14">
              <div className="mb-4 flex items-center gap-3">
                <StatusBadge status={torneio.status} />
                <span className="font-mono text-xs text-muted">{torneio.formato}</span>
              </div>
              <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{torneio.nome}</h1>
              <p className="mt-3 max-w-2xl text-muted">{torneio.descricao}</p>

              {torneio.status === 'inscricoes_abertas' && (
                <Link href={`/torneios/${torneio.slug}/inscricao`} className="btn-primary mt-6 inline-flex">
                  Inscrever meu time
                </Link>
              )}

              <div className="mt-8 flex flex-wrap gap-8 font-mono text-sm">
                {torneio.dataInicio && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">Início</p>
                    <p className="mt-1 text-ink">{new Date(torneio.dataInicio).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
                {torneio.dataFim && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">Término</p>
                    <p className="mt-1 text-ink">{new Date(torneio.dataFim).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
                {torneio.local && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">Local</p>
                    <p className="mt-1 text-ink">{torneio.local}</p>
                  </div>
                )}
                {torneio.premiacao && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">Premiação</p>
                    <p className="mt-1 text-signal">{torneio.premiacao}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* LAYOUT 3 COLUNAS */}
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr_300px]">
            {/* NAV LATERAL ESQUERDA */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-1">
                <p className="eyebrow mb-3">Neste torneio</p>
                {itensNav.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block border-l-2 border-transparent py-1.5 pl-3 text-sm text-muted transition hover:border-signal hover:text-ink"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </aside>

            {/* CONTEÚDO CENTRAL: PARTIDAS */}
            <div className="min-w-0 space-y-12">
              {fases.length === 0 && (
                <p className="text-muted">As partidas ainda não foram definidas.</p>
              )}

              {fasesDeGrupo.map((fase) => (
                <section key={fase} id={`fase-${fase}`} className="scroll-mt-24">
                  <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide">{fase}</h2>
                  <div className="space-y-2">
                    {partidas.filter((p) => p.fase === fase).map((p) => (
                      <MatchRow key={p.id} partida={p} timesPorId={timesPorId} />
                    ))}
                  </div>
                </section>
              ))}

              {fasesMataMata.length > 0 && (
                <section id="playoffs" className="scroll-mt-24">
                  <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide">Playoffs</h2>
                  <Bracket fases={fasesMataMata} partidas={partidas} timesPorId={timesPorId} />
                </section>
              )}

              {/* TIMES */}
              <section id="times" className="scroll-mt-24">
                <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide">Times inscritos</h2>
                {times.length === 0 ? (
                  <p className="text-muted">Nenhum time inscrito ainda.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {times.map((t) => (
                      <Link key={t.id} href={`/times/${t.id}`} className="card group flex items-center gap-3 p-4 transition hover:border-signal/50">
                        {t.logo ? (
                          <img src={t.logo} alt={t.nome} className="h-10 w-10 flex-shrink-0 object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-surface2 font-mono text-xs text-muted">
                            {t.tag.slice(0, 3)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-display font-semibold group-hover:text-signal">{t.nome}</p>
                          <p className="font-mono text-xs text-signal">{t.tag}</p>
                          {t.grupo && <p className="mt-0.5 text-xs text-muted">{t.grupo}</p>}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* SIDEBAR DIREITA: CLASSIFICAÇÃO */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
              <p className="eyebrow">Classificação</p>
              {gruposDeTimes.length === 0 && <p className="text-sm text-muted">Sem grupos definidos ainda.</p>}
              {gruposDeTimes.map((grupo) => {
                const timesDoGrupo = times.filter((t) => t.grupo === grupo);
                const partidasDoGrupo = partidas.filter(
                  (p) => timesDoGrupo.some((t) => t.id === p.timeA) && timesDoGrupo.some((t) => t.id === p.timeB)
                );
                const classificacao = calcularClassificacao(timesDoGrupo, partidasDoGrupo);

                return (
                  <div key={grupo} className="card overflow-hidden">
                    <div className="border-b border-line bg-surface2 px-3 py-2">
                      <p className="font-mono text-xs font-medium uppercase tracking-wider">{grupo}</p>
                    </div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left text-muted">
                          <th className="px-3 py-1.5 font-normal">Time</th>
                          <th className="px-1 py-1.5 text-center font-normal">V</th>
                          <th className="px-1 py-1.5 text-center font-normal">D</th>
                          <th className="px-1 py-1.5 text-center font-normal">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classificacao.map((linha, i) => (
                          <tr key={linha.time.id} className={i < 2 ? 'bg-signal/5' : ''}>
                            <td className="max-w-[110px] truncate px-3 py-1.5 font-medium">
                              <Link href={`/times/${linha.time.id}`} className="hover:text-signal">
                                {linha.time.tag}
                              </Link>
                            </td>
                            <td className="px-1 py-1.5 text-center font-mono text-live">{linha.vitorias}</td>
                            <td className="px-1 py-1.5 text-center font-mono text-alert">{linha.derrotas}</td>
                            <td className="px-1 py-1.5 text-center font-mono font-semibold text-signal">{linha.pontos}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
