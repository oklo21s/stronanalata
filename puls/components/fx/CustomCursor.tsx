'use client'

import { useEffect, useRef, useState } from 'react'
import { MQ, gsap } from '@/lib/gsap'

/**
 * Kropka 8 px + pierscien 32 px z opoznieniem. Montuje sie dopiero po
 * sprawdzeniu, ze urzadzenie ma prawdziwy hover — na dotyku nie istnieje.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const query = window.matchMedia(`${MQ.hover} and (prefers-reduced-motion: no-preference)`)
    const sync = () => setEnabled(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { ...pointer }

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 })

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      gsap.set(dot, { x: pointer.x, y: pointer.y })
      gsap.to([dot, ring], { opacity: 1, duration: 0.2, overwrite: 'auto' })
    }

    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest(
        'a, button, [data-cursor="grow"]',
      )
      gsap.to(ring, {
        scale: target ? 1.7 : 1,
        borderColor: target ? 'rgb(110 91 246 / 0.9)' : 'rgb(255 255 255 / 0.35)',
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 })

    const tick = () => {
      ringPos.x += (pointer.x - ringPos.x) * 0.15
      ringPos.y += (pointer.y - ringPos.y) * 0.15
      gsap.set(ring, { x: ringPos.x, y: ringPos.y })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerleave', onLeave)
      gsap.ticker.remove(tick)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div ref={ringRef} className="absolute size-8 rounded-full border border-white/35" />
      <div ref={dotRef} className="absolute size-2 rounded-full bg-white" />
    </div>
  )
}
