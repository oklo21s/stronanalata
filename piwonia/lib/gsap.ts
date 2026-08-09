/**
 * Centralna rejestracja GSAP-a. Importujemy TYLKO stad — nigdzie indziej
 * nie wolno wywolywac gsap.registerPlugin, zeby plugin nie zarejestrowal sie
 * dwa razy ani nie trafil do bundla serwerowego.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

  // Domyslny easing projektu — odpowiednik --ease-out-expo z globals.css.
  gsap.defaults({ ease: 'expo.out' })

  // ScrollTrigger ignoruje resize wywolany paskiem adresu na mobile.
  ScrollTrigger.config({ ignoreMobileResize: true })
}

/**
 * will-change wlaczamy dopiero na starcie animacji i zdejmujemy po niej —
 * trzymanie go na stale zjada pamiec GPU i potrafi rozmyc tekst.
 */
export function willChange(targets: Element | Element[] | null, value: string | null): void {
  if (!targets) return
  const list = Array.isArray(targets) ? targets : [targets]
  for (const el of list) {
    if (el instanceof HTMLElement) el.style.willChange = value ?? ''
  }
}

let refreshTimer: number | undefined

/**
 * Zbiorczy ScrollTrigger.refresh() z debouncem.
 *
 * Sekcje, ktore buduja triggery dopiero po `document.fonts.ready`, powstaja
 * pozniej niz te budowane synchronicznie — a wtedy wczesniejszy trigger ma
 * zapamietany `start` sprzed zmiany wysokosci dokumentu. Kazdy asynchroniczny
 * builder wola to po zakonczeniu; debounce skleja wszystkie wywolania w jedno.
 */
export function scheduleRefresh(): void {
  if (typeof window === 'undefined') return
  window.clearTimeout(refreshTimer)
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 60)
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
