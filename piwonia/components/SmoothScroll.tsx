'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { setLenis } from '@/lib/lenis-store'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function SmoothScroll(): null {
  const reducedMotion = useReducedMotion()

  // --- Lenis <-> ScrollTrigger ------------------------------------------------
  useEffect(() => {
    // Przy prefers-reduced-motion Lenis nie startuje w ogole: zostaje natywny
    // scroll przegladarki, bez bezwladnosci.
    if (reducedMotion) {
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    setLenis(lenis)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [reducedMotion])

  // --- Odswiezenie pomiarow po zaladowaniu obrazow i fontow -------------------
  useEffect(() => {
    let cancelled = false

    const settle = async () => {
      const images = Array.from(document.images)
      await Promise.all(images.map((img) => img.decode().catch(() => undefined)))
      // Fonty zmieniaja wysokosc naglowkow, wiec czekamy takze na nie.
      await document.fonts.ready.catch(() => undefined)
      if (!cancelled) ScrollTrigger.refresh()
    }

    void settle()

    return () => {
      cancelled = true
    }
  }, [])

  // --- Resize z debouncem 200 ms ---------------------------------------------
  useEffect(() => {
    let timer: number | undefined

    const onResize = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  return null
}
