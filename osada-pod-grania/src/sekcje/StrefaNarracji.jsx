import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { invalidate } from '@react-three/fiber'
import { ustawCel, ustawNatychmiast } from '../scroll/stanScrolla'
import { useOgraniczonyRuch } from '../hooks/useOgraniczonyRuch'
import { Hero } from './Hero'
import { Przejscie } from './Przejscie'

gsap.registerPlugin(ScrollTrigger)

/*
  Strefa narracji: trzy ekrany wysokości, w środku przyklejona ramka na jedną
  wysokość okna. Scroll przez tę strefę steruje jednocześnie kamerą, paletą,
  opadaniem chmur i wynurzaniem siatki - wszystko przez jedną wartość postępu.

  Przyklejenie robi `position: sticky`, a nie `pin` ScrollTriggera. Sticky nie
  przepisuje układu dokumentu, więc nie ma skoków przy przeliczaniu wysokości.
  ScrollTrigger odpowiada wyłącznie za wartości: postęp sceny i krzyżowe
  przenikanie dwóch kadrów tekstowych.
*/
export function StrefaNarracji() {
  const strefaRef = useRef(null)
  const heroRef = useRef(null)
  const przejscieRef = useRef(null)
  const ograniczonyRuch = useOgraniczonyRuch()

  useLayoutEffect(() => {
    if (ograniczonyRuch) return undefined
    const strefa = strefaRef.current
    const hero = heroRef.current
    const przejscie = przejscieRef.current
    if (!strefa || !hero || !przejscie) return undefined

    const ctx = gsap.context(() => {
      const os = gsap.timeline({
        scrollTrigger: {
          trigger: strefa,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => ustawCel(self.progress),
        },
      })

      // Kadr pierwszy ustępuje, zanim scena zdąży wejść w noc.
      os.to(hero, { opacity: 0, y: -44, ease: 'none', duration: 0.3 }, 0.06)
      // Kadr drugi wchodzi dopiero, gdy tło jest już ciemne.
      os.fromTo(
        przejscie,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, ease: 'none', duration: 0.22 },
        0.44
      )
      os.to(przejscie, { opacity: 0, y: -20, ease: 'none', duration: 0.18 }, 0.82)
    }, strefa)

    const przelicz = () => ScrollTrigger.refresh()
    window.addEventListener('load', przelicz)

    return () => {
      window.removeEventListener('load', przelicz)
      ctx.revert()
    }
  }, [ograniczonyRuch])

  // Wariant dla ograniczonego ruchu: żadnego przewijania sterowanego animacją.
  // Pora dnia przeskakuje raz, w momencie opuszczenia kadru przez hero.
  useEffect(() => {
    if (!ograniczonyRuch) return undefined
    const hero = heroRef.current
    if (!hero || typeof IntersectionObserver === 'undefined') {
      ustawNatychmiast(0)
      return undefined
    }

    // Kanwa pracuje wtedy w trybie `demand`. Jedno `invalidate` wystarcza,
    // gdy nic innego nie zmienia rozmiaru bufora - ale zmienia go choćby
    // obniżenie dpr przez PerformanceMonitor. Trzy klatki pod rząd domykają
    // ten wyścig i nadal są niczym wobec ciągłej pętli renderowania.
    let uchwyt = 0
    const odswiez = (ile) => {
      invalidate()
      if (ile > 0) uchwyt = requestAnimationFrame(() => odswiez(ile - 1))
    }

    const obserwator = new IntersectionObserver(
      ([wpis]) => {
        ustawNatychmiast(wpis.isIntersecting ? 0 : 1)
        odswiez(2)
      },
      { threshold: 0.4 }
    )
    obserwator.observe(hero)
    return () => {
      obserwator.disconnect()
      cancelAnimationFrame(uchwyt)
    }
  }, [ograniczonyRuch])

  if (ograniczonyRuch) {
    return (
      <section id="gora" ref={strefaRef} className="relative">
        <Hero ref={heroRef} wStrefie={false} />
        {/*
          Ramp do wartości zasłony sekcji nocnych (88%). Wariant zwykły dostaje
          ten sam ramp z `App`, po strefie przewijania; tutaj musi być na miejscu,
          bo tam strefy przewijania nie ma i bez niego zasłona zaczynałaby się
          twardą krawędzią w połowie ekranu.
        */}
        <div className="bg-gradient-to-b from-transparent via-granat/60 to-granat/[0.88]">
          <Przejscie ref={przejscieRef} wStrefie={false} />
        </div>
      </section>
    )
  }

  return (
    <section id="gora" ref={strefaRef} className="relative h-[320vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <Hero ref={heroRef} />
        <Przejscie ref={przejscieRef} />
      </div>
    </section>
  )
}
