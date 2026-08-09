'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { courses, formatPrice, menuIntro, setMenus, tagLabels, type Course } from '@/data/menu'
import { photos } from '@/data/photos'
import Reveal from './ui/Reveal'

export default function Menu() {
  const [activeId, setActiveId] = useState<string>(courses[0]?.id ?? '')
  const tabsRef = useRef<HTMLDivElement>(null)

  const active: Course = courses.find((course) => course.id === activeId) ?? courses[0]!
  const photo = photos[active.photo]

  // Strzalki w tablist to wymog wzorca ARIA — bez nich karta jest nieobsługiwalna
  // z klawiatury dla kogos, kto nie uzywa Taba do kazdej zakladki.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    event.preventDefault()

    const index = courses.findIndex((course) => course.id === activeId)
    const next = courses[(index + step + courses.length) % courses.length]
    if (!next) return

    setActiveId(next.id)
    tabsRef.current?.querySelector<HTMLButtonElement>(`#tab-${next.id}`)?.focus()
  }

  return (
    <section id="karta" className="bg-paper py-24 md:py-32">
      <div className="shell">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-wine">{menuIntro.eyebrow}</p>
            <h2 className="type-display type-h2 mt-5">{menuIntro.heading}</h2>
            <p className="mt-6 text-lg text-ink-soft">{menuIntro.lead}</p>
          </div>
          <p className="shrink-0 border border-line px-4 py-2 text-xs tracking-[0.14em] text-ink-soft uppercase">
            {menuIntro.seasonNote}
          </p>
        </Reveal>

        {/* Zestawy — nad karta a la carte, bo to one sa powodem rezerwacji. */}
        <div className="mt-14 grid gap-[var(--gutter)] md:grid-cols-2">
          {setMenus.map((set, index) => (
            <Reveal key={set.id} delay={index * 0.08}>
              <article
                className={`flex h-full flex-col justify-between gap-6 p-8 md:p-10 ${
                  set.highlight ? 'bg-wine text-cream' : 'border border-line text-ink'
                }`}
              >
                <div>
                  <h3 className="type-display type-h3">{set.name}</h3>
                  <p
                    className={`mt-1 text-xs tracking-[0.16em] uppercase ${
                      set.highlight ? 'text-cream/60' : 'text-ink-soft'
                    }`}
                  >
                    {set.subtitle}
                  </p>
                  <p
                    className={`mt-5 text-[0.95rem] leading-relaxed ${
                      set.highlight ? 'text-cream/80' : 'text-ink-soft'
                    }`}
                  >
                    {set.description}
                  </p>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="type-display tabular text-4xl">{formatPrice(set.price)}</span>
                  <span
                    className={`text-xs tracking-[0.14em] uppercase ${
                      set.highlight ? 'text-cream/60' : 'text-ink-soft'
                    }`}
                  >
                    {set.unit}
                  </span>
                  {'extra' in set && set.extra ? (
                    <span
                      className={`tabular ml-auto text-right text-xs ${
                        set.highlight ? 'text-cream/70' : 'text-ink-soft'
                      }`}
                    >
                      {set.extra.label}
                      <br />
                      {formatPrice(set.extra.price)}
                    </span>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Karta a la carte */}
        <Reveal className="mt-20">
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Działy karty"
            onKeyDown={onKeyDown}
            className="flex gap-1 overflow-x-auto border-b border-line pb-px"
          >
            {courses.map((course) => {
              const selected = course.id === activeId
              return (
                <button
                  key={course.id}
                  id={`tab-${course.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`panel-${course.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(course.id)}
                  className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-xs tracking-[0.16em] whitespace-nowrap uppercase transition-colors duration-300 ${
                    selected
                      ? 'border-wine text-wine'
                      : 'border-transparent text-ink-soft hover:text-ink'
                  }`}
                >
                  {course.title}
                </button>
              )
            })}
          </div>
        </Reveal>

        <div
          id={`panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          tabIndex={-1}
          className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-[var(--gutter)]"
        >
          <div className="lg:col-span-7">
            <p className="max-w-lg text-sm text-ink-soft italic">{active.note}</p>

            <ul className="mt-8 flex flex-col">
              {active.dishes.map((dish) => (
                <li key={dish.name} className="border-b border-line py-5 first:border-t">
                  <div className="flex items-end gap-3">
                    <h3 className="type-display type-h4 leading-tight">
                      {dish.name}
                      {dish.signature ? (
                        <span className="ml-2 align-middle text-[0.6rem] tracking-[0.18em] text-gold uppercase">
                          nasze
                        </span>
                      ) : null}
                    </h3>
                    <span className="leader" aria-hidden="true" />
                    <span className="type-display tabular shrink-0 text-2xl">
                      {formatPrice(dish.price)}
                    </span>
                  </div>
                  <p className="mt-2 max-w-lg text-[0.95rem] text-ink-soft">{dish.description}</p>
                  {dish.tags?.length ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {dish.tags.map((tag) => (
                        <li
                          key={tag}
                          className="border border-line px-2 py-0.5 text-[0.65rem] tracking-[0.12em] text-ink-soft uppercase"
                        >
                          {tagLabels[tag]}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-4/5 overflow-hidden">
                <Image
                  // key wymusza ponowne zamontowanie <img> przy zmianie zakladki,
                  // dzieki czemu placeholder blur pokazuje sie za kazdym razem.
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  quality={78}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  placeholder="blur"
                  blurDataURL={photo.blurDataURL}
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-xs tracking-[0.12em] text-ink-soft uppercase">
                {active.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
