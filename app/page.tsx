import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { MatchRow } from '@/components/MatchRow';
import { TabelaLiga } from '@/components/TabelaLiga';
import { buscarTorneioPorFase, listarTimesPorTorneio, listarPartidasPorTorneio, listarNoticias } from '@/lib/data';
import { calcularTabelaLiga } from '@/lib/standings';

export const revalidate = 60;

function extrairEmbedYoutube(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|live\/|embed\/))([\w-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  // canal/live sem ID de vídeo específico — tenta embed genérico de live do canal
  const canalMatch = url.match(/youtube\.com\/@([\w-]+)/);
  if (canalMatch) return `https://www.youtube.com/embed/live_stream?channel=${canalMatch[1]}`;
  return null;
}

export default async function HomePage() {
  const serieA = await buscarTorneioPorFase('Série A').catch(() => null);

  const [times, partidas, noticias] = await Promise.all([
    serieA ? listarTimesPorTorneio(serieA.id).catch(() => []) : Promise.resolve([]),
    serieA ? listarPartidasPorTorneio(serieA.id).catch(() => []) : Promise.resolve([]),
    listarNoticias().catch(() => []),
  ]);

  const tabela = calcularTabelaLiga(times, partidas, 'serie-a');
  const proximasRodadas = partidas
    .filter((p) => !p.finalizada && p.data)
    .sort((a, b) => new Date(a.data!).getTime() - new Date(b.data!).getTime())
    .slice(0, 4);

  const timesPorId = Object.fromEntries(times.map((t) => [t.id, t]));
  const embedStream = extrairEmbedYoutube(serieA?.streamUrl);

  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO — ETAPA ATIVA */}
        <section className="border-b border-white/10 bg-circuit-trace bg-[length:120px_120px]">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <p className="eyebrow mb-2">Circuit — Liga Independente de Valorant</p>
            <h1 className="font-display text-4xl font-semibold uppercase tracking-tight sm:text-5xl">
              {serieA ? serieA.nome : 'Nenhum Split ativo'}
            </h1>
            {serieA && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="pill text-signal">SÉRIE A — ELITE</span>
                {serieA.premiacao && <span className="pill text-signal">{serieA.premiacao}</span>}
                {serieA.status === 'inscricoes_abertas' && (
                  <Link href={`/torneios/${serieA.slug}/inscricao`} className="btn-primary py-2 text-xs">
                    Inscrever meu time
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-12">
              {/* TABELA DA SÉRIE A */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <p className="eyebrow">Tabela — Série A</p>
                  <Link href="/serie-a" className="font-mono text-[11px] uppercase tracking-wider text-signal hover:underline">
                    Ver completa
                  </Link>
                </div>
                {tabela.length === 0 ? (
                  <div className="card p-8 text-center text-muted">A Série A ainda não foi configurada.</div>
                ) : (
                  <TabelaLiga linhas={tabela} tipo="serie-a" />
                )}
              </section>

              {/* PRÓXIMAS RODADAS */}
              <section>
                <p className="eyebrow mb-4">Próximas rodadas</p>
                {proximasRodadas.length === 0 ? (
                  <p className="text-sm text-muted">Nenhuma partida agendada no momento.</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {proximasRodadas.map((p) => (
                      <MatchRow key={p.id} partida={p} timesPorId={timesPorId} />
                    ))}
                  </div>
                )}
              </section>

              {/* PLAYER DE STREAM */}
              {embedStream && (
                <section>
                  <p className="eyebrow mb-4">Transmissão ao vivo</p>
                  <div className="card aspect-video overflow-hidden">
                    <iframe
                      src={embedStream}
                      title="Transmissão Circuit"
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </section>
              )}
            </div>

            {/* SIDEBAR: NOTÍCIAS */}
            <aside>
              <div className="mb-4 flex items-center justify-between">
                <p className="eyebrow">Notícias</p>
                <Link href="/noticias" className="font-mono text-[11px] uppercase tracking-wider text-signal hover:underline">
                  Ver tudo
                </Link>
              </div>
              <div className="space-y-2">
                {noticias.length === 0 && <p className="text-sm text-muted">Nenhuma notícia publicada.</p>}
                {noticias.slice(0, 4).map((n) => (
                  <Link key={n.id} href={`/noticias/${n.slug}`} className="card block p-3 transition-colors hover:bg-white/5">
                    <p className="line-clamp-2 text-sm font-medium">{n.titulo}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                      {new Date(n.publicadoEm).toLocaleDateString('pt-BR')}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="mt-8 card p-5">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-signal">Série B</p>
                <p className="mt-2 text-sm text-muted">
                  Ao fim do Split, os rebaixados da Série A fundam a Série B, com 6 vagas abertas.
                </p>
                <Link href="/serie-b" className="btn-secondary mt-4 inline-flex text-xs">
                  Saiba mais
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
