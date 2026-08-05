import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ erro: 'id não informado.' }, { status: 400 });

  const snap = await adminDb.collection('inscricoes').doc(id).get();
  if (!snap.exists) return NextResponse.json({ erro: 'Inscrição não encontrada.' }, { status: 404 });

  // Só devolve o status — não expõe dados de outros times nem detalhes sensíveis
  return NextResponse.json({ status: snap.data()!.status });
}
