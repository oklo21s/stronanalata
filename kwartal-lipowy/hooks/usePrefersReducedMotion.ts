'use client';

import { useEffect, useState } from 'react';

/**
 * Dla komponentow, ktore musza podjac decyzje w Reakcie, a nie w GSAP —
 * np. czy w ogole montowac scene 3D albo czy Framer Motion ma animowac.
 *
 * Startujemy od `false`, bo serwer nie zna preferencji uzytkownika. Gdyby
 * startowac od `true`, pierwszy render klienta rozjechalby sie z HTML-em
 * z serwera i React zglosilby blad hydratacji.
 */
export function usePrefersReducedMotion(): boolean {
  const [ograniczony, setOgraniczony] = useState(false);

  useEffect(() => {
    const zapytanie = window.matchMedia('(prefers-reduced-motion: reduce)');
    setOgraniczony(zapytanie.matches);

    const przyZmianie = (e: MediaQueryListEvent) => setOgraniczony(e.matches);
    zapytanie.addEventListener('change', przyZmianie);
    return () => zapytanie.removeEventListener('change', przyZmianie);
  }, []);

  return ograniczony;
}
