'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

type MarqueeProps = {
  children: ReactNode
  /** Pelny przebieg w sekundach. */
  duration?: number
  className?: string
}

/**
 * Nieskonczony marquee na zduplikowanej liscie. Hover zwalnia przez timeScale,
 * nie przez pause() — twarde zatrzymanie wyglada na zaciecie.
 */
export function Marquee({ children, duration = 28, className = '' }: MarqueeProps) {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = scope.current
      const track = root?.querySelector<HTMLElement>('[data-track]')
      if (!root || !track) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const loop = gsap.to(track, {
          xPercent: -50,
          duration,
          ease: 'none',
          repeat: -1,
        })

        const slow = () => gsap.to(loop, { timeScale: 0.25, duration: 0.4, overwrite: true })
        const resume = () => gsap.to(loop, { timeScale: 1, duration: 0.4, overwrite: true })

        root.addEventListener('pointerenter', slow)
        root.addEventListener('pointerleave', resume)
        root.addEventListener('focusin', slow)
        root.addEventListener('focusout', resume)

        return () => {
          root.removeEventListener('pointerenter', slow)
          root.removeEventListener('pointerleave', resume)
          root.removeEventListener('focusin', slow)
          root.removeEventListener('focusout', resume)
          loop.kill()
        }
      })

      return () => mm.revert()
    },
    { scope, dependencies: [duration] },
  )

  return (
    <div ref={scope} className={`mask-fade-x relative overflow-hidden ${className}`}>
      <div data-track className="flex w-max will-change-transform">
        {children}
        <span aria-hidden="true" className="contents">
          {children}
        </span>
      </div>
    </div>
  )
}
