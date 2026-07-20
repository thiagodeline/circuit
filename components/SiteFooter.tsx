import Link from 'next/link';
import Image from 'next/image';

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-semibold uppercase tracking-wide">
              <Image src="/logo-mark.png" alt="Circuit" width={26} height={26} />
              Circuit
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Organização de torneios de Valorant. Chaves, resultados e times, tudo em um só lugar.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4">Navegação</p>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/torneios" className="transition hover:text-ink">Torneios</Link></li>
              <li><Link href="/times" className="transition hover:text-ink">Times</Link></li>
              <li><Link href="/noticias" className="transition hover:text-ink">Notícias</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">Comunidade</p>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <a
                  href="https://discord.com/invite/PASRYsBsAG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-ink"
                >
                  Discord oficial
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 font-mono text-xs uppercase tracking-wider text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Circuit — Organização de torneios de Valorant</p>
          <p>Temporada atual: Circuit Zen</p>
        </div>
      </div>
    </footer>
  );
}
