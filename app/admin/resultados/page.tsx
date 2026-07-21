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

const vazio = { fase: '', timeA: '', timeB: '', finalizada: false };

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
    if (!form.fase) return alert('Preencha a fase.');
    setSalvando(true);
    try {
      // timeA/timeB podem ficar em branco — significa "a definir" (útil pra criar
      // os slots dos playoffs antes de saber quem se classificou)
      await criarPartida({
        torneioId,
        fase: form.fase,
        timeA: form.timeA,
        timeB: form.timeB,
        finalizada: false,
      });
      setForm(vazio);
      await carregar(torneioId);
    } finally {
      setSalvando(false);
    }
  }

  async function atualizarTimeDaPartida(p: Partida, campo: 'timeA' | 'timeB', valor: string) {
    await atualizarPartida(p.id, { [campo]: valor });
    await carregar(torneioId);
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
                    <select
                      className="input flex-1"
                      value={p.timeA}
                      onChange={(e) => atualizarTimeDaPartida(p, 'timeA', e.target.value)}
                    >
                      <option value="">A definir</option>
                      {times.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
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
                    <select
                      className="input flex-1"
                      value={p.timeB}
                      onChange={(e) => atualizarTimeDaPartida(p, 'timeB', e.target.value)}
                    >
                      <option value="">A definir</option>
                      {times.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={criar} className="card h-fit space-y-4 p-6">
              <h2 className="font-display font-semibold">Nova partida</h2>
              <div>
                <label className="label">Fase</label>
                <input required className="input" value={form.fase} onChange={(e) => setForm({ ...form, fase: e.target.value })} placeholder="Grupo A / Quartas de Final / Semifinal / Final" />
              </div>
              <div>
                <label className="label">Time A</label>
                <select className="input" value={form.timeA} onChange={(e) => setForm({ ...form, timeA: e.target.value })}>
                  <option value="">A definir</option>
                  {times.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Time B</label>
                <select className="input" value={form.timeB} onChange={(e) => setForm({ ...form, timeB: e.target.value })}>
                  <option value="">A definir</option>
                  {times.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>
              <button type="submit" disabled={salvando} className="btn-primary w-full disabled:opacity-60">
                {salvando ? 'Criando…' : 'Criar partida'}
              </button>
              <p className="text-xs text-muted">
                Para os playoffs: crie a partida deixando os times como "A definir" — depois, quando
                souber quem se classificou, volte aqui e escolha os times na lista ao lado. O placar
                também salva direto na lista ao sair do campo.
              </p>
            </form>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
