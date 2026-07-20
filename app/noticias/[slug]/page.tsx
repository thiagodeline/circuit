import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { buscarNoticiaPorSlug } from '@/lib/data';

export const revalidate = 60;

export default async function NoticiaDetalhePage({ params }: { params: { slug: string } }) {
  const noticia = await buscarNoticiaPorSlug(params.slug).catch(() => null);
  if (!noticia) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-mono text-xs text-muted">
          {new Date(noticia.publicadoEm).toLocaleDateString('pt-BR')} · {noticia.autor}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold">{noticia.titulo}</h1>
        <div className="prose prose-invert mt-8 max-w-none whitespace-pre-line text-ink/90">
          {noticia.conteudo}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
