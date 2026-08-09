'use client'

import { useRef } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MQ, ScrollTrigger, gsap, useGSAP } from '@/lib/gsap'
import { testimonials } from '@/lib/content'
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll'

export function Testimonials() {
  const headingScope = useRevealOnScroll<HTMLDivElement>()
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = scope.current
      const track = section?.querySelector<HTMLElement>('[data-track]')
      if (!section || !track) return

      const mm = gsap.matchMedia()

      mm.add(`${MQ.desktop} and (prefers-reduced-motion: no-preference)`, () => {
        const distance = () => Math.max(track.scrollWidth - window.innerWidth + 96, 1)

        const trigger = ScrollTrigger.create({
          trigger: section,
          pin: true,
          scrub: 1,
          // Dystans przewijania równy dystansowi panoramy: ruch 1:1, bez wleczenia.
          end: () => '+=' + distance(),
          animation: gsap.to(track, { x: () => -distance(), ease: 'none' }),
          invalidateOnRefresh: true,
          anticipatePin: 1,
        })

        return () => trigger.kill()
      })

      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      aria-labelledby="opinie-title"
      className="section relative z-10 overflow-hidden"
    >
      <div className="shell" ref={headingScope}>
        <SectionHeading
          eyebrow={testimonials.eyebrow}
          title={testimonials.title}
          titleId="opinie-title"
          className="mb-12"
        />
      </div>

      <div
        data-track
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--shell-pad)] pb-4 lg:overflow-visible lg:px-0 lg:pb-0"
        style={{ paddingInlineStart: 'max(var(--shell-pad), calc((100vw - 1200px) / 2))' }}
      >
        {testimonials.items.map((item) => (
          <figure
            key={item.name}
            className="flex w-[min(84vw,340px)] shrink-0 snap-start flex-col gap-6 rounded-lg border border-line bg-surface p-6 backdrop-blur-md sm:w-[380px] sm:p-7"
          >
            <blockquote className="text-[1.0625rem] leading-relaxed text-pretty text-text">
              „{item.quote}”
            </blockquote>
            <figcaption className="mt-auto flex items-center gap-3 border-t border-line pt-5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent/40 to-accent-2/40 font-mono text-[0.6875rem] text-text">
                {item.initials}
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-[0.875rem] font-medium text-text">{item.name}</span>
                <span className="truncate text-[0.8125rem] text-text-muted">
                  {item.role}, {item.company}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
        <span aria-hidden="true" className="w-[var(--shell-pad)] shrink-0 lg:w-24" />
      </div>
    </section>
  )
}
