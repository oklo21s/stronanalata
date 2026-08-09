import { MARKA, NAWIGACJA } from '../dane'

export function Stopka() {
  return (
    <footer className="relative border-t border-white/10">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:grid-cols-12 md:px-10 md:py-20">
        <div className="md:col-span-5">
          <p className="tytul-wyswietlany text-[13px] tracking-[0.24em] text-kremowa uppercase">
            {MARKA.pelna}
          </p>
          <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-stal">
            {MARKA.lokalizacja}, 940 m n.p.m. Doba hotelowa od 16:00 do 11:00.
          </p>
        </div>

        <nav aria-label="Stopka" className="flex flex-col gap-3 md:col-span-3">
          {NAWIGACJA.map((pozycja) => (
            <a
              key={pozycja.kotwica}
              href={pozycja.kotwica}
              className="text-sm text-stal transition-colors duration-200 hover:text-lod"
            >
              {pozycja.etykieta}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-3 md:col-span-4">
          <a
            href={`tel:${MARKA.telefonLink}`}
            className="text-sm text-stal transition-colors duration-200 hover:text-lod"
          >
            {MARKA.telefon}
          </a>
          <a
            href={`mailto:${MARKA.email}`}
            className="text-sm text-stal transition-colors duration-200 hover:text-lod"
          >
            {MARKA.email}
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] border-t border-white/10 px-5 py-6 md:px-10">
        <p className="text-xs text-stal">
          {new Date().getFullYear()} {MARKA.pelna}. Wszystkie prawa zastrzeżone.
        </p>
      </div>
    </footer>
  )
}
