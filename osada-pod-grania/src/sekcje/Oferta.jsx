import { useRef } from 'react'
import { UDOGODNIENIA } from '../dane'
import { ObiektOferty } from '../obiekty/ObiektOferty'
import { useOdslonienie } from '../hooks/useOdslonienie'

/*
  Trzy bloki tego, co jest na miejscu. Dwa pierwsze idą naprzemiennym podziałem
  tekst / obiekt, trzeci łamie ten rytm na układ pełnej szerokości - trzeci
  z rzędu podział na pół czytałby się jak szablon, a nie jak kompozycja.
*/
export function Oferta() {
  const sekcjaRef = useRef(null)
  useOdslonienie(sekcjaRef)

  const [pierwszy, drugi, trzeci] = UDOGODNIENIA

  return (
    <section id="udogodnienia" ref={sekcjaRef} className="relative">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <h2
          data-odsloniecie
          className="tytul-wyswietlany max-w-[16ch] text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.08] text-kremowa"
        >
          Co jest na miejscu
        </h2>

        <div className="mt-16 grid items-center gap-10 md:mt-24 md:grid-cols-12 md:gap-16">
          <div data-odsloniecie className="md:col-span-6 md:col-start-1">
            <h3 className="tytul-wyswietlany text-[clamp(1.4rem,2.8vw,2.1rem)] leading-tight text-kremowa">
              {pierwszy.naglowek}
            </h3>
            <p className="mt-5 max-w-[46ch] leading-relaxed text-stal">{pierwszy.opis}</p>
          </div>
          <div data-odsloniecie className="md:col-span-5 md:col-start-8">
            <ObiektOferty ksztalt={pierwszy.ksztalt} etykieta={pierwszy.etykietaObiektu} />
          </div>
        </div>

        <div className="mt-20 grid items-center gap-10 md:mt-28 md:grid-cols-12 md:gap-16">
          <div data-odsloniecie className="md:col-span-5 md:col-start-1 md:row-start-1">
            <ObiektOferty ksztalt={drugi.ksztalt} etykieta={drugi.etykietaObiektu} />
          </div>
          <div data-odsloniecie className="md:col-span-6 md:col-start-7 md:row-start-1">
            <h3 className="tytul-wyswietlany text-[clamp(1.4rem,2.8vw,2.1rem)] leading-tight text-kremowa">
              {drugi.naglowek}
            </h3>
            <p className="mt-5 max-w-[46ch] leading-relaxed text-stal">{drugi.opis}</p>
          </div>
        </div>

        <div className="mt-24 border-t border-white/10 pt-16 md:mt-36 md:pt-24">
          <div data-odsloniecie className="mx-auto w-full max-w-[26rem]">
            <ObiektOferty ksztalt={trzeci.ksztalt} etykieta={trzeci.etykietaObiektu} />
          </div>
          <div data-odsloniecie className="mx-auto mt-10 max-w-[52ch] text-center">
            <h3 className="tytul-wyswietlany text-[clamp(1.4rem,2.8vw,2.1rem)] leading-tight text-kremowa">
              {trzeci.naglowek}
            </h3>
            <p className="mt-5 leading-relaxed text-stal">{trzeci.opis}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
