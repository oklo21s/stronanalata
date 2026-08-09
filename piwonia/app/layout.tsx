import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'

import SmoothScroll from '@/components/SmoothScroll'
import Nav from '@/components/Nav'
import { hours, site } from '@/data/content'

// latin-ext jest obowiazkowy — bez niego ą, ć, ę, ł, ń, ó, ś, ź, ż lecialyby z fallbacku.
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
})

const jost = Jost({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-jost',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — restauracja, ${site.city}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'restauracja Warszawa',
    'kuchnia polska',
    'Nowe Miasto',
    'pierogi',
    'kaczka z pieca',
    'rezerwacja stolika',
    'przyjęcia okolicznościowe',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — restauracja, ${site.city}`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — restauracja, ${site.city}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#5c1524',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

/**
 * Dane strukturalne restauracji. Wyszukiwarki czytaja stad godziny, adres
 * i przedzial cenowy — bez tego karta lokalu w wynikach jest pusta.
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  servesCuisine: 'Polska',
  priceRange: '$$',
  acceptsReservations: true,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.street,
    postalCode: site.postal.split(' ')[0],
    addressLocality: site.city,
    addressCountry: 'PL',
  },
  openingHours: hours.map((row) => row.schema).filter((row) => row !== null),
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <noscript>
          {/* Bez JS nie ma animacji — odslaniamy tresc, ktora czeka na reveal. */}
          <style>{`
            [data-js-hidden] { visibility: visible !important; opacity: 1 !important; }
          `}</style>
        </noscript>
        <script
          type="application/ld+json"
          // Dane sa nasze i statyczne — nie ma tu tresci od uzytkownika.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-cream font-body text-ink antialiased">
        <a
          href="#tresc"
          className="sr-only bg-wine text-cream focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2"
        >
          Przejdź do treści
        </a>
        <SmoothScroll />
        <Nav />
        {children}
      </body>
    </html>
  )
}
