import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
