import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Demo stoi pod stronanalata.pl/osada-pod-grania/, wiec assety musza miec
  // ten prefiks w adresie. Przy przenosinach na wlasna domene/subdomene:
  // zmien na '/' i usun blok z rewrite w nginx.conf.
  base: '/osada-pod-grania/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
        },
      },
    },
  },
})
