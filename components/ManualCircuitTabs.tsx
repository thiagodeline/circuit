'use client';

import { useState } from 'react';
import { stagesData, DIVISAO_FINANCEIRA_QUALIFIERS } from '@/lib/stagesData';

type Aba = 'overview' | 'qualifiers' | 'masters' | 'financeiro';

const ABAS: { key: Aba; label: string }[] = [
  { key: 'overview', label: 'Visão Geral' },
  { key: 'qualifiers', label: 'Qualifiers' },
  { key: 'masters', label: 'Circuit Masters' },
  { key: 'financeiro', label: 'Transparência Financeira' },
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
        {abaAtiva === 'overview' && <PainelVisaoGeral />}
        {abaAtiva === 'qualifiers' && <PainelEtapa etapa="qualifiers" />}
        {abaAtiva === 'masters' && <PainelEtapa etapa="masters" />}
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
          Dois caminhos até o Circuit Masters
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">
          A temporada da Circuit funciona em duas etapas. Você pode disputar o{' '}
          <strong className="text-ink">Circuit Qualifier</strong> por apenas{' '}
          <strong className="text-signal">R$ 40,00</strong> por time — uma chance de conquistar uma
          vaga gratuita no Masters e ainda faturar um PIX rápido se for campeão. Ou, se preferir
          pular a fase classificatória, seu time pode entrar direto no{' '}
          <strong className="text-ink">Circuit Masters</strong> como Wildcard, por{' '}
          <strong className="text-signal">R$ 100,00</strong> por time. As duas portas levam ao
          mesmo lugar: o torneio principal da temporada, com premiação em dinheiro e o Selo Oficial
          de Campeão Circuit para quem vencer.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-signal">Rota 1</p>
          <h3 className="mt-2 font-display text-lg font-semibold uppercase">Jogar o Qualifier</h3>
          <p className="mt-3 text-sm text-muted">
            R$ 40,00 por time. Chance de vaga gratuita no Masters + PIX de R$ 190,00 pro campeão.
          </p>
        </div>
        <div className="card p-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-signal">Rota 2</p>
          <h3 className="mt-2 font-display text-lg font-semibold uppercase">Entrar direto no Masters</h3>
          <p className="mt-3 text-sm text-muted">
            R$ 100,00 por time como Wildcard. Pula o Qualifier e já disputa o torneio principal.
          </p>
        </div>
      </div>

      <div>
        <p className="eyebrow mb-4">Fluxo da temporada</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="pill text-ink">Circuit Qualifier</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
          <span className="pill text-ink">Circuit Masters</span>
        </div>
      </div>
    </div>
  );
}

function PainelEtapa({ etapa }: { etapa: 'qualifiers' | 'masters' }) {
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
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Vagas / Entrada</p>
          <p className="mt-2 text-sm font-medium">{dados.requisitoEntrada}</p>
        </div>
        <div className="card p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Premiação</p>
          <p className="mt-2 text-sm font-medium text-signal">{dados.premiacao}</p>
        </div>
      </div>

      <div>
        <p className="eyebrow mb-4">Classificação — {dados.titulo}</p>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.03] text-left text-xs text-muted">
                <th className="px-4 py-3 font-normal">Colocação</th>
                <th className="px-4 py-3 font-normal">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dados.pontuacao.map((linha) => (
                <tr key={linha.colocacao}>
                  <td className="px-4 py-3">{linha.colocacao}</td>
                  <td className="px-4 py-3 text-signal">{linha.pontos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="font-mono text-[11px] text-muted">
        Valores de referência — a staff pode ajustar taxas e premiação real de cada edição.
      </p>
    </div>
  );
}

function PainelFinanceiro() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-2">Transparência</p>
        <h2 className="font-display text-2xl font-semibold uppercase tracking-wide">
          Como o valor arrecadado é dividido
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Toda taxa de inscrição paga nos Circuit Qualifiers é dividida de forma transparente entre
          premiação imediata, o pote acumulado para o Circuit Masters, e os custos operacionais da
          organização.
        </p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/[0.03] text-left text-xs text-muted">
              <th className="px-4 py-3 font-normal">Destino</th>
              <th className="px-4 py-3 font-normal">Percentual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {DIVISAO_FINANCEIRA_QUALIFIERS.map((d) => (
              <tr key={d.destino}>
                <td className="px-4 py-3">{d.destino}</td>
                <td className="px-4 py-3 font-mono font-semibold text-signal">{d.percentual}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BARRA VISUAL DA DIVISÃO */}
      <div className="flex h-3 overflow-hidden rounded-full border border-white/10">
        <div className="bg-signal" style={{ width: '60%' }} />
        <div className="bg-live" style={{ width: '20%' }} />
        <div className="bg-white/20" style={{ width: '20%' }} />
      </div>
      <div className="flex flex-wrap gap-4 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-signal" />Premiação (60%)</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-live" />Pote do Masters (20%)</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-white/20" />Organização (20%)</span>
      </div>
    </div>
  );
}
