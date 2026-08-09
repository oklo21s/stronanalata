'use client'

import { useRef } from 'react'
import { Marquee } from '@/components/ui/Marquee'
import { gsap, useGSAP } from '@/lib/gsap'
import { logoCloud } from '@/lib/content'

export function LogoCloud() {
  const scope = useRef<HTMLElement>(null)

  // t = 1,40 s sekwencji page-load: wjazd do docelowych 45% krycia.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          scope.current,
          { opacity: 0 },
          { opacity: 0.45, duration: 0.6, delay: 1.4, ease: 'power3.out' },
        )
      })
      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      data-load
      aria-label="Klienci korzystający z Pulsa"
      className="relative z-10 pb-8 opacity-45"
    >
      <div className="shell flex flex-col gap-6">
        <p className="eyebrow text-center">{logoCloud.eyebrow}</p>

        <Marquee duration={34}>
          {logoCloud.logos.map((logo) => (
            <span
              key={logo}
              className="px-7 font-display text-[1.05rem] font-semibold tracking-[-0.03em] whitespace-nowrap text-text-muted transition-colors duration-200 hover:text-text sm:px-10 sm:text-[1.25rem]"
            >
              {logo}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
