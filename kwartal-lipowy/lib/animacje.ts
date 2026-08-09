'use client';

import { gsap, krzywe, rytm } from '@/lib/gsap';

/**
 * Wejscie naglowka sekcji: nadtytul, slowa tytulu spod maski, lead.
 *
 * Trzyma trzy elementy w jednej osi czasu z zakladkami, zamiast trzech
 * niezaleznych tweenow — dzieki temu lead rusza, zanim tytul skonczy, i calosc
 * czyta sie jak jeden gest, a nie trzy osobne zdarzenia.
 *
 * Wywolywac WYLACZNIE wewnatrz gsap.context() sekcji: selektory sa wtedy
 * ograniczone do jej poddrzewa i nie zlapia naglowkow z sasiednich sekcji.
 */
export function wejscieNaglowka(trigger: Element | null, maly: boolean) {
  if (!trigger) return;

  const os = gsap.timeline({
    scrollTrigger: { trigger, start: 'top 78%' },
  });

  os.from('[data-naglowek-nad]', {
    opacity: 0,
    y: 14,
    duration: 0.55,
    ease: krzywe.plynne,
  })
    .from(
      '[data-slowo]',
      {
        yPercent: 118,
        duration: maly ? 0.8 : 0.95,
        ease: krzywe.odslona,
        stagger: maly ? rytm.slowa.maly : rytm.slowa.duzy,
      },
      '-=0.3',
    )
    .from(
      '[data-naglowek-lead]',
      {
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: krzywe.plynne,
      },
      '-=0.55',
    );

  return os;
}

/**
 * Odslona zdjecia: kadr rozsuwa sie od dolu, a sam obraz w tym czasie schodzi
 * ze skali w dol.
 *
 * Dwie warstwy sa konieczne — clip-path na ramce i skala na obrazie. Gdyby
 * skalowac ramke, razem z nia skalowalby sie zaokraglony rog i cien.
 * Rozjazd predkosci miedzy maska a obrazem daje ten sam efekt glebi,
 * co parallax, tylko w mniejszej skali i na wejsciu.
 */
export function odslonaKadru(kadr: Element, obraz: Element | null, maly: boolean) {
  const os = gsap.timeline({
    scrollTrigger: { trigger: kadr, start: maly ? 'top 88%' : 'top 82%' },
  });

  os.from(kadr, {
    clipPath: 'inset(100% 0% 0% 0%)',
    duration: maly ? 1 : 1.25,
    ease: krzywe.odslona,
  });

  if (obraz) {
    os.from(
      obraz,
      {
        scale: 1.18,
        duration: maly ? 1.1 : 1.4,
        ease: krzywe.plynne,
      },
      0,
    );
  }

  return os;
}
