import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ManualCircuitTabs } from '@/components/ManualCircuitTabs';

export default function ManualCircuitPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* HEADER DA PÁGINA */}
        <section className="border-b border-white/10 bg-circuit-trace bg-[length:120px_120px]">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <h1 className="font-display text-4xl font-semibold uppercase tracking-tight sm:text-5xl">
              Manual Circuit
            </h1>
            <p className="mt-3 max-w-2xl text-muted">
              Tudo o que você precisa saber sobre a Temporada do circuito amador de VALORANT.
            </p>
          </div>
        </section>

        <ManualCircuitTabs />
      </main>
      <SiteFooter />
    </>
  );
}
