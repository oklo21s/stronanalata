'use client';

import { useRef } from 'react';

import { gsap, krzywe, rytm, warunki, type WarunkiRuchu } from '@/lib/gsap';
import { wejscieNaglowka } from '@/lib/animacje';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { NaglowekSekcji } from '@/components/ui/NaglowekSekcji';
import { Licznik } from '@/components/ui/Licznik';
import { statystyki } from '@/lib/content';

export function Statystyki() {
  const korzen = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(warunki, (kontekst) => {
        const { maly, ruchOgraniczony: bezRuchu } = kontekst.conditions as WarunkiRuchu;
        if (bezRuchu) return;

        wejscieNaglowka(korzen.current, maly);

        const odstep = maly ? rytm.karty.maly : rytm.karty.duzy;

        const os = gsap.timeline({
          scrollTrigger: { trigger: '[data-statystyki-siatka]', start: 'top 82%' },
        });

        // Kreska rozciaga sie od lewej i dopiero spod niej wychodzi liczba —
        // kolejnosc robi z tego jeden gest zamiast dwoch rownoleglych.
        os.from('[data-kreska]', {
          scaleX: 0,
          duration: 0.7,
          ease: krzywe.spokojne,
          stagger: odstep,
        })
          .from(
            '[data-liczba]',
            {
              yPercent: 115,
              duration: 1,
              ease: krzywe.odslona,
              stagger: odstep,
            },
            0.15,
          )
          .from(
            '[data-opis-statystyki]',
            {
              opacity: 0,
              y: 14,
              duration: 0.6,
              ease: krzywe.plynne,
              stagger: odstep,
            },
            0.4,
          );
      });
    }, korzen);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={korzen} id="statystyki" className="bg-grafit py-sekcja text-kosc">
      <div className="kontener">
        <NaglowekSekcji
          nadtytul={statystyki.nadtytul}
          tytul={statystyki.tytul}
          jasny
        />

        <dl
          data-statystyki-siatka
          className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {statystyki.pozycje.map((pozycja) => (
            <div key={pozycja.etykieta} data-statystyka>
              <div data-kreska className="h-px w-full origin-left bg-kosc/15" aria-hidden />

              <dd className="overflow-hidden pb-[0.06em] pt-6 font-display text-5xl text-kosc lg:text-6xl">
                <span data-liczba className="block will-change-transform">
                  <Licznik wartosc={pozycja.wartosc} sufiks={pozycja.sufiks} />
                </span>
              </dd>

              <dt data-opis-statystyki className="mt-4 text-sm text-kosc/75">
                {pozycja.etykieta}
              </dt>
              <p data-opis-statystyki className="mt-2 text-xs leading-relaxed text-kosc/45">
                {pozycja.opis}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
