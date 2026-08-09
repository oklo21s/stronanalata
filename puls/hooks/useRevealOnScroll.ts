'use client'

import { useRef } from 'react'
import { DUR, EASE, MQ, STAGGER, gsap, useGSAP } from '@/lib/gsap'

type RevealOptions = {
  /** Selektor elementow wewnatrz scope'u. */
  selector?: string
  y?: number
  /** Rozmycie na wejsciu. Wylacz przy grupach > 15 elementow. */
  blur?: boolean
  stagger?: number
  start?: string
}

/**
 * Uniwersalny reveal przy scrollu — jeden wzorzec dla wszystkich blokow tresci.
 * Zwraca ref do podpiecia pod sekcje; animuje elementy z `data-reveal` w srodku.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {},
) {
  const {
    selector = '[data-reveal]',
    y = 28,
    blur = true,
    stagger = STAGGER.group,
    start = 'top 78%',
  } = options

  const scope = useRef<T>(null)

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return

      const targets = gsap.utils.toArray<HTMLElement>(selector, root)
      if (targets.length === 0) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          targets,
          { opacity: 0, y, ...(blur ? { filter: 'blur(6px)' } : null) },
          {
            opacity: 1,
            y: 0,
            ...(blur ? { filter: 'blur(0px)' } : null),
            duration: DUR.base,
            ease: EASE.enter,
            stagger,
            clearProps: 'filter,willChange',
            scrollTrigger: { trigger: root, start, once: true },
          },
        )
      })

      return () => mm.revert()
    },
    { scope, dependencies: [selector, y, blur, stagger, start] },
  )

  return scope
}

export { MQ }
