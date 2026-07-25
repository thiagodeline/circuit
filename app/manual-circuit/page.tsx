import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const SECOES_RAPIDAS = [
  { id: 'visao-geral', label: 'Visão Geral' },
  { id: 'qualifiers', label: 'Qualifiers' },
  { id: 'copa-circuit', label: 'Copa Circuit' },
  { id: 'series', label: 'Series' },
  { id: 'elite', label: 'Circuit ELITE' },
  { id: 'finals', label: 'Circuit FINALS' },
];

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

        {/* NAVEGAÇÃO RÁPIDA POR ETAPAS */}
        <div className="border-b border-white/10">
          <div className="mx-auto max-w-6xl overflow-x-auto px-6">
            <div className="flex gap-2 py-3">
              {SECOES_RAPIDAS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex-shrink-0 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:border-signal/40 hover:text-ink"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* CONTEÚDO EM GRID */}
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-6 md:grid-cols-2">
            <section id="visao-geral" className="card scroll-mt-24 p-6">
              <p className="eyebrow mb-3">Sobre o Circuito</p>
              <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide">
                Como funciona o ecossistema
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                O Circuit é a cadeia oficial de torneios amadores de Valorant organizada pela
                Circuit. A temporada segue um caminho progressivo: times começam nos{' '}
                <strong className="text-ink">Circuit Qualifiers</strong>, etapas classificatórias
                abertas a qualquer equipe. Quem se destaca avança para a{' '}
                <strong className="text-ink">Copa Circuit</strong> e a{' '}
                <strong className="text-ink">Circuit Series</strong>, etapas intermediárias que
                concedem Circuit Points. Os times mais bem colocados no ranking acumulado do
                circuito garantem vaga direta no <strong className="text-ink">Circuit ELITE</strong>,
                a etapa de elite da temporada, cujos melhores colocados avançam para o{' '}
                <strong className="text-ink">Circuit FINALS</strong>, o evento decisivo que coroa o
                campeão da temporada.
              </p>
            </section>

            <section id="pontos" className="card scroll-mt-24 p-6">
              <p className="eyebrow mb-3">Sistema de Circuit Points</p>
              <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide">
                Como a pontuação classifica os times
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-muted">
                Cada etapa da temporada distribui Circuit Points aos times participantes, de acordo
                com a colocação final. Os pontos são acumulados ao longo da temporada e formam o{' '}
                <strong className="text-ink">Ranking Circuit</strong> — os times mais bem colocados
                no ranking acumulado garantem vaga direta no Circuit ELITE, sem precisar disputar
                todas as etapas classificatórias novamente.
              </p>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.03] text-left text-xs text-muted">
                      <th className="px-3 py-2 font-normal">Colocação</th>
                      <th className="px-3 py-2 font-normal">Circuit Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr><td className="px-3 py-2">1º lugar</td><td className="px-3 py-2 font-mono text-signal">50 pts</td></tr>
                    <tr><td className="px-3 py-2">2º lugar</td><td className="px-3 py-2 font-mono text-signal">30 pts</td></tr>
                    <tr><td className="px-3 py-2">3º-4º lugar</td><td className="px-3 py-2 font-mono text-signal">15 pts</td></tr>
                    <tr><td className="px-3 py-2">5º-8º lugar</td><td className="px-3 py-2 font-mono text-signal">5 pts</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 font-mono text-[11px] text-muted">
                Valores de referência — a staff pode ajustar a pontuação real de cada edição.
              </p>
            </section>

            <section id="formato" className="card scroll-mt-24 p-6">
              <p className="eyebrow mb-3">Formato & Regras</p>
              <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide">
                Como os torneios são disputados
              </h2>
              <ul className="space-y-3 text-sm text-muted">
                <li>
                  <strong className="text-ink">Eliminatória simples (mata-mata):</strong> todos os
                  torneios do circuito seguem chave de eliminação direta — uma derrota elimina o
                  time da competição.
                </li>
                <li>
                  <strong className="text-ink">Formato das partidas:</strong> fases iniciais
                  costumam ser MD1 (melhor de 1 mapa), com semifinais e finais em MD3 (melhor de 3).
                </li>
                <li>
                  <strong className="text-ink">Check-in:</strong> os times precisam confirmar
                  presença antes de cada partida, dentro do prazo divulgado — a ausência de
                  check-in pode resultar em W.O.
                </li>
              </ul>
            </section>

            <section id="premiacoes" className="card scroll-mt-24 p-6">
              <p className="eyebrow mb-3">Premiações & Vagas</p>
              <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide">
                Prize pool por etapa
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                Cada etapa da temporada tem sua própria premiação, divulgada na página do torneio
                correspondente (aba "Regras / Premiação"). De forma geral, a premiação cresce ao
                longo da cadeia: os Qualifiers costumam ter prêmios simbólicos, enquanto o Circuit
                ELITE e o Circuit FINALS concentram os maiores prize pools da temporada.
              </p>
            </section>
          </div>

          {/* ÂNCORAS DAS ETAPAS ESPECÍFICAS (referenciadas pela navegação rápida) */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { id: 'qualifiers', nome: 'Circuit Qualifiers', desc: 'Etapa classificatória aberta, primeiro passo da temporada.' },
              { id: 'copa-circuit', nome: 'Copa Circuit', desc: 'Etapa intermediária que distribui Circuit Points.' },
              { id: 'series', nome: 'Circuit Series', desc: 'Fase de consolidação do ranking acumulado.' },
              { id: 'elite', nome: 'Circuit ELITE', desc: 'Etapa de elite — vaga garantida pelo ranking.' },
              { id: 'finals', nome: 'Circuit FINALS', desc: 'Grande final da temporada, que coroa o campeão.' },
            ].map((etapa) => (
              <div key={etapa.id} id={etapa.id} className="card scroll-mt-24 p-5">
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-signal">{etapa.nome}</p>
                <p className="mt-2 text-sm text-muted">{etapa.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
