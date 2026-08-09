import { useEffect, useState } from 'react'
import { stanScrolla } from '../scroll/stanScrolla'

const ZAPYTANIE = '(prefers-reduced-motion: reduce)'

function odczyt() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(ZAPYTANIE).matches
}

/**
 * Zwraca true, gdy użytkownik prosi o ograniczony ruch. Wynik jest też
 * zapisywany w `stanScrolla`, bo czytają go moduły spoza drzewa React
 * (pętla renderowania sceny).
 */
export function useOgraniczonyRuch() {
  const [ograniczony, setOgraniczony] = useState(odczyt)

  useEffect(() => {
    if (!window.matchMedia) return undefined
    const mq = window.matchMedia(ZAPYTANIE)
    const naZmiane = (e) => setOgraniczony(e.matches)
    mq.addEventListener('change', naZmiane)
    return () => mq.removeEventListener('change', naZmiane)
  }, [])

  useEffect(() => {
    stanScrolla.ograniczonyRuch = ograniczony
  }, [ograniczony])

  return ograniczony
}
