'use client'

import { useRef } from 'react'
import { gsap, SplitText, useGSAP, scheduleRefresh, willChange } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Props = {
  children: string
  className?: string
}

/**
 * Akapit odslaniany slowo po slowie, scrubowany scrollem.
 * Tekst zostaje w DOM jako zwykly <p>, wiec bez JS czyta sie normalnie.
 */
export default function TextReveal({ children, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      if (reducedMotion) {
        gsap.set(el, { autoAlpha: 1 })
        return
      }

      let split: SplitText | undefined
      const ctx = gsap.context(() => {}, el)

      void document.fonts.ready.then(() => {
        if (!ref.current) return

        ctx.add(() => {
          split = SplitText.create(el, { type: 'words', wordsClass: 'split-word' })
          willChange(split.words, 'opacity')

          gsap.fromTo(
            split.words,
            { opacity: 0.16 },
            {
              opacity: 1,
              ease: 'none',
              stagger: 0.4,
              scrollTrigger: {
                trigger: el,
                start: 'top 78%',
                end: 'bottom 55%',
                scrub: 0.6,
                onLeave: () => willChange(split?.words ?? null, null),
              },
            },
          )
        })

        // Podzial na slowa zmienia wysokosc akapitu — triggery ponizej
        // musza przeliczyc swoje pozycje.
        scheduleRefresh()
      })

      return () => {
        split?.revert()
        ctx.revert()
      }
    },
    { dependencies: [reducedMotion], scope: ref },
  )

  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  )
}
