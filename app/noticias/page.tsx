import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { listarNoticias } from '@/lib/data';

export const revalidate = 60;

export default async function NoticiasPage() {
  const noticias = await listarNoticias().catch(() => []);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="eyebrow mb-2">Blog</p>
        <h1 className="font-display text-4xl font-semibold">Notícias</h1>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {noticias.length === 0 && <p className="text-muted">Nenhuma notícia publicada ainda.</p>}
          {noticias.map((n) => (
            <Link key={n.id} href={`/noticias/${n.slug}`} className="card group p-6 transition hover:border-signal/50">
              <p className="font-mono text-xs text-muted">
                {new Date(n.publicadoEm).toLocaleDateString('pt-BR')}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold group-hover:text-signal">{n.titulo}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{n.resumo}</p>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
