'use client'

import { useRef, type ReactNode } from 'react'
import { MQ, gsap, useGSAP } from '@/lib/gsap'

type SpotlightCardProps = {
  children: ReactNode
  className?: string
  /** Maksymalne wychylenie w stopniach. 0 wylacza tilt. */
  tilt?: number
}

/**
 * Karta ze swiatlem podazajacym za kursorem i lekkim tiltem.
 * Oba efekty tylko na urzadzeniach z hoverem — dotyk dostaje zwykla karte.
 */
export function SpotlightCard({ children, className = '', tilt = 5 }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const mm = gsap.matchMedia()

      mm.add(`${MQ.hover} and (prefers-reduced-motion: no-preference)`, () => {
        const rotX = gsap.quickTo(el, 'rotateX', { duration: 0.5, ease: 'power3.out' })
        const rotY = gsap.quickTo(el, 'rotateY', { duration: 0.5, ease: 'power3.out' })

        const onMove = (event: PointerEvent) => {
          const box = el.getBoundingClientRect()
          const px = event.clientX - box.left
          const py = event.clientY - box.top

          el.style.setProperty('--mx', `${px}px`)
          el.style.setProperty('--my', `${py}px`)

          if (tilt > 0) {
            rotX(gsap.utils.mapRange(0, box.height, tilt, -tilt, py))
            rotY(gsap.utils.mapRange(0, box.width, -tilt, tilt, px))
          }
        }

        const onEnter = () => gsap.to(el, { '--spot': 1, duration: 0.3, ease: 'power2.out' })
        const onLeave = () => {
          gsap.to(el, { '--spot': 0, duration: 0.5, ease: 'power2.out' })
          if (tilt > 0) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' })
        }

        el.addEventListener('pointermove', onMove, { passive: true })
        el.addEventListener('pointerenter', onEnter)
        el.addEventListener('pointerleave', onLeave)

        return () => {
          el.removeEventListener('pointermove', onMove)
          el.removeEventListener('pointerenter', onEnter)
          el.removeEventListener('pointerleave', onLeave)
        }
      })

      return () => mm.revert()
    },
    { dependencies: [tilt] },
  )

  return (
    <div
      ref={ref}
      className={`group/spot relative isolate overflow-hidden rounded-lg border border-line bg-surface transition-colors duration-200 hover:border-line-strong ${className}`}
      style={
        {
          transformStyle: 'preserve-3d',
          '--mx': '50%',
          '--my': '50%',
          '--spot': 0,
        } as React.CSSProperties
      }
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          opacity: 'var(--spot)',
          background:
            'radial-gradient(400px circle at var(--mx) var(--my), rgb(255 255 255 / 0.06), transparent 60%)',
        }}
      />
      {children}
    </div>
  )
}
