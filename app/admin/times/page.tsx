'use client';

import { useEffect, useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminSidebar } from '@/components/AdminSidebar';
import { listarTorneios, listarTimesPorTorneio, criarTime, atualizarTime, excluirTime } from '@/lib/data';
import { Torneio, Time } from '@/types';

const vazio = { nome: '', tag: '', logo: '', bio: '', capitao: '', contato: '', grupo: '', jogadores: '' };

export default function AdminTimesPage() {
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [torneioId, setTorneioId] = useState('');
  const [times, setTimes] = useState<Time[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState(vazio);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    listarTorneios().then((t) => {
      setTorneios(t);
      if (t.length && !torneioId) setTorneioId(t[0].id);
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function carregarTimes(id: string) {
    if (!id) return setTimes([]);
    const lista = await listarTimesPorTorneio(id).catch(() => []);
    setTimes(lista);
  }

  useEffect(() => {
    carregarTimes(torneioId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [torneioId]);

  function iniciarEdicao(t: Time) {
    setEditando(t.id);
    setForm({
      nome: t.nome,
      tag: t.tag,
      logo: t.logo || '',
      bio: t.bio || '',
      capitao: t.capitao,
      contato: t.contato,
      grupo: t.grupo || '',
      jogadores: t.jogadores.join(', '),
    });
  }

  function cancelar() {
    setEditando(null);
    setForm(vazio);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!torneioId) return alert('Cadastre um torneio antes de adicionar times.');
    setSalvando(true);
    const dados = {
      torneioId,
      nome: form.nome,
      tag: form.tag,
      logo: form.logo,
      bio: form.bio,
      capitao: form.capitao,
      contato: form.contato,
      grupo: form.grupo,
      jogadores: form.jogadores.split(',').map((j) => j.trim()).filter(Boolean),
    };
    try {
      if (editando) {
        await atualizarTime(editando, dados);
      } else {
        await criarTime(dados);
      }
      cancelar();
      await carregarTimes(torneioId);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id: string) {
    if (!confirm('Excluir este time?')) return;
    await excluirTime(id);
    await carregarTimes(torneioId);
  }

  return (
    <RequireAuth>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-10 py-10">
          <p className="eyebrow mb-2">Gestão</p>
          <h1 className="font-display text-3xl font-semibold">Times</h1>

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
              {times.length === 0 && <p className="text-muted">Nenhum time inscrito neste torneio.</p>}
              {times.map((t) => (
                <div key={t.id} className="card flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {t.logo ? (
                      <img src={t.logo} alt={t.nome} className="h-9 w-9 rounded-md object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface2 font-mono text-xs text-muted">
                        {t.tag.slice(0, 3)}
                      </div>
                    )}
                    <div>
                      <p className="font-display font-semibold">{t.nome} <span className="font-mono text-xs text-muted">({t.tag})</span></p>
                      <p className="text-xs text-muted">Capitão: {t.capitao} {t.grupo && `· ${t.grupo}`}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => iniciarEdicao(t)} className="btn-secondary px-3 py-1.5 text-xs">Editar</button>
                    <button onClick={() => excluir(t.id)} className="rounded-lg border border-alert/40 px-3 py-1.5 text-xs text-alert hover:bg-alert/10">Excluir</button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={salvar} className="card h-fit space-y-4 p-6">
              <h2 className="font-display font-semibold">{editando ? 'Editar time' : 'Novo time'}</h2>
              <div>
                <label className="label">Nome do time</label>
                <input required className="input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div>
                <label className="label">Tag</label>
                <input required className="input" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="ZEN" />
              </div>
              <div>
                <label className="label">URL do logo</label>
                <input className="input" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <label className="label">Capitão</label>
                <input required className="input" value={form.capitao} onChange={(e) => setForm({ ...form, capitao: e.target.value })} />
              </div>
              <div>
                <label className="label">Contato (Discord/email)</label>
                <input className="input" value={form.contato} onChange={(e) => setForm({ ...form, contato: e.target.value })} />
              </div>
              <div>
                <label className="label">Bio / história do time</label>
                <textarea className="input min-h-20" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Curta descrição sobre o time, trajetória, etc." />
              </div>
              <div>
                <label className="label">Grupo</label>
                <input className="input" value={form.grupo} onChange={(e) => setForm({ ...form, grupo: e.target.value })} placeholder="Grupo A" />
              </div>
              <div>
                <label className="label">Jogadores (separados por vírgula)</label>
                <textarea className="input min-h-16" value={form.jogadores} onChange={(e) => setForm({ ...form, jogadores: e.target.value })} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={salvando} className="btn-primary flex-1 disabled:opacity-60">
                  {salvando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Adicionar time'}
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
