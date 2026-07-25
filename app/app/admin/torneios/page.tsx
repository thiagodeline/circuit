'use client';

import { useEffect, useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminSidebar } from '@/components/AdminSidebar';
import { StatusBadge } from '@/components/StatusBadge';
import { listarTorneios, criarTorneio, atualizarTorneio, excluirTorneio } from '@/lib/data';
import { Torneio, StatusTorneio, FaseCircuito, FASES_CIRCUITO } from '@/types';

const vazio = {
  slug: '',
  nome: '',
  descricao: '',
  status: 'em_breve' as StatusTorneio,
  faseCircuito: '' as FaseCircuito | '',
  edicao: '',
  etapaAtiva: false,
  formato: '',
  dataInicio: '',
  dataFim: '',
  local: '',
  premiacao: '',
  regras: '',
  regulamentoUrl: '',
  streamUrl: '',
  valorInscricao: '',
  capa: '',
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
      faseCircuito: t.faseCircuito || '',
      edicao: t.edicao || '',
      etapaAtiva: Boolean(t.etapaAtiva),
      formato: t.formato,
      dataInicio: t.dataInicio,
      dataFim: t.dataFim || '',
      local: t.local || '',
      premiacao: t.premiacao || '',
      regras: t.regras || '',
      regulamentoUrl: t.regulamentoUrl || '',
      streamUrl: t.streamUrl || '',
      valorInscricao: t.valorInscricao ? String(t.valorInscricao) : '',
      capa: t.capa || '',
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
      const dados: any = { ...form };
      if (form.valorInscricao) {
        dados.valorInscricao = Number(form.valorInscricao);
      } else {
        delete dados.valorInscricao; // sem valor = inscrição gratuita
      }
      if (!dados.faseCircuito) delete dados.faseCircuito;
      if (!dados.edicao) delete dados.edicao;

      let novoId = editando;
      if (editando) {
        await atualizarTorneio(editando, dados);
      } else {
        const ref = await criarTorneio(dados);
        novoId = ref.id;
      }

      // Só um torneio pode ser "etapa atual" por vez — desmarca os demais.
      if (dados.etapaAtiva && novoId) {
        await Promise.all(
          torneios
            .filter((t) => t.id !== novoId && t.etapaAtiva)
            .map((t) => atualizarTorneio(t.id, { etapaAtiva: false }))
        );
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
                <label className="label">Formato (descrição)</label>
                <input
                  className="input"
                  value={form.formato}
                  onChange={(e) => setForm({ ...form, formato: e.target.value })}
                  placeholder="8 times · 2 grupos · playoffs"
                />
              </div>
              <div>
                <label className="label">Link do regulamento (PDF)</label>
                <input
                  className="input"
                  value={form.regulamentoUrl}
                  onChange={(e) => setForm({ ...form, regulamentoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="label">Canal da stream (Twitch/YouTube)</label>
                <input
                  className="input"
                  value={form.streamUrl}
                  onChange={(e) => setForm({ ...form, streamUrl: e.target.value })}
                  placeholder="https://twitch.tv/..."
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
                <label className="label">Etapa do Circuito</label>
                <select
                  className="input"
                  value={form.faseCircuito}
                  onChange={(e) => setForm({ ...form, faseCircuito: e.target.value as FaseCircuito | '' })}
                >
                  <option value="">Sem etapa vinculada</option>
                  {FASES_CIRCUITO.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-muted">
                  Vincula este torneio ao menu "Etapas" do site e à linha do tempo da home.
                </p>
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
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.etapaAtiva}
                  onChange={(e) => setForm({ ...form, etapaAtiva: e.target.checked })}
                  className="h-4 w-4 rounded border-white/20 bg-white/5"
                />
                Etapa atual (destaca este torneio no menu e na home — desmarca automaticamente as demais)
              </label>
              <div>
                <label className="label">Data de início</label>
                <input
                  type="date"
                  className="input"
                  value={form.dataInicio}
                  onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Data de término</label>
                <input
                  type="date"
                  className="input"
                  value={form.dataFim}
                  onChange={(e) => setForm({ ...form, dataFim: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Local</label>
                <input
                  className="input"
                  value={form.local}
                  onChange={(e) => setForm({ ...form, local: e.target.value })}
                  placeholder="Online / São Paulo, SP"
                />
              </div>
              <div>
                <label className="label">Premiação</label>
                <input
                  className="input"
                  value={form.premiacao}
                  onChange={(e) => setForm({ ...form, premiacao: e.target.value })}
                  placeholder="R$ 2.000 para o campeão"
                />
              </div>
              <div>
                <label className="label">Regras / observações</label>
                <textarea
                  className="input min-h-24"
                  value={form.regras}
                  onChange={(e) => setForm({ ...form, regras: e.target.value })}
                  placeholder="Regras de campeonato, formato de partida (MD1/MD3), horários, etc."
                />
              </div>
              <div>
                <label className="label">Valor da inscrição (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="input"
                  value={form.valorInscricao}
                  onChange={(e) => setForm({ ...form, valorInscricao: e.target.value })}
                  placeholder="Deixe em branco para inscrição gratuita"
                />
                <p className="mt-1 text-xs text-muted">
                  Se preenchido, o time precisa pagar via PIX (Mercado Pago) para concluir a inscrição.
                </p>
              </div>
              <div>
                <label className="label">URL da imagem de capa</label>
                <input
                  className="input"
                  value={form.capa}
                  onChange={(e) => setForm({ ...form, capa: e.target.value })}
                  placeholder="https://..."
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
