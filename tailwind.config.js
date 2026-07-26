/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0B0C10',      // fundo principal, dark mode fechado
        surface: '#12141A',   // cards e painéis
        surface2: '#191C24',  // camada elevada (hover, inputs)
        line: '#242832',      // bordas e divisores
        ink: '#EDEDED',       // texto principal
        muted: '#8A8A8E',     // texto secundário
        signal: '#FF4655',    // vermelho Valorant — ação, links, marca
        live: '#1FE5C0',      // teal — "ao vivo", sucesso
        alert: '#FF5D6C',     // vermelho — erro, urgente
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      backgroundImage: {
        'circuit-trace': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath d='M0 60 H40 V20 H80 V90 H120' stroke='%23242832' stroke-width='1' fill='none'/%3E%3Ccircle cx='40' cy='20' r='2.5' fill='%23242832'/%3E%3Ccircle cx='80' cy='90' r='2.5' fill='%23242832'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
