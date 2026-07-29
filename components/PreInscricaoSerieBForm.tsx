'use client';

import { useState } from 'react';
import { criarPreInscricaoSerieB } from '@/lib/data';

export function PreInscricaoSerieBForm() {
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [form, setForm] = useState({ nomeTime: '', tag: '', capitao: '', contato: '' });

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await criarPreInscricaoSerieB(form);
      setEnviado(true);
    } catch {
      setErro('Não foi possível enviar. Tente novamente em instantes.');
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="card p-6 text-center">
        <p className="font-display text-lg font-semibold text-signal">Time na lista de espera!</p>
        <p className="mt-2 text-sm text-muted">
          Avisaremos pelo contato informado assim que as vagas da Série B abrirem oficialmente.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="card max-w-lg space-y-4 p-6">
      <div>
        <label className="label">Nome do time</label>
        <input required className="input" value={form.nomeTime} onChange={(e) => setForm({ ...form, nomeTime: e.target.value })} />
      </div>
      <div>
        <label className="label">Tag</label>
        <input required className="input" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="ZEN" />
      </div>
      <div>
        <label className="label">Capitão</label>
        <input required className="input" value={form.capitao} onChange={(e) => setForm({ ...form, capitao: e.target.value })} />
      </div>
      <div>
        <label className="label">Contato (Discord ou email)</label>
        <input required className="input" value={form.contato} onChange={(e) => setForm({ ...form, contato: e.target.value })} placeholder="usuario#0000 ou email@exemplo.com" />
      </div>
      {erro && <p className="text-sm text-alert">{erro}</p>}
      <button type="submit" disabled={enviando} className="btn-primary w-full disabled:opacity-60">
        {enviando ? 'Enviando…' : 'Entrar na lista de espera'}
      </button>
    </form>
  );
}
