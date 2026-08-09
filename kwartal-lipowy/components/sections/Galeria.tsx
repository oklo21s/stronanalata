'use client';

import { useRef } from 'react';
import Image from 'next/image';

import { gsap, krzywe, warunki, type WarunkiRuchu } from '@/lib/gsap';
import { odslonaKadru, wejscieNaglowka } from '@/lib/animacje';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { NaglowekSekcji } from '@/components/ui/NaglowekSekcji';
import { galeria } from '@/lib/content';

export function Galeria() {
  const korzen = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(warunki, (kontekst) => {
        const { maly, ruchOgraniczony: bezRuchu } = kontekst.conditions as WarunkiRuchu;
        if (bezRuchu) return;

        // Trzy predkosci wzgledem scrolla: tlo ~0,3x, kadry ~0,6x, tekst 1x.
        // Im mniejsza predkosc wlasna warstwy, tym bardziej "zostaje w tyle",
        // czyli tym wieksze przesuniecie w przeciwna strone.
        // Na malym ekranie skracamy caly zakres — przy krotkim viewporcie
        // pelna amplituda odrywa podpisy od obrazow.
        const skala = maly ? 0.45 : 1;

        gsap.fromTo(
          '[data-parallax-tlo]',
          { yPercent: -14 * skala },
          {
            yPercent: 14 * skala,
            ease: 'none',
            scrollTrigger: {
              trigger: korzen.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );

        gsap.utils.toArray<HTMLElement>('[data-parallax-kadr]').forEach((kadr, i) => {
          // Naprzemienny kierunek — dwie kolumny rozjezdzaja sie wzgledem siebie.
          const kierunek = i % 2 === 0 ? 1 : -1;

          gsap.fromTo(
            kadr,
            { yPercent: -7 * skala * kierunek },
            {
              yPercent: 7 * skala * kierunek,
              ease: 'none',
              scrollTrigger: {
                trigger: kadr,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          );

          // Odslona przy wejsciu w kadr — niezalezna od parallaxu powyzej,
          // bo tamten jest scrubowany, a ta ma zagrac raz i do konca.
          odslonaKadru(kadr, kadr.querySelector('img'), maly);
        });

        wejscieNaglowka(korzen.current, maly);

        gsap.from('[data-zastrzezenie]', {
          opacity: 0,
          y: 16,
          duration: 0.7,
          ease: krzywe.plynne,
          scrollTrigger: { trigger: '[data-zastrzezenie]', start: 'top 92%' },
        });
      });
    }, korzen);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={korzen}
      id="galeria"
      className="relative overflow-hidden bg-kosc py-sekcja"
    >
      {/* Warstwa najwolniejsza — dekoracyjna, poza drzewem dostepnosci. */}
      <div
        data-parallax-tlo
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 flex justify-center"
        aria-hidden
      >
        <span className="select-none font-display text-[26vw] leading-none text-glina/40">
          Kwartał
        </span>
      </div>

      <div className="kontener relative z-10">
        <NaglowekSekcji nadtytul={galeria.nadtytul} tytul={galeria.tytul} />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 sm:gap-8">
          {galeria.kadry.map((kadr, i) => (
            <figure
              key={kadr.podpis}
              className={`${i % 2 === 1 ? 'sm:mt-20' : ''}`}
            >
              <div
                data-parallax-kadr
                className="group overflow-hidden rounded-2xl bg-piasek ring-1 ring-glina"
              >
                {/*
                  Import statyczny daje next/image wymiary i wygenerowany
                  blurDataURL — kafelek nie skacze przy doladowaniu, bo miejsce
                  jest zarezerwowane od pierwszego renderu.
                  `sizes` mowi, ze na desktopie kadr zajmuje pol szerokosci:
                  bez tego Next zasysalby wariant na pelna szerokosc ekranu.
                */}
                <Image
                  src={kadr.plik}
                  alt={`${kadr.podpis}. Zdjęcie poglądowe, nie przedstawia tej inwestycji.`}
                  placeholder="blur"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-wyjscie will-change-transform motion-safe:group-hover:scale-[1.04]"
                />
              </div>

              <figcaption className="mt-5">
                <p className="text-sm font-medium text-grafit">{kadr.podpis}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-wegiel/65">
                  {kadr.opis}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p
          data-zastrzezenie
          className="mt-14 max-w-2xl border-t border-glina pt-6 text-xs leading-relaxed text-kamien"
        >
          {galeria.zastrzezenie}
        </p>
      </div>
    </section>
  );
}
