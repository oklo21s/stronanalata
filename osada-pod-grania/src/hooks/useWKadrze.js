import { useEffect, useRef, useState } from 'react'

/**
 * IntersectionObserver zamiast nasłuchu scrolla. Używane do wstrzymywania
 * pętli renderowania małych scen 3D, które są poza kadrem.
 */
export function useWKadrze({ margines = '160px', prog = 0 } = {}) {
  const ref = useRef(null)
  const [wKadrze, setWKadrze] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (typeof IntersectionObserver === 'undefined') {
      setWKadrze(true)
      return undefined
    }

    const obserwator = new IntersectionObserver(
      ([wpis]) => setWKadrze(wpis.isIntersecting),
      { rootMargin: margines, threshold: prog }
    )
    obserwator.observe(el)
    return () => obserwator.disconnect()
  }, [margines, prog])

  return [ref, wKadrze]
}
