import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ESTRUTURA_QUALIFIER, ESTRUTURA_VCL } from '@/lib/stagesData';

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
              Como funciona o caminho até o VCL — do VCL Qualifier aos playoffs decisivos.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-6 md:grid-cols-2">
            {/* VCL QUALIFIER */}
            <section className="card p-6">
              <span className="pill w-fit text-signal">FASE CLASSIFICATÓRIA</span>
              <h2 className="mt-4 mb-4 font-display text-xl font-semibold uppercase tracking-wide">
                VCL Qualifier
              </h2>
              <div className="space-y-4">
                {ESTRUTURA_QUALIFIER.map((etapa, i) => (
                  <div key={etapa.titulo} className="flex gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-signal/40 font-mono text-xs text-signal">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{etapa.titulo}</p>
                      <p className="text-sm text-muted">{etapa.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 border-t border-white/10 pt-5 text-xs text-muted">
                Quantidade de times, valor de inscrição e premiação de cada edição são definidos
                pela staff no painel admin, na página do torneio correspondente.
              </p>
            </section>

            {/* VCL */}
            <section className="card p-6">
              <span className="pill w-fit text-signal">TORNEIO PRINCIPAL</span>
              <h2 className="mt-4 mb-4 font-display text-xl font-semibold uppercase tracking-wide">
                VCL — Playoffs
              </h2>
              <p className="mb-4 text-sm text-muted">
                Os classificados do VCL Qualifier (diretos + repescagem) disputam o VCL em chave de
                eliminação simples (mata-mata):
              </p>
              <div className="space-y-2">
                {ESTRUTURA_VCL.map((fase) => (
                  <div key={fase.titulo} className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2.5">
                    <span className="font-medium">{fase.titulo}</span>
                    <span className="pill text-signal">{fase.formato}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 border-t border-white/10 pt-5 text-xs text-muted">
                Vagas, premiação e regras específicas de cada edição do VCL ficam disponíveis na
                aba "Regulamento" da página do torneio.
              </p>
            </section>
          </div>

          {/* FLUXO VISUAL */}
          <section className="mt-10">
            <p className="eyebrow mb-4">Do Qualifier ao campeão</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="pill text-ink">VCL Qualifier (grupos)</span>
              <Seta />
              <span className="pill text-ink">Vaga direta + Repescagem</span>
              <Seta />
              <span className="pill text-ink">VCL (mata-mata)</span>
              <Seta />
              <span className="pill text-signal">Campeão</span>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Seta() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}
