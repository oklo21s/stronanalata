'use client';

import { useRef } from 'react';

import { gsap, warunki, type WarunkiRuchu } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

/**
 * Wlasne formatowanie zamiast Intl.NumberFormat celowo.
 *
 * Intl potrafi zwrocic inny separator tysiecy w Node i w przegladarce
 * (U+00A0 kontra U+202F, zaleznie od wersji ICU). Tekst wyrenderowany na
 * serwerze rozjechalby sie wtedy z pierwszym renderem klienta i React
 * zglosilby blad hydratacji. Ta funkcja jest deterministyczna.
 */
function sformatuj(liczba: number): string {
  return Math.round(liczba)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

type Props = {
  wartosc: number;
  sufiks?: string;
};

export function Licznik({ wartosc, sufiks = '' }: Props) {
  const element = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(warunki, (kontekst) => {
        const { ruchOgraniczony: bezRuchu } = kontekst.conditions as WarunkiRuchu;
        const cel = element.current;
        if (!cel || bezRuchu) return;

        const stan = { biezaca: 0 };
        cel.textContent = sformatuj(0);

        gsap.to(stan, {
          biezaca: wartosc,
          duration: 1.9,
          ease: 'power2.out',
          onUpdate: () => {
            cel.textContent = sformatuj(stan.biezaca);
          },
          scrollTrigger: {
            trigger: cel,
            // Moment wejscia sekcji w kadr, nie wczesniej — licznik, ktory
            // odliczyl sie poza ekranem, jest tylko liczba.
            start: 'top 85%',
            once: true,
          },
        });

        // Cofniecie matchMedia (zmiana breakpointu, wlaczenie reduced-motion)
        // musi zostawic pelna wartosc, a nie liczbe zamrozona w polowie.
        return () => {
          cel.textContent = sformatuj(wartosc);
        };
      });
    }, element);

    return () => ctx.revert();
  }, [wartosc]);

  return (
    <span className="tabular-nums">
      {/* Wartosc koncowa jest w HTML od razu: bez JS licznik po prostu
          pokazuje gotowa liczbe, zamiast zera. */}
      <span ref={element}>{sformatuj(wartosc)}</span>
      {sufiks}
    </span>
  );
}
