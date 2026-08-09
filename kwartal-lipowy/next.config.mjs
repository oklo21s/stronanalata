/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  // Demo stoi pod stronanalata.pl/kwartal-lipowy — Next musi doklejac ten
  // prefiks do adresow stron i zasobow z /_next/. Przy przenosinach na wlasna
  // domene/subdomene wystarczy usunac te linie.
  basePath: '/kwartal-lipowy',
  // Buduje samowystarczalny serwer w .next/standalone (tylko realnie uzywane
  // moduly) — to jego kopiuje finalny obraz Dockera zamiast calego node_modules.
  output: 'standalone',
};

export default nextConfig;
