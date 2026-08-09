'use client'

import { useEffect, useId, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { hours, reservation, site } from '@/data/content'
import Reveal from './ui/Reveal'
import Ornament from './ui/Ornament'

type Values = {
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: string
  notes: string
  consent: boolean
}

type Errors = Partial<Record<keyof Values, string>>

const EMPTY: Values = {
  name: '',
  phone: '',
  email: '',
  date: '',
  time: '',
  guests: '',
  notes: '',
  consent: false,
}

/** Minimum, ktore ma sens sprawdzic po stronie klienta. Reszte i tak weryfikuje
 *  telefon od restauracji — formularz jest prosba, nie potwierdzeniem. */
function validate(values: Values): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 3) errors.name = 'Podaj imię i nazwisko.'
  // Telefony PL zapisuje sie roznie (spacje, +48, myslniki) — liczymy same cyfry.
  if (values.phone.replace(/\D/g, '').length < 9) errors.phone = 'Podaj numer telefonu.'
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'Sprawdź adres e-mail.'
  }
  if (!values.date) errors.date = 'Wybierz datę.'
  if (!values.time) errors.time = 'Wybierz godzinę.'
  if (!values.guests) errors.guests = 'Podaj liczbę osób.'
  if (!values.consent) errors.consent = 'Bez zgody nie możemy zapisać rezerwacji.'
  return errors
}

export default function Reservation() {
  const id = useId()
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const [minDate, setMinDate] = useState<string>('')

  // Dzisiejsza data liczona po zamontowaniu — w buildzie SSG bylaby data builda,
  // a to rozjechaloby hydracje przy pierwszym renderze u gościa.
  useEffect(() => {
    const today = new Date()
    const local = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
    setMinDate(local.toISOString().slice(0, 10))
  }, [])

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0]
      document.getElementById(`${id}-${first}`)?.focus()
      return
    }
    // Wersja demonstracyjna: brak backendu, patrz README.
    setSent(true)
  }

  const fieldError = (key: keyof Values) =>
    errors[key] ? (
      <p id={`${id}-${key}-error`} className="mt-2 text-xs text-wine">
        {errors[key]}
      </p>
    ) : null

  const aria = (key: keyof Values) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${id}-${key}-error` : undefined,
  })

  return (
    <section id="rezerwacja" className="bg-cream py-24 md:py-32">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-[var(--gutter)]">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow text-wine">{reservation.eyebrow}</p>
            <h2 className="type-display type-h2 mt-5">{reservation.heading}</h2>
            <p className="mt-6 max-w-xl text-lg text-ink-soft">{reservation.lead}</p>
          </Reveal>

          {sent ? (
            <div
              role="status"
              className="mt-12 flex flex-col items-start gap-5 border border-line p-8 md:p-10"
            >
              <span className="flex h-11 w-11 items-center justify-center bg-wine text-cream">
                <Check className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="type-display type-h3">{reservation.successTitle}</h3>
                <p className="mt-3 max-w-md text-ink-soft">{reservation.successBody}</p>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setValues(EMPTY)
                  setSent(false)
                }}
              >
                {reservation.again}
              </button>
            </div>
          ) : (
            <Reveal className="mt-12">
              <form noValidate onSubmit={onSubmit} className="flex flex-col gap-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor={`${id}-name`}>
                      {reservation.fields.name}
                    </label>
                    <input
                      id={`${id}-name`}
                      name="name"
                      type="text"
                      autoComplete="name"
                      className="field"
                      value={values.name}
                      onChange={(event) => set('name', event.target.value)}
                      {...aria('name')}
                    />
                    {fieldError('name')}
                  </div>

                  <div>
                    <label className="field-label" htmlFor={`${id}-phone`}>
                      {reservation.fields.phone}
                    </label>
                    <input
                      id={`${id}-phone`}
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      className="field"
                      value={values.phone}
                      onChange={(event) => set('phone', event.target.value)}
                      {...aria('phone')}
                    />
                    {fieldError('phone')}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="field-label" htmlFor={`${id}-email`}>
                      {reservation.fields.email}
                    </label>
                    <input
                      id={`${id}-email`}
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="field"
                      value={values.email}
                      onChange={(event) => set('email', event.target.value)}
                      {...aria('email')}
                    />
                    {fieldError('email')}
                  </div>

                  <div>
                    <label className="field-label" htmlFor={`${id}-date`}>
                      {reservation.fields.date}
                    </label>
                    <input
                      id={`${id}-date`}
                      name="date"
                      type="date"
                      min={minDate || undefined}
                      className="field tabular"
                      value={values.date}
                      onChange={(event) => set('date', event.target.value)}
                      {...aria('date')}
                    />
                    {fieldError('date')}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="field-label" htmlFor={`${id}-time`}>
                        {reservation.fields.time}
                      </label>
                      {/* Strzalka jest pozycjonowana wzgledem samego pola, nie calej
                          kolumny — inaczej komunikat bledu spychalby ja w dol. */}
                      <div className="relative">
                        <select
                          id={`${id}-time`}
                          name="time"
                          className="field tabular pr-6"
                          value={values.time}
                          onChange={(event) => set('time', event.target.value)}
                          {...aria('time')}
                        >
                          <option value="">—</option>
                          {reservation.timeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute right-0 bottom-3 h-4 w-4 opacity-50"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </div>
                      {fieldError('time')}
                    </div>

                    <div>
                      <label className="field-label" htmlFor={`${id}-guests`}>
                        {reservation.fields.guests}
                      </label>
                      <div className="relative">
                        <select
                          id={`${id}-guests`}
                          name="guests"
                          className="field pr-6"
                          value={values.guests}
                          onChange={(event) => set('guests', event.target.value)}
                          {...aria('guests')}
                        >
                          <option value="">—</option>
                          {reservation.guestOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute right-0 bottom-3 h-4 w-4 opacity-50"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </div>
                      {fieldError('guests')}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="field-label" htmlFor={`${id}-notes`}>
                      {reservation.fields.notes}
                    </label>
                    <textarea
                      id={`${id}-notes`}
                      name="notes"
                      rows={3}
                      className="field resize-none"
                      placeholder={reservation.fields.notesPlaceholder}
                      value={values.notes}
                      onChange={(event) => set('notes', event.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm">
                    <input
                      id={`${id}-consent`}
                      name="consent"
                      type="checkbox"
                      className="mt-1 h-4 w-4 shrink-0 accent-wine"
                      checked={values.consent}
                      onChange={(event) => set('consent', event.target.checked)}
                      {...aria('consent')}
                    />
                    <span className="text-ink-soft">{reservation.consent}</span>
                  </label>
                  {fieldError('consent')}
                </div>

                <div className="flex flex-wrap items-center gap-5">
                  <button type="submit" className="btn btn-solid">
                    {reservation.submit}
                  </button>
                  <p className="text-xs text-ink-soft">{reservation.demoNote}</p>
                </div>
              </form>
            </Reveal>
          )}
        </div>

        <Reveal className="lg:col-span-4 lg:col-start-9" y={40}>
          <div className="flex flex-col gap-8 bg-wine-deep p-8 text-cream md:p-10">
            <Ornament className="h-10 w-10 text-gold" />

            <div>
              <h3 className="eyebrow text-cream/60">Godziny</h3>
              <dl className="mt-4 flex flex-col gap-2 text-sm">
                {hours.map((row) => (
                  <div key={row.days} className="flex items-baseline justify-between gap-4">
                    <dt className="text-cream/80">{row.days}</dt>
                    <dd className={`tabular ${row.closed ? 'text-cream/40' : ''}`}>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rule-dark" />

            <div>
              <h3 className="eyebrow text-cream/60">Telefon</h3>
              <a
                href={`tel:${site.phoneHref}`}
                className="type-display link-underline mt-3 inline-block text-2xl"
              >
                {site.phone}
              </a>
            </div>

            <div className="rule-dark" />

            <ul className="flex flex-col gap-3 text-sm">
              {reservation.rules.map((rule) => (
                <li key={rule} className="flex gap-3 text-cream/70">
                  <span className="mt-2 h-px w-3 shrink-0 bg-gold" aria-hidden="true" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
