import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { InscricaoForm } from '@/components/InscricaoForm';
import { listarTorneios } from '@/lib/data';

export default async function InscricaoPage({ params }: { params: { slug: string } }) {
  const torneios = await listarTorneios().catch(() => []);
  const abertos = torneios.filter((t) => t.status === 'inscricoes_abertas');

  if (abertos.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <p className="text-muted">Não há torneios com inscrições abertas no momento.</p>
          <Link href="/" className="btn-secondary mt-6 inline-flex">
            Voltar à home
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  // Se o slug da URL corresponder a um torneio com inscrições abertas, ele vem
  // pré-selecionado; senão, o formulário abre no primeiro torneio aberto da lista
  // (o usuário pode trocar livremente pelo select).
  const torneioInicial = abertos.find((t) => t.slug === params.slug) || abertos[0];

  return (
    <>
      <SiteHeader />
      <main>
        <InscricaoForm torneiosAbertos={abertos} torneioInicialId={torneioInicial.id} />
      </main>
      <SiteFooter />
    </>
  );
}
