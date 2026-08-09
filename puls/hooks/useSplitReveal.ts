'use client'

import { useRef } from 'react'
import { EASE, STAGGER, SplitText, gsap, useGSAP } from '@/lib/gsap'

type SplitRevealOptions = {
  type?: 'lines' | 'words'
  start?: string
  duration?: number
  /** Odpal od razu po zamontowaniu zamiast czekac na scroll (hero). */
  immediate?: boolean
  delay?: number
}

/**
 * Maskowany reveal naglowka. Kazdy wiersz dostaje wlasny kontener
 * `overflow: hidden` (opcja `mask` w SplitText 3.13+) i wjezdza od dolu.
 *
 * Nie wolamy `split.revert()` po animacji: `autoSplit` musi zostac aktywny,
 * zeby przelamania wierszy przeliczyly sie po zaladowaniu fontu i przy resize.
 * Dostepnosc, o ktora chodzilo w wymaganiu revertu, zalatwia `aria: 'auto'` —
 * SplitText przepisuje oryginalny tekst na `aria-label` rodzica, a rozbite
 * fragmenty oznacza jako `aria-hidden`.
 */
export function useSplitReveal<T extends HTMLElement = HTMLHeadingElement>(
  options: SplitRevealOptions = {},
) {
  const {
    type = 'lines',
    start = 'top 80%',
    duration = 0.8,
    immediate = false,
    delay = 0,
  } = options

  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(el, {
          type,
          mask: type,
          aria: 'auto',
          autoSplit: true,
          onSplit(self) {
            const parts = type === 'lines' ? self.lines : self.words
            return gsap.from(parts, {
              yPercent: 100,
              duration,
              delay,
              ease: EASE.expressive,
              stagger: type === 'lines' ? STAGGER.lines : STAGGER.words,
              ...(immediate ? {} : { scrollTrigger: { trigger: el, start, once: true } }),
            })
          },
        })

        return () => split.revert()
      })

      return () => mm.revert()
    },
    { scope: ref, dependencies: [type, start, duration, immediate, delay] },
  )

  return ref
}
