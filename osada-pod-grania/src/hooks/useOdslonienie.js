import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useOgraniczonyRuch } from './useOgraniczonyRuch'

gsap.registerPlugin(ScrollTrigger)

/**
 * Odsłania elementy oznaczone `data-odsloniecie` wewnątrz sekcji, gdy sekcja
 * wchodzi w kadr. Ruch niesie hierarchię: kolejność pojawiania się mówi, co
 * czytać najpierw. Przy `prefers-reduced-motion` wszystko jest od razu widoczne.
 */
export function useOdslonienie(ref, { przesuniecie = 26, odstep = 0.08 } = {}) {
  const ograniczonyRuch = useOgraniczonyRuch()

  useLayoutEffect(() => {
    const korzen = ref.current
    if (!korzen) return undefined

    const cele = korzen.querySelectorAll('[data-odsloniecie]')
    if (!cele.length) return undefined

    if (ograniczonyRuch) {
      gsap.set(cele, { opacity: 1, y: 0, clearProps: 'transform' })
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.from(cele, {
        opacity: 0,
        y: przesuniecie,
        duration: 0.75,
        ease: 'power2.out',
        stagger: odstep,
        scrollTrigger: { trigger: korzen, start: 'top 80%', once: true },
      })
    }, korzen)

    return () => ctx.revert()
  }, [ref, ograniczonyRuch, przesuniecie, odstep])
}
