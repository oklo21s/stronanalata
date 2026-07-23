import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/buddem-bez-animacji/",
  build: {
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
      },
    },
  },
});
