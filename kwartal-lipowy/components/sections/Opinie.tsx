'use client';

import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

import { gsap, krzywe, rytm, warunki, type WarunkiRuchu } from '@/lib/gsap';
import { wejscieNaglowka } from '@/lib/animacje';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { NaglowekSekcji } from '@/components/ui/NaglowekSekcji';
import { opinie } from '@/lib/content';

export function Opinie() {
  const korzen = useRef<HTMLElement>(null);
  const pas = useRef<HTMLDivElement>(null);
  const [aktywny, setAktywny] = useState(0);
  const ruchOgraniczony = usePrefersReducedMotion();

  // Pozycje czytamy z samego przewijania, wiec dziala tak samo dla palca,
  // kolka myszy, klawiatury i przyciskow ponizej.
  const przyPrzewijaniu = useCallback(() => {
    const element = pas.current;
    if (!element) return;

    const slajd = element.scrollWidth / opinie.slajdy.length;
    const indeks = Math.round(element.scrollLeft / slajd);
    setAktywny((poprzedni) => (poprzedni === indeks ? poprzedni : indeks));
  }, []);

  const przejdz = useCallback(
    (kierunek: number) => {
      const element = pas.current;
      if (!element) return;

      const slajd = element.scrollWidth / opinie.slajdy.length;
      const docelowy = Math.min(
        opinie.slajdy.length - 1,
        Math.max(0, aktywny + kierunek),
      );

      element.scrollTo({
        left: docelowy * slajd,
        behavior: ruchOgraniczony ? 'auto' : 'smooth',
      });
    },
    [aktywny, ruchOgraniczony],
  );

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(warunki, (kontekst) => {
        const { maly, ruchOgraniczony: bezRuchu } = kontekst.conditions as WarunkiRuchu;
        if (bezRuchu) return;

        wejscieNaglowka(korzen.current, maly);

        // Slajdy wchodza pojedynczo, z lekkim przesunieciem w bok — pas
        // czyta sie wtedy jak tasma, ktora dopiero wjechala w kadr,
        // a nie jak blok, ktory sie pojawil.
        gsap.from('[data-slajd]', {
          opacity: 0,
          xPercent: 6,
          y: 28,
          duration: 0.9,
          ease: krzywe.plynne,
          stagger: maly ? rytm.drobne.maly : rytm.drobne.duzy,
          scrollTrigger: { trigger: '[data-pas]', start: 'top 86%' },
        });

        gsap.from('[data-sterowanie]', {
          opacity: 0,
          scale: 0.85,
          duration: 0.5,
          ease: 'back.out(2)',
          stagger: 0.08,
          scrollTrigger: { trigger: korzen.current, start: 'top 70%' },
        });
      });
    }, korzen);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={korzen} id="opinie" className="bg-piasek py-sekcja">
      <div className="kontener">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <NaglowekSekcji nadtytul={opinie.nadtytul} tytul={opinie.tytul} />

          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={() => przejdz(-1)}
              disabled={aktywny === 0}
              aria-label="Poprzednia opinia"
              data-sterowanie
              className="flex h-12 w-12 items-center justify-center rounded-full border border-glina bg-kosc text-grafit transition-opacity duration-300 disabled:opacity-35"
              whileHover={ruchOgraniczony ? undefined : { scale: 1.06 }}
              whileTap={ruchOgraniczony ? undefined : { scale: 0.94 }}
            >
              <ArrowLeft size={17} aria-hidden />
            </motion.button>

            <motion.button
              type="button"
              onClick={() => przejdz(1)}
              disabled={aktywny === opinie.slajdy.length - 1}
              aria-label="Następna opinia"
              data-sterowanie
              className="flex h-12 w-12 items-center justify-center rounded-full border border-glina bg-kosc text-grafit transition-opacity duration-300 disabled:opacity-35"
              whileHover={ruchOgraniczony ? undefined : { scale: 1.06 }}
              whileTap={ruchOgraniczony ? undefined : { scale: 0.94 }}
            >
              <ArrowRight size={17} aria-hidden />
            </motion.button>
          </div>
        </div>

        <div
          ref={pas}
          data-pas
          onScroll={przyPrzewijaniu}
          // data-lenis-prevent-touch: przesuwanie palcem w poziomie ma isc
          // natywnie do tego kontenera, a nie do inercyjnego scrolla strony.
          data-lenis-prevent-touch
          role="region"
          aria-label="Opinie kupujących"
          tabIndex={0}
          className="pas-poziomy mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
        >
          {opinie.slajdy.map((slajd) => (
            <figure
              key={slajd.autor}
              data-slajd
              className="flex w-[86%] shrink-0 snap-start flex-col rounded-2xl border border-glina bg-kosc p-8 sm:w-[58%] lg:w-[38%] lg:p-10"
            >
              <Quote size={26} className="text-lipa" aria-hidden />

              <blockquote className="mt-6 flex-1">
                <p className="font-display text-xl leading-relaxed text-grafit lg:text-2xl">
                  {slajd.cytat}
                </p>
              </blockquote>

              <figcaption className="mt-8 border-t border-glina pt-5">
                <p className="text-sm font-medium text-grafit">{slajd.autor}</p>
                <p className="mt-1 text-xs text-kamien">{slajd.rola}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-6 flex gap-2" aria-hidden>
          {opinie.slajdy.map((slajd, i) => (
            <span
              key={slajd.autor}
              className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${
                i === aktywny ? 'bg-lipa' : 'bg-glina'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
