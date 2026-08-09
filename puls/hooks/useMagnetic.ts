'use client'

import { useRef } from 'react'
import { MQ, gsap, useGSAP } from '@/lib/gsap'

type MagneticOptions = {
  /** Maksymalne przesuniecie w px. */
  strength?: number
  /** Promien, w ktorym element reaguje na kursor. */
  radius?: number
}

/** CTA przyciaga sie do kursora. Tylko na urzadzeniach z prawdziwym hoverem. */
export function useMagnetic<T extends HTMLElement = HTMLAnchorElement>({
  strength = 8,
  radius = 80,
}: MagneticOptions = {}) {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const mm = gsap.matchMedia()

      mm.add(`${MQ.hover} and (prefers-reduced-motion: no-preference)`, () => {
        const move = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
        const moveY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })

        const onMove = (event: PointerEvent) => {
          const box = el.getBoundingClientRect()
          const dx = event.clientX - (box.left + box.width / 2)
          const dy = event.clientY - (box.top + box.height / 2)
          const distance = Math.hypot(dx, dy)
          const pull = Math.max(0, 1 - distance / (radius + box.width / 2))

          move(gsap.utils.clamp(-strength, strength, dx * pull * 0.6))
          moveY(gsap.utils.clamp(-strength, strength, dy * pull * 0.6))
        }

        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
        }

        window.addEventListener('pointermove', onMove, { passive: true })
        el.addEventListener('pointerleave', onLeave)

        return () => {
          window.removeEventListener('pointermove', onMove)
          el.removeEventListener('pointerleave', onLeave)
        }
      })

      return () => mm.revert()
    },
    { dependencies: [strength, radius] },
  )

  return ref
}
