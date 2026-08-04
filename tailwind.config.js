/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0C0D10',      // fundo principal, grafite escuro
        surface: '#16171C',   // cards
        surface2: '#1E2026',  // camada elevada (hover, inputs)
        line: '#2A2D35',      // bordas suaves
        ink: '#FFFFFF',       // texto título
        muted: '#9CA3AF',     // texto corpo
        signal: '#FF1F3D',    // vermelho/neon — ação, links, marca
        live: '#1FE5C0',      // teal — "ao vivo", sucesso
        alert: '#FF5D6C',     // vermelho — erro, urgente
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      backgroundImage: {
        'circuit-trace': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath d='M0 60 H40 V20 H80 V90 H120' stroke='%232A2D35' stroke-width='1' fill='none'/%3E%3Ccircle cx='40' cy='20' r='2.5' fill='%232A2D35'/%3E%3Ccircle cx='80' cy='90' r='2.5' fill='%232A2D35'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
