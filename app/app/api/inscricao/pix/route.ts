import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getPaymentClient } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { torneioId, nomeTime, tag, capitao, contato, jogadores, payerEmail } = body;

    if (!torneioId || !nomeTime || !tag || !capitao || !contato || !payerEmail) {
      return NextResponse.json({ erro: 'Dados incompletos.' }, { status: 400 });
    }

    // Busca o torneio no servidor para confirmar o valor real da inscrição —
    // nunca confia em um valor vindo do navegador.
    const torneioSnap = await adminDb.collection('torneios').doc(torneioId).get();
    if (!torneioSnap.exists) {
      return NextResponse.json({ erro: 'Torneio não encontrado.' }, { status: 404 });
    }
    const torneio = torneioSnap.data()!;

    if (torneio.status !== 'inscricoes_abertas') {
      return NextResponse.json({ erro: 'Inscrições não estão abertas para este torneio.' }, { status: 400 });
    }

    const valor = Number(torneio.valorInscricao || 0);
    if (!valor || valor <= 0) {
      return NextResponse.json({ erro: 'Este torneio não exige pagamento — use a inscrição gratuita.' }, { status: 400 });
    }

    // Cria a inscrição como "aguardando pagamento" — só vira "pendente" (visível
    // pra staff aprovar) depois que o webhook confirmar o PIX.
    const inscricaoRef = await adminDb.collection('inscricoes').add({
      torneioId,
      nomeTime,
      tag,
      capitao,
      contato,
      jogadores: Array.isArray(jogadores) ? jogadores : [],
      status: 'aguardando_pagamento',
      valorPago: valor,
      criadoEm: Date.now(),
    });

    const origem = req.nextUrl.origin;

    const paymentClient = getPaymentClient();
    const pagamento = await paymentClient.create({
      body: {
        transaction_amount: valor,
        description: `Inscrição ${torneio.nome} — ${nomeTime}`,
        payment_method_id: 'pix',
        payer: { email: payerEmail },
        external_reference: inscricaoRef.id,
        notification_url: `${origem}/api/inscricao/webhook`,
      },
    });

    await inscricaoRef.update({ paymentId: String(pagamento.id) });

    const dadosPix = pagamento.point_of_interaction?.transaction_data;

    return NextResponse.json({
      inscricaoId: inscricaoRef.id,
      paymentId: pagamento.id,
      qrCodeBase64: dadosPix?.qr_code_base64 ?? null,
      copiaCola: dadosPix?.qr_code ?? null,
    });
  } catch (err) {
    console.error('Erro ao criar pagamento PIX:', err);
    return NextResponse.json({ erro: 'Não foi possível gerar o pagamento. Tente novamente.' }, { status: 500 });
  }
}
