'use client';

import { useEffect, useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminSidebar } from '@/components/AdminSidebar';
import {
  listarTorneios,
  buscarTorneioPorFase,
  listarTimesPorTorneio,
  listarPartidasPorTorneio,
  atualizarTime,
} from '@/lib/data';
import { calcularTabelaLiga } from '@/lib/standings';
import { Torneio, Time } from '@/types';

export default function AdminTemporadaPage() {
  const [serieA, setSerieA] = useState<Torneio | null>(null);
  const [serieB, setSerieB] = useState<Torneio | null>(null);
  const [times, setTimes] = useState<Time[]>([]);
  const [rebaixados, setRebaixados] = useState<Time[]>([]);
  const [processando, setProcessando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [erro, setErro] = useState('');

  async function carregar() {
    const [a, b] = await Promise.all([
      buscarTorneioPorFase('Série A').catch(() => null),
      buscarTorneioPorFase('Série B').catch(() => null),
    ]);
    setSerieA(a);
    setSerieB(b);

    if (a) {
      const [t, p] = await Promise.all([
        listarTimesPorTorneio(a.id).catch(() => []),
        listarPartidasPorTorneio(a.id).catch(() => []),
      ]);
      setTimes(t);
      const tabela = calcularTabelaLiga(t, p, 'serie-a');
      setRebaixados(tabela.filter((l) => l.zona === 'rebaixamento').map((l) => l.time));
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function processarTransicao() {
    if (!serieB) {
      setErro('Cadastre o torneio da Série B no admin antes de processar a transição.');
      return;
    }
    if (rebaixados.length === 0) {
      setErro('Não há times na zona de rebaixamento (verifique se todas as partidas da Série A foram finalizadas).');
      return;
    }
    if (!confirm(`Mover ${rebaixados.length} time(s) rebaixado(s) para a Série B? Essa ação não pode ser desfeita automaticamente.`)) return;

    setProcessando(true);
    setErro('');
    try {
      await Promise.all(rebaixados.map((t) => atualizarTime(t.id, { torneioId: serieB.id })));
      setConcluido(true);
      await carregar();
    } catch {
      setErro('Não foi possível processar a transição. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  }

  return (
    <RequireAuth>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-10 py-10">
          <p className="eyebrow mb-2">Gestão</p>
          <h1 className="font-display text-3xl font-semibold">Encerramento de Temporada</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Ao final do Split, processe a transição: os times na zona de rebaixamento da Série A são
            movidos automaticamente para o torneio da Série B, liberando as 2 vagas deles na Série A
            do próximo Split.
          </p>

          {!serieA && (
            <div className="card mt-8 p-6 text-muted">
              Cadastre um torneio com Etapa "Série A" no admin de Torneios antes de usar esta tela.
            </div>
          )}

          {serieA && (
            <>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="card p-5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Série A</p>
                  <p className="mt-1 font-medium">{serieA.nome}</p>
                </div>
                <div className="card p-5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Série B</p>
                  <p className="mt-1 font-medium">{serieB ? serieB.nome : 'Ainda não cadastrada'}</p>
                </div>
              </div>

              <div className="card mt-8 p-6">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-alert">
                  Zona de rebaixamento ({rebaixados.length})
                </p>
                {rebaixados.length === 0 ? (
                  <p className="mt-3 text-sm text-muted">
                    Nenhum time identificado na zona de rebaixamento ainda — finalize todas as
                    partidas da Série A para calcular a posição final.
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {rebaixados.map((t) => (
                      <div key={t.id} className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2">
                        <span className="font-medium">{t.nome}</span>
                        <span className="font-mono text-xs text-muted">({t.tag})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {erro && <p className="mt-4 text-sm text-alert">{erro}</p>}
              {concluido && <p className="mt-4 text-sm text-live">Transição processada com sucesso.</p>}

              <button
                onClick={processarTransicao}
                disabled={processando || rebaixados.length === 0}
                className="btn-primary mt-6 disabled:opacity-40"
              >
                {processando ? 'Processando…' : 'Processar Rebaixamento → Série B'}
              </button>
            </>
          )}
        </main>
      </div>
    </RequireAuth>
  );
}
