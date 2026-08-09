import { Scena } from './scena/Scena'
import { useOgraniczonyRuch } from './hooks/useOgraniczonyRuch'
import { Nawigacja } from './sekcje/Nawigacja'
import { StrefaNarracji } from './sekcje/StrefaNarracji'
import { Oferta } from './sekcje/Oferta'
import { Domki } from './sekcje/Domki'
import { Rezerwacja } from './sekcje/Rezerwacja'
import { Stopka } from './sekcje/Stopka'

/*
  Kanwa 3D leży na stałe pod całym dokumentem. Sekcje nocne mają własną,
  półprzezroczystą zasłonę, więc masyw zostaje widoczny jako tło, a tekst
  i tak trzyma kontrast powyżej progu AA (zasłona 88% na granacie).
*/
export default function App() {
  const ograniczonyRuch = useOgraniczonyRuch()

  return (
    <div className="ziarno relative">
      <a
        href="#tresc"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:bg-lod focus:px-5 focus:py-3 focus:text-sm focus:text-granat"
      >
        Przejdź do treści
      </a>

      <Scena />
      <Nawigacja />

      <main id="tresc">
        <StrefaNarracji />

        <div className="relative">
          {/*
            Miękkie wejście w zasłonę: bez tego krawędź ciemnej części byłaby
            prostą linią. Przy ograniczonym ruchu ten sam ramp jest już wbudowany
            w strefę narracji, więc drugi zrobiłby uskok zamiast przejścia.
          */}
          {ograniczonyRuch ? null : (
            <div
              aria-hidden="true"
              className="pointer-events-none h-32 bg-gradient-to-b from-transparent to-granat/[0.88] md:h-48"
            />
          )}
          <div className="bg-granat/[0.88]">
            <Oferta />
            <Domki />
            <Rezerwacja />
            <Stopka />
          </div>
        </div>
      </main>
    </div>
  )
}
