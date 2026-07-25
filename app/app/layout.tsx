import type { Metadata } from 'next';
import { Oswald, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const display = Oswald({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
});
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500', '600'] });

export const metadata: Metadata = {
  title: 'Circuit — Organização de torneios de Valorant',
  description:
    'Circuit organiza campeonatos competitivos de Valorant, do Circuit Zen em diante. Chaves, resultados, times e notícias em um só lugar.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-base text-ink font-body antialiased">{children}</body>
    </html>
  );
}
