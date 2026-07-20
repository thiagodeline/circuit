import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { buscarTimePorId, listarPartidasPorTorneio } from '@/lib/data';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Torneio } from '@/types';

export const revalidate = 30;

export default async function PerfilTimePage({ params }: { params: { id: string } }) {
  const time = await buscarTimePorId(params.id).catch(() => null);
  if (!time) notFound();

  const torneioSnap = await getDoc(doc(db, 'torneios', time.torneioId)).catch(() => null);
  const torneio = torneioSnap && torneioSnap.exists() ? ({ id: torneioSnap.id, ...torneioSnap.data() } as Torneio) : null;

  const partidas = torneio ? await listarPartidasPorTorneio(torneio.id).catch(() => []) : [];
  const partidasDoTime = partidas.filter((p) => p.timeA === time.id || p.timeB === time.id);

  const vitorias = partidasDoTime.filter((p) => {
    if (!p.finalizada) return false;
    const meuPlacar = p.timeA === time.id ? p.placarA : p.placarB;
    const placarAdversario = p.timeA === time.id ? p.placarB : p.placarA;
    return (meuPlacar ?? 0) > (placarAdversario ?? 0);
  }).length;
  const derrotas = partidasDoTime.filter((p) => p.finalizada).length - vitorias;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-5">
          {time.logo ? (
            <img src={time.logo} alt={time.nome} className="h-20 w-20 rounded-xl object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-surface2 font-mono text-lg text-muted">
              {time.tag.slice(0, 3)}
            </div>
          )}
          <div>
            <p className="font-mono text-sm text-signal">{time.tag}</p>
            <h1 className="font-display text-3xl font-semibold">{time.nome}</h1>
            {torneio && (
              <Link href={`/torneios/${torneio.slug}`} className="text-sm text-muted hover:text-signal">
                {torneio.nome} {time.grupo && `· ${time.grupo}`}
              </Link>
            )}
          </div>
        </div>

        {time.bio && <p className="mt-6 max-w-2xl text-muted">{time.bio}</p>}

        {/* STATS */}
        <div className="mt-8 grid grid-cols-3 gap-4 sm:max-w-md">
          <div className="card p-4 text-center">
            <p className="font-display text-2xl font-semibold text-live">{vitorias}</p>
            <p className="text-xs text-muted">Vitórias</p>
          </div>
          <div className="card p-4 text-center">
            <p className="font-display text-2xl font-semibold text-alert">{derrotas}</p>
            <p className="text-xs text-muted">Derrotas</p>
          </div>
          <div className="card p-4 text-center">
            <p className="font-display text-2xl font-semibold">{time.jogadores.length}</p>
            <p className="text-xs text-muted">Jogadores</p>
          </div>
        </div>

        {/* ELENCO */}
        <section className="mt-14">
          <h2 className="mb-5 font-display text-xl font-semibold">Elenco</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="card flex items-center justify-between p-4">
              <span className="font-medium">{time.capitao}</span>
              <span className="font-mono text-xs text-signal">Capitão</span>
            </div>
            {time.jogadores
              .filter((j) => j !== time.capitao)
              .map((j) => (
                <div key={j} className="card p-4">
                  <span className="font-medium">{j}</span>
                </div>
              ))}
          </div>
        </section>

        {/* HISTÓRICO DE PARTIDAS */}
        {partidasDoTime.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-5 font-display text-xl font-semibold">Partidas</h2>
            <div className="space-y-2">
              {partidasDoTime.map((p) => {
                const souA = p.timeA === time.id;
                const meuPlacar = souA ? p.placarA : p.placarB;
                const placarAdversario = souA ? p.placarB : p.placarA;
                const venceu = p.finalizada && (meuPlacar ?? 0) > (placarAdversario ?? 0);
                return (
                  <div key={p.id} className="card flex items-center justify-between p-4">
                    <span className="font-mono text-xs text-muted">{p.fase}</span>
                    <span className={`font-mono ${p.finalizada ? (venceu ? 'text-live' : 'text-alert') : 'text-muted'}`}>
                      {p.finalizada ? `${meuPlacar} : ${placarAdversario}` : 'a definir'}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
