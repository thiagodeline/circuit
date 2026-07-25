import { MercadoPagoConfig, Payment } from 'mercadopago';

// O Access Token vem da variável de ambiente MP_ACCESS_TOKEN
// (nunca prefixada com NEXT_PUBLIC_ — precisa ficar só no servidor).
function getClient() {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('MP_ACCESS_TOKEN não configurada.');
  }
  return new MercadoPagoConfig({ accessToken });
}

export function getPaymentClient() {
  return new Payment(getClient());
}
