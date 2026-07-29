import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { REGRAS_SERIE_A, REGRAS_SERIE_B, DIVISAO_PREMIACAO_SERIE_A } from '@/lib/stagesData';

export default function ManualCircuitPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-white/10 bg-circuit-trace bg-[length:120px_120px]">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <h1 className="font-display text-4xl font-semibold uppercase tracking-tight sm:text-5xl">
              Manual Circuit
            </h1>
            <p className="mt-3 max-w-2xl text-muted">
              Como funciona o sistema de acesso e rebaixamento entre a Série A e a Série B da Circuit.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-6 md:grid-cols-2">
            {/* SÉRIE A */}
            <section className="card p-6">
              <span className="pill w-fit text-signal">SÉRIE A — ELITE</span>
              <h2 className="mt-4 mb-4 font-display text-xl font-semibold uppercase tracking-wide">
                Regras da Série A
              </h2>
              <ul className="space-y-3 text-sm text-muted">
                <li><strong className="text-ink">Formato:</strong> {REGRAS_SERIE_A.formato}</li>
                <li><strong className="text-ink">Inscrição:</strong> {REGRAS_SERIE_A.inscricao}</li>
                <li><strong className="text-ink">Premiação total:</strong> {REGRAS_SERIE_A.premiacaoTotal}</li>
                <li>🛡️ {REGRAS_SERIE_A.permanencia}</li>
                <li>🔻 {REGRAS_SERIE_A.rebaixamento}</li>
              </ul>
              <div className="mt-5 flex gap-4 border-t border-white/10 pt-5">
                {DIVISAO_PREMIACAO_SERIE_A.map((d) => (
                  <div key={d.colocacao}>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{d.colocacao}</p>
                    <p className="font-display text-lg font-semibold text-signal">{d.valor}</p>
                  </div>
                ))}
              </div>
              <Link href="/serie-a" className="btn-secondary mt-6 inline-flex text-xs">Ver Série A</Link>
            </section>

            {/* SÉRIE B */}
            <section className="card p-6">
              <span className="pill w-fit text-signal">SÉRIE B — ACESSO</span>
              <h2 className="mt-4 mb-4 font-display text-xl font-semibold uppercase tracking-wide">
                Regras da Série B
              </h2>
              <ul className="space-y-3 text-sm text-muted">
                <li><strong className="text-ink">Formato:</strong> {REGRAS_SERIE_B.formato}</li>
                <li><strong className="text-ink">Inscrição:</strong> {REGRAS_SERIE_B.inscricao}</li>
                <li>⬆️ {REGRAS_SERIE_B.acesso}</li>
              </ul>
              <p className="mt-5 border-t border-white/10 pt-5 text-sm text-muted">
                A Série B só existe a partir do 2º Split, formada pelos 2 rebaixados da Série A do
                Split anterior somados às 6 vagas abertas por inscrição.
              </p>
              <Link href="/serie-b" className="btn-secondary mt-6 inline-flex text-xs">Ver Série B</Link>
            </section>
          </div>

          {/* CICLO VISUAL */}
          <section className="mt-10">
            <p className="eyebrow mb-4">Ciclo de acesso e rebaixamento</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="pill text-ink">Série A (Top 6 permanece)</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              <span className="pill text-alert">7º e 8º rebaixados</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              <span className="pill text-ink">Série B (formada)</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              <span className="pill text-signal">Top 2 sobem para a Série A</span>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
