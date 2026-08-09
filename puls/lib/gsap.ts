import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
  // Bez tego pasek adresu na iOS przelicza wysokosc viewportu i rozwala piny.
  ScrollTrigger.config({ ignoreMobileResize: true })
}

/** Jedyna dozwolona paleta easingow. Nic spoza tej tabeli. */
export const EASE = {
  enter: 'power3.out',
  exit: 'power2.in',
  smooth: 'power2.inOut',
  expressive: 'expo.out',
  soft: 'sine.inOut',
} as const

/** Czasy trwania w sekundach. */
export const DUR = {
  micro: 0.12,
  fast: 0.24,
  base: 0.6,
  slow: 0.9,
} as const

export const STAGGER = {
  group: 0.06,
  words: 0.025,
  lines: 0.07,
} as const

export const MQ = {
  desktop: '(min-width: 1024px)',
  belowDesktop: '(max-width: 1023px)',
  reduced: '(prefers-reduced-motion: reduce)',
  hover: '(hover: hover) and (pointer: fine)',
} as const

export { gsap, ScrollTrigger, SplitText, useGSAP }
