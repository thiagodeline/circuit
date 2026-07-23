'use client';

import { useEffect, useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminSidebar } from '@/components/AdminSidebar';
import {
  listarPontosCircuito,
  listarTodosOsTimes,
  lancarPontosCircuito,
  atualizarPontosCircuito,
  excluirPontosCircuito,
} from '@/lib/data';
import { calcularRankingCircuito, rotuloOrigem } from '@/lib/circuitPoints';
import { PontosCircuito, Time, FaseCircuito, FASES_CIRCUITO } from '@/types';

const vazio = { timeId: '', fase: FASES_CIRCUITO[0] as FaseCircuito, edicao: '', pontos: '' };

export default function AdminRankingPage() {
  const [times, setTimes] = useState<Time[]>([]);
  const [lancamentos, setLancamentos] = useState<PontosCircuito[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState(vazio);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    const [t, l] = await Promise.all([
      listarTodosOsTimes().catch(() => []),
      listarPontosCircuito().catch(() => []),
    ]);
    setTimes(t);
    setLancamentos(l);
  }

  useEffect(() => {
    carregar();
  }, []);

  const ranking = calcularRankingCircuito(times, lancamentos);

  function iniciarEdicao(l: PontosCircuito) {
    setEditando(l.id);
    setForm({ timeId: l.timeId, fase: l.fase, edicao: l.edicao || '', pontos: String(l.pontos) });
  }

  function cancelar() {
    setEditando(null);
    setForm(vazio);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.timeId) return alert('Selecione um time.');
    if (!form.pontos || Number(form.pontos) <= 0) return alert('Informe uma quantidade de pontos válida.');

    setSalvando(true);
    try {
      const dados = {
        timeId: form.timeId,
        fase: form.fase,
        edicao: form.edicao.trim() || undefined,
        pontos: Number(form.pontos),
      };
      if (editando) {
        await atualizarPontosCircuito(editando, dados);
      } else {
        await lancarPontosCircuito(dados);
      }
      cancelar();
      await carregar();
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id: string) {
    if (!confirm('Remover este lançamento de pontos? O total do time será recalculado.')) return;
    await excluirPontosCircuito(id);
    await carregar();
  }

  return (
    <RequireAuth>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-10 py-10">
          <p className="eyebrow mb-2">Gestão</p>
          <h1 className="font-display text-3xl font-semibold">Ranking — Pontos de Circuito</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            O ranking é sempre calculado automaticamente pela soma dos pontos lançados aqui — não
            existe posição manual. Lance a pontuação de um time em um torneio da cadeia oficial e o
            total (e a ordem) é recalculado sozinho.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* RANKING CALCULADO */}
            <div className="space-y-3">
              {ranking.length === 0 && <p className="text-muted">Nenhum time pontuou ainda.</p>}
              {ranking.map((linha, i) => (
                <div key={linha.time.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-display text-lg font-semibold text-signal">{i + 1}</span>
                      <p className="font-medium">{linha.time.nome} <span className="font-mono text-xs text-muted">({linha.time.tag})</span></p>
                    </div>
                    <span className="font-display text-lg font-bold text-signal">{linha.total} pts</span>
                  </div>
                  <div className="mt-3 space-y-1.5 border-t border-white/5 pt-3">
                    {linha.lancamentos.map((l) => (
                      <div key={l.id} className="flex items-center justify-between text-xs">
                        <span className="text-muted">
                          <span className="font-semibold text-signal">{l.pontos} Pts</span> — {rotuloOrigem(l)}
                        </span>
                        <div className="flex gap-2">
                          <button onClick={() => iniciarEdicao(l)} className="text-muted hover:text-ink">Editar</button>
                          <button onClick={() => excluir(l.id)} className="text-muted hover:text-alert">Excluir</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* FORMULÁRIO DE LANÇAMENTO */}
            <form onSubmit={salvar} className="card h-fit space-y-4 p-6">
              <h2 className="font-display font-semibold">{editando ? 'Editar lançamento' : 'Lançar pontos'}</h2>
              <div>
                <label className="label">Time</label>
                <select required className="input" value={form.timeId} onChange={(e) => setForm({ ...form, timeId: e.target.value })}>
                  <option value="">Selecione</option>
                  {times.map((t) => (
                    <option key={t.id} value={t.id}>{t.nome} ({t.tag})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Torneio de origem</label>
                <select className="input" value={form.fase} onChange={(e) => setForm({ ...form, fase: e.target.value as FaseCircuito })}>
                  {FASES_CIRCUITO.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Edição (opcional)</label>
                <input
                  className="input"
                  value={form.edicao}
                  onChange={(e) => setForm({ ...form, edicao: e.target.value })}
                  placeholder="#1, #2..."
                />
                <p className="mt-1 text-xs text-muted">Use para diferenciar edições repetidas, ex: "Circuit Qualifier #1".</p>
              </div>
              <div>
                <label className="label">Quantidade de pontos</label>
                <input
                  type="number"
                  min="1"
                  required
                  className="input"
                  value={form.pontos}
                  onChange={(e) => setForm({ ...form, pontos: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={salvando} className="btn-primary flex-1 disabled:opacity-60">
                  {salvando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Lançar pontos'}
                </button>
                {editando && <button type="button" onClick={cancelar} className="btn-secondary">Cancelar</button>}
              </div>
            </form>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
