import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Strona wielostronicowa: strona główna plus dwie podstrony sprzedażowe.
// Każde wejście to osobny plik HTML, więc /oferta/ i /realizacje/ działają
// jako zwykłe adresy — bez routingu po stronie JavaScriptu i bez 404 przy
// wejściu wprost z wyszukiwarki albo z linku wklejonego w komunikatorze.
export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        oferta: resolve(import.meta.dirname, 'oferta/index.html'),
        realizacje: resolve(import.meta.dirname, 'realizacje/index.html'),
      },
    },
  },
});
