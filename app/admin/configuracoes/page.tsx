'use client';

import { useEffect, useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminSidebar } from '@/components/AdminSidebar';
import { buscarConfigTemporada, atualizarConfigTemporada, ConfigTemporada } from '@/lib/data';

export default function AdminConfiguracoesPage() {
  const [form, setForm] = useState<ConfigTemporada | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    buscarConfigTemporada().then(setForm);
  }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSalvando(true);
    setSalvo(false);
    try {
      await atualizarConfigTemporada(form);
      setSalvo(true);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <RequireAuth>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-10 py-10">
          <p className="eyebrow mb-2">Gestão</p>
          <h1 className="font-display text-3xl font-semibold">Inscrição e Premiação</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Valores exibidos nas páginas públicas (Série A, Série B e Manual Circuit).
          </p>

          {!form ? (
            <p className="mt-8 text-muted">Carregando…</p>
          ) : (
            <form onSubmit={salvar} className="card mt-8 max-w-xl space-y-6 p-6">
              <div>
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-signal">Série A</p>
                <div className="space-y-3">
                  <div>
                    <label className="label">Texto da inscrição</label>
                    <input className="input" value={form.inscricaoSerieA} onChange={(e) => setForm({ ...form, inscricaoSerieA: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Prêmio 1º lugar</label>
                      <input className="input" value={form.premio1SerieA} onChange={(e) => setForm({ ...form, premio1SerieA: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">Prêmio 2º lugar</label>
                      <input className="input" value={form.premio2SerieA} onChange={(e) => setForm({ ...form, premio2SerieA: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-signal">Série B</p>
                <div className="space-y-3">
                  <div>
                    <label className="label">Texto da inscrição</label>
                    <input className="input" value={form.inscricaoSerieB} onChange={(e) => setForm({ ...form, inscricaoSerieB: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Prêmio 1º lugar</label>
                      <input className="input" value={form.premio1SerieB} onChange={(e) => setForm({ ...form, premio1SerieB: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">Prêmio 2º lugar</label>
                      <input className="input" value={form.premio2SerieB} onChange={(e) => setForm({ ...form, premio2SerieB: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>

              {salvo && <p className="text-sm text-live">Salvo com sucesso.</p>}
              <button type="submit" disabled={salvando} className="btn-primary w-full disabled:opacity-60">
                {salvando ? 'Salvando…' : 'Salvar alterações'}
              </button>
            </form>
          )}
        </main>
      </div>
    </RequireAuth>
  );
}
