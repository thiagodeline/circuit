'use client';

import { useEffect, useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminSidebar } from '@/components/AdminSidebar';
import { listarNoticias, criarNoticia, atualizarNoticia, excluirNoticia } from '@/lib/data';
import { Noticia } from '@/types';
import { useAuth } from '@/lib/auth-context';

const vazio = { slug: '', titulo: '', resumo: '', conteudo: '' };

export default function AdminNoticiasPage() {
  const { user } = useAuth();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState(vazio);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setNoticias(await listarNoticias().catch(() => []));
  }

  useEffect(() => {
    carregar();
  }, []);

  function iniciarEdicao(n: Noticia) {
    setEditando(n.id);
    setForm({ slug: n.slug, titulo: n.titulo, resumo: n.resumo, conteudo: n.conteudo });
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
        await atualizarNoticia(editando, form);
      } else {
        await criarNoticia({ ...form, autor: user?.email || 'Circuit' });
      }
      cancelar();
      await carregar();
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id: string) {
    if (!confirm('Excluir esta notícia?')) return;
    await excluirNoticia(id);
    await carregar();
  }

  return (
    <RequireAuth>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-10 py-10">
          <p className="eyebrow mb-2">Gestão</p>
          <h1 className="font-display text-3xl font-semibold">Notícias</h1>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
            <div className="space-y-3">
              {noticias.length === 0 && <p className="text-muted">Nenhuma notícia publicada.</p>}
              {noticias.map((n) => (
                <div key={n.id} className="card flex items-center justify-between p-4">
                  <div>
                    <p className="font-display font-semibold">{n.titulo}</p>
                    <p className="font-mono text-xs text-muted">/{n.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => iniciarEdicao(n)} className="btn-secondary px-3 py-1.5 text-xs">Editar</button>
                    <button onClick={() => excluir(n.id)} className="rounded-lg border border-alert/40 px-3 py-1.5 text-xs text-alert hover:bg-alert/10">Excluir</button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={salvar} className="card h-fit space-y-4 p-6">
              <h2 className="font-display font-semibold">{editando ? 'Editar notícia' : 'Nova notícia'}</h2>
              <div>
                <label className="label">Título</label>
                <input required className="input" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
              </div>
              <div>
                <label className="label">Slug (URL)</label>
                <input required className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div>
                <label className="label">Resumo</label>
                <textarea required className="input min-h-16" value={form.resumo} onChange={(e) => setForm({ ...form, resumo: e.target.value })} />
              </div>
              <div>
                <label className="label">Conteúdo</label>
                <textarea required className="input min-h-40" value={form.conteudo} onChange={(e) => setForm({ ...form, conteudo: e.target.value })} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={salvando} className="btn-primary flex-1 disabled:opacity-60">
                  {salvando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Publicar'}
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
