import Link from 'next/link';
import Image from 'next/image';

const links = [
  { href: '/torneios', label: 'Torneios' },
  { href: '/times', label: 'Times' },
  { href: '/noticias', label: 'Notícias' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <Image src="/logo-mark.png" alt="Circuit" width={32} height={32} priority />
          Circuit
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted transition hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/torneios" className="btn-primary text-sm">
          Ver torneios
        </Link>
      </div>
    </header>
  );
}
