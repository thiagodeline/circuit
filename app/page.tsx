import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { StatusBadge } from '@/components/StatusBadge';
import { listarTorneios } from '@/lib/data';
import { Torneio } from '@/types';

export const revalidate = 60;

function TorneioCard({ t, destaque = false }: { t: Torneio; destaque?: boolean }) {
  return (
    <Link
      href={`/torneios/${t.slug}`}
      className={`card group overflow-hidden transition hover:border-signal/50 ${destaque ? 'md:col-span-2' : ''}`}
    >
      <div className={`w-full bg-surface2 ${destaque ? 'aspect-[21/8]' : 'aspect-[21/9]'}`}>
        {t.capa && <img src={t.capa} alt={t.nome} className="h-full w-full object-cover" />}
      </div>
      <div className="p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={t.status} />
          <span className="border border-line px-2.5 py-1 font-mono text-xs text-muted">
            Grupos + Playoffs
          </span>
        </div>
        <h3 className={`font-display font-semibold uppercase tracking-wide group-hover:text-signal ${destaque ? 'text-2xl' : 'text-xl'}`}>
          {t.nome}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{t.descricao}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-muted">
          {t.dataInicio && <span>{new Date(t.dataInicio).toLocaleDateString('pt-BR')}</span>}
          {t.local && <span>{t.local}</span>}
          {t.premiacao && <span className="text-signal">{t.premiacao}</span>}
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  let torneios: Torneio[] = [];
  try {
    torneios = await listarTorneios();
  } catch {}

  const emAndamento = torneios.filter((t) => t.status === 'em_andamento');
  const inscricoesAbertas = torneios.filter((t) => t.status === 'inscricoes_abertas');

  const destaque = emAndamento[0] || inscricoesAbertas[0];
  const resto = torneios.filter((t) => t.id !== destaque?.id);

  return (
    <>
      <SiteHeader />
      <main>
        {/* BARRA DE TÍTULO COMPACTA — sem hero grande */}
        <section className="border-b border-white/10 bg-circuit-trace bg-[length:120px_120px]">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <p className="eyebrow mb-2">Circuit</p>
            <h1 className="font-display text-3xl font-semibold uppercase tracking-tight sm:text-4xl">Torneios</h1>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-14">
          {torneios.length === 0 && (
            <div className="card p-10 text-center text-muted">Nenhum torneio publicado ainda.</div>
          )}

          {destaque && (
            <div className="mb-6">
              <p className="eyebrow mb-4">Destaque</p>
              <div className="grid gap-6 md:grid-cols-2">
                <TorneioCard t={destaque} destaque />
              </div>
            </div>
          )}

          {resto.length > 0 && (
            <div>
              {destaque && <p className="eyebrow mb-4">Outros torneios</p>}
              <div className="grid gap-6 md:grid-cols-2">
                {resto.map((t) => (
                  <TorneioCard key={t.id} t={t} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
