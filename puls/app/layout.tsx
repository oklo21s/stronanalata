import type { Metadata, Viewport } from 'next'
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import { SmoothScroll } from '@/components/providers/SmoothScroll'
import { site } from '@/lib/content'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter-tight',
  display: 'swap',
  weight: ['500', '600', '700'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name} — monitoring aplikacji z jednym alertem zamiast trzydziestu`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: site.name,
    title: `${site.name} — awarię widzisz w 40 sekund`,
    description: site.description,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#08090B',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pl"
      className={`no-js ${inter.variable} ${interTight.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {/* Zdejmuje klase zanim odmaluje sie hero. Bez JS stany startowe
            zostaja widoczne i strona dziala jako zwykly dokument. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.remove('no-js')",
          }}
        />
        <a
          href="#tresc"
          className="sr-only rounded-md bg-cta px-4 py-2 text-cta-text focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200]"
        >
          Przejdź do treści
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
