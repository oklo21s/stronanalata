import { useEffect, useRef, useState } from 'react'
import { List, X } from '@phosphor-icons/react'
import { MARKA, NAWIGACJA, CTA_GLOWNE } from '../dane'

/*
  Pasek na stałe u góry. Nad jasnym niebem hero jest przezroczysty i pisany
  ciemnym atramentem; po odjechaniu od góry strony zamienia się w ciemną,
  rozmytą belkę z jasnym tekstem. Oba stany mają kontrast powyżej 4.5:1.

  Stan "odjechany" bierze się z IntersectionObserver na jednopikselowym
  wartowniku, nie z nasłuchu zdarzenia scroll.
*/
export function Nawigacja() {
  const wartownikRef = useRef(null)
  const [przyGorze, setPrzyGorze] = useState(true)
  const [menuOtwarte, setMenuOtwarte] = useState(false)

  useEffect(() => {
    const el = wartownikRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const obserwator = new IntersectionObserver(([wpis]) => setPrzyGorze(wpis.isIntersecting), {
      threshold: 0,
    })
    obserwator.observe(el)
    return () => obserwator.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOtwarte) return undefined
    const naKlawisz = (e) => {
      if (e.key === 'Escape') setMenuOtwarte(false)
    }
    document.addEventListener('keydown', naKlawisz)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', naKlawisz)
      document.body.style.overflow = ''
    }
  }, [menuOtwarte])

  const atrament = przyGorze ? 'text-noc' : 'text-kremowa'

  return (
    <>
      <div ref={wartownikRef} className="absolute top-24 left-0 h-px w-full" aria-hidden="true" />

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          przyGorze
            ? 'bg-transparent'
            : 'border-b border-white/10 bg-granat/85 backdrop-blur-md supports-[backdrop-filter]:bg-granat/70'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-5 md:h-[72px] md:px-10">
          <a
            href="#gora"
            className={`flex shrink-0 items-center gap-2.5 ${atrament} transition-colors duration-500`}
          >
            <svg viewBox="0 0 32 24" className="h-4 w-6" aria-hidden="true">
              <path
                d="M2 22 L12 4 L18 15 L21.5 9 L30 22 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            <span className="tytul-wyswietlany text-[13px] tracking-[0.24em] uppercase">
              {MARKA.pelna}
            </span>
          </a>

          <nav aria-label="Główna" className="hidden items-center gap-9 md:flex">
            {NAWIGACJA.map((pozycja) => (
              <a
                key={pozycja.kotwica}
                href={pozycja.kotwica}
                className={`text-[13px] tracking-[0.06em] ${atrament} opacity-80 transition-opacity duration-300 hover:opacity-100`}
              >
                {pozycja.etykieta}
              </a>
            ))}
            <a
              href="#rezerwacja"
              className={`px-5 py-2.5 text-[13px] font-medium tracking-[0.04em] whitespace-nowrap transition-all duration-500 active:translate-y-px ${
                przyGorze
                  ? 'bg-noc text-kremowa hover:bg-noc/85'
                  : 'bg-lod text-granat hover:bg-lod/85'
              }`}
            >
              {CTA_GLOWNE}
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOtwarte(true)}
            aria-expanded={menuOtwarte}
            aria-controls="menu-mobilne"
            className={`-mr-2 p-2 md:hidden ${atrament} transition-colors duration-500`}
          >
            <span className="sr-only">Otwórz menu</span>
            <List size={22} weight="light" aria-hidden="true" />
          </button>
        </div>
      </header>

      {menuOtwarte ? (
        <div
          id="menu-mobilne"
          className="fixed inset-0 z-[70] flex flex-col bg-granat/[0.97] px-5 pt-5 md:hidden"
        >
          <div className="flex h-16 items-center justify-end">
            <button
              type="button"
              onClick={() => setMenuOtwarte(false)}
              className="-mr-2 p-2 text-kremowa"
            >
              <span className="sr-only">Zamknij menu</span>
              <X size={22} weight="light" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobilna" className="mt-6 flex flex-col gap-1">
            {NAWIGACJA.map((pozycja) => (
              <a
                key={pozycja.kotwica}
                href={pozycja.kotwica}
                onClick={() => setMenuOtwarte(false)}
                className="tytul-wyswietlany border-b border-white/10 py-5 text-2xl text-kremowa"
              >
                {pozycja.etykieta}
              </a>
            ))}
          </nav>
          <a
            href="#rezerwacja"
            onClick={() => setMenuOtwarte(false)}
            className="mt-8 bg-lod px-6 py-4 text-center text-sm font-medium text-granat"
          >
            {CTA_GLOWNE}
          </a>
        </div>
      ) : null}
    </>
  )
}
