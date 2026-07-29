import Link from 'next/link';
import { LinhaTabela } from '@/lib/standings';

export function TabelaLiga({ linhas, tipo }: { linhas: LinhaTabela[]; tipo: 'serie-a' | 'serie-b' }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/[0.03] text-left text-xs text-muted">
            <th className="px-4 py-3 font-normal">#</th>
            <th className="px-4 py-3 font-normal">Time</th>
            <th className="px-2 py-3 text-center font-normal">J</th>
            <th className="px-2 py-3 text-center font-normal">V</th>
            <th className="px-2 py-3 text-center font-normal">E</th>
            <th className="px-2 py-3 text-center font-normal">D</th>
            <th className="px-2 py-3 text-center font-normal">Saldo</th>
            <th className="px-3 py-3 text-center font-normal">Pts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {linhas.map((l) => (
            <tr
              key={l.time.id}
              className={`transition-colors hover:bg-white/5 ${
                l.zona === 'rebaixamento' ? 'bg-alert/[0.08]' : l.zona === 'promocao' ? 'bg-signal/[0.08]' : ''
              }`}
            >
              <td className="px-4 py-3 font-mono text-muted">{l.posicao}</td>
              <td className="px-4 py-3">
                <Link href={`/times/${l.time.id}`} className="flex items-center gap-2.5 hover:text-signal">
                  {l.time.logo ? (
                    <img src={l.time.logo} alt="" loading="lazy" decoding="async" className="h-6 w-6 flex-shrink-0 rounded-md object-cover" />
                  ) : (
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-white/5 font-mono text-[9px] text-muted">
                      {l.time.tag.slice(0, 2)}
                    </div>
                  )}
                  <span className="font-medium">{l.time.nome}</span>
                </Link>
              </td>
              <td className="px-2 py-3 text-center font-mono text-muted">{l.jogos}</td>
              <td className="px-2 py-3 text-center font-mono text-live">{l.vitorias}</td>
              <td className="px-2 py-3 text-center font-mono text-muted">{l.empates}</td>
              <td className="px-2 py-3 text-center font-mono text-alert">{l.derrotas}</td>
              <td className="px-2 py-3 text-center font-mono text-muted">{l.saldo > 0 ? `+${l.saldo}` : l.saldo}</td>
              <td className="px-3 py-3 text-center font-mono font-semibold text-signal">{l.pontos}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* LEGENDA DAS ZONAS */}
      <div className="flex flex-wrap gap-4 border-t border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted">
        {tipo === 'serie-a' ? (
          <>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-transparent border border-white/20" />Fica na Série A</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-alert" />Zona de rebaixamento para Série B</span>
          </>
        ) : (
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-signal" />Zona de promoção para Série A</span>
        )}
      </div>
    </div>
  );
}
