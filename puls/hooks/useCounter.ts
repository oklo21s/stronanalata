'use client'

import { useRef } from 'react'
import { EASE, gsap, useGSAP } from '@/lib/gsap'

type CounterOptions = {
  value: number
  decimals?: number
  suffix?: string
  duration?: number
}

/** Licznik odpalany raz, przy wejsciu w widok. Formatowanie przez Intl. */
export function useCounter({ value, decimals = 0, suffix = '', duration = 1.8 }: CounterOptions) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const format = new Intl.NumberFormat('pl-PL', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        // Bez tego pl-PL nie grupuje liczb czterocyfrowych: „1240" zamiast „1 240".
        useGrouping: 'always',
      })

      const write = (n: number) => {
        el.textContent = `${format.format(n)}${suffix}`
      }

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        write(value)
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const state = { v: 0 }
        write(0)

        const tween = gsap.to(state, {
          v: value,
          duration,
          ease: EASE.smooth,
          onUpdate: () => write(state.v),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })

        return () => tween.kill()
      })

      return () => mm.revert()
    },
    { dependencies: [value, decimals, suffix, duration] },
  )

  return ref
}
