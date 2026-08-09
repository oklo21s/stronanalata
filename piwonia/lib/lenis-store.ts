/**
 * Dostep do instancji Lenisa spoza drzewa Reacta — potrzebny nawigacji,
 * ktora musi zatrzymac scroll na czas otwartego menu mobilnego
 * i przewinac do kotwicy bez natywnego `scrollIntoView`.
 */
import type Lenis from 'lenis'

let instance: Lenis | null = null

export function setLenis(next: Lenis | null): void {
  instance = next
}

export function getLenis(): Lenis | null {
  return instance
}

/** Przewija do elementu; bez Lenisa (reduced motion) spada na natywny scroll. */
export function scrollToTarget(target: string): void {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(target, { offset: -72, duration: 1.4 })
    return
  }
  document.querySelector(target)?.scrollIntoView({ block: 'start' })
}
