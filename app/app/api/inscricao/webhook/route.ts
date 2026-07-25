import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getPaymentClient } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const url = req.nextUrl;

    // O Mercado Pago manda o id do pagamento no corpo (data.id) ou via query string,
    // dependendo da configuração — checamos os dois formatos.
    const paymentId = body?.data?.id || url.searchParams.get('id') || url.searchParams.get('data.id');

    if (!paymentId) {
      return NextResponse.json({ ok: true }); // notificação irrelevante, apenas confirma recebimento
    }

    const paymentClient = getPaymentClient();
    const pagamento = await paymentClient.get({ id: String(paymentId) });

    const inscricaoId = pagamento.external_reference;
    if (!inscricaoId) return NextResponse.json({ ok: true });

    const inscricaoRef = adminDb.collection('inscricoes').doc(inscricaoId);
    const inscricaoSnap = await inscricaoRef.get();
    if (!inscricaoSnap.exists) return NextResponse.json({ ok: true });

    if (pagamento.status === 'approved') {
      await inscricaoRef.update({ status: 'pendente' }); // libera pra staff revisar/aprovar
    } else if (pagamento.status === 'rejected' || pagamento.status === 'cancelled') {
      await inscricaoRef.update({ status: 'pagamento_recusado' });
    }
    // outros status (pending, in_process) não mudam nada — segue aguardando

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Erro no webhook do Mercado Pago:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// O Mercado Pago também pode chamar via GET em alguns testes de configuração
export async function GET() {
  return NextResponse.json({ ok: true });
}
