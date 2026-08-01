import Link from 'next/link';
import Image from 'next/image';
import { listarTorneios } from '@/lib/data';
import { Torneio } from '@/types';

export async function SiteHeader() {
  let torneios: Torneio[] = [];
  try {
    torneios = await listarTorneios();
  } catch {
    // Firebase ainda não configurado — segue sem os dados de etapas
  }

  const ativo = torneios.find((t) => t.status === 'em_andamento');
  const inscricoes = torneios.find((t) => t.status === 'inscricoes_abertas');
  const ticker = ativo
    ? { texto: `EM ANDAMENTO — ${ativo.nome}`, href: `/torneios/${ativo.slug}` }
    : inscricoes
    ? { texto: `INSCRIÇÕES ABERTAS — ${inscricoes.nome}`, href: `/torneios/${inscricoes.slug}` }
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-base/90 backdrop-blur-md">
      {ticker && (
        <Link
          href={ticker.href}
          className="flex items-center justify-center gap-2 border-b border-white/10 bg-white/[0.03] px-6 py-1.5 font-mono text-xs uppercase tracking-wider text-muted backdrop-blur-sm transition-colors hover:text-signal"
        >
          <span className="h-1.5 w-1.5 animate-pulse bg-live" />
          {ticker.texto}
        </Link>
      )}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide">
          <Image src="/logo-mark.png" alt="Circuit" width={30} height={30} priority />
          Circuit
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="font-display text-sm font-bold uppercase tracking-wide text-muted transition-colors hover:text-ink">
            Home
          </Link>

          {/* ETAPAS — dropdown simples, cada item já é o link direto (sem flyout lateral) */}
          <div className="group relative">
            <button className="flex items-center gap-1.5 font-display text-sm font-bold uppercase tracking-wide text-muted transition-colors hover:text-ink">
              Etapas
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
              <div className="rounded-2xl border border-white/10 bg-base/95 p-1.5 backdrop-blur-xl">
                <Link
                  href="/serie-a"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
                >
                  <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 border-signal">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                  </span>
                  <span>
                    <p className="font-display text-sm font-semibold uppercase tracking-wide">Série A</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Em andamento</p>
                  </span>
                </Link>
                <Link
                  href="/serie-b"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
                >
                  <span className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-white/20" />
                  <span>
                    <p className="font-display text-sm font-semibold uppercase tracking-wide text-muted">Série B</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted/70">Em breve</p>
                  </span>
                </Link>

                {/* SAIBA MAIS */}
                <div className="mt-2 border-t border-white/10 pt-2">
                  <p className="mb-1 px-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">Saiba mais</p>
                  <Link
                    href="/manual-circuit"
                    className="block rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5 hover:text-signal"
                  >
                    Manual Circuit
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link href="/ranking" className="font-display text-sm font-bold uppercase tracking-wide text-muted transition-colors hover:text-ink">
            Ranking
          </Link>
          <Link href="/noticias" className="font-display text-sm font-bold uppercase tracking-wide text-muted transition-colors hover:text-ink">
            Notícias
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          {inscricoes && (
            <Link href={`/torneios/${inscricoes.slug}/inscricao`} className="btn-primary px-5 py-2 text-xs">
              Inscrever Time
            </Link>
          )}
          <a
            href="https://www.youtube.com/@circuitgg_vlr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="text-muted transition-colors hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
            </svg>
          </a>
          <a
            href="https://discord.com/invite/PASRYsBsAG"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className="text-muted transition-colors hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.045-.32 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.645-1.873.892a.076.076 0 0 0-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.028ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.955 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418Z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
