import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { StatusBadge } from '@/components/StatusBadge';
import { MatchRow } from '@/components/MatchRow';
import { Bracket } from '@/components/Bracket';
import { TorneioTabsClient } from '@/components/TorneioTabsClient';
import { buscarTorneioPorSlug, listarTimesPorTorneio, listarPartidasPorTorneio } from '@/lib/data';
import { calcularClassificacao } from '@/lib/classificacao';
import { ordenarPartidasPorData } from '@/lib/ordenar';

export const revalidate = 30;

function ehFaseDeGrupo(fase: string) {
  return /grupo/i.test(fase);
}

// Extrai o número da rodada do texto da fase (ex: "Grupo A / Rodada 2" -> 2),
// para ordenar todas as partidas da Rodada 1 antes das da Rodada 2, e assim por diante.
function extrairNumeroRodada(fase: string): number {
  const match = fase.match(/rodada\s*(\d+)/i);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function ordenarFasesPorRodada(fasesLista: string[]): string[] {
  return [...fasesLista].sort((a, b) => {
    const diff = extrairNumeroRodada(a) - extrairNumeroRodada(b);
    return diff !== 0 ? diff : a.localeCompare(b);
  });
}

const TABS_GRUPOS_MATA_MATA = [
  { key: 'visao-geral', label: 'Visão Geral' },
  { key: 'grupos', label: 'Grupos' },
  { key: 'chaveamento', label: 'Chaveamento' },
  { key: 'equipes', label: 'Equipes' },
];

const TABS_APENAS_MATA_MATA = [
  { key: 'visao-geral', label: 'Visão Geral' },
  { key: 'chaveamento', label: 'Chaveamento' },
  { key: 'equipes', label: 'Equipes' },
];

export default async function TorneioDetalhePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { tab?: string };
}) {
  const torneio = await buscarTorneioPorSlug(params.slug).catch(() => null);
  if (!torneio) notFound();

  const modo = torneio.modoTorneio || 'grupos_mata_mata';
  const ehApenasMataMata = modo === 'apenas_mata_mata';

  const [times, partidas] = await Promise.all([
    listarTimesPorTorneio(torneio.id).catch(() => []),
    listarPartidasPorTorneio(torneio.id).catch(() => []),
  ]);

  const timesPorId = Object.fromEntries(times.map((t) => [t.id, t]));
  const gruposDeTimes = Array.from(new Set(times.map((t) => t.grupo).filter(Boolean))) as string[];
  const fases = Array.from(new Set(partidas.map((p) => p.fase)));
  const fasesDeGrupo = ehApenasMataMata ? [] : ordenarFasesPorRodada(fases.filter(ehFaseDeGrupo));
  const fasesMataMata = ehApenasMataMata ? fases : fases.filter((f) => !ehFaseDeGrupo(f));

  const tabsDisponiveis = ehApenasMataMata ? TABS_APENAS_MATA_MATA : TABS_GRUPOS_MATA_MATA;
  const tabInicial = tabsDisponiveis.some((t) => t.key === searchParams.tab) ? searchParams.tab! : 'visao-geral';

  const partidasFinalizadas = ordenarPartidasPorData(partidas.filter((p) => p.finalizada)).slice(0, 6);

  // --- Cada painel é montado uma única vez aqui no servidor e passado como
  // conteúdo pronto para o componente client, que só alterna a visibilidade via
  // CSS — nenhuma dessas árvores é desmontada/refeita ao trocar de aba.

  const painelVisaoGeral = (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        <div>
          <h2 className="mb-3 font-display text-xl font-semibold uppercase tracking-wide">Sobre o torneio</h2>
          <p className="whitespace-pre-line text-muted">{torneio.descricao}</p>
        </div>
        {torneio.regras && (
          <div>
            <h2 className="mb-3 font-display text-xl font-semibold uppercase tracking-wide">Regulamento rápido</h2>
            <p className="whitespace-pre-line text-muted">{torneio.regras}</p>
          </div>
        )}
      </div>
      <div>
        <p className="eyebrow mb-4">Últimos resultados</p>
        {partidasFinalizadas.length === 0 ? (
          <p className="text-sm text-muted">Nenhum resultado registrado ainda.</p>
        ) : (
          <div className="space-y-2">
            {partidasFinalizadas.map((p) => (
              <MatchRow key={p.id} partida={p} timesPorId={timesPorId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const painelGrupos = ehApenasMataMata ? null : (
    <div className="space-y-12">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {gruposDeTimes.length === 0 && <p className="text-muted">Sem grupos definidos ainda.</p>}
        {gruposDeTimes.map((grupo) => {
          const timesDoGrupo = times.filter((t) => t.grupo === grupo);
          const partidasDoGrupo = partidas.filter(
            (p) => timesDoGrupo.some((t) => t.id === p.timeA) && timesDoGrupo.some((t) => t.id === p.timeB)
          );
          const classificacao = calcularClassificacao(timesDoGrupo, partidasDoGrupo);

          return (
            <div key={grupo} className="card overflow-hidden">
              <div className="border-b border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider">{grupo}</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted">
                    <th className="px-3 py-2 font-normal">Time</th>
                    <th className="px-1 py-2 text-center font-normal">V</th>
                    <th className="px-1 py-2 text-center font-normal">D</th>
                    <th className="px-1 py-2 text-center font-normal">MV</th>
                    <th className="px-1 py-2 text-center font-normal">MD</th>
                    <th className="px-1 py-2 text-center font-normal">Saldo</th>
                    <th className="px-2 py-2 text-center font-normal">P</th>
                  </tr>
                </thead>
                <tbody>
                  {classificacao.map((linha, i) => (
                    <tr
                      key={linha.time.id}
                      className={`transition-colors hover:bg-white/5 ${i < 2 ? 'bg-signal/10' : ''}`}
                    >
                      <td className="max-w-[120px] truncate px-3 py-2 font-medium">
                        <Link href={`/times/${linha.time.id}`} className="flex items-center gap-2 hover:text-signal">
                          {linha.time.logo ? (
                            <img
                              src={linha.time.logo}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className="h-5 w-5 flex-shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/5 font-mono text-[9px] text-muted">
                              {linha.time.tag.slice(0, 2)}
                            </div>
                          )}
                          <span className="truncate">{linha.time.tag}</span>
                        </Link>
                      </td>
                      <td className="px-1 py-2 text-center font-mono text-live">{linha.vitorias}</td>
                      <td className="px-1 py-2 text-center font-mono text-alert">{linha.derrotas}</td>
                      <td className="px-1 py-2 text-center font-mono text-muted">{linha.mapasVencidos}</td>
                      <td className="px-1 py-2 text-center font-mono text-muted">{linha.mapasPerdidos}</td>
                      <td className="px-1 py-2 text-center font-mono text-muted">
                        {linha.saldo > 0 ? `+${linha.saldo}` : linha.saldo}
                      </td>
                      <td className="px-2 py-2 text-center font-mono font-semibold text-signal">{linha.pontos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {fasesDeGrupo.length > 0 && (
        <div className="space-y-8">
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide">Partidas da fase de grupos</h2>
          {fasesDeGrupo.map((fase) => (
            <div key={fase}>
              <p className="eyebrow mb-3">{fase}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {ordenarPartidasPorData(partidas.filter((p) => p.fase === fase)).map((p) => (
                  <MatchRow key={p.id} partida={p} timesPorId={timesPorId} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const painelChaveamento = (
    <div>
      {fasesMataMata.length === 0 ? (
        <p className="text-muted">A chave do mata-mata ainda não foi definida.</p>
      ) : (
        <Bracket fases={fasesMataMata} partidas={partidas} timesPorId={timesPorId} />
      )}
    </div>
  );

  const painelEquipes = (
    <div>
      {times.length === 0 ? (
        <p className="text-muted">Nenhum time inscrito ainda.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {times.map((t) => (
            <Link
              key={t.id}
              href={`/times/${t.id}`}
              className="card group flex items-center gap-3 p-4 transition-colors hover:border-signal/50 hover:-translate-y-0.5 transition-transform duration-200 ease-in-out will-change-transform"
            >
              {t.logo ? (
                <img
                  src={t.logo}
                  alt={t.nome}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-12 flex-shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 font-mono text-xs text-muted">
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
    </div>
  );

  const panels: Record<string, React.ReactNode> = {
    'visao-geral': painelVisaoGeral,
    ...(painelGrupos ? { grupos: painelGrupos } : {}),
    chaveamento: painelChaveamento,
    equipes: painelEquipes,
  };

  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO IMERSIVO */}
        <section className="border-b border-white/10">
          {/* Wrapper do banner — a imagem e o overlay ficam contidos aqui, cobrindo só
              a área do breadcrumb + título (como um hero), sem vazar para trás das abas */}
          <div className="relative overflow-hidden">
            {torneio.capa && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${torneio.capa})` }}
                // fetchPriority ajuda o navegador a priorizar essa imagem de fundo,
                // já que ela está sempre acima da dobra (visível assim que a página carrega)
                data-fetchpriority="high"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-base via-base/85 to-base/40" />

            <div className="relative mx-auto max-w-[1400px] px-6 pt-8">
              {/* BREADCRUMB + REGULAMENTO */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
                <nav className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
                  <Link href="/" className="transition-colors hover:text-ink">Torneios</Link>
                  <span>/</span>
                  <span className="text-ink">{torneio.nome}</span>
                </nav>
                {torneio.regulamentoUrl && (
                  <a
                    href={torneio.regulamentoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2 py-2 text-xs"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                    </svg>
                    Regulamento
                  </a>
                )}
              </div>

              {/* BLOCO PRINCIPAL — o banner (torneio.capa) fica como fundo só desta área,
                  atrás do título, ao invés de aparecer como miniatura ao lado */}
              <div className="flex flex-col gap-8 pb-10 pt-16 sm:pt-24">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <StatusBadge status={torneio.status} />
                    {torneio.dataInicio && (
                      <span className="pill text-muted">
                        {new Date(torneio.dataInicio).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: '2-digit',
                          month: '2-digit',
                        })}
                        {torneio.dataInicio.includes('T') &&
                          ` às ${new Date(torneio.dataInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                      </span>
                    )}
                  </div>

                  <h1 className="font-display text-4xl font-semibold uppercase tracking-tight sm:text-5xl">
                    {torneio.nome}
                  </h1>

                  {torneio.status === 'inscricoes_abertas' && (
                    <Link href={`/torneios/${torneio.slug}/inscricao`} className="btn-primary mt-5 inline-flex">
                      Inscrever meu time
                    </Link>
                  )}

                  {/* INFOS COMPLEMENTARES COM ÍCONES */}
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted">
                    {torneio.streamUrl && (
                      <a
                        href={torneio.streamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 transition-colors hover:text-signal"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.6 5.7H10v4.4h1.6zm4.4 0h-1.6v4.4H16zM6 0 1.6 4.4v15.2h5.2V24l4.4-4.4h3.5L22.4 12V0zm14.7 11.1-3.5 3.5h-3.5l-3.1 3.1v-3.1H7.1V1.7h13.6z"/></svg>
                        Assistir stream
                      </a>
                    )}
                    {torneio.local && (
                      <span className="flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        {torneio.local}
                      </span>
                    )}
                    {torneio.premiacao && (
                      <span className="flex items-center gap-1.5 text-signal">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 21h8m-4-4v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4a2 2 0 0 0 2 4M17 6h3a2 2 0 0 1-2 4"/></svg>
                        {torneio.premiacao}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11.5 11 13.5 15 9"/><circle cx="12" cy="12" r="9"/></svg>
                      Vitória = 3 pts
                    </span>
                    {torneio.valorInscricao ? (
                      <span className="flex items-center gap-1.5">
                        Inscrição: R$ {torneio.valorInscricao.toFixed(2)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ABAS — fora do wrapper do banner, com fundo normal da página (sem imagem atrás).
              Troca client-side, sem recarregar a página nem refazer fetch. */}
          <div className="mx-auto max-w-[1400px] px-6 pb-4">
            <TorneioTabsClient
              slug={torneio.slug}
              tabs={tabsDisponiveis}
              initialTab={tabInicial}
              panels={panels}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
