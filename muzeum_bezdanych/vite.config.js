import { resolve } from "node:path";
import { defineConfig } from "vite";

// Muzeum to strona wielopodstronowa: sześć osobnych plików HTML współdzieli
// jeden pakiet JS i jeden arkusz CSS. Każda podstrona jest osobnym wejściem
// Rollupa, więc build wygeneruje kompletny, samodzielny plik dla każdej z nich.
export default defineConfig({
  base: "/muzeum/",
  build: {
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        wystawy: resolve(import.meta.dirname, "wystawy.html"),
        wydarzenia: resolve(import.meta.dirname, "wydarzenia.html"),
        kolekcje: resolve(import.meta.dirname, "kolekcje.html"),
        zwiedzanie: resolve(import.meta.dirname, "zwiedzanie.html"),
        kontakt: resolve(import.meta.dirname, "kontakt.html"),
      },
    },
  },
});
