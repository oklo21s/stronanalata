'use client';

import { useRef, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Check, Mail, MapPin, Phone } from 'lucide-react';

import { gsap, krzywe, rytm, warunki, type WarunkiRuchu } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SlowaZMaska } from '@/components/ui/SlowaZMaska';
import { kontakt } from '@/lib/content';

const KLASA_POLA =
  'w-full rounded-xl border border-glina bg-kosc px-4 py-3.5 text-sm text-grafit placeholder:text-kamien focus:border-lipa focus:outline-none focus:ring-1 focus:ring-lipa';

export function Kontakt() {
  const korzen = useRef<HTMLElement>(null);
  const formularz = useRef<HTMLFormElement>(null);
  const [wyslany, setWyslany] = useState(false);
  const ruchOgraniczony = usePrefersReducedMotion();

  const przySubmit = (zdarzenie: FormEvent<HTMLFormElement>) => {
    zdarzenie.preventDefault();

    // UWAGA: ta strona nie ma backendu. Formularz niczego nie wysyla i
    // niczego nie zapisuje — dane zostaja w polach przegladarki.
    // Podlaczenie: POST na wlasny endpoint albo dostawce formularzy w tym
    // miejscu, plus obsluga bledu i stanu ladowania.
    setWyslany(true);
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(warunki, (kontekst) => {
        const { maly, ruchOgraniczony: bezRuchu } = kontekst.conditions as WarunkiRuchu;
        if (bezRuchu) return;

        const osFormularza = gsap.timeline({
          scrollTrigger: { trigger: formularz.current, start: 'top 85%' },
        });

        // Najpierw wjezdza sama karta, a pola dopiero po niej — inaczej
        // ruch pol znosi sie z ruchem tla, pod ktorym siedza.
        osFormularza
          .from(formularz.current, {
            y: maly ? 48 : 90,
            opacity: 0,
            duration: 1.05,
            ease: krzywe.plynne,
          })
          .from(
            '[data-pole]',
            {
              opacity: 0,
              y: 22,
              duration: 0.6,
              ease: krzywe.plynne,
              stagger: maly ? rytm.drobne.maly : rytm.drobne.duzy,
            },
            '-=0.6',
          );

        const osTekstu = gsap.timeline({
          scrollTrigger: { trigger: korzen.current, start: 'top 72%' },
        });

        osTekstu
          .from('[data-naglowek-nad]', {
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
            '[data-kontakt-tekst]',
            {
              y: 26,
              opacity: 0,
              duration: 0.75,
              ease: krzywe.plynne,
              stagger: maly ? rytm.drobne.maly : rytm.drobne.duzy,
            },
            '-=0.55',
          );
      });
    }, korzen);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={korzen} id="kontakt" className="bg-kosc py-sekcja">
      <div className="kontener">
        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          {/* Sticky reveal: kolumna z danymi zostaje w kadrze, formularz
              przesuwa sie obok niej. */}
          <div className="md:sticky md:top-28 md:self-start">
            <p data-naglowek-nad className="nadtytul">
              {kontakt.nadtytul}
            </p>
            <SlowaZMaska
              jako="h2"
              tekst={kontakt.tytul}
              className="mt-5 font-display text-sekcja"
            />
            <p data-kontakt-tekst className="mt-6 max-w-md text-lead text-wegiel/70">
              {kontakt.lead}
            </p>

            <ul data-kontakt-tekst className="mt-10 space-y-4 text-sm">
              <li className="flex items-start gap-3.5">
                <MapPin size={17} className="mt-0.5 shrink-0 text-lipa" aria-hidden />
                <span className="text-wegiel/80">{kontakt.biuro.adres}</span>
              </li>
              <li className="flex items-start gap-3.5">
                <Phone size={17} className="mt-0.5 shrink-0 text-lipa" aria-hidden />
                <a
                  href={`tel:${kontakt.biuro.telefon.replace(/\s/g, '')}`}
                  className="text-wegiel/80 hover:text-grafit"
                >
                  {kontakt.biuro.telefon}
                </a>
              </li>
              <li className="flex items-start gap-3.5">
                <Mail size={17} className="mt-0.5 shrink-0 text-lipa" aria-hidden />
                <a
                  href={`mailto:${kontakt.biuro.email}`}
                  className="text-wegiel/80 hover:text-grafit"
                >
                  {kontakt.biuro.email}
                </a>
              </li>
            </ul>

            <p data-kontakt-tekst className="mt-8 text-xs text-kamien">
              {kontakt.biuro.godziny}
            </p>
          </div>

          <form
            ref={formularz}
            onSubmit={przySubmit}
            className="rounded-2xl border border-glina bg-piasek/60 p-7 lg:p-10"
            noValidate={false}
          >
            <div className="grid gap-5">
              <div data-pole>
                <label htmlFor="imie" className="mb-2 block text-xs text-wegiel/70">
                  {kontakt.pola.imie}
                </label>
                <input
                  id="imie"
                  name="imie"
                  type="text"
                  required
                  autoComplete="name"
                  className={KLASA_POLA}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div data-pole>
                  <label htmlFor="email" className="mb-2 block text-xs text-wegiel/70">
                    {kontakt.pola.email}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={KLASA_POLA}
                  />
                </div>

                <div data-pole>
                  <label htmlFor="telefon" className="mb-2 block text-xs text-wegiel/70">
                    {kontakt.pola.telefon}
                  </label>
                  <input
                    id="telefon"
                    name="telefon"
                    type="tel"
                    autoComplete="tel"
                    className={KLASA_POLA}
                  />
                </div>
              </div>

              <div data-pole>
                <label htmlFor="metraz" className="mb-2 block text-xs text-wegiel/70">
                  {kontakt.pola.metraz}
                </label>
                <select id="metraz" name="metraz" className={KLASA_POLA} defaultValue="">
                  <option value="" disabled>
                    Wybierz
                  </option>
                  {kontakt.metraze.map((pozycja) => (
                    <option key={pozycja} value={pozycja}>
                      {pozycja}
                    </option>
                  ))}
                </select>
              </div>

              <div data-pole>
                <label htmlFor="wiadomosc" className="mb-2 block text-xs text-wegiel/70">
                  {kontakt.pola.wiadomosc}
                </label>
                <textarea
                  id="wiadomosc"
                  name="wiadomosc"
                  rows={4}
                  className={`${KLASA_POLA} resize-y`}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-grafit px-7 py-4 text-sm text-kosc"
              whileHover={ruchOgraniczony ? undefined : { scale: 1.02 }}
              whileTap={ruchOgraniczony ? undefined : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            >
              {wyslany ? <Check size={17} aria-hidden /> : null}
              {wyslany ? 'Formularz wypełniony' : kontakt.przycisk}
            </motion.button>

            <p className="mt-5 text-xs leading-relaxed text-kamien">{kontakt.zgoda}</p>

            {/* Komunikat mowi wprost, co sie stalo — obiecywanie wyslanego
                zgloszenia bez backendu byloby klamstwem wobec uzytkownika. */}
            <p
              role="status"
              aria-live="polite"
              className={`mt-4 rounded-xl border border-mosiadz/40 bg-mosiadz/10 px-4 py-3 text-xs leading-relaxed text-wegiel ${
                wyslany ? 'block' : 'hidden'
              }`}
            >
              Wersja demonstracyjna: formularz nie wysyła danych. Aby zgłoszenia
              docierały do biura, podłącz endpoint w funkcji <code>przySubmit</code>.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
