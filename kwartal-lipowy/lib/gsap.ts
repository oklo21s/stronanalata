'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Rejestracja musi wykonac sie raz i wylacznie po stronie klienta.
// ScrollTrigger dotyka `window` juz przy rejestracji.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Warunki dla gsap.matchMedia().
 *
 * Uzywamy gsap.matchMedia() zamiast ScrollTrigger.matchMedia() — to drugie jest
 * oznaczone jako deprecated od GSAP 3.11. Nastepca daje ten sam podzial na
 * breakpointy, ale dokłada automatyczny cleanup i pozwala trzymac warunek
 * prefers-reduced-motion w tym samym miejscu co breakpointy, zamiast w drugim
 * rownoleglym mechanizmie.
 *
 * Kazda sekcja czyta `context.conditions` i sama decyduje, co uproscic.
 */
export const warunki = {
  duzy: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  maly: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
  ruchOgraniczony: '(prefers-reduced-motion: reduce)',
} as const;

export type WarunkiRuchu = {
  duzy: boolean;
  maly: boolean;
  ruchOgraniczony: boolean;
};

/**
 * Wspolne krzywe czasu. Trzymane w jednym miejscu, zeby cala strona zwalniala
 * tak samo — rozjechane easingi to najczestszy powod, dla ktorego zestaw
 * poprawnych animacji sklada sie na niespojna calosc.
 *
 * `odslona` (expo.out) hamuje bardzo ostro: swietne do wjazdu tekstu spod
 * maski, bo slowo laduje i natychmiast stoi.
 * `plynne` (power3.out) jest lagodniejsze — do przesuniec i zanikania.
 * `spokojne` (power2.inOut) ma symetryczny rozbieg i wyhamowanie, do rzeczy,
 * ktore zmieniaja stan w obie strony.
 */
export const krzywe = {
  odslona: 'expo.out',
  plynne: 'power3.out',
  spokojne: 'power2.inOut',
} as const;

/** Wspolny rytm staggerow — desktop i maly ekran. */
export const rytm = {
  slowa: { duzy: 0.055, maly: 0.035 },
  karty: { duzy: 0.1, maly: 0.06 },
  drobne: { duzy: 0.07, maly: 0.045 },
} as const;

export { gsap, ScrollTrigger };
