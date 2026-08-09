'use client'

import { useRef } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/fx/SpotlightCard'
import { BentoVisual } from '@/components/sections/BentoVisual'
import { DUR, EASE, gsap, useGSAP } from '@/lib/gsap'
import { bento } from '@/lib/content'
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll'

const SPAN: Record<string, string> = {
  wide: 'lg:col-span-7',
  half: 'lg:col-span-5',
  third: 'lg:col-span-4',
}

export function BentoFeatures() {
  const headingScope = useRevealOnScroll<HTMLDivElement>()
  const gridScope = useRef<HTMLUListElement>(null)

  useGSAP(
    () => {
      const grid = gridScope.current
      if (!grid) return
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]', grid)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: DUR.base,
            ease: EASE.enter,
            stagger: { each: 0.07, from: 'start', grid: 'auto' },
            scrollTrigger: { trigger: grid, start: 'top 82%', once: true },
          },
        )
      })

      return () => mm.revert()
    },
    { scope: gridScope },
  )

  return (
    <section id="funkcje" className="section relative z-10">
      <div className="shell flex flex-col gap-12 sm:gap-16">
        <div ref={headingScope}>
          <SectionHeading eyebrow={bento.eyebrow} title={bento.title} lead={bento.lead} />
        </div>

        <ul ref={gridScope} className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {bento.cards.map((card) => (
            <li key={card.id} data-card className={SPAN[card.span]}>
              <SpotlightCard className="flex h-full flex-col gap-5 p-6 sm:p-7">
                <div className="flex flex-col gap-2">
                  <p className="eyebrow">{card.eyebrow}</p>
                  <h3 className="text-h3 text-balance">{card.title}</h3>
                  <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-text-muted">
                    {card.body}
                  </p>
                </div>
                <div className="mt-auto pt-2">
                  <BentoVisual kind={card.visual} />
                </div>
              </SpotlightCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
