'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { gsap, warunki, type WarunkiRuchu } from '@/lib/gsap';
import { wejscieNaglowka } from '@/lib/animacje';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { NaglowekSekcji } from '@/components/ui/NaglowekSekcji';
import { proces } from '@/lib/content';

const KOLORY_STATUSU: Record<string, string> = {
  zakończony: 'bg-lipa text-kosc',
  'w toku': 'bg-mosiadz text-kosc',
  planowany: 'bg-glina text-wegiel/70',
};

const WYGLADZENIE = [0.16, 1, 0.3, 1] as const;

/**
 * Harmonogram jako zakladki.
 *
 * Sekcja celowo NIE przejmuje przewijania — etapy przelacza sie klikiem
 * (albo strzalkami), a strona przewija sie przez nia normalnie. Wczesniej byla
 * tu sekcja przypieta, gdzie etapy zmienialy sie wraz z pozycja scrolla;
 * odebrane uzytkownikowi przewijanie na kilka ekranow okazalo sie gorsze
 * niz zysk z efektu.
 *
 * Przejscia miedzy panelami robi Framer Motion, nie GSAP: to mikrointerakcja
 * interfejsu, niezwiazana z pozycja scrolla. GSAP zostaje tu tylko od wejscia
 * naglowka w kadr.
 */
export function Proces() {
  const korzen = useRef<HTMLElement>(null);
  const przyciski = useRef<(HTMLButtonElement | null)[]>([]);
  const [aktywny, setAktywny] = useState(0);
  const ruchOgraniczony = usePrefersReducedMotion();

  const etap = proces.etapy[aktywny];

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(warunki, (kontekst) => {
        const { maly, ruchOgraniczony: bezRuchu } = kontekst.conditions as WarunkiRuchu;
        if (bezRuchu) return;

        wejscieNaglowka(korzen.current, maly);
      });
    }, korzen);

    return () => ctx.revert();
  }, []);

  // Wzorzec zakladek wymaga obslugi strzalek — bez niej klawiatura utyka
  // na pierwszym przycisku, bo pozostale maja tabIndex -1.
  const przyKlawiszu = (zdarzenie: KeyboardEvent<HTMLDivElement>) => {
    const ostatni = proces.etapy.length - 1;
    let cel: number | null = null;

    if (zdarzenie.key === 'ArrowRight' || zdarzenie.key === 'ArrowDown') {
      cel = aktywny === ostatni ? 0 : aktywny + 1;
    } else if (zdarzenie.key === 'ArrowLeft' || zdarzenie.key === 'ArrowUp') {
      cel = aktywny === 0 ? ostatni : aktywny - 1;
    } else if (zdarzenie.key === 'Home') {
      cel = 0;
    } else if (zdarzenie.key === 'End') {
      cel = ostatni;
    }

    if (cel === null) return;
    zdarzenie.preventDefault();
    setAktywny(cel);
    przyciski.current[cel]?.focus();
  };

  return (
    <section ref={korzen} id="proces" className="bg-piasek py-sekcja">
      <div className="kontener">
        <NaglowekSekcji
          nadtytul={proces.nadtytul}
          tytul={proces.tytul}
          lead={proces.lead}
        />

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:gap-16">
          {/*
            Jedna lista zakladek dla obu ukladow, przelaczana klasami:
            na waskim ekranie poziomy pasek pigulek z numerami, na szerokim
            pionowy spis z nazwami. Dwie osobne listy oznaczalyby dwa komplety
            tych samych identyfikatorow ARIA.
          */}
          <div
            role="tablist"
            aria-label="Etapy inwestycji"
            onKeyDown={przyKlawiszu}
            className="pas-poziomy -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:flex-col md:gap-0 md:overflow-visible md:px-0"
          >
            {proces.etapy.map((pozycja, i) => {
              const wybrany = i === aktywny;

              return (
                <button
                  key={pozycja.numer}
                  ref={(el) => {
                    przyciski.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`etap-zakladka-${i}`}
                  aria-selected={wybrany}
                  aria-controls={`etap-panel-${i}`}
                  tabIndex={wybrany ? 0 : -1}
                  onClick={() => setAktywny(i)}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-left text-sm transition-colors duration-300 ease-wyjscie md:w-full md:rounded-none md:border-0 md:border-l-2 md:px-5 md:py-3 ${
                    wybrany
                      ? 'border-lipa bg-lipa text-kosc md:bg-transparent md:text-grafit'
                      : 'border-glina bg-kosc text-kamien hover:text-grafit md:bg-transparent'
                  }`}
                >
                  <span className="font-display md:mr-4 md:text-sm">{pozycja.numer}</span>
                  <span className="hidden md:inline">{pozycja.nazwa}</span>
                </button>
              );
            })}
          </div>

          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={aktywny}
                role="tabpanel"
                id={`etap-panel-${aktywny}`}
                aria-labelledby={`etap-zakladka-${aktywny}`}
                tabIndex={0}
                initial={ruchOgraniczony ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={ruchOgraniczony ? { opacity: 0 } : { opacity: 0, y: -14 }}
                transition={{
                  duration: ruchOgraniczony ? 0.01 : 0.42,
                  ease: WYGLADZENIE,
                }}
                className="focus-visible:outline-none"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="overflow-hidden pb-[0.06em] font-display text-6xl text-lipa md:text-7xl">
                    <motion.span
                      className="block"
                      initial={ruchOgraniczony ? false : { y: '110%' }}
                      animate={{ y: '0%' }}
                      transition={{
                        duration: ruchOgraniczony ? 0 : 0.7,
                        ease: WYGLADZENIE,
                      }}
                    >
                      {etap.numer}
                    </motion.span>
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.14em] ${
                      KOLORY_STATUSU[etap.status] ?? 'bg-glina text-wegiel/70'
                    }`}
                  >
                    {etap.status}
                  </span>
                  <span className="text-xs uppercase tracking-[0.14em] text-kamien">
                    {etap.okres}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-3xl text-grafit md:text-4xl">
                  {etap.nazwa}
                </h3>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-wegiel/75 md:text-lg">
                  {etap.opis}
                </p>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        {/* Pasek pokazuje, ktory etap z pieciu jest otwarty. Wczesniej
            odmierzal postep przewijania w przypietej sekcji. */}
        <div className="mt-14 h-px w-full bg-glina" aria-hidden>
          <motion.div
            className="h-px origin-left bg-lipa"
            animate={{ scaleX: (aktywny + 1) / proces.etapy.length }}
            transition={{ duration: ruchOgraniczony ? 0 : 0.5, ease: WYGLADZENIE }}
          />
        </div>
      </div>
    </section>
  );
}
