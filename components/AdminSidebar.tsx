'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const itens = [
  { href: '/admin/dashboard', label: 'Visão geral' },
  { href: '/admin/torneios', label: 'Torneios' },
  { href: '/admin/inscricoes', label: 'Inscrições' },
  { href: '/admin/times', label: 'Times' },
  { href: '/admin/resultados', label: 'Resultados' },
  { href: '/admin/noticias', label: 'Notícias' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { sair, user } = useAuth();
  const router = useRouter();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-line bg-surface px-4 py-6">
      <div className="mb-8 flex items-center gap-2 px-2 font-display text-lg font-semibold">
        <Image src="/logo-mark.png" alt="Circuit" width={24} height={24} />
        Circuit
      </div>
      <nav className="flex-1 space-y-1">
        {itens.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={`block rounded-lg px-3 py-2 text-sm transition ${
              pathname === i.href ? 'bg-surface2 text-ink' : 'text-muted hover:bg-surface2 hover:text-ink'
            }`}
          >
            {i.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-line pt-4">
        <p className="truncate px-2 text-xs text-muted">{user?.email}</p>
        <button
          onClick={async () => {
            await sair();
            router.push('/admin/login');
          }}
          className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition hover:bg-surface2 hover:text-alert"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
