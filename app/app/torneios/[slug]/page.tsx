import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { StatusBadge } from '@/components/StatusBadge';
import { buscarTorneioPorSlug, listarTimesPorTorneio, listarPartidasPorTorneio } from '@/lib/data';
import { calcularClassificacao } from '@/lib/classificacao';
import { Partida, Time } from '@/types';

export const revalidate = 30;

function ehFaseDeGrupo(fase: string) {
  return /grupo/i.test(fase);
}

const rotuloFormato: Record<string, string> = {
  grupos_playoffs: 'Fase de grupos + playoffs',
  mata_mata: 'Mata-mata',
  todos_contra_todos: 'Todos contra todos',
  outro: 'Formato personalizado',
};

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
  const tipoFormato = torneio.formatoTipo || 'grupos_playoffs';

  // Mata-mata: sem tabela de classificação, todas as fases são chaves
  // Todos contra todos: uma única tabela combinada, sem separar por grupo
  // Grupos + playoffs / outro: mantém a separação por nome de fase ("Grupo X" vs. resto)
  const mostrarClassificacao = tipoFormato !== 'mata_mata';
  const classificacaoUnica = tipoFormato === 'todos_contra_todos';

  const fasesDeGrupo = tipoFormato === 'mata_mata' ? [] : fases.filter(ehFaseDeGrupo);
  const fasesMataMata = tipoFormato === 'mata_mata' ? fases : fases.filter((f) => !ehFaseDeGrupo(f));

  return (
    <>
      <SiteHeader />
      <main>
        <section
          className="relative border-b border-line bg-cover bg-center"
          style={torneio.capa ? { backgroundImage: `url(${torneio.capa})` } : undefined}
        >
          <div className="bg-gradient-to-t from-base via-base/90 to-base/40">
            <div className="mx-auto max-w-6xl px-6 py-20">
              <div className="mb-4 flex items-center gap-3">
                <StatusBadge status={torneio.status} />
                <span className="font-mono text-xs text-muted">
                  {rotuloFormato[torneio.formatoTipo || 'grupos_playoffs']} · {torneio.formato}
                </span>
              </div>
              <h1 className="font-display text-5xl font-semibold tracking-tight">{torneio.nome}</h1>
              <p className="mt-4 max-w-2xl text-lg text-muted">{torneio.descricao}</p>

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
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">Times</p>
                  <p className="mt-1 text-ink">{times.length}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-16">
          {mostrarClassificacao && (gruposDeTimes.length > 0 || classificacaoUnica) && (
            <section className="mb-16">
              <h2 className="mb-6 font-display text-2xl font-semibold">Classificação</h2>
              <div className={classificacaoUnica ? '' : 'grid gap-8 md:grid-cols-2'}>
                {(classificacaoUnica ? ['__todos__'] : gruposDeTimes).map((grupo) => {
                  const timesDoGrupo = classificacaoUnica ? times : times.filter((t) => t.grupo === grupo);
                  const partidasDoGrupo = classificacaoUnica
                    ? partidas
                    : partidas.filter(
                        (p) => timesDoGrupo.some((t) => t.id === p.timeA) && timesDoGrupo.some((t) => t.id === p.timeB)
                      );
                  const classificacao = calcularClassificacao(timesDoGrupo, partidasDoGrupo);

                  return (
                    <div key={grupo} className="card overflow-hidden">
                      <div className="border-b border-line bg-surface2 px-4 py-3">
                        <p className="eyebrow">{classificacaoUnica ? 'Tabela geral' : grupo}</p>
                      </div>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-muted">
                            <th className="px-4 py-2 font-normal">Time</th>
                            <th className="px-2 py-2 text-center font-normal">V</th>
                            <th className="px-2 py-2 text-center font-normal">D</th>
                            <th className="px-2 py-2 text-center font-normal">Mapas V</th>
                            <th className="px-2 py-2 text-center font-normal">Mapas D</th>
                            <th className="px-2 py-2 text-center font-normal">Saldo</th>
                            <th className="px-2 py-2 text-center font-normal">Pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {classificacao.map((linha, i) => (
                            <tr key={linha.time.id} className={i < 2 ? 'bg-signal/5' : ''}>
                              <td className="px-4 py-2.5">
                                <Link href={`/times/${linha.time.id}`} className="flex items-center gap-2 hover:text-signal">
                                  <span className="w-4 font-mono text-xs text-muted">{i + 1}</span>
                                  {linha.time.logo ? (
                                    <img src={linha.time.logo} alt="" className="h-5 w-5 rounded object-cover" />
                                  ) : null}
                                  <span className="truncate font-medium">{linha.time.nome}</span>
                                </Link>
                              </td>
                              <td className="px-2 py-2.5 text-center font-mono text-live">{linha.vitorias}</td>
                              <td className="px-2 py-2.5 text-center font-mono text-alert">{linha.derrotas}</td>
                              <td className="px-2 py-2.5 text-center font-mono text-muted">{linha.mapasVencidos}</td>
                              <td className="px-2 py-2.5 text-center font-mono text-muted">{linha.mapasPerdidos}</td>
                              <td className="px-2 py-2.5 text-center font-mono text-muted">
                                {linha.saldo > 0 ? `+${linha.saldo}` : linha.saldo}
                              </td>
                              <td className="px-2 py-2.5 text-center font-mono font-semibold text-signal">{linha.pontos}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {!classificacaoUnica && (
                        <p className="border-t border-line px-4 py-2 text-xs text-muted">Os 2 primeiros avançam</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {fasesDeGrupo.length > 0 && (
            <section className="mb-16">
              <h2 className="mb-6 font-display text-2xl font-semibold">
                {classificacaoUnica ? 'Partidas' : 'Partidas — Fase de grupos'}
              </h2>
              <div className="space-y-8">
                {fasesDeGrupo.map((fase) => (
                  <div key={fase}>
                    <p className="eyebrow mb-3">{fase}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {partidas.filter((p) => p.fase === fase).map((p) => (
                        <PartidaCard key={p.id} partida={p} timesPorId={timesPorId} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {fasesMataMata.length > 0 && (
            <section className="mb-16">
              <h2 className="mb-6 font-display text-2xl font-semibold">Playoffs</h2>
              <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
                {fasesMataMata.map((fase) => (
                  <div key={fase} className="flex-1">
                    <p className="eyebrow mb-3">{fase}</p>
                    <div className="space-y-3">
                      {partidas.filter((p) => p.fase === fase).map((p) => (
                        <PartidaCard key={p.id} partida={p} timesPorId={timesPorId} destaque />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {fases.length === 0 && <p className="text-muted">As partidas ainda não foram definidas.</p>}

          <section>
            <h2 className="mb-6 font-display text-2xl font-semibold">Times inscritos</h2>
            {times.length === 0 ? (
              <p className="text-muted">Nenhum time inscrito ainda.</p>
            ) : (
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
                      <p className="font-mono text-xs text-signal">{t.tag}</p>
                      {t.grupo && <p className="mt-0.5 text-xs text-muted">{t.grupo}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function PartidaCard({
  partida,
  timesPorId,
  destaque,
}: {
  partida: Partida;
  timesPorId: Record<string, Time>;
  destaque?: boolean;
}) {
  const a = timesPorId[partida.timeA];
  const b = timesPorId[partida.timeB];
  const aVenceu = partida.finalizada && (partida.placarA ?? 0) > (partida.placarB ?? 0);
  const bVenceu = partida.finalizada && (partida.placarB ?? 0) > (partida.placarA ?? 0);

  return (
    <div className={`card p-4 ${destaque ? 'border-line' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`w-2/5 truncate font-medium ${aVenceu ? 'text-ink' : 'text-muted'}`}>{a?.nome ?? '—'}</span>
        <span className={`font-mono ${partida.finalizada ? 'text-signal' : 'text-muted'}`}>
          {partida.finalizada ? `${partida.placarA} : ${partida.placarB}` : 'vs'}
        </span>
        <span className={`w-2/5 truncate text-right font-medium ${bVenceu ? 'text-ink' : 'text-muted'}`}>{b?.nome ?? '—'}</span>
      </div>
    </div>
  );
}
