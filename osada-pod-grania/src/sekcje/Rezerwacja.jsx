import { useRef, useState } from 'react'
import { CheckCircle, WarningCircle, Phone, EnvelopeSimple } from '@phosphor-icons/react'
import { MARKA, REZERWACJA, CTA_GLOWNE } from '../dane'
import { useOdslonienie } from '../hooks/useOdslonienie'

/*
  Formularz zapytania o termin.

  UWAGA WDROŻENIOWA: nie ma tu backendu. `wyslijZapytanie` udaje wysyłkę
  i zwraca sukces, a jedyny realny warunek porażki to brak połączenia.
  Przed uruchomieniem u klienta trzeba podmienić tę funkcję na wywołanie
  właściwego endpointu i dopiąć zabezpieczenie antyspamowe.
*/
async function wyslijZapytanie() {
  await new Promise((gotowe) => setTimeout(gotowe, 900))
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('brak-polaczenia')
  }
  return true
}

const PUSTY = {
  imie: '',
  email: '',
  przyjazd: '',
  wyjazd: '',
  osoby: '2',
  wiadomosc: '',
}

function dzisiaj() {
  return new Date().toISOString().slice(0, 10)
}

function sprawdz(dane) {
  const bledy = {}
  if (dane.imie.trim().length < 3) {
    bledy.imie = 'Podajcie imię i nazwisko, przynajmniej trzy znaki.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(dane.email.trim())) {
    bledy.email = 'Ten adres nie wygląda na poprawny. Sprawdźcie zapis.'
  }
  if (!dane.przyjazd) {
    bledy.przyjazd = 'Wybierzcie datę przyjazdu.'
  }
  if (!dane.wyjazd) {
    bledy.wyjazd = 'Wybierzcie datę wyjazdu.'
  } else if (dane.przyjazd && dane.wyjazd <= dane.przyjazd) {
    bledy.wyjazd = 'Wyjazd musi wypadać po przyjeździe.'
  }
  return bledy
}

const KLASA_POLA =
  'w-full border bg-granat-2/60 px-4 py-3 text-[15px] text-kremowa transition-colors duration-200 placeholder:text-stal/50 focus:border-lod focus:outline-none'

function Pole({ id, etykieta, podpowiedz, blad, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[13px] tracking-[0.04em] text-stal">
        {etykieta}
      </label>
      {children}
      {blad ? (
        <p id={`${id}-blad`} className="text-[13px] text-alarm">
          {blad}
        </p>
      ) : podpowiedz ? (
        <p id={`${id}-opis`} className="text-[13px] text-stal">
          {podpowiedz}
        </p>
      ) : null}
    </div>
  )
}

export function Rezerwacja() {
  const sekcjaRef = useRef(null)
  const formRef = useRef(null)
  useOdslonienie(sekcjaRef)

  const [dane, setDane] = useState(PUSTY)
  const [bledy, setBledy] = useState({})
  const [stan, setStan] = useState('gotowy')

  const zmien = (klucz) => (zdarzenie) => {
    const wartosc = zdarzenie.target.value
    setDane((poprzednie) => ({ ...poprzednie, [klucz]: wartosc }))
    setBledy((poprzednie) => {
      if (!poprzednie[klucz]) return poprzednie
      const kopia = { ...poprzednie }
      delete kopia[klucz]
      return kopia
    })
  }

  const wyslij = async (zdarzenie) => {
    zdarzenie.preventDefault()
    const znalezione = sprawdz(dane)
    setBledy(znalezione)

    if (Object.keys(znalezione).length > 0) {
      setStan('gotowy')
      const pierwsze = formRef.current?.querySelector('[aria-invalid="true"]')
      if (pierwsze) pierwsze.focus()
      return
    }

    setStan('wysylanie')
    try {
      await wyslijZapytanie(dane)
      setStan('wyslane')
    } catch {
      setStan('blad')
    }
  }

  const cechyPola = (klucz, maPodpowiedz = false) => ({
    id: klucz,
    name: klucz,
    value: dane[klucz],
    onChange: zmien(klucz),
    'aria-invalid': bledy[klucz] ? 'true' : undefined,
    'aria-describedby': bledy[klucz]
      ? `${klucz}-blad`
      : maPodpowiedz
        ? `${klucz}-opis`
        : undefined,
    className: `${KLASA_POLA} ${bledy[klucz] ? 'border-alarm' : 'border-white/15'}`,
  })

  return (
    <section id="rezerwacja" ref={sekcjaRef} className="relative">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-14 md:grid-cols-12 md:gap-20">
          <div data-odsloniecie className="md:col-span-5">
            <h2 className="tytul-wyswietlany text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.08] text-kremowa">
              {REZERWACJA.naglowek}
            </h2>
            <p className="mt-6 max-w-[42ch] leading-relaxed text-stal">{REZERWACJA.opis}</p>

            <div className="mt-10 flex flex-col gap-4">
              <a
                href={`tel:${MARKA.telefonLink}`}
                className="inline-flex items-center gap-3 text-kremowa transition-colors duration-200 hover:text-lod"
              >
                <Phone size={18} weight="light" aria-hidden="true" />
                <span className="tytul-wyswietlany text-lg">{MARKA.telefon}</span>
              </a>
              <a
                href={`mailto:${MARKA.email}`}
                className="inline-flex items-center gap-3 text-stal transition-colors duration-200 hover:text-lod"
              >
                <EnvelopeSimple size={18} weight="light" aria-hidden="true" />
                <span className="text-[15px]">{MARKA.email}</span>
              </a>
            </div>
          </div>

          <div data-odsloniecie className="md:col-span-6 md:col-start-7">
            <p aria-live="polite" className="sr-only">
              {stan === 'wysylanie'
                ? 'Wysyłanie zapytania.'
                : stan === 'wyslane'
                  ? 'Zapytanie zostało przyjęte.'
                  : stan === 'blad'
                    ? 'Nie udało się wysłać zapytania.'
                    : ''}
            </p>

            {stan === 'wyslane' ? (
              <div className="border border-lod/40 bg-granat-2/60 p-8">
                <CheckCircle size={28} weight="light" className="text-lod" aria-hidden="true" />
                <h3 className="tytul-wyswietlany mt-5 text-2xl text-kremowa">
                  Mamy Wasze zapytanie
                </h3>
                <p className="mt-4 max-w-[44ch] leading-relaxed text-stal">
                  Odpowiemy dziś do dwudziestej na adres {dane.email}. Jeśli termin okaże się
                  zajęty, zaproponujemy dwa najbliższe wolne.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDane(PUSTY)
                    setStan('gotowy')
                  }}
                  className="mt-7 border border-white/20 px-6 py-3 text-sm text-kremowa transition-colors duration-200 hover:border-lod hover:text-lod active:translate-y-px"
                >
                  Wyślij kolejne zapytanie
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={wyslij} noValidate className="flex flex-col gap-6">
                <Pole id="imie" etykieta="Imię i nazwisko" blad={bledy.imie}>
                  <input type="text" autoComplete="name" {...cechyPola('imie')} />
                </Pole>

                <Pole
                  id="email"
                  etykieta="Adres e-mail"
                  podpowiedz="Na ten adres wyślemy potwierdzenie terminu."
                  blad={bledy.email}
                >
                  <input type="email" autoComplete="email" {...cechyPola('email', true)} />
                </Pole>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Pole id="przyjazd" etykieta="Przyjazd" blad={bledy.przyjazd}>
                    <input type="date" min={dzisiaj()} {...cechyPola('przyjazd')} />
                  </Pole>
                  <Pole id="wyjazd" etykieta="Wyjazd" blad={bledy.wyjazd}>
                    <input type="date" min={dane.przyjazd || dzisiaj()} {...cechyPola('wyjazd')} />
                  </Pole>
                </div>

                <Pole id="osoby" etykieta="Liczba osób">
                  <select {...cechyPola('osoby')}>
                    {['1', '2', '3', '4', '5', '6', 'więcej niż 6'].map((wartosc) => (
                      <option key={wartosc} value={wartosc} className="bg-granat">
                        {wartosc}
                      </option>
                    ))}
                  </select>
                </Pole>

                <Pole
                  id="wiadomosc"
                  etykieta="Wiadomość"
                  podpowiedz="Pole nieobowiązkowe. Napiszcie, jeśli przyjeżdżacie z psem albo chcecie nagrzaną saunę."
                >
                  <textarea rows={4} {...cechyPola('wiadomosc', true)} />
                </Pole>

                {stan === 'blad' ? (
                  <div
                    role="alert"
                    className="flex items-start gap-3 border border-alarm/50 bg-alarm/10 p-4"
                  >
                    <WarningCircle
                      size={20}
                      weight="light"
                      className="mt-0.5 shrink-0 text-alarm"
                      aria-hidden="true"
                    />
                    <p className="text-[14px] leading-relaxed text-kremowa">
                      Zapytanie nie wyszło. Sprawdźcie połączenie i spróbujcie jeszcze raz albo
                      zadzwońcie pod {MARKA.telefon}.
                    </p>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={stan === 'wysylanie'}
                  className="mt-2 self-start bg-lod px-8 py-3.5 text-sm font-medium whitespace-nowrap text-granat transition-colors duration-200 hover:bg-lod/85 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {stan === 'wysylanie' ? 'Wysyłanie' : CTA_GLOWNE}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
