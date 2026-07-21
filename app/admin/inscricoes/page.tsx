'use client';

import { useEffect, useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminSidebar } from '@/components/AdminSidebar';
import {
  listarTorneios,
  listarInscricoesPorTorneio,
  atualizarInscricao,
  excluirInscricao,
  criarTime,
} from '@/lib/data';
import { Torneio, Inscricao } from '@/types';

export default function AdminInscricoesPage() {
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [torneioId, setTorneioId] = useState('');
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [processando, setProcessando] = useState<string | null>(null);

  useEffect(() => {
    listarTorneios().then((t) => {
      setTorneios(t);
      if (t.length) setTorneioId(t[0].id);
    }).catch(() => {});
  }, []);

  async function carregar(id: string) {
    if (!id) return setInscricoes([]);
    setInscricoes(await listarInscricoesPorTorneio(id).catch(() => []));
  }

  useEffect(() => {
    carregar(torneioId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [torneioId]);

  async function aprovar(insc: Inscricao) {
    setProcessando(insc.id);
    try {
      await criarTime({
        torneioId: insc.torneioId,
        nome: insc.nomeTime,
        tag: insc.tag,
        capitao: insc.capitao,
        contato: insc.contato,
        jogadores: insc.jogadores,
      });
      await atualizarInscricao(insc.id, { status: 'aprovada' });
      await carregar(torneioId);
    } finally {
      setProcessando(null);
    }
  }

  async function rejeitar(id: string) {
    setProcessando(id);
    try {
      await atualizarInscricao(id, { status: 'rejeitada' });
      await carregar(torneioId);
    } finally {
      setProcessando(null);
    }
  }

  async function excluir(id: string) {
    if (!confirm('Excluir esta inscrição definitivamente?')) return;
    await excluirInscricao(id);
    await carregar(torneioId);
  }

  const aguardandoPagamento = inscricoes.filter((i) => i.status === 'aguardando_pagamento');
  const pendentes = inscricoes.filter((i) => i.status === 'pendente');
  const processadas = inscricoes.filter((i) => !['pendente', 'aguardando_pagamento'].includes(i.status));

  return (
    <RequireAuth>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-10 py-10">
          <p className="eyebrow mb-2">Gestão</p>
          <h1 className="font-display text-3xl font-semibold">Inscrições</h1>

          <div className="mt-6 max-w-xs">
            <label className="label">Torneio</label>
            <select className="input" value={torneioId} onChange={(e) => setTorneioId(e.target.value)}>
              {torneios.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>

          {aguardandoPagamento.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 font-display text-lg font-semibold">Aguardando pagamento ({aguardandoPagamento.length})</h2>
              <p className="mb-3 text-xs text-muted">
                Times que começaram a inscrição mas ainda não confirmaram o PIX. Aparecem aqui só como acompanhamento — nada pra fazer ainda.
              </p>
              <div className="space-y-2">
                {aguardandoPagamento.map((i) => (
                  <div key={i.id} className="card flex items-center justify-between p-4">
                    <p className="font-medium">{i.nomeTime} <span className="font-mono text-xs text-muted">({i.tag})</span></p>
                    <span className="font-mono text-xs text-muted">R$ {i.valorPago?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10">
            <h2 className="mb-4 font-display text-lg font-semibold">Pendentes ({pendentes.length})</h2>
            {pendentes.length === 0 && <p className="text-muted">Nenhuma inscrição pendente.</p>}
            <div className="space-y-3">
              {pendentes.map((i) => (
                <div key={i.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-display font-semibold">{i.nomeTime} <span className="font-mono text-xs text-muted">({i.tag})</span></p>
                      <p className="mt-1 text-sm text-muted">Capitão: {i.capitao} · Contato: {i.contato}</p>
                      <p className="mt-1 text-xs text-muted">Jogadores: {i.jogadores.join(', ')}</p>
                      {i.valorPago && (
                        <p className="mt-1 font-mono text-xs text-signal">Pago: R$ {i.valorPago.toFixed(2)}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => aprovar(i)}
                        disabled={processando === i.id}
                        className="rounded-none border border-live/40 px-3 py-1.5 text-xs uppercase tracking-wider text-live hover:bg-live/10 disabled:opacity-50"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => rejeitar(i.id)}
                        disabled={processando === i.id}
                        className="rounded-none border border-alert/40 px-3 py-1.5 text-xs uppercase tracking-wider text-alert hover:bg-alert/10 disabled:opacity-50"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {processadas.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 font-display text-lg font-semibold">Processadas</h2>
              <div className="space-y-2">
                {processadas.map((i) => (
                  <div key={i.id} className="card flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{i.nomeTime} <span className="font-mono text-xs text-muted">({i.tag})</span></p>
                      <p className="font-mono text-xs uppercase tracking-wider text-muted">
                        {i.status === 'aprovada'
                          ? 'Aprovada — time criado'
                          : i.status === 'rejeitada'
                          ? 'Rejeitada'
                          : 'Pagamento recusado'}
                      </p>
                    </div>
                    <button onClick={() => excluir(i.id)} className="text-xs text-muted hover:text-alert">Excluir</button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </RequireAuth>
  );
}
