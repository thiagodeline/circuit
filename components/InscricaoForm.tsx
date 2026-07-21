'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { criarInscricao } from '@/lib/data';
import { Torneio } from '@/types';

type Etapa = 'formulario' | 'aguardando_pix' | 'pago' | 'enviado';

export function InscricaoForm({ torneio }: { torneio: Torneio }) {
  const ehPago = Boolean(torneio.valorInscricao && torneio.valorInscricao > 0);

  const [etapa, setEtapa] = useState<Etapa>('formulario');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [pix, setPix] = useState<{ inscricaoId: string; qrCodeBase64: string | null; copiaCola: string | null } | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [form, setForm] = useState({
    nomeTime: '',
    tag: '',
    capitao: '',
    contato: '',
    jogadores: '',
    email: '',
  });

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  async function enviarGratuito(e: React.FormEvent) {
    e.preventDefault();
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
      setEtapa('enviado');
    } catch {
      setErro('Não foi possível enviar sua inscrição. Tente novamente em instantes.');
    } finally {
      setEnviando(false);
    }
  }

  async function gerarPix(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      const resp = await fetch('/api/inscricao/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          torneioId: torneio.id,
          nomeTime: form.nomeTime,
          tag: form.tag,
          capitao: form.capitao,
          contato: form.contato,
          jogadores: form.jogadores.split(',').map((j) => j.trim()).filter(Boolean),
          payerEmail: form.email,
        }),
      });
      const dados = await resp.json();
      if (!resp.ok) {
        setErro(dados.erro || 'Não foi possível gerar o pagamento.');
        return;
      }
      setPix(dados);
      setEtapa('aguardando_pix');

      // Fica perguntando ao servidor se o PIX já caiu, a cada 4 segundos
      pollRef.current = setInterval(async () => {
        const r = await fetch(`/api/inscricao/status?id=${dados.inscricaoId}`);
        const d = await r.json();
        if (d.status === 'pendente') {
          setEtapa('pago');
          if (pollRef.current) clearInterval(pollRef.current);
        } else if (d.status === 'pagamento_recusado') {
          setErro('O pagamento foi recusado. Tente novamente.');
          setEtapa('formulario');
          if (pollRef.current) clearInterval(pollRef.current);
        }
      }, 4000);
    } catch {
      setErro('Não foi possível gerar o pagamento. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  function copiarCodigo() {
    if (pix?.copiaCola) navigator.clipboard.writeText(pix.copiaCola);
  }

  // --- TELAS DE CONFIRMAÇÃO ---
  if (etapa === 'enviado' || etapa === 'pago') {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="eyebrow mb-3 justify-center">Inscrição enviada</p>
        <h1 className="font-display text-3xl font-semibold">
          {etapa === 'pago' ? 'Pagamento confirmado!' : 'Recebemos a inscrição do seu time!'}
        </h1>
        <p className="mt-4 text-muted">
          A staff da Circuit vai revisar os dados e confirmar sua participação no {torneio.nome}
          {' '}pelo contato informado.
        </p>
        <Link href={`/torneios/${torneio.slug}`} className="btn-secondary mt-8 inline-flex">
          Voltar ao torneio
        </Link>
      </div>
    );
  }

  // --- TELA DE PAGAMENTO PIX ---
  if (etapa === 'aguardando_pix' && pix) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="eyebrow mb-3 justify-center">{torneio.nome}</p>
        <h1 className="font-display text-2xl font-semibold">Pague com PIX para confirmar</h1>
        <p className="mt-2 text-sm text-muted">
          Valor: <span className="text-signal">R$ {torneio.valorInscricao?.toFixed(2)}</span>
        </p>

        {pix.qrCodeBase64 && (
          <img
            src={`data:image/png;base64,${pix.qrCodeBase64}`}
            alt="QR Code do PIX"
            className="mx-auto mt-6 h-56 w-56"
          />
        )}

        {pix.copiaCola && (
          <div className="mt-6">
            <p className="label text-left">Ou copie o código PIX</p>
            <div className="flex gap-2">
              <input readOnly value={pix.copiaCola} className="input flex-1 truncate text-xs" />
              <button onClick={copiarCodigo} className="btn-secondary flex-shrink-0 text-xs">Copiar</button>
            </div>
          </div>
        )}

        <p className="mt-8 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
          <span className="h-1.5 w-1.5 animate-pulse bg-signal" />
          Aguardando confirmação do pagamento…
        </p>
      </div>
    );
  }

  // --- FORMULÁRIO ---
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <p className="eyebrow mb-3">{torneio.nome}</p>
      <h1 className="font-display text-3xl font-semibold">Inscrever time</h1>
      <p className="mt-3 text-muted">
        Preencha os dados do seu time para participar deste torneio.
        {ehPago && (
          <> A inscrição custa <strong className="text-signal">R$ {torneio.valorInscricao?.toFixed(2)}</strong>, pago via PIX no próximo passo.</>
        )}
      </p>

      <form onSubmit={ehPago ? gerarPix : enviarGratuito} className="card mt-8 space-y-4 p-6">
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
        {ehPago && (
          <div>
            <label className="label">Email para o recibo do pagamento</label>
            <input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="capitao@email.com" />
          </div>
        )}
        {erro && <p className="text-sm text-alert">{erro}</p>}
        <button type="submit" disabled={enviando} className="btn-primary w-full disabled:opacity-60">
          {enviando ? 'Processando…' : ehPago ? 'Gerar PIX e continuar' : 'Enviar inscrição'}
        </button>
      </form>
    </div>
  );
}
