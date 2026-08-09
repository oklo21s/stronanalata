import { useRef } from 'react'
import { DOMKI } from '../dane'
import { useOdslonienie } from '../hooks/useOdslonienie'

/*
  Trzy domki w układzie asymetrycznym: jeden kadr pionowy niesie sekcję,
  dwa poziome stoją obok. Dane liczbowe idą w trzykolumnową siatkę z jedną
  linią u góry, zamiast listy z kreską pod każdym wierszem.
*/

function Metryka({ domek }) {
  return (
    <dl className="mt-5 grid grid-cols-3 border-t border-white/10">
      <div className="py-4 pr-4">
        <dt className="text-[11px] tracking-[0.14em] text-stal uppercase">Osoby</dt>
        <dd className="tytul-wyswietlany mt-1.5 text-lg text-kremowa">{domek.osoby}</dd>
      </div>
      <div className="border-l border-white/10 py-4 pr-4 pl-4">
        <dt className="text-[11px] tracking-[0.14em] text-stal uppercase">Metraż</dt>
        <dd className="tytul-wyswietlany mt-1.5 text-lg text-kremowa">{domek.metraz}</dd>
      </div>
      <div className="border-l border-white/10 py-4 pl-4">
        <dt className="text-[11px] tracking-[0.14em] text-stal uppercase">Doba</dt>
        <dd className="tytul-wyswietlany mt-1.5 text-lg text-lod">{domek.cena}</dd>
      </div>
    </dl>
  )
}

function Zdjecie({ domek, proporcje }) {
  return (
    <div className={`w-full overflow-hidden bg-granat-2 ${proporcje}`}>
      <img
        src={domek.zdjecie}
        alt={domek.alt}
        width={domek.szerokosc}
        height={domek.wysokosc}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
  )
}

export function Domki() {
  const sekcjaRef = useRef(null)
  useOdslonienie(sekcjaRef)

  const [glowny, ...pozostale] = DOMKI

  return (
    <section id="domki" ref={sekcjaRef} className="relative">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <h2
          data-odsloniecie
          className="tytul-wyswietlany max-w-[18ch] text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.08] text-kremowa"
        >
          Sześć domów, trzy metraże
        </h2>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-12">
          <article data-odsloniecie className="md:col-span-7">
            <Zdjecie domek={glowny} proporcje="aspect-[4/5]" />
            <h3 className="tytul-wyswietlany mt-7 text-2xl text-kremowa md:text-3xl">
              {glowny.nazwa}
            </h3>
            <p className="mt-3 max-w-[46ch] leading-relaxed text-stal">{glowny.opis}</p>
            <Metryka domek={glowny} />
          </article>

          <div className="flex flex-col gap-12 md:col-span-5 md:justify-center">
            {pozostale.map((domek) => (
              <article key={domek.id} data-odsloniecie>
                <Zdjecie domek={domek} proporcje="aspect-[4/3]" />
                <h3 className="tytul-wyswietlany mt-6 text-xl text-kremowa md:text-2xl">
                  {domek.nazwa}
                </h3>
                <p className="mt-3 max-w-[42ch] leading-relaxed text-stal">{domek.opis}</p>
                <Metryka domek={domek} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
