import { firma, kontakt, stopka } from '@/lib/content';

export function Stopka() {
  return (
    <footer className="border-t border-glina bg-piasek py-16">
      <div className="kontener">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-2xl">{firma.nazwa}</p>
            <p className="mt-3 text-sm leading-relaxed text-wegiel/70">{firma.tagline}</p>
          </div>

          <div className="grid gap-8 text-sm sm:grid-cols-2">
            <div>
              <p className="nadtytul mb-3">Biuro sprzedaży</p>
              <address className="not-italic leading-relaxed text-wegiel/80">
                {kontakt.biuro.adres}
                <br />
                {kontakt.biuro.godziny}
              </address>
            </div>
            <div>
              <p className="nadtytul mb-3">Kontakt</p>
              <p className="leading-relaxed text-wegiel/80">
                <a href={`tel:${kontakt.biuro.telefon.replace(/\s/g, '')}`} className="hover:text-grafit">
                  {kontakt.biuro.telefon}
                </a>
                <br />
                <a href={`mailto:${kontakt.biuro.email}`} className="hover:text-grafit">
                  {kontakt.biuro.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-glina pt-8 text-xs text-kamien sm:flex-row sm:items-center sm:justify-between">
          <p>{stopka.prawa}</p>
          <p className="max-w-xl sm:text-right">{stopka.nota}</p>
        </div>
      </div>
    </footer>
  );
}
