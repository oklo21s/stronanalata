'use client'

import { useRef } from 'react'
import { ArrowRight, PlayCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button, buttonClass } from '@/components/ui/Button'
import { MagneticButton } from '@/components/fx/MagneticButton'
import { HeroMockup } from '@/components/sections/HeroMockup'
import { EASE, MQ, SplitText, gsap, useGSAP } from '@/lib/gsap'
import { hero } from '@/lib/content'

export function Hero() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return

      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      // ---- sekwencja page-load (≤ 1,8 s, odpala się raz) ----
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const heading = q('[data-hero-title]')[0]
        if (!heading) return

        const split = SplitText.create(heading, {
          type: 'lines',
          mask: 'lines',
          aria: 'auto',
          autoSplit: true,
          onSplit(self) {
            const tl = gsap.timeline({ defaults: { ease: EASE.enter } })

            tl.fromTo(
              q('[data-hero-badge]'),
              { opacity: 0, y: 12, scale: 0.96 },
              { opacity: 1, y: 0, scale: 1, duration: 0.5 },
              0.15,
            )
              .set(heading, { opacity: 1 }, 0.3)
              .from(
                self.lines,
                { yPercent: 110, duration: 0.9, ease: EASE.expressive, stagger: 0.08 },
                0.3,
              )
              .fromTo(
                q('[data-hero-sub]'),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6 },
                0.7,
              )
              .fromTo(
                q('[data-hero-cta]'),
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 },
                0.85,
              )
              .fromTo(
                q('[data-hero-mockup]'),
                { opacity: 0, y: 60, scale: 0.94, rotateX: 12 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotateX: 0,
                  duration: 1.1,
                  ease: EASE.expressive,
                  clearProps: 'willChange',
                },
                1,
              )
              .fromTo(
                q('[data-hero-glow]'),
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.9 },
                1.25,
              )

            return tl
          },
        })

        return () => split.revert()
      })

      // ---- parallax przy scrollu, tylko desktop ----
      mm.add(`${MQ.desktop} and (prefers-reduced-motion: no-preference)`, () => {
        const scrub = {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        } as const

        const shell = q('[data-mockup-shell]')
        const aurora = document.querySelector('[data-aurora]')

        gsap.to(shell, { y: -80, scale: 1.04, rotateX: -4, scrollTrigger: scrub })
        gsap.to(q('[data-hero-copy]'), { y: 60, opacity: 0.35, scrollTrigger: scrub })
        if (aurora) gsap.to(aurora, { y: 120, scrollTrigger: scrub })
      })

      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      className="relative z-10 pt-32 pb-16 sm:pt-40 sm:pb-24"
      aria-labelledby="hero-title"
    >
      <div className="shell">
        <div data-hero-copy className="flex flex-col items-center gap-6 text-center">
          <div data-load data-hero-badge>
            <Badge href={hero.badge.href}>{hero.badge.label}</Badge>
          </div>

          <h1 id="hero-title" data-load data-hero-title className="text-h1">
            <span className="block">{hero.headline.first}</span>
            <span className="block">
              {hero.headline.secondLead} <span className="grad">{hero.headline.accent}</span>
            </span>
            <span className="block">{hero.headline.third}</span>
          </h1>

          <p
            data-load
            data-hero-sub
            className="max-w-[62ch] text-body text-pretty text-text-muted"
          >
            {hero.sub}
          </p>

          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
            <div data-load data-hero-cta>
              <MagneticButton
                href={hero.primary.href}
                className={`${buttonClass('primary', 'lg')} group`}
              >
                {hero.primary.label}
                <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-[3px]" />
              </MagneticButton>
            </div>
            <div data-load data-hero-cta>
              <Button href={hero.secondary.href} variant="secondary" size="lg">
                <PlayCircle className="size-4" />
                {hero.secondary.label}
              </Button>
            </div>
          </div>

          <ul
            data-load
            data-hero-cta
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          >
            {hero.reassurance.map((item) => (
              <li key={item} className="eyebrow flex items-center gap-2 text-text-dim">
                <span aria-hidden="true" className="size-1 rounded-full bg-text-dim" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* mockup: zewnętrzna warstwa dla parallaxu, wewnętrzna dla page-load */}
        <div
          data-mockup-shell
          className="relative mt-14 sm:mt-20"
          style={{ perspective: '1200px' }}
        >
          <div
            data-load
            data-hero-glow
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[8%] -top-[6%] -bottom-[10%] -z-10 rounded-[50%] blur-[90px]"
            style={{
              background:
                'radial-gradient(closest-side, rgb(110 91 246 / 0.55), rgb(59 169 245 / 0.18) 55%, transparent 78%)',
            }}
          />
          <div data-load data-hero-mockup className="will-change-transform">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
