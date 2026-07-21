'use client';

import { useEffect, useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminSidebar } from '@/components/AdminSidebar';
import {
  listarRanking,
  listarTodosOsTimes,
  criarEntradaRanking,
  atualizarEntradaRanking,
  excluirEntradaRanking,
} from '@/lib/data';
import { RankingEntrada, Time } from '@/types';

const vazio = { timeId: '', posicao: '1', comentario: '' };

export default function AdminRankingPage() {
  const [ranking, setRanking] = useState<RankingEntrada[]>([]);
  const [times, setTimes] = useState<Time[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState(vazio);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    const [r, t] = await Promise.all([listarRanking().catch(() => []), listarTodosOsTimes().catch(() => [])]);
    setRanking(r);
    setTimes(t);
  }

  useEffect(() => {
    carregar();
  }, []);

  function iniciarEdicao(r: RankingEntrada) {
    setEditando(r.id);
    setForm({ timeId: r.timeId, posicao: String(r.posicao), comentario: r.comentario || '' });
  }

  function cancelar() {
    setEditando(null);
    setForm(vazio);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.timeId) return alert('Selecione um time.');
    setSalvando(true);
    try {
      const dados = { timeId: form.timeId, posicao: Number(form.posicao), comentario: form.comentario };
      if (editando) {
        await atualizarEntradaRanking(editando, dados);
      } else {
        await criarEntradaRanking(dados);
      }
      cancelar();
      await carregar();
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id: string) {
    if (!confirm('Remover este time do ranking?')) return;
    await excluirEntradaRanking(id);
    await carregar();
  }

  const timesPorId = Object.fromEntries(times.map((t) => [t.id, t]));

  return (
    <RequireAuth>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-10 py-10">
          <p className="eyebrow mb-2">Gestão</p>
          <h1 className="font-display text-3xl font-semibold">Ranking</h1>
          <p className="mt-2 text-sm text-muted">
            Ranking geral, independente de torneio — a staff define a posição e um comentário curto sobre o momento do time.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-2">
              {ranking.length === 0 && <p className="text-muted">Nenhum time no ranking ainda.</p>}
              {ranking.map((r) => {
                const time = timesPorId[r.timeId];
                return (
                  <div key={r.id} className="card flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-display text-lg font-semibold text-signal">{r.posicao}</span>
                      <div>
                        <p className="font-medium">{time?.nome ?? 'Time removido'}</p>
                        {r.comentario && <p className="text-xs text-muted">{r.comentario}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => iniciarEdicao(r)} className="btn-secondary px-3 py-1.5 text-xs">Editar</button>
                      <button onClick={() => excluir(r.id)} className="rounded-none border border-alert/40 px-3 py-1.5 text-xs text-alert hover:bg-alert/10">Excluir</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={salvar} className="card h-fit space-y-4 p-6">
              <h2 className="font-display font-semibold">{editando ? 'Editar posição' : 'Adicionar ao ranking'}</h2>
              <div>
                <label className="label">Posição</label>
                <input type="number" min="1" required className="input" value={form.posicao} onChange={(e) => setForm({ ...form, posicao: e.target.value })} />
              </div>
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
                <label className="label">Comentário (opcional)</label>
                <textarea className="input min-h-20" value={form.comentario} onChange={(e) => setForm({ ...form, comentario: e.target.value })} placeholder="Breve avaliação sobre o momento do time" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={salvando} className="btn-primary flex-1 disabled:opacity-60">
                  {salvando ? 'Salvando…' : editando ? 'Salvar' : 'Adicionar'}
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
