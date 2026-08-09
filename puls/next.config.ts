import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Demo stoi pod stronanalata.pl/puls — Next musi doklejac ten prefiks do
  // adresow stron i zasobow z /_next/. Przy przenosinach na wlasna
  // domene/subdomene wystarczy usunac te linie.
  basePath: '/puls',
  // Buduje samowystarczalny serwer w .next/standalone (tylko realnie uzywane
  // moduly) — to jego kopiuje finalny obraz Dockera zamiast calego node_modules.
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [128, 256, 384, 512],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion'],
  },
}

export default nextConfig
