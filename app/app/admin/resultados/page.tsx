'use client';

import { useEffect, useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminSidebar } from '@/components/AdminSidebar';
import {
  listarTorneios,
  listarTimesPorTorneio,
  listarPartidasPorTorneio,
  criarPartida,
  atualizarPartida,
  excluirPartida,
} from '@/lib/data';
import { Torneio, Time, Partida } from '@/types';

const vazio = { fase: '', timeA: '', timeB: '', placarA: '', placarB: '', finalizada: false };

export default function AdminResultadosPage() {
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [torneioId, setTorneioId] = useState('');
  const [times, setTimes] = useState<Time[]>([]);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [form, setForm] = useState(vazio);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    listarTorneios().then((t) => {
      setTorneios(t);
      if (t.length) setTorneioId(t[0].id);
    }).catch(() => {});
  }, []);

  async function carregar(id: string) {
    if (!id) return;
    const [t, p] = await Promise.all([
      listarTimesPorTorneio(id).catch(() => []),
      listarPartidasPorTorneio(id).catch(() => []),
    ]);
    setTimes(t);
    setPartidas(p);
  }

  useEffect(() => {
    carregar(torneioId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [torneioId]);

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.timeA || !form.timeB) return alert('Selecione os dois times.');
    setSalvando(true);
    try {
      const dados: any = {
        torneioId,
        fase: form.fase,
        timeA: form.timeA,
        timeB: form.timeB,
        finalizada: form.finalizada,
      };
      if (form.placarA !== '') dados.placarA = Number(form.placarA);
      if (form.placarB !== '') dados.placarB = Number(form.placarB);

      await criarPartida(dados);
      setForm(vazio);
      await carregar(torneioId);
    } finally {
      setSalvando(false);
    }
  }

  async function atualizarPlacar(p: Partida, placarA: number, placarB: number, finalizada: boolean) {
    await atualizarPartida(p.id, { placarA, placarB, finalizada });
    await carregar(torneioId);
  }

  async function excluir(id: string) {
    if (!confirm('Excluir esta partida?')) return;
    await excluirPartida(id);
    await carregar(torneioId);
  }

  const nomeTime = (id: string) => times.find((t) => t.id === id)?.nome ?? '—';

  return (
    <RequireAuth>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-10 py-10">
          <p className="eyebrow mb-2">Gestão</p>
          <h1 className="font-display text-3xl font-semibold">Resultados</h1>

          <div className="mt-6 max-w-xs">
            <label className="label">Torneio</label>
            <select className="input" value={torneioId} onChange={(e) => setTorneioId(e.target.value)}>
              {torneios.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {partidas.length === 0 && <p className="text-muted">Nenhuma partida cadastrada.</p>}
              {partidas.map((p) => (
                <div key={p.id} className="card p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-xs text-signal">{p.fase}</span>
                    <button onClick={() => excluir(p.id)} className="text-xs text-alert hover:underline">Excluir</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex-1 truncate">{nomeTime(p.timeA)}</span>
                    <input
                      type="number"
                      defaultValue={p.placarA ?? ''}
                      className="input w-16 text-center"
                      onBlur={(e) =>
                        atualizarPlacar(p, Number(e.target.value), p.placarB ?? 0, true)
                      }
                    />
                    <span className="text-muted">:</span>
                    <input
                      type="number"
                      defaultValue={p.placarB ?? ''}
                      className="input w-16 text-center"
                      onBlur={(e) =>
                        atualizarPlacar(p, p.placarA ?? 0, Number(e.target.value), true)
                      }
                    />
                    <span className="flex-1 truncate text-right">{nomeTime(p.timeB)}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={criar} className="card h-fit space-y-4 p-6">
              <h2 className="font-display font-semibold">Nova partida</h2>
              <div>
                <label className="label">Fase</label>
                <input required className="input" value={form.fase} onChange={(e) => setForm({ ...form, fase: e.target.value })} placeholder="Grupo A / Semifinal / Final" />
              </div>
              <div>
                <label className="label">Time A</label>
                <select required className="input" value={form.timeA} onChange={(e) => setForm({ ...form, timeA: e.target.value })}>
                  <option value="">Selecione</option>
                  {times.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Time B</label>
                <select required className="input" value={form.timeB} onChange={(e) => setForm({ ...form, timeB: e.target.value })}>
                  <option value="">Selecione</option>
                  {times.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>
              <button type="submit" disabled={salvando} className="btn-primary w-full disabled:opacity-60">
                {salvando ? 'Criando…' : 'Criar partida'}
              </button>
              <p className="text-xs text-muted">Depois de criar, edite o placar direto na lista ao lado (o resultado salva ao sair do campo).</p>
            </form>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
