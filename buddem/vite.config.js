import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/buddem/",
  build: {
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        bezIntro: resolve(import.meta.dirname, "bez-intro.html"),
      },
    },
  },
});
