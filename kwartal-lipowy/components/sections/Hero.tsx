'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Move3d, X } from 'lucide-react';

import { gsap, krzywe, warunki, type WarunkiRuchu } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { hero } from '@/lib/content';

// Three.js siega po `window` juz przy imporcie, wiec panorama nie moze
// trafic do renderu serwerowego.
const Panorama360 = dynamic(() => import('@/components/three/Panorama360'), {
  ssr: false,
});

export function Hero() {
  const korzen = useRef<HTMLElement>(null);
  const tresc = useRef<HTMLDivElement>(null);
  const tlo = useRef<HTMLDivElement>(null);
  const zdjecie = useRef<HTMLDivElement>(null);

  const ruchOgraniczony = usePrefersReducedMotion();
  const maly = useMediaQuery('(max-width: 767px)');

  // Panorama wchodzi dopiero po hydratacji — inaczej pierwszy render klienta
  // rozjechalby sie z serwerowym.
  const [zamontowana, setZamontowana] = useState(false);
  const [gotowa, setGotowa] = useState(false);
  const [ruszony, setRuszony] = useState(false);
  const [dotykAktywny, setDotykAktywny] = useState(false);

  useEffect(() => setZamontowana(true), []);

  // Autoobrot ma zachecac do zlapania panoramy, wiec po pierwszym chwyceniu
  // przestaje przeszkadzac.
  const przyChwyceniu = useCallback(() => setRuszony(true), []);
  const oznaczGotowa = useCallback(() => setGotowa(true), []);

  const panoramaWidoczna = zamontowana && !ruchOgraniczony;
  // Na myszy przeciaganie nie koliduje z przewijaniem, wiec dziala od razu.
  // Na dotyku wlacza je dopiero przycisk — patrz komentarz przy nim.
  const interaktywna = maly ? dotykAktywny : true;

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(warunki, (kontekst) => {
        const { maly, ruchOgraniczony: bezRuchu } = kontekst.conditions as WarunkiRuchu;
        if (bezRuchu) return;

        // Wejscie jako jedna sekwencja: najpierw odslania sie kadr, potem
        // spod maski wychodzi tytul, a reszta dochodzi z zakladkami.
        // Osobne tweeny z recznie dobranymi `delay` rozjezdzaja sie przy
        // kazdej zmianie czasu trwania — os czasu utrzymuje relacje sama.
        const wejscie = gsap.timeline({ defaults: { ease: krzywe.plynne } });

        wejscie
          .from(tlo.current, {
            clipPath: 'inset(14% 8% 14% 8%)',
            duration: 1.5,
            ease: krzywe.odslona,
          })
          .from(
            zdjecie.current,
            {
              scale: 1.14,
              duration: 1.8,
            },
            0,
          )
          .from(
            '[data-hero-nad]',
            {
              opacity: 0,
              y: 16,
              duration: 0.7,
            },
            0.35,
          )
          .from(
            '[data-hero-linia]',
            {
              yPercent: 112,
              duration: 1.2,
              ease: krzywe.odslona,
              stagger: 0.1,
            },
            0.45,
          )
          .from(
            '[data-hero-fade]',
            {
              opacity: 0,
              y: 24,
              duration: 0.85,
              stagger: 0.09,
            },
            0.95,
          );

        // Wyjscie: tresc blaknie i kurczy sie w pierwszych ~20% scrolla,
        // zdjecie w tym czasie powoli najezdza — stad wrazenie glebi.
        const os = gsap.timeline({
          scrollTrigger: {
            trigger: korzen.current,
            start: 'top top',
            end: '20% top',
            scrub: true,
          },
        });

        os.to(tresc.current, { opacity: 0, scale: 0.94, yPercent: -12, ease: 'none' }, 0);
        os.to(tlo.current, { scale: maly ? 1.06 : 1.12, ease: 'none' }, 0);
      });
    }, korzen);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={korzen}
      className="relative flex h-[100svh] min-h-[640px] items-center overflow-hidden bg-piasek"
    >
      <div ref={tlo} className="absolute inset-0 will-change-transform" aria-hidden>
        {/* Osobna warstwa na skale wejsciowa: `tlo` obsluguje juz clip-path
            i najazd przy przewijaniu, a dwa tweeny skali na jednym elemencie
            nadpisalyby sie nawzajem. */}
        <div ref={zdjecie} className="absolute inset-0 will-change-transform">
        {/*
          `priority` — to najwiekszy element pierwszego ekranu, wiec ma isc
          bez lazy-loadingu; inaczej psuje LCP.
          `alt=""` jest celowe: zdjecie jest dekoracyjne, cala tresc niesie
          naglowek obok. Opisywanie go czytnikowi tylko dublowaloby lekture.
        */}
          <Image
            src={hero.foto}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/*
          Panorama lezy NAD statycznym zdjeciem i wchodzi dopiero, gdy tekstura
          sie zaladuje. Dzieki temu LCP liczy sie ze zdjecia (lekkie, `priority`),
          a nie z ~800 kB panoramy, i nie ma momentu pustego tla.
        */}
        {panoramaWidoczna && (
          <div
            onPointerDown={przyChwyceniu}
            className={`absolute inset-0 transition-opacity duration-1000 ease-wyjscie ${
              gotowa ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Panorama360
              plik={maly ? hero.panorama.plikMaly : hero.panorama.plik}
              interaktywna={interaktywna}
              autoObrot={!ruszony}
              onGotowa={oznaczGotowa}
            />
          </div>
        )}
      </div>

      {/*
        Zdjecie jest jasne, ale nie na tyle rownomiernie, zeby utrzymac
        grafitowy tekst. Na szerokim ekranie przykrywamy lewa strone (tam stoi
        tresc), na waskim — gora i dol, bo tekst lezy wtedy na srodku kadru.
      */}
      {/* pointer-events-none jest tu konieczne: bez tego przezroczysta
          warstwa przykrywajaca cale hero przechwytywalaby przeciaganie
          i panoramy nie dalo by sie obrocic. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-kosc/95 via-kosc/75 to-kosc/90 md:bg-gradient-to-r md:from-kosc md:via-kosc/85 md:to-transparent"
        aria-hidden
      />

      {/* Kontener rozciaga sie na cala szerokosc strony, wiec gdyby lapal
          wskaznik, zjadalby przeciaganie panoramy takze tam, gdzie nie ma
          zadnego tekstu. Wskaznik lapie dopiero sam blok tresci ponizej. */}
      <div className="kontener pointer-events-none relative z-10 pt-20">
        <div ref={tresc} className="pointer-events-auto max-w-2xl">
          <p data-hero-nad className="nadtytul">
            {hero.nadtytul}
          </p>

          <h1 className="mt-6 font-display text-hero">
            {hero.tytul.map((linia) => (
              <span key={linia} className="block overflow-hidden pb-[0.08em]">
                <span data-hero-linia className="block">
                  {linia}
                </span>
              </span>
            ))}
          </h1>

          <p data-hero-fade className="mt-8 max-w-xl text-lead text-wegiel/75">
            {hero.lead}
          </p>

          <div data-hero-fade className="mt-11 flex flex-wrap items-center gap-4">
            <motion.a
              href={hero.cta.cel}
              className="group inline-flex items-center gap-2 rounded-full bg-grafit px-7 py-4 text-sm text-kosc"
              whileHover={ruchOgraniczony ? undefined : { scale: 1.04 }}
              whileTap={ruchOgraniczony ? undefined : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            >
              {hero.cta.etykieta}
              <ArrowUpRight size={17} aria-hidden />
            </motion.a>

            <motion.a
              href={hero.ctaDrugie.cel}
              className="inline-flex items-center gap-2 rounded-full border border-grafit/25 bg-kosc/40 px-7 py-4 text-sm text-grafit backdrop-blur-sm"
              whileHover={ruchOgraniczony ? undefined : { scale: 1.04 }}
              whileTap={ruchOgraniczony ? undefined : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            >
              {hero.ctaDrugie.etykieta}
            </motion.a>
          </div>
        </div>
      </div>

      <div
        data-hero-fade
        className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center"
        aria-hidden
      >
        <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-wegiel/60">
          <ArrowDown size={14} className="motion-safe:animate-bounce" />
          {hero.wskaznikScrolla}
        </span>
      </div>

      {/* Sterowanie panorama.

          Na myszy przeciaganie nie ma z czym kolidowac, wiec dziala od razu
          i wystarczy podpowiedziec, ze jest mozliwe.

          Na dotyku jest inaczej: hero zajmuje caly ekran, a gest przeciagniecia
          to jednoczesnie gest przewijania strony. Panorama lapiaca go od razu
          zablokowalaby zjechanie nizej, dlatego wchodzi dopiero przyciskiem
          i tak samo sie ja wylacza.

          Na waskim ekranie przycisk siada wyzej (bottom-24), zeby nie wchodzil
          na wskaznik przewijania stojacy na dole na srodku. */}
      {panoramaWidoczna && gotowa && (
        <div className="absolute bottom-24 right-6 z-20 md:bottom-8 md:right-10">
          <span className="hidden items-center gap-2 rounded-full border border-grafit/15 bg-kosc/70 px-4 py-2.5 text-xs text-wegiel/75 backdrop-blur-sm md:flex">
            <Move3d size={15} aria-hidden />
            {hero.panorama.podpowiedz}
          </span>

          <motion.button
            type="button"
            onClick={() => setDotykAktywny((stan) => !stan)}
            aria-pressed={dotykAktywny}
            title={hero.panorama.opisPrzycisku}
            className="flex items-center gap-2 rounded-full border border-grafit/15 bg-kosc/85 px-4 py-2.5 text-xs text-grafit backdrop-blur-sm md:hidden"
            whileTap={ruchOgraniczony ? undefined : { scale: 0.95 }}
          >
            {dotykAktywny ? <X size={15} aria-hidden /> : <Move3d size={15} aria-hidden />}
            {dotykAktywny ? hero.panorama.wylacz : hero.panorama.wlacz}
          </motion.button>
        </div>
      )}
    </section>
  );
}
