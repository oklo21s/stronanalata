import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // AVIF pierwszy, WebP jako fallback dla Safari < 16.
    formats: ['image/avif', 'image/webp'],
    // Next 15 wymaga zadeklarowania kazdej wartosci `quality` uzytej w <Image>.
    qualities: [70, 78],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [128, 256, 384, 512],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
