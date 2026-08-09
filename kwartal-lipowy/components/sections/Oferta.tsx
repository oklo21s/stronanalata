'use client';

import { useRef } from 'react';
import { Home, Sprout, Sun, TreeDeciduous, type LucideIcon } from 'lucide-react';

import { gsap, krzywe, rytm, warunki, type WarunkiRuchu } from '@/lib/gsap';
import { wejscieNaglowka } from '@/lib/animacje';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { NaglowekSekcji } from '@/components/ui/NaglowekSekcji';
import { oferta } from '@/lib/content';

const IKONY: Record<string, LucideIcon> = {
  Sprout,
  Home,
  TreeDeciduous,
  Sun,
};

export function Oferta() {
  const korzen = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(warunki, (kontekst) => {
        const { maly, ruchOgraniczony: bezRuchu } = kontekst.conditions as WarunkiRuchu;
        if (bezRuchu) return;

        wejscieNaglowka(korzen.current, maly);

        // Na malym ekranie karty ida jedna pod druga, wiec dlugi stagger
        // znaczylby, ze ostatnia rusza dobre pol sekundy po wejsciu w kadr.
        const odstep = maly ? rytm.karty.maly : rytm.karty.duzy;

        const os = gsap.timeline({
          scrollTrigger: { trigger: '[data-siatka]', start: 'top 80%' },
        });

        os.from('[data-karta]', {
          y: maly ? 32 : 56,
          opacity: 0,
          // Delikatne domykanie skali sprawia, ze karta „dochodzi" do widza,
          // zamiast tylko przesuwac sie w gore.
          scale: 0.97,
          duration: 0.9,
          ease: krzywe.plynne,
          stagger: odstep,
        }).from(
          '[data-ikona]',
          {
            scale: 0.5,
            opacity: 0,
            duration: 0.55,
            ease: 'back.out(2)',
            stagger: odstep,
          },
          // Ikony ruszaja tuz po kartach — razem z nimi ginelyby w ruchu.
          0.25,
        );
      });
    }, korzen);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={korzen} id="oferta" className="bg-kosc py-sekcja">
      <div className="kontener">
        <NaglowekSekcji
          nadtytul={oferta.nadtytul}
          tytul={oferta.tytul}
          lead={oferta.lead}
        />

        <div
          data-siatka
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          {oferta.karty.map((karta) => {
            const Ikona = IKONY[karta.ikona] ?? Home;

            return (
              <article
                key={karta.nazwa}
                data-karta
                className="group flex flex-col rounded-2xl border border-glina bg-piasek/50 p-7 transition-colors duration-500 ease-wyjscie hover:border-lipa/40 hover:bg-piasek"
              >
                <span
                  data-ikona
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-kosc text-lipa ring-1 ring-glina transition-colors duration-500 ease-wyjscie group-hover:bg-lipa group-hover:text-kosc"
                >
                  <Ikona size={19} aria-hidden />
                </span>

                <p className="mt-7 font-display text-3xl text-grafit">{karta.metraz}</p>
                <h3 className="mt-2 text-base font-medium text-grafit">{karta.nazwa}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-wegiel/70">
                  {karta.opis}
                </p>

                <p className="mt-7 border-t border-glina pt-4 text-xs uppercase tracking-[0.16em] text-kamien">
                  {karta.liczba}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
