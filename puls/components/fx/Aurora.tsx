'use client'

import { useRef } from 'react'
import { EASE, gsap, useGSAP } from '@/lib/gsap'

/**
 * Ambientowa poswiata tla. Trzy rozmyte plamy w nieskonczonej petli.
 * Warstwa jest `fixed` i calkowicie przezroczysta dla wskaznika.
 */
export function Aurora() {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const blobs = gsap.utils.toArray<HTMLElement>('[data-blob]', scope.current)

        blobs.forEach((blob, index) => {
          gsap.to(blob, {
            xPercent: index % 2 === 0 ? 14 : -12,
            yPercent: index === 1 ? 16 : -10,
            scale: index === 2 ? 1.18 : 1.1,
            duration: 18 + index * 4,
            ease: EASE.soft,
            repeat: -1,
            yoyo: true,
            delay: index * 1.5,
          })
        })
      })

      return () => mm.revert()
    },
    { scope },
  )

  return (
    <div
      ref={scope}
      data-aurora
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        data-blob
        className="absolute -top-[22vh] left-1/2 h-[62vh] w-[76vw] -translate-x-1/2 rounded-full opacity-35 blur-[120px]"
        style={{
          background:
            'radial-gradient(closest-side, var(--color-accent), transparent 72%)',
        }}
      />
      <div
        data-blob
        className="absolute top-[8vh] -right-[14vw] h-[52vh] w-[52vw] rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            'radial-gradient(closest-side, var(--color-accent-2), transparent 70%)',
        }}
      />
      <div
        data-blob
        className="absolute top-[52vh] -left-[16vw] h-[46vh] w-[46vw] rounded-full opacity-25 blur-[120px]"
        style={{
          background: 'radial-gradient(closest-side, #7b3ff2, transparent 70%)',
        }}
      />
    </div>
  )
}
