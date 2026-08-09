/*
  Jedno źródło prawdy o postępie narracji scrollowej.

  Celowo jest to zwykły obiekt modułowy, a nie stan Reacta: wartość zmienia się
  co klatkę scrolla, a `useState` przerysowywałby całe drzewo React kilkadziesiąt
  razy na sekundę. GSAP ScrollTrigger zapisuje tu `docelowy`, pętla `useFrame`
  w scenie 3D czyta `postep` i dogania cel tłumieniem.

  0 = złota godzina (szczyt hero), 1 = noc (wejście w ciemną część strony).
*/
export const stanScrolla = {
  postep: 0,
  docelowy: 0,
  ograniczonyRuch: false,
}

export function ustawCel(wartosc) {
  stanScrolla.docelowy = Math.min(1, Math.max(0, wartosc))
}

/** Skok bez tłumienia - używane przy `prefers-reduced-motion`. */
export function ustawNatychmiast(wartosc) {
  const v = Math.min(1, Math.max(0, wartosc))
  stanScrolla.docelowy = v
  stanScrolla.postep = v
}
