import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { MatchRow } from '@/components/MatchRow';
import {
  listarTorneios,
  listarPartidasPorTorneio,
  listarTimesPorTorneio,
  listarPontosCircuito,
  listarTodosOsTimes,
  listarNoticias,
} from '@/lib/data';
import { calcularRankingCircuito } from '@/lib/circuitPoints';
import { ordenarPartidasPorData } from '@/lib/ordenar';
import { FASES_CIRCUITO, Torneio } from '@/types';

export const revalidate = 60;

function formatarPeriodo(t?: Torneio) {
  if (!t?.dataInicio) return null;
  const inicio = new Date(t.dataInicio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const fim = t.dataFim ? new Date(t.dataFim).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : null;
  return fim ? `${inicio} - ${fim}` : inicio;
}

export default async function HomePage() {
  let torneios: Torneio[] = [];
  try {
    torneios = await listarTorneios();
  } catch (err) {
    console.error('Erro ao buscar torneios na home:', err);
  }

  const [lancamentos, times, noticias] = await Promise.all([
    listarPontosCircuito().catch(() => []),
    listarTodosOsTimes().catch(() => []),
    listarNoticias().catch(() => []),
  ]);

  // --- SIDEBAR ESQUERDA: uma linha por etapa da cadeia oficial, sempre nesta ordem ---
  const etapaAtiva = torneios.find((t) => t.etapaAtiva);
  const timeline = FASES_CIRCUITO.map((fase) => {
    const torneiosDaFase = torneios.filter((t) => t.faseCircuito === fase);
    // Representante da fase: prioriza a etapa marcada como ativa, senão o em andamento,
    // senão o próximo a acontecer, senão o mais recente já finalizado.
    const representante =
      torneiosDaFase.find((t) => t.etapaAtiva) ||
      torneiosDaFase.find((t) => t.status === 'em_andamento') ||
      torneiosDaFase.find((t) => t.status === 'inscricoes_abertas' || t.status === 'em_breve') ||
      torneiosDaFase.find((t) => t.status === 'finalizado');

    const ehAtual = Boolean(representante?.etapaAtiva);
    const concluida = torneiosDaFase.length > 0 && torneiosDaFase.every((t) => t.status === 'finalizado');

    return { fase, representante, ehAtual, concluida };
  });

  // --- ÁREA CENTRAL: partidas da etapa ativa (ou, se não houver, do primeiro torneio em andamento) ---
  const torneioEmFoco = etapaAtiva || torneios.find((t) => t.status === 'em_andamento');
  const partidasEmFoco = torneioEmFoco
    ? ordenarPartidasPorData(await listarPartidasPorTorneio(torneioEmFoco.id).catch(() => [])).slice(0, 8)
    : [];
  const timesEmFoco = torneioEmFoco
    ? Object.fromEntries((await listarTimesPorTorneio(torneioEmFoco.id).catch(() => [])).map((t) => [t.id, t]))
    : {};

  // --- SIDEBAR DIREITA: top 3 do ranking + últimas notícias ---
  const rankingTop3 = calcularRankingCircuito(times, lancamentos).slice(0, 3);
  const ultimasNoticias = noticias.slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr_300px]">
          {/* SIDEBAR ESQUERDA — LINHA DO TEMPO DAS ETAPAS */}
          <aside>
            <p className="eyebrow mb-4">Temporada</p>
            <div className="space-y-2">
              {timeline.map(({ fase, representante, ehAtual, concluida }) => {
                const periodo = formatarPeriodo(representante);
                const conteudo = (
                  <div
                    className={`card p-4 transition-colors ${
                      ehAtual
                        ? 'border-signal/60 bg-signal/10 shadow-[0_0_24px_-4px_rgba(255,106,26,0.35)]'
                        : representante
                        ? 'hover:border-white/20'
                        : 'opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-display text-sm font-semibold uppercase tracking-wide ${ehAtual ? 'text-signal' : ''}`}>
                        {fase}
                      </p>
                      {concluida && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="flex-shrink-0 text-live">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                      )}
                      {ehAtual && <span className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-signal" />}
                    </div>
                    {periodo && <p className="mt-1 font-mono text-xs text-muted">{periodo}</p>}
                  </div>
                );
                return representante ? (
                  <Link key={fase} href={`/torneios/${representante.slug}`}>
                    {conteudo}
                  </Link>
                ) : (
                  <div key={fase}>{conteudo}</div>
                );
              })}
            </div>
          </aside>

          {/* ÁREA CENTRAL — PARTIDAS DA ETAPA EM FOCO */}
          <div className="min-w-0">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="eyebrow mb-1">
                  {torneioEmFoco ? torneioEmFoco.faseCircuito || 'Partidas' : 'Partidas'}
                </p>
                <h1 className="font-display text-2xl font-semibold uppercase tracking-tight">
                  {torneioEmFoco ? torneioEmFoco.nome : 'Nenhuma etapa ativa'}
                </h1>
              </div>
              {torneioEmFoco && (
                <Link href={`/torneios/${torneioEmFoco.slug}`} className="btn-secondary text-xs">
                  Ver torneio
                </Link>
              )}
            </div>

            {partidasEmFoco.length === 0 ? (
              <div className="card p-10 text-center text-muted">
                {torneioEmFoco
                  ? 'Nenhuma partida cadastrada para esta etapa ainda.'
                  : 'Marque uma etapa como "atual" no painel admin para exibi-la aqui.'}
              </div>
            ) : (
              <div className="space-y-2">
                {partidasEmFoco.map((p) => (
                  <MatchRow key={p.id} partida={p} timesPorId={timesEmFoco} />
                ))}
              </div>
            )}
          </div>

          {/* SIDEBAR DIREITA — RANKING RÁPIDO + ÚLTIMAS NOTÍCIAS */}
          <aside className="space-y-8">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="eyebrow">Ranking</p>
                <Link href="/ranking" className="font-mono text-[11px] uppercase tracking-wider text-signal hover:underline">
                  Ver tudo
                </Link>
              </div>
              <div className="space-y-2">
                {rankingTop3.length === 0 && <p className="text-sm text-muted">Nenhum time pontuou ainda.</p>}
                {rankingTop3.map((linha, i) => (
                  <Link key={linha.time.id} href={`/times/${linha.time.id}`} className="card flex items-center gap-3 p-3 transition-colors hover:bg-white/5">
                    <span className="w-5 flex-shrink-0 text-center font-display text-lg font-semibold text-signal">{i + 1}</span>
                    {linha.time.logo ? (
                      <img src={linha.time.logo} alt="" loading="lazy" decoding="async" className="h-8 w-8 flex-shrink-0 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 font-mono text-[9px] text-muted">
                        {linha.time.tag.slice(0, 2)}
                      </div>
                    )}
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{linha.time.nome}</span>
                    <span className="flex-shrink-0 font-mono text-xs text-signal">{linha.total} pts</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="eyebrow">Notícias</p>
                <Link href="/noticias" className="font-mono text-[11px] uppercase tracking-wider text-signal hover:underline">
                  Ver tudo
                </Link>
              </div>
              <div className="space-y-2">
                {ultimasNoticias.length === 0 && <p className="text-sm text-muted">Nenhuma notícia publicada.</p>}
                {ultimasNoticias.map((n) => (
                  <Link key={n.id} href={`/noticias/${n.slug}`} className="card block p-3 transition-colors hover:bg-white/5">
                    <p className="line-clamp-2 text-sm font-medium">{n.titulo}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                      {new Date(n.publicadoEm).toLocaleDateString('pt-BR')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
