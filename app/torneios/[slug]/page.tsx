import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { StatusBadge } from '@/components/StatusBadge';
import { MatchRow } from '@/components/MatchRow';
import { TabelaLiga } from '@/components/TabelaLiga';
import { calcularTabelaLiga } from '@/lib/standings';
import { TorneioTabsClient } from '@/components/TorneioTabsClient';
import { buscarTorneioPorSlug, listarTimesPorTorneio, listarPartidasPorTorneio } from '@/lib/data';
import { ordenarPartidasPorData } from '@/lib/ordenar';

export const revalidate = 30;

const TABS = [
  { key: 'visao-geral', label: 'Visão Geral' },
  { key: 'equipes', label: 'Times Inscritos' },
  { key: 'classificacao', label: 'Classificação' },
  { key: 'regulamento', label: 'Regulamento' },
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

  const [times, partidas] = await Promise.all([
    listarTimesPorTorneio(torneio.id).catch(() => []),
    listarPartidasPorTorneio(torneio.id).catch(() => []),
  ]);

  const timesPorId = Object.fromEntries(times.map((t) => [t.id, t]));
  const ehSerieB = torneio.faseCircuito === 'Série B';
  const tabela = calcularTabelaLiga(times, partidas, ehSerieB ? 'serie-b' : 'serie-a');
  const tabInicial = TABS.some((t) => t.key === searchParams.tab) ? searchParams.tab! : 'visao-geral';
  const partidasFinalizadas = ordenarPartidasPorData(partidas.filter((p) => p.finalizada)).slice(0, 6);

  const painelVisaoGeral = (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        <div>
          <h2 className="mb-3 font-display text-xl font-semibold uppercase tracking-wide">Sobre o torneio</h2>
          <p className="whitespace-pre-line text-muted">{torneio.descricao}</p>
        </div>
        {torneio.status === 'inscricoes_abertas' && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-signal/20 bg-signal/5 px-5 py-4">
            <p className="text-sm text-muted">Inscrições abertas para este torneio.</p>
            <Link href={`/torneios/${torneio.slug}/inscricao`} className="btn-primary flex-shrink-0 py-2 text-xs">
              Inscrever meu time
            </Link>
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  const painelClassificacao = (
    <div className="space-y-8">
      {tabela.length === 0 ? (
        <p className="text-muted">Nenhum time inscrito ainda.</p>
      ) : (
        <TabelaLiga linhas={tabela} tipo={ehSerieB ? 'serie-b' : 'serie-a'} />
      )}

      <div>
        <p className="eyebrow mb-4">Partidas (MD2)</p>
        {partidas.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma partida cadastrada ainda.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {ordenarPartidasPorData(partidas).map((p) => (
              <MatchRow key={p.id} partida={p} timesPorId={timesPorId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const painelRegulamento = (
    <div className="max-w-2xl space-y-8">
      {torneio.premiacao && (
        <div>
          <h2 className="mb-3 font-display text-xl font-semibold uppercase tracking-wide">Premiação</h2>
          <p className="text-signal">{torneio.premiacao}</p>
        </div>
      )}
      {torneio.regras && (
        <div>
          <h2 className="mb-3 font-display text-xl font-semibold uppercase tracking-wide">Regras</h2>
          <p className="whitespace-pre-line text-muted">{torneio.regras}</p>
        </div>
      )}
      {torneio.regulamentoUrl && (
        <a
          href={torneio.regulamentoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary inline-flex items-center gap-2 text-xs"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          Baixar regulamento (PDF)
        </a>
      )}
      {!torneio.premiacao && !torneio.regras && !torneio.regulamentoUrl && (
        <p className="text-muted">Regulamento ainda não publicado.</p>
      )}
    </div>
  );

  const panels: Record<string, React.ReactNode> = {
    'visao-geral': painelVisaoGeral,
    equipes: painelEquipes,
    classificacao: painelClassificacao,
    regulamento: painelRegulamento,
  };

  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-white/10">
          <div className="relative overflow-hidden">
            {torneio.capa && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${torneio.capa})` }}
                data-fetchpriority="high"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-base via-base/85 to-base/40" />

            <div className="relative mx-auto max-w-[1400px] px-6 pt-8">
              <nav className="flex items-center gap-2 pb-6 font-mono text-xs uppercase tracking-wider text-muted">
                <Link href="/torneios" className="transition-colors hover:text-ink">Torneios</Link>
                <span>/</span>
                <span className="text-ink">{torneio.nome}</span>
              </nav>

              <div className="flex flex-col gap-8 pb-10 pt-16 sm:pt-24">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <StatusBadge status={torneio.status} />
                    {torneio.faseCircuito && (
                      <span className="pill text-signal">{torneio.faseCircuito} {torneio.edicao}</span>
                    )}
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
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[1400px] px-6 pb-4">
            <TorneioTabsClient slug={torneio.slug} tabs={TABS} initialTab={tabInicial} panels={panels} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
