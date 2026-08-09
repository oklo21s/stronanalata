'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';

import { firma, nawigacja } from '@/lib/content';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function Nawigacja() {
  const [przyklejona, setPrzyklejona] = useState(false);
  const [menuOtwarte, setMenuOtwarte] = useState(false);
  const ruchOgraniczony = usePrefersReducedMotion();
  const { scrollY } = useScroll();

  // Lenis przewija natywnie okno, wiec scrollY z Framer Motion jest wiarygodne.
  useMotionValueEvent(scrollY, 'change', (wartosc) => {
    setPrzyklejona(wartosc > 80);
  });

  // Nad hero nagłówek leży na zdjęciu, więc dopóki nie jest przyklejony,
  // dostaje gradientową podkładkę — bez niej pozycje menu gubią kontrast
  // na jasnych liściach. Jako pasek jest niewidoczna, a tekst się trzyma.
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-wyjscie ${
        przyklejona
          ? 'border-b border-glina/70 bg-kosc/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      {/* Podkładka wychodzi niżej niż sam nagłówek (h-32 wobec 72 px), bo
          gradient kończący się dokładnie na jego krawędzi rysuje na zdjęciu
          widoczną poziomą linię. */}
      {!przyklejona && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-kosc via-kosc/55 to-transparent"
          aria-hidden
        />
      )}
      <div className="kontener flex h-[72px] items-center justify-between">
        <a href="#tresc" className="font-display text-lg tracking-tight">
          {firma.nazwa}
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Główna">
          {nawigacja.map((pozycja) => (
            <motion.a
              key={pozycja.cel}
              href={pozycja.cel}
              className="relative text-sm text-wegiel/80 transition-colors hover:text-grafit"
              whileHover={ruchOgraniczony ? undefined : { y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            >
              {pozycja.etykieta}
            </motion.a>
          ))}
          <motion.a
            href="#kontakt"
            className="rounded-full bg-grafit px-5 py-2.5 text-sm text-kosc"
            whileHover={ruchOgraniczony ? undefined : { scale: 1.04 }}
            whileTap={ruchOgraniczony ? undefined : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          >
            Umów spacer
          </motion.a>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOtwarte((stan) => !stan)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-glina md:hidden"
          aria-expanded={menuOtwarte}
          aria-controls="menu-mobilne"
          aria-label={menuOtwarte ? 'Zamknij menu' : 'Otwórz menu'}
        >
          {menuOtwarte ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
        </button>
      </div>

      <AnimatePresence>
        {menuOtwarte && (
          <motion.nav
            id="menu-mobilne"
            aria-label="Główna, mobilna"
            className="overflow-hidden border-t border-glina bg-kosc md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: ruchOgraniczony ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="kontener flex flex-col gap-1 py-5">
              {[...nawigacja, { etykieta: 'Umów spacer', cel: '#kontakt' }].map((pozycja) => (
                <li key={`${pozycja.cel}-${pozycja.etykieta}`}>
                  <a
                    href={pozycja.cel}
                    onClick={() => setMenuOtwarte(false)}
                    className="block py-2.5 text-base text-wegiel"
                  >
                    {pozycja.etykieta}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
