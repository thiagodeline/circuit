import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { buscarTimePorId, listarPartidasPorTorneio } from '@/lib/data';
import { ordenarPartidasPorData } from '@/lib/ordenar';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Torneio, Time } from '@/types';

export const revalidate = 30;

export default async function PerfilTimePage({ params }: { params: { id: string } }) {
  const time = await buscarTimePorId(params.id).catch(() => null);
  if (!time) notFound();

  const torneioSnap = await getDoc(doc(db, 'torneios', time.torneioId)).catch(() => null);
  const torneio = torneioSnap && torneioSnap.exists() ? ({ id: torneioSnap.id, ...torneioSnap.data() } as Torneio) : null;

  const partidas = torneio ? await listarPartidasPorTorneio(torneio.id).catch(() => []) : [];

  const partidasDoTime = partidas.filter((p) => p.timeA === time.id || p.timeB === time.id);
  const resultadosFinalizados = ordenarPartidasPorData(partidasDoTime.filter((p) => p.finalizada));

  const vitorias = resultadosFinalizados.filter((p) => {
    const meuPlacar = p.timeA === time.id ? p.placarA : p.placarB;
    const placarAdversario = p.timeA === time.id ? p.placarB : p.placarA;
    return (meuPlacar ?? 0) > (placarAdversario ?? 0);
  }).length;
  const derrotas = resultadosFinalizados.length - vitorias;

  // Busca os times adversários dos resultados recentes para exibir o nome
  const idsAdversarios = Array.from(
    new Set(resultadosFinalizados.map((p) => (p.timeA === time.id ? p.timeB : p.timeA)))
  );
  const adversarios = new Map<string, Time>();
  await Promise.all(
    idsAdversarios.map(async (id) => {
      const snap = await getDoc(doc(db, 'times', id)).catch(() => null);
      if (snap && snap.exists()) adversarios.set(id, { id: snap.id, ...snap.data() } as Time);
    })
  );

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-5">
          {time.logo ? (
            <img src={time.logo} alt={time.nome} className="h-20 w-20 object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center bg-surface2 font-mono text-lg text-muted">
              {time.tag.slice(0, 3)}
            </div>
          )}
          <div>
            <p className="font-mono text-sm text-signal">{time.tag}</p>
            <h1 className="font-display text-3xl font-semibold uppercase tracking-tight">{time.nome}</h1>
            {torneio && (
              <Link href={`/torneios/${torneio.slug}`} className="text-sm text-muted hover:text-signal">
                {torneio.nome} {time.grupo && `· ${time.grupo}`}
              </Link>
            )}
          </div>
        </div>

        {time.bio && <p className="mt-6 max-w-2xl text-muted">{time.bio}</p>}

        {/* STATS */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-xs">
          <div className="card p-4 text-center">
            <p className="font-display text-2xl font-semibold text-live">{vitorias}</p>
            <p className="font-mono text-xs uppercase tracking-wider text-muted">Vitórias</p>
          </div>
          <div className="card p-4 text-center">
            <p className="font-display text-2xl font-semibold text-alert">{derrotas}</p>
            <p className="font-mono text-xs uppercase tracking-wider text-muted">Derrotas</p>
          </div>
        </div>

        {/* ÚLTIMOS RESULTADOS */}
        <section className="mt-14">
          <h2 className="mb-5 font-display text-xl font-semibold uppercase tracking-wide">Últimos resultados</h2>
          {resultadosFinalizados.length === 0 ? (
            <p className="text-muted">Nenhum resultado registrado ainda.</p>
          ) : (
            <div className="space-y-2">
              {resultadosFinalizados.map((p) => {
                const souA = p.timeA === time.id;
                const meuPlacar = souA ? p.placarA : p.placarB;
                const placarAdversario = souA ? p.placarB : p.placarA;
                const venceu = (meuPlacar ?? 0) > (placarAdversario ?? 0);
                const adversarioId = souA ? p.timeB : p.timeA;
                const adversario = adversarios.get(adversarioId);

                return (
                  <div key={p.id} className="card flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <span className={`w-1 self-stretch ${venceu ? 'bg-live' : 'bg-alert'}`} />
                      <div>
                        <p className="font-mono text-xs uppercase tracking-wider text-muted">{p.fase}</p>
                        <p className="font-medium">vs {adversario?.nome ?? 'Time removido'}</p>
                      </div>
                    </div>
                    <span className={`font-mono text-lg font-semibold ${venceu ? 'text-live' : 'text-alert'}`}>
                      {meuPlacar} : {placarAdversario}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
