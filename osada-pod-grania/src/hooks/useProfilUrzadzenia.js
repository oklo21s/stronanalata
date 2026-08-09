import { useEffect, useState } from 'react'

const MOBILNY = '(max-width: 767px)'

function odczyt() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return { mobilny: false, rdzenie: 8 }
  }
  return {
    mobilny: window.matchMedia(MOBILNY).matches,
    rdzenie: navigator.hardwareConcurrency || 4,
  }
}

/**
 * Profil urządzenia dla decyzji wydajnościowych sceny: liczba cząstek,
 * wygładzanie krawędzi, bloom. Czytany raz przy montowaniu i przy zmianie
 * szerokości, nie co klatkę.
 */
export function useProfilUrzadzenia() {
  const [profil, setProfil] = useState(odczyt)

  useEffect(() => {
    if (!window.matchMedia) return undefined
    const mq = window.matchMedia(MOBILNY)
    const naZmiane = () => setProfil(odczyt())
    mq.addEventListener('change', naZmiane)
    return () => mq.removeEventListener('change', naZmiane)
  }, [])

  const slabe = profil.mobilny || profil.rdzenie <= 4

  return {
    mobilny: profil.mobilny,
    liczbaCzastek: profil.mobilny ? 380 : slabe ? 700 : 1200,
    wygladzanie: !profil.mobilny,
    bloom: !slabe,
  }
}
