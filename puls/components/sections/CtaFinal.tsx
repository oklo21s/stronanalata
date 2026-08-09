'use client'

import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { MagneticButton } from '@/components/fx/MagneticButton'
import { buttonClass } from '@/components/ui/Button'
import { DUR, EASE, SplitText, STAGGER, gsap, useGSAP } from '@/lib/gsap'
import { ctaFinal } from '@/lib/content'

export function CtaFinal() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return

      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const heading = q('[data-cta-title]')[0]

        const split = heading
          ? SplitText.create(heading, {
              type: 'words',
              mask: 'words',
              aria: 'auto',
              autoSplit: true,
              onSplit(self) {
                return gsap.from(self.words, {
                  yPercent: 110,
                  duration: DUR.slow,
                  ease: EASE.expressive,
                  stagger: STAGGER.words,
                  scrollTrigger: { trigger: root, start: 'top 72%', once: true },
                })
              },
            })
          : null

        gsap.fromTo(
          q('[data-reveal]'),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.enter,
            stagger: STAGGER.group,
            scrollTrigger: { trigger: root, start: 'top 72%', once: true },
          },
        )

        // Tło jedzie wolniej niż treść — parallax 0,3.
        gsap.fromTo(
          q('[data-cta-bg]'),
          { yPercent: -12, scale: 1, opacity: 0.3 },
          {
            yPercent: 12,
            scale: 1.35,
            opacity: 0.6,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          },
        )

        return () => split?.revert()
      })

      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      id="rejestracja"
      aria-labelledby="cta-title"
      className="relative z-10 overflow-hidden border-y border-line py-[clamp(96px,18vh,200px)]"
    >
      <div
        data-cta-bg
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[70vh] w-[120vw] -translate-x-1/2 -translate-y-1/2 blur-[110px]"
        style={{
          background:
            'radial-gradient(closest-side, rgb(110 91 246 / 0.7), rgb(59 169 245 / 0.28) 55%, transparent 78%)',
        }}
      />

      <div className="shell flex flex-col items-center gap-7 text-center">
        <p className="eyebrow" data-reveal>
          {ctaFinal.eyebrow}
        </p>

        <h2
          id="cta-title"
          data-cta-title
          className="max-w-[20ch] text-[clamp(2.1rem,4.6vw,4rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance"
        >
          {ctaFinal.title}
        </h2>

        <p className="max-w-[54ch] text-body text-text-muted" data-reveal>
          {ctaFinal.sub}
        </p>

        <div data-reveal className="mt-2">
          <MagneticButton
            href={ctaFinal.cta.href}
            className={`${buttonClass('primary', 'lg')} group`}
            strength={10}
          >
            {ctaFinal.cta.label}
            <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-[3px]" />
          </MagneticButton>
        </div>

        <p className="eyebrow text-text-dim" data-reveal>
          {ctaFinal.note}
        </p>
      </div>
    </section>
  )
}
