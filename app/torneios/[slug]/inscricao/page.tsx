'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { buscarTorneioPorSlug, criarInscricao } from '@/lib/data';
import { Torneio } from '@/types';

export default function InscricaoPage() {
  const params = useParams<{ slug: string }>();

  const [torneio, setTorneio] = useState<Torneio | null | undefined>(undefined); // undefined = carregando
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const [form, setForm] = useState({
    nomeTime: '',
    tag: '',
    capitao: '',
    contato: '',
    jogadores: '',
  });

  useEffect(() => {
    buscarTorneioPorSlug(params.slug)
      .then(setTorneio)
      .catch(() => setTorneio(null));
  }, [params.slug]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!torneio) return;
    setErro('');
    setEnviando(true);
    try {
      await criarInscricao({
        torneioId: torneio.id,
        nomeTime: form.nomeTime,
        tag: form.tag,
        capitao: form.capitao,
        contato: form.contato,
        jogadores: form.jogadores.split(',').map((j) => j.trim()).filter(Boolean),
      });
      setEnviado(true);
    } catch {
      setErro('Não foi possível enviar sua inscrição. Tente novamente em instantes.');
    } finally {
      setEnviando(false);
    }
  }

  if (torneio === undefined) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-xl px-6 py-24 text-center text-muted">Carregando…</main>
        <SiteFooter />
      </>
    );
  }

  if (!torneio) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-xl px-6 py-24 text-center text-muted">Torneio não encontrado.</main>
        <SiteFooter />
      </>
    );
  }

  if (torneio.status !== 'inscricoes_abertas') {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <p className="text-muted">As inscrições para <strong className="text-ink">{torneio.nome}</strong> não estão abertas no momento.</p>
          <Link href={`/torneios/${torneio.slug}`} className="btn-secondary mt-6 inline-flex">
            Voltar ao torneio
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (enviado) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <p className="eyebrow mb-3 justify-center">Inscrição enviada</p>
          <h1 className="font-display text-3xl font-semibold">Recebemos a inscrição do seu time!</h1>
          <p className="mt-4 text-muted">
            A staff da Circuit vai revisar os dados e confirmar sua participação no {torneio.nome}
            {' '}pelo contato informado.
          </p>
          <Link href={`/torneios/${torneio.slug}`} className="btn-secondary mt-8 inline-flex">
            Voltar ao torneio
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-6 py-16">
        <p className="eyebrow mb-3">{torneio.nome}</p>
        <h1 className="font-display text-3xl font-semibold">Inscrever time</h1>
        <p className="mt-3 text-muted">Preencha os dados do seu time para participar deste torneio.</p>

        <form onSubmit={enviar} className="card mt-8 space-y-4 p-6">
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
          <div>
            <label className="label">Jogadores (separados por vírgula)</label>
            <textarea required className="input min-h-20" value={form.jogadores} onChange={(e) => setForm({ ...form, jogadores: e.target.value })} placeholder="Nick1, Nick2, Nick3, Nick4, Nick5" />
          </div>
          {erro && <p className="text-sm text-alert">{erro}</p>}
          <button type="submit" disabled={enviando} className="btn-primary w-full disabled:opacity-60">
            {enviando ? 'Enviando…' : 'Enviar inscrição'}
          </button>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}
