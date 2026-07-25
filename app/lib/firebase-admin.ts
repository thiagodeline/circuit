import { cert, getApps, initializeApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// A chave de serviço vem em base64 na variável de ambiente FIREBASE_SERVICE_ACCOUNT_KEY
// (nunca prefixada com NEXT_PUBLIC_ — precisa ficar só no servidor).
function getAdminApp(): App {
  if (getApps().length) return getApps()[0];

  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!base64) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY não configurada.');
  }
  const serviceAccount = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));

  return initializeApp({ credential: cert(serviceAccount) });
}

export const adminDb = getFirestore(getAdminApp());
