'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TabItem {
  key: string;
  label: string;
}

interface Props {
  slug: string;
  tabs: TabItem[];
  initialTab: string;
  panels: Record<string, React.ReactNode>;
}

/**
 * Todos os painéis já vêm renderizados pelo servidor (Server Components passados
 * como children/props) e ficam montados no DOM o tempo todo — só a visibilidade
 * muda via CSS (hidden/block + opacity), então trocar de aba nunca refaz fetch
 * nem desmonta o que já foi carregado. A URL é atualizada de forma "shallow"
 * (sem navegação/reload) só para manter o link compartilhável.
 */
export function TorneioTabsClient({ slug, tabs, initialTab, panels }: Props) {
  const router = useRouter();
  const [ativa, setAtiva] = useState(initialTab);

  function selecionar(key: string) {
    if (key === ativa) return;
    setAtiva(key);
    router.replace(`/torneios/${slug}?tab=${key}`, { scroll: false });
  }

  return (
    <>
      <nav className="mb-2 flex w-fit gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-sm">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => selecionar(t.key)}
            className={`flex-shrink-0 rounded-xl px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ease-in-out ${
              ativa === t.key
                ? 'bg-gradient-to-r from-signal to-orange-600 text-white'
                : 'text-muted hover:bg-white/5 hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div className="pb-4" />

      {tabs.map((t) => (
        <div
          key={t.key}
          className={`transition-opacity duration-200 ease-in-out ${
            ativa === t.key ? 'block opacity-100' : 'hidden opacity-0'
          }`}
        >
          {panels[t.key]}
        </div>
      ))}
    </>
  );
}
