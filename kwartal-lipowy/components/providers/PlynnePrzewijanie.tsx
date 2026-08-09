'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Inercyjne przewijanie (Lenis) spiete z ScrollTriggerem.
 *
 * Trzy rzeczy, ktore musza sie zgadzac, zeby to nie rozjechalo sie z GSAP:
 *  1. Lenis informuje ScrollTrigger o kazdej zmianie pozycji (`lenis.on('scroll')`).
 *  2. Klatki Lenisa liczy ticker GSAP, a nie wlasny requestAnimationFrame —
 *     inaczej dwie petle animacji chodza obok siebie i pinnowane sekcje drgaja.
 *  3. `lagSmoothing(0)` — GSAP domyslnie "nadrabia" zgubione klatki skokiem
 *     czasu, co przy scrubowanych animacjach widac jako przeskok.
 *
 * Przy `prefers-reduced-motion: reduce` Lenis w ogole nie startuje — zostaje
 * natywne przewijanie przegladarki, ktore uzytkownik zna i kontroluje.
 */
export function PlynnePrzewijanie() {
  useEffect(() => {
    const ograniczony = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (ograniczony) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Na dotyku zostawiamy natywne przewijanie — przejecie go psuje
      // wrazenie bezwladnosci, ktore system operacyjny robi lepiej.
      syncTouch: false,
      touchMultiplier: 1.6,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const klatka = (czas: number) => lenis.raf(czas * 1000);
    gsap.ticker.add(klatka);
    gsap.ticker.lagSmoothing(0);

    // Kotwice (#oferta itd.) musza isc przez Lenisa, bo natywny skok
    // omija jego wewnetrzna pozycje i ScrollTrigger gubi synchronizacje.
    const przyKlikniecie = (zdarzenie: MouseEvent) => {
      const cel = (zdarzenie.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!(cel instanceof HTMLAnchorElement)) return;

      const id = cel.getAttribute('href');
      if (!id || id === '#') return;

      const element = document.querySelector(id);
      if (!element) return;

      zdarzenie.preventDefault();
      lenis.scrollTo(element as HTMLElement, { offset: -72, duration: 1.2 });
    };

    document.addEventListener('click', przyKlikniecie);

    // Fonty i obrazy zmieniaja wysokosc dokumentu juz po pierwszym pomiarze
    // ScrollTriggera — bez odswiezenia triggery wypadaja o kilkadziesiat pikseli.
    const odswiez = () => ScrollTrigger.refresh();
    window.addEventListener('load', odswiez);
    document.fonts?.ready.then(odswiez);

    return () => {
      document.removeEventListener('click', przyKlikniecie);
      window.removeEventListener('load', odswiez);
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(klatka);
      lenis.destroy();
    };
  }, []);

  return null;
}
