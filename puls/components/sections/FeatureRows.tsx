'use client'

import { useRef } from 'react'
import { Check } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { FeatureVisual } from '@/components/sections/FeatureVisual'
import { DUR, EASE, STAGGER, gsap, useGSAP } from '@/lib/gsap'
import { featureRows } from '@/lib/content'
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll'

export function FeatureRows() {
  const headingScope = useRevealOnScroll<HTMLDivElement>()
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return

      const rows = gsap.utils.toArray<HTMLElement>('[data-row]', root)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        rows.forEach((row) => {
          const before = row.querySelector('[data-layer="before"]')
          const after = row.querySelector('[data-layer="after"]')

          gsap.fromTo(
            row.querySelectorAll('[data-reveal]'),
            { opacity: 0, y: 28, filter: 'blur(6px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: DUR.base,
              ease: EASE.enter,
              stagger: STAGGER.group,
              clearProps: 'filter',
              scrollTrigger: { trigger: row, start: 'top 78%', once: true },
            },
          )

          if (!before || !after) return

          // Przejście robi wycieranie, nie crossfade: dwie półprzezroczyste
          // sceny naraz dawały zlepek dwóch nagłówków w jednym miejscu.
          gsap.fromTo(
            after,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              ease: 'none',
              scrollTrigger: {
                trigger: row,
                start: 'top 58%',
                end: 'bottom 78%',
                scrub: 0.8,
              },
            },
          )
        })
      })

      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section id="jak-dziala" className="section relative z-10">
      <div className="shell flex flex-col gap-16 sm:gap-24">
        <div ref={headingScope}>
          <SectionHeading
            eyebrow={featureRows.eyebrow}
            title={featureRows.title}
            lead={featureRows.lead}
          />
        </div>

        <div ref={scope} className="flex flex-col gap-20 lg:gap-0">
          {featureRows.rows.map((row, index) => (
            <div
              key={row.id}
              data-row
              className="grid items-center gap-8 lg:min-h-[78vh] lg:grid-cols-2 lg:gap-16"
            >
              <div
                className={`flex flex-col gap-5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}
              >
                <p className="eyebrow" data-reveal>
                  {row.eyebrow}
                </p>
                <h3 className="max-w-[18ch] text-h2 text-balance" data-reveal>
                  {row.title}
                </h3>
                <p className="max-w-[52ch] text-body text-text-muted" data-reveal>
                  {row.body}
                </p>
                <ul className="flex flex-col gap-2.5 pt-1">
                  {row.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      data-reveal
                      className="flex items-start gap-2.5 text-[0.9375rem] text-text-muted"
                    >
                      <Check
                        aria-hidden="true"
                        className="mt-1 size-4 shrink-0 text-accent-2"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`lg:sticky lg:top-[20vh] ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                data-reveal
              >
                <div className="relative aspect-4/3 w-full">
                  <div data-layer="before" className="absolute inset-0">
                    <FeatureVisual kind={row.visual} state="before" />
                  </div>
                  {/* Bez JS i przy wyłączonym ruchu widoczny zostaje stan
                      docelowy — czyli ten, o którym mówi nagłówek. */}
                  <div data-layer="after" className="absolute inset-0">
                    <FeatureVisual kind={row.visual} state="after" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
