import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { buscarTorneioPorFase, listarTimesPorTorneio, listarPartidasPorTorneio } from '@/lib/data';
import { calcularTabelaLiga } from '@/lib/standings';
import { TabelaLiga } from '@/components/TabelaLiga';
import { REGRAS_SERIE_B } from '@/lib/stagesData';
import { PreInscricaoSerieBForm } from '@/components/PreInscricaoSerieBForm';

export const revalidate = 30;

export default async function SerieBPage() {
  const torneio = await buscarTorneioPorFase('Série B').catch(() => null);

  const [times, partidas] = torneio
    ? await Promise.all([
        listarTimesPorTorneio(torneio.id).catch(() => []),
        listarPartidasPorTorneio(torneio.id).catch(() => []),
      ])
    : [[], []];

  const tabela = torneio ? calcularTabelaLiga(times, partidas, 'serie-b') : [];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <span className="pill text-signal">SÉRIE B</span>
        <h1 className="mt-3 font-display text-4xl font-semibold uppercase tracking-tight">
          {torneio ? torneio.nome : 'Série B'}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          A Série B é formada pelos 2 times rebaixados da Série A a cada Split, somados a 6 vagas
          abertas por inscrição paga. Os 2 melhores colocados da Série B sobem para a Série A no
          Split seguinte.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="card p-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Formato</p>
            <p className="mt-2 text-sm font-medium">{REGRAS_SERIE_B.formato}</p>
          </div>
          <div className="card p-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Inscrição</p>
            <p className="mt-2 text-sm font-medium text-signal">{REGRAS_SERIE_B.inscricao}</p>
          </div>
          <div className="card p-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Acesso</p>
            <p className="mt-2 text-sm font-medium">{REGRAS_SERIE_B.acesso}</p>
          </div>
        </div>

        {torneio && tabela.length > 0 && (
          <section className="mt-12">
            <p className="eyebrow mb-4">Classificação atual</p>
            <TabelaLiga linhas={tabela} tipo="serie-b" />
          </section>
        )}

        {/* PRÉ-INSCRIÇÃO / LISTA DE ESPERA PARA AS VAGAS ABERTAS */}
        <section className="mt-14">
          <p className="eyebrow mb-4">Pré-inscrição — vagas abertas</p>
          <p className="mb-6 max-w-2xl text-sm text-muted">
            A Série B ainda não abriu oficialmente. Deixe os dados do seu time na lista de espera —
            quando as 6 vagas abertas forem liberadas (R$ 150,00 por time), a staff entra em contato
            pela ordem de cadastro.
          </p>
          <PreInscricaoSerieBForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
