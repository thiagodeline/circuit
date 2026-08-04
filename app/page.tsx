import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { MatchRow } from '@/components/MatchRow';
import { StatusBadge } from '@/components/StatusBadge';
import { listarTorneios, listarTimesPorTorneio, listarPartidasPorTorneio, listarNoticias } from '@/lib/data';
import { ordenarPartidasPorData } from '@/lib/ordenar';
import { Torneio } from '@/types';

export const revalidate = 60;

function extrairEmbedYoutube(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|live\/|embed\/))([\w-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  const canalMatch = url.match(/youtube\.com\/@([\w-]+)/);
  if (canalMatch) return `https://www.youtube.com/embed/live_stream?channel=${canalMatch[1]}`;
  return null;
}

export default async function HomePage() {
  const torneios = await listarTorneios().catch(() => []);
  const emFoco: Torneio | undefined =
    torneios.find((t) => t.etapaAtiva) ||
    torneios.find((t) => t.status === 'em_andamento') ||
    torneios.find((t) => t.status === 'inscricoes_abertas');

  const [times, partidas, noticias] = await Promise.all([
    emFoco ? listarTimesPorTorneio(emFoco.id).catch(() => []) : Promise.resolve([]),
    emFoco ? listarPartidasPorTorneio(emFoco.id).catch(() => []) : Promise.resolve([]),
    listarNoticias().catch(() => []),
  ]);

  const timesPorId = Object.fromEntries(times.map((t) => [t.id, t]));
  const proximasPartidas = ordenarPartidasPorData(partidas.filter((p) => !p.finalizada)).slice(0, 4);
  const resultadosRecentes = ordenarPartidasPorData(partidas.filter((p) => p.finalizada)).slice(0, 4);
  const embedStream = extrairEmbedYoutube(emFoco?.streamUrl);

  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO — ETAPA ATIVA */}
        <section className="border-b border-white/10 bg-circuit-trace bg-[length:120px_120px]">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <p className="eyebrow mb-2">Circuit — VCL (Valorant Circuit League)</p>
            {emFoco ? (
              <>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <StatusBadge status={emFoco.status} />
                  {emFoco.faseCircuito && <span className="pill text-signal">{emFoco.faseCircuito} {emFoco.edicao}</span>}
                  {emFoco.vagas && <span className="pill text-muted">{emFoco.vagas} times</span>}
                </div>
                <h1 className="font-display text-4xl font-semibold uppercase tracking-tight sm:text-5xl">
                  {emFoco.nome}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {emFoco.premiacao && <span className="pill text-signal">{emFoco.premiacao}</span>}
                  {emFoco.status === 'inscricoes_abertas' && (
                    <Link href={`/torneios/${emFoco.slug}/inscricao`} className="btn-primary py-2 text-xs">
                      Inscrever meu time
                    </Link>
                  )}
                  <Link href={`/torneios/${emFoco.slug}`} className="btn-secondary py-2 text-xs">
                    Ver torneio
                  </Link>
                </div>
              </>
            ) : (
              <h1 className="font-display text-4xl font-semibold uppercase tracking-tight sm:text-5xl">
                Nenhuma etapa ativa no momento
              </h1>
            )}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-12">
              {/* PRÓXIMOS JOGOS */}
              <section>
                <p className="eyebrow mb-4">Próximos jogos</p>
                {proximasPartidas.length === 0 ? (
                  <p className="text-sm text-muted">Nenhuma partida agendada no momento.</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {proximasPartidas.map((p) => (
                      <MatchRow key={p.id} partida={p} timesPorId={timesPorId} />
                    ))}
                  </div>
                )}
              </section>

              {/* ÚLTIMOS RESULTADOS */}
              <section>
                <p className="eyebrow mb-4">Últimos resultados</p>
                {resultadosRecentes.length === 0 ? (
                  <p className="text-sm text-muted">Nenhum resultado registrado ainda.</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {resultadosRecentes.map((p) => (
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
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-signal">Todos os torneios</p>
                <p className="mt-2 text-sm text-muted">Veja todas as edições do VCL Qualifier e do VCL.</p>
                <Link href="/torneios" className="btn-secondary mt-4 inline-flex text-xs">
                  Ver torneios
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
