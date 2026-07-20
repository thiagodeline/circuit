'use client';

import { useEffect, useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminSidebar } from '@/components/AdminSidebar';
import { StatusBadge } from '@/components/StatusBadge';
import { listarTorneios, criarTorneio, atualizarTorneio, excluirTorneio } from '@/lib/data';
import { Torneio, StatusTorneio } from '@/types';

const vazio = {
  slug: '',
  nome: '',
  descricao: '',
  status: 'em_breve' as StatusTorneio,
  formato: '',
  dataInicio: '',
};

export default function AdminTorneiosPage() {
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState(vazio);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    const lista = await listarTorneios().catch(() => []);
    setTorneios(lista);
  }

  useEffect(() => {
    carregar();
  }, []);

  function iniciarEdicao(t: Torneio) {
    setEditando(t.id);
    setForm({
      slug: t.slug,
      nome: t.nome,
      descricao: t.descricao,
      status: t.status,
      formato: t.formato,
      dataInicio: t.dataInicio,
    });
  }

  function cancelar() {
    setEditando(null);
    setForm(vazio);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      if (editando) {
        await atualizarTorneio(editando, form);
      } else {
        await criarTorneio(form);
      }
      cancelar();
      await carregar();
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id: string) {
    if (!confirm('Excluir este torneio? Essa ação não pode ser desfeita.')) return;
    await excluirTorneio(id);
    await carregar();
  }

  return (
    <RequireAuth>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-10 py-10">
          <p className="eyebrow mb-2">Gestão</p>
          <h1 className="font-display text-3xl font-semibold">Torneios</h1>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Lista */}
            <div className="space-y-3">
              {torneios.length === 0 && <p className="text-muted">Nenhum torneio cadastrado ainda.</p>}
              {torneios.map((t) => (
                <div key={t.id} className="card flex items-center justify-between p-4">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <StatusBadge status={t.status} />
                      <p className="font-display font-semibold">{t.nome}</p>
                    </div>
                    <p className="font-mono text-xs text-muted">/{t.slug} · {t.formato}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => iniciarEdicao(t)} className="btn-secondary px-3 py-1.5 text-xs">
                      Editar
                    </button>
                    <button
                      onClick={() => excluir(t.id)}
                      className="rounded-lg border border-alert/40 px-3 py-1.5 text-xs text-alert hover:bg-alert/10"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Formulário */}
            <form onSubmit={salvar} className="card h-fit space-y-4 p-6">
              <h2 className="font-display font-semibold">
                {editando ? 'Editar torneio' : 'Novo torneio'}
              </h2>
              <div>
                <label className="label">Nome</label>
                <input
                  required
                  className="input"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Circuit Zen"
                />
              </div>
              <div>
                <label className="label">Slug (URL)</label>
                <input
                  required
                  className="input"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="circuit-zen"
                />
              </div>
              <div>
                <label className="label">Descrição</label>
                <textarea
                  required
                  className="input min-h-20"
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Formato</label>
                <input
                  className="input"
                  value={form.formato}
                  onChange={(e) => setForm({ ...form, formato: e.target.value })}
                  placeholder="8 times · 2 grupos · playoffs"
                />
              </div>
              <div>
                <label className="label">Status</label>
                <select
                  className="input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as StatusTorneio })}
                >
                  <option value="em_breve">Em breve</option>
                  <option value="inscricoes_abertas">Inscrições abertas</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>
              <div>
                <label className="label">Data de início</label>
                <input
                  type="date"
                  className="input"
                  value={form.dataInicio}
                  onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={salvando} className="btn-primary flex-1 disabled:opacity-60">
                  {salvando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Criar torneio'}
                </button>
                {editando && (
                  <button type="button" onClick={cancelar} className="btn-secondary">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
