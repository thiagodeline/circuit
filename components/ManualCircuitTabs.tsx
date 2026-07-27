'use client';

import { useState } from 'react';
import { stagesData, DIVISAO_FINANCEIRA_QUALIFIERS } from '@/lib/stagesData';

type Aba = 'overview' | 'qualifiers' | 'elite' | 'masters' | 'finals' | 'financeiro';

const ABAS: { key: Aba; label: string }[] = [
  { key: 'overview', label: 'Visão Geral' },
  { key: 'qualifiers', label: 'Qualifiers' },
  { key: 'elite', label: 'Circuit Elite' },
  { key: 'masters', label: 'Circuit Masters' },
  { key: 'finals', label: 'Circuit Finals' },
  { key: 'financeiro', label: 'Transparência Financeira' },
];

export function ManualCircuitTabs() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('overview');

  return (
    <div>
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
        {abaAtiva === 'overview' && <PainelVisaoGeral />}
        {abaAtiva === 'qualifiers' && <PainelEtapa etapa="qualifiers" />}
        {abaAtiva === 'elite' && <PainelEtapa etapa="elite" />}
        {abaAtiva === 'masters' && <PainelEtapa etapa="masters" />}
        {abaAtiva === 'finals' && <PainelEtapa etapa="finals" />}
        {abaAtiva === 'financeiro' && <PainelFinanceiro />}
      </div>
    </div>
  );
}

function PainelVisaoGeral() {
  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow mb-3">Sobre o Circuito</p>
        <h2 className="mb-4 font-display text-2xl font-semibold uppercase tracking-wide">
          O caminho até o Circuit Finals
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">
          A temporada da Circuit é dividida em 4 etapas. Tudo começa nos{' '}
          <strong className="text-ink">Circuit Qualifiers</strong> — 4 edições pagas ao longo do
          ano, com 8 times cada. Os 2 melhores de cada Qualifier avançam direto para o{' '}
          <strong className="text-ink">Circuit Masters</strong>; o 3º e 4º lugares avançam para o{' '}
          <strong className="text-ink">Circuit Elite</strong>. Ambas as etapas são gratuitas e
          premiadas com o Fundo Acumulado gerado pelos próprios Qualifiers. Os 3 melhores times de
          cada uma se enfrentam no <strong className="text-ink">Circuit Finals</strong>, o grande
          evento de 6 times que fecha a temporada e coroa o campeão do ano.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(['qualifiers', 'elite', 'masters', 'finals'] as const).map((k) => (
          <div key={k} className="card p-5">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-signal">
              {stagesData[k].titulo}
            </p>
            <p className="mt-2 text-xs text-muted">{stagesData[k].classificacao}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="eyebrow mb-4">Fluxo da temporada</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="pill text-ink">Circuit Qualifiers</span>
          <Seta />
          <span className="pill text-ink">Elite / Masters</span>
          <Seta />
          <span className="pill text-ink">Circuit Finals</span>
        </div>
      </div>
    </div>
  );
}

function Seta() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function PainelEtapa({ etapa }: { etapa: 'qualifiers' | 'elite' | 'masters' | 'finals' }) {
  const dados = stagesData[etapa];
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-2">Etapa da temporada</p>
        <h2 className="font-display text-3xl font-semibold uppercase tracking-tight">{dados.titulo}</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Formato</p>
          <p className="mt-2 text-sm font-medium">{dados.formato}</p>
        </div>
        <div className="card p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Vagas / Entrada</p>
          <p className="mt-2 text-sm font-medium">{dados.requisitoEntrada}</p>
        </div>
        <div className="card p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Classificação</p>
          <p className="mt-2 text-sm font-medium">{dados.classificacao}</p>
        </div>
        <div className="card p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Premiação</p>
          <p className="mt-2 text-sm font-medium text-signal">{dados.premiacao}</p>
        </div>
      </div>

      <div>
        <p className="eyebrow mb-4">Circuit Points — {dados.titulo}</p>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.03] text-left text-xs text-muted">
                <th className="px-4 py-3 font-normal">Colocação</th>
                <th className="px-4 py-3 font-normal">Pontos</th>
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
    </div>
  );
}

function PainelFinanceiro() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-2">Transparência</p>
        <h2 className="font-display text-2xl font-semibold uppercase tracking-wide">
          Como a taxa de cada Qualifier é dividida
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Cada Circuit Qualifier arrecada R$ 600,00 no total (8 times). Esse valor é dividido em
          três partes: o prêmio imediato do campeão, o Fundo Acumulado que paga as premiações do
          Circuit Elite e do Circuit Masters ao longo da temporada, e o lucro da organização.
        </p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/[0.03] text-left text-xs text-muted">
              <th className="px-4 py-3 font-normal">Destino</th>
              <th className="px-4 py-3 font-normal">Valor por Qualifier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {DIVISAO_FINANCEIRA_QUALIFIERS.map((d) => (
              <tr key={d.destino}>
                <td className="px-4 py-3">{d.destino}</td>
                <td className="px-4 py-3 font-mono font-semibold text-signal">{d.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex h-3 overflow-hidden rounded-full border border-white/10">
        <div className="bg-signal" style={{ width: '50%' }} />
        <div className="bg-live" style={{ width: '33.3%' }} />
        <div className="bg-white/20" style={{ width: '16.7%' }} />
      </div>
      <div className="flex flex-wrap gap-4 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-signal" />Prêmio PIX (R$ 300)</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-live" />Fundo Acumulado (R$ 200)</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-white/20" />Lucro da Org (R$ 100)</span>
      </div>

      <p className="font-mono text-[11px] text-muted">
        Com as 4 edições de Qualifiers da temporada, o Fundo Acumulado soma R$ 800,00 — exatamente
        o suficiente para cobrir os R$ 200 do Circuit Elite e os R$ 300 do Circuit Masters, com
        margem de segurança.
      </p>
    </div>
  );
}
