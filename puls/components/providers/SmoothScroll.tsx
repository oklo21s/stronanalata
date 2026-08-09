'use client'

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger, gsap } from '@/lib/gsap'

type LenisApi = { stop: () => void; start: () => void }

const LenisContext = createContext<LenisApi | null>(null)

/** Pozwala zablokowac scroll (menu mobilne) bez sięgania po globalne hacki. */
export function useLenisControls(): LenisApi {
  const api = useContext(LenisContext)
  return (
    api ?? {
      stop: () => document.body.classList.add('overflow-hidden'),
      start: () => document.body.classList.remove('overflow-hidden'),
    }
  )
}

/**
 * Lenis + spiecie tickera z GSAP. Swiadomie bez ScrollSmoothera —
 * dwa smooth-scrolle naraz walcza o ten sam scroll i szarpia piny.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Po zaladowaniu fontow i obrazow zmieniaja sie wysokosci blokow —
    // piny musza sie przeliczyc, inaczej koncza sie w zlym miejscu.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) {
      return () => window.removeEventListener('load', refresh)
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Kotwice musza isc przez Lenisa — natywny skok rozjezdza sie
    // z pozycja, ktora zna ScrollTrigger.
    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      const hash = link?.getAttribute('href')
      if (!link || !hash || hash === '#') return
      const target = document.querySelector(hash)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -72 })
    }

    document.addEventListener('click', onAnchorClick)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const api: LenisApi = {
    stop: () => {
      lenisRef.current?.stop()
      document.body.classList.add('overflow-hidden')
    },
    start: () => {
      lenisRef.current?.start()
      document.body.classList.remove('overflow-hidden')
    },
  }

  return <LenisContext.Provider value={api}>{children}</LenisContext.Provider>
}
