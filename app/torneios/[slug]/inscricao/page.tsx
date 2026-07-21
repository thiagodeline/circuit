import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { InscricaoForm } from '@/components/InscricaoForm';
import { buscarTorneioPorSlug } from '@/lib/data';

export default async function InscricaoPage({ params }: { params: { slug: string } }) {
  const torneio = await buscarTorneioPorSlug(params.slug).catch(() => null);
  if (!torneio) notFound();

  if (torneio.status !== 'inscricoes_abertas') {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <p className="text-muted">
            As inscrições para <strong className="text-ink">{torneio.nome}</strong> não estão abertas no momento.
          </p>
          <Link href={`/torneios/${torneio.slug}`} className="btn-secondary mt-6 inline-flex">
            Voltar ao torneio
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main>
        <InscricaoForm torneio={torneio} />
      </main>
      <SiteFooter />
    </>
  );
}
