import { Fragment, type ElementType } from 'react';

type Props = {
  tekst: string;
  jako?: ElementType;
  className?: string;
  /** Nazwa atrybutu, po ktorym sekcja zlapie slowa w gsap.from(). */
  znacznik?: string;
};

/**
 * Dzieli tekst na slowa i wklada kazde do wlasnej maski, zeby mogly wjechac
 * spod krawedzi zamiast po prostu pojawic sie razem z calym blokiem.
 *
 * Trzy rzeczy, ktore latwo tu zepsuc:
 *
 * 1. **Ogonki.** `overflow: hidden` obcina wszystko ponizej linii bazowej,
 *    wiec bez zapasu na dole polskie „ą" i „ę" traca ogonki, a „y" i „p"
 *    descendery. Stad `pb-[0.16em]` i wyrownanie do dolu.
 * 2. **Zawijanie.** Spacje sa prawdziwymi wezlami tekstowymi miedzy spanami,
 *    a nie marginesem — dzieki temu dlugi naglowek lamie sie naturalnie
 *    i zachowuje wlasciwa szerokosc spacji dla danego kroju.
 * 3. **Czytniki ekranu.** Tekst pociety na kilkanascie elementow potrafi byc
 *    czytany z pauzami, dlatego pelne zdanie idzie w `aria-label`, a kawalki
 *    znikaja z drzewa dostepnosci.
 *
 * Bez JS (i przy ograniczonym ruchu) slowa po prostu stoja na miejscu —
 * animacje robi `gsap.from()`, wiec stanem domyslnym jest tekst widoczny.
 */
export function SlowaZMaska({
  tekst,
  jako: Tag = 'span',
  className,
  znacznik = 'data-slowo',
}: Props) {
  const slowa = tekst.split(' ');

  return (
    <Tag className={className} aria-label={tekst}>
      {slowa.map((slowo, i) => (
        <Fragment key={`${slowo}-${i}`}>
          <span
            className="inline-block overflow-hidden pb-[0.16em] align-bottom"
            aria-hidden
          >
            <span {...{ [znacznik]: '' }} className="inline-block will-change-transform">
              {slowo}
            </span>
          </span>
          {i < slowa.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}
