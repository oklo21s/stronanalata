'use client'

import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { willChange } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Props = {
  children: ReactNode
  /** Element opakowujacy — domyslnie <div>, w listach warto podac 'li'. */
  as?: ElementType
  className?: string
  /** Opoznienie w sekundach; do kaskad w siatkach. */
  delay?: number
  /** Dystans w px, o ktory tresc dojezdza z dolu. */
  y?: number
}

/**
 * Podstawowe odslanianie przy scrollu: przesuniecie w gore + rozjasnienie.
 * Startowy stan ustawia `gsap.set` w useGSAP, a nie CSS — dzieki temu bez JS
 * tresc jest po prostu widoczna (patrz <noscript> w layoucie).
 */
export default function Reveal({ children, as, className, delay = 0, y = 28 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const Tag = (as ?? 'div') as ElementType

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      if (reducedMotion) {
        gsap.set(el, { autoAlpha: 1, y: 0 })
        return
      }

      gsap.set(el, { autoAlpha: 0, y })
      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        delay,
        onStart: () => willChange(el, 'transform, opacity'),
        onComplete: () => willChange(el, null),
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    },
    { dependencies: [reducedMotion, delay, y], scope: ref },
  )

  return (
    <Tag ref={ref} className={className} data-js-hidden="">
      {children}
    </Tag>
  )
}
