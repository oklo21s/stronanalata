import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neutralne — nosniki "swiatla" i bialej przestrzeni
        kosc: '#FDFCFA',
        piasek: '#F5F2EC',
        glina: '#E6DFD4',
        kamien: '#A8A29A',
        // Ciemne
        grafit: '#15171A',
        wegiel: '#22262B',
        // Akcenty branzowe: zielen lipy + mosiadz
        lipa: {
          DEFAULT: '#5C7355',
          jasna: '#8AA182',
          ciemna: '#3D4F38',
        },
        mosiadz: '#B08968',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-tekst)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Skala nagłówkowa oparta na clamp — bez skoków przy zmianie breakpointu
        hero: ['clamp(2.75rem, 9vw, 8.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        sekcja: ['clamp(2rem, 5vw, 4.25rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        lead: ['clamp(1.05rem, 1.8vw, 1.5rem)', { lineHeight: '1.55' }],
      },
      spacing: {
        sekcja: 'clamp(6rem, 14vh, 11rem)',
      },
      transitionTimingFunction: {
        wyjscie: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      maxWidth: {
        tresc: '78rem',
      },
    },
  },
  plugins: [],
};

export default config;
