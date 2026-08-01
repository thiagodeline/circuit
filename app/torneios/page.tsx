import { redirect } from 'next/navigation';

// A Série A é a página principal de torneios do site — qualquer link antigo
// para /torneios cai direto nela.
export default function TorneiosRedirectPage() {
  redirect('/serie-a');
}
