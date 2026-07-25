'use client';

import { useState } from 'react';
import { stagesData, ETAPAS_COMPARATIVO, FAIXAS_COMPARATIVO, pontosNaFaixa } from '@/lib/stagesData';

type Aba = 'overview' | 'qualifiers' | 'copa' | 'series' | 'elite' | 'finals';

const ABAS: { key: Aba; label: string }[] = [
  { key: 'overview', label: 'Visão Geral' },
  { key: 'qualifiers', label: 'Qualifiers' },
  { key: 'copa', label: 'Copa Circuit' },
  { key: 'series', label: 'Series' },
  { key: 'elite', label: 'Circuit ELITE' },
  { key: 'finals', label: 'Circuit FINALS' },
];

export function ManualCircuitTabs() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('overview');

  return (
    <div>
      {/* NAV DE ABAS */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-6xl overflow-x-auto px-6">
          <div className="flex gap-2 py-3">
            {ABAS.map((a) => (
              <button
                key={a.key}
                onClick={() => setAbaAtiva(a.key)}
                className={`flex-shrink-0 rounded-xl border px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                  abaAtiva === a.key
                    ? 'border-signal bg-signal/10 text-signal'
                    : 'border-white/10 bg-white/[0.03] text-muted hover:text-ink'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14">
        {abaAtiva === 'overview' ? <PainelVisaoGeral /> : <PainelEtapa etapa={abaAtiva} />}
      </div>
    </div>
  );
}

function PainelVisaoGeral() {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2">
        <section className="card p-6">
          <p className="eyebrow mb-3">Sobre o Circuito</p>
          <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide">
            Como funciona o ecossistema
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            O Circuit é a cadeia oficial de torneios amadores de Valorant organizada pela Circuit.
            A temporada segue um caminho progressivo: times começam nos{' '}
            <strong className="text-ink">Circuit Qualifiers</strong>, etapas classificatórias
            abertas a qualquer equipe. Quem se destaca avança para a{' '}
            <strong className="text-ink">Copa Circuit</strong> e a{' '}
            <strong className="text-ink">Circuit Series</strong>, etapas intermediárias que
            concedem Circuit Points. Os times mais bem colocados no ranking acumulado garantem vaga
            direta no <strong className="text-ink">Circuit ELITE</strong>, cujos melhores
            colocados avançam para o <strong className="text-ink">Circuit FINALS</strong>, o evento
            decisivo que coroa o campeão da temporada.
          </p>
        </section>

        <section className="card p-6">
          <p className="eyebrow mb-3">Sistema de Circuit Points</p>
          <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-wide">
            Como a pontuação classifica os times
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            Cada etapa distribui Circuit Points de acordo com a colocação final do time. Os pontos
            são acumulados ao longo da temporada e formam o <strong className="text-ink">Ranking
            Circuit</strong> — quanto mais avançada a etapa, maior o valor em jogo, recompensando
            times que sobem na cadeia competitiva.
          </p>
        </section>
      </div>

      {/* TABELA COMPARATIVA LADO A LADO */}
      <section>
        <p className="eyebrow mb-4">Comparativo de pontuação por etapa</p>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-white/[0.03] text-left text-xs text-muted">
                <th className="px-4 py-3 font-normal">Colocação</th>
                {ETAPAS_COMPARATIVO.map((e) => (
                  <th key={e.chave} className="px-4 py-3 text-center font-normal">{e.nome}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {FAIXAS_COMPARATIVO.map((faixa) => (
                <tr key={faixa}>
                  <td className="px-4 py-3 font-medium">{faixa}</td>
                  {ETAPAS_COMPARATIVO.map((e) => (
                    <td key={e.chave} className="px-4 py-3 text-center font-mono text-signal">
                      {pontosNaFaixa(e.chave, faixa)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 font-mono text-[11px] text-muted">
          Circuit FINALS não distribui pontos — é o evento que define o campeão do ano.
        </p>
      </section>

      {/* FLUXO DE CLASSIFICAÇÃO */}
      <section>
        <p className="eyebrow mb-4">Fluxo de classificação</p>
        <div className="flex flex-wrap items-center gap-2">
          {['Qualifiers', 'Copa Circuit', 'Circuit Series', 'Circuit ELITE', 'Circuit FINALS'].map((etapa, i, arr) => (
            <div key={etapa} className="flex items-center gap-2">
              <span className="pill text-ink">{etapa}</span>
              {i < arr.length - 1 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 text-muted">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PainelEtapa({ etapa }: { etapa: 'qualifiers' | 'copa' | 'series' | 'elite' | 'finals' }) {
  const dados = stagesData[etapa];

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-2">Etapa da temporada</p>
        <h2 className="font-display text-3xl font-semibold uppercase tracking-tight">{dados.titulo}</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Formato de jogo</p>
          <p className="mt-2 text-sm font-medium">{dados.formato}</p>
        </div>
        <div className="card p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Requisito de entrada</p>
          <p className="mt-2 text-sm font-medium">{dados.requisitoEntrada}</p>
        </div>
        <div className="card p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Premiação</p>
          <p className="mt-2 text-sm font-medium text-signal">{dados.premiacao}</p>
        </div>
      </div>

      <div>
        <p className="eyebrow mb-4">Tabela de pontuação — {dados.titulo}</p>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.03] text-left text-xs text-muted">
                <th className="px-4 py-3 font-normal">Colocação</th>
                <th className="px-4 py-3 font-normal">Circuit Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dados.pontuacao.map((linha) => (
                <tr key={linha.colocacao}>
                  <td className="px-4 py-3">{linha.colocacao}</td>
                  <td className="px-4 py-3 font-mono text-signal">{linha.pontos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="font-mono text-[11px] text-muted">
        Valores de referência — a staff pode ajustar a pontuação e a premiação real de cada edição.
      </p>
    </div>
  );
}
