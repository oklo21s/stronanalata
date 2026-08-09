import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';

import './globals.css';
import { PlynnePrzewijanie } from '@/components/providers/PlynnePrzewijanie';
import { PasekPostepu } from '@/components/ui/PasekPostepu';
import { Nawigacja } from '@/components/ui/Nawigacja';
import { Stopka } from '@/components/ui/Stopka';
import { firma, hero } from '@/lib/content';

// latin-ext jest obowiazkowy — bez niego polskie znaki diakrytyczne
// leca na font zastepczy i naglowki rozjezdzaja sie w pionie.
// Fraunces jest fontem zmiennym. Podanie listy `weight` obok `axes` wywala
// build ("Axes can only be defined for variable fonts") — wage zostawiamy
// jako os zmienna, dzieki czemu dziala caly zakres 100-900 z jednego pliku.
const fontDisplay = Fraunces({
  subsets: ['latin', 'latin-ext'],
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
  variable: '--font-display',
});

const fontTekst = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-tekst',
});

export const metadata: Metadata = {
  // metadataBase jest wymagane, zeby wzgledne sciezki obrazkow OG zamienily
  // sie w pelne URL-e. Bez tego Next wypisuje ostrzezenie przy buildzie,
  // a podglad linku w komunikatorach zostaje bez grafiki.
  metadataBase: new URL(`https://${firma.domena}`),
  title: `${firma.nazwa} — ${firma.tagline}`,
  description: hero.lead,
  openGraph: {
    title: `${firma.nazwa} — ${firma.tagline}`,
    description: hero.lead,
    locale: 'pl_PL',
    type: 'website',
    images: [
      {
        url: '/zdjecia/dziedziniec.jpg',
        width: 1200,
        height: 1500,
        alt: `${firma.nazwa} — układ kwartału wokół wspólnego dziedzińca`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${firma.nazwa} — ${firma.tagline}`,
    description: hero.lead,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${fontDisplay.variable} ${fontTekst.variable}`}>
      <body>
        <PlynnePrzewijanie />
        <PasekPostepu />
        <a
          href="#tresc"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-full focus:bg-grafit focus:px-5 focus:py-3 focus:text-sm focus:text-kosc"
        >
          Przejdź do treści
        </a>
        <Nawigacja />
        <main id="tresc">{children}</main>
        <Stopka />
      </body>
    </html>
  );
}
