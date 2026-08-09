import { forwardRef } from 'react'
import { PRZEJSCIE } from '../dane'

/*
  Drugi kadr strefy narracji. Pojawia się, gdy scena jest już w połowie nocy,
  więc niesie jasny atrament na ciemnym tle. Ustawiony po prawej stronie -
  hero trzyma się lewej krawędzi, ten blok odbija się na przeciwną,
  żeby przejście było widoczne także w kompozycji, nie tylko w kolorze.
*/
export const Przejscie = forwardRef(function Przejscie({ wStrefie = true }, ref) {
  return (
    <div
      ref={ref}
      className={
        wStrefie
          ? 'absolute inset-0 z-10 flex items-center justify-end px-5 opacity-0 md:px-10'
          : 'relative z-10 flex min-h-[70vh] items-center justify-end px-5 md:px-10'
      }
    >
      {/*
        Zasłona po tej stronie kadru, po której leży tekst. Szczyt w nocnej
        tonacji jest jasnoniebieski, więc bez niej jasna typografia potrafiłaby
        zejść poniżej progu kontrastu dokładnie na śniegu.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full bg-gradient-to-l from-granat/90 via-granat/60 to-transparent md:w-3/5"
      />

      <div className="max-w-[34ch] md:max-w-[38ch]">
        <p className="tytul-wyswietlany text-[clamp(1.75rem,4.6vw,3.4rem)] leading-[1.1] text-kremowa">
          {PRZEJSCIE.naglowek}
        </p>
        <p className="mt-6 text-[15px] leading-relaxed text-stal md:text-base">
          {PRZEJSCIE.opis}
        </p>
      </div>
    </div>
  )
})
