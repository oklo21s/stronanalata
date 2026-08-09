import * as THREE from 'three'

/*
  Dwa krańce narracji. Wszystko pomiędzy powstaje przez `lerpColors`
  w pętli klatki - patrz `mieszaj()` niżej. Wartości hex są zsynchronizowane
  z tokenami Tailwinda w `src/index.css`.
*/
export const CIEPLO = {
  skala: new THREE.Color('#7a5340'),
  szczyt: new THREE.Color('#fff6e8'),
  rim: new THREE.Color('#ffb877'),
  slonce: new THREE.Color('#ffb066'),
  otoczenie: new THREE.Color('#ffd9b0'),
  mgla: new THREE.Color('#f6e8d2'),
  niebo: new THREE.Color('#f9e6cd'),
  chmura: new THREE.Color('#fffaf2'),
  siatka: new THREE.Color('#c9a887'),
  czastka: new THREE.Color('#ffd7a8'),
}

export const CHLOD = {
  skala: new THREE.Color('#141f3b'),
  szczyt: new THREE.Color('#93bfe4'),
  rim: new THREE.Color('#6fd8f2'),
  slonce: new THREE.Color('#7fa6ff'),
  otoczenie: new THREE.Color('#22335c'),
  mgla: new THREE.Color('#0a1128'),
  niebo: new THREE.Color('#070d1f'),
  chmura: new THREE.Color('#7f9ad0'),
  siatka: new THREE.Color('#6fd8f2'),
  czastka: new THREE.Color('#a9e6fb'),
}

/** Bufory robocze - jeden komplet obiektów Color na cały czas życia sceny. */
export const AKTUALNA = Object.fromEntries(
  Object.keys(CIEPLO).map((klucz) => [klucz, new THREE.Color()])
)

/**
 * Interpoluje cały komplet kolorów według postępu narracji.
 * Bez alokacji: `lerpColors` zapisuje wynik do istniejącego obiektu.
 */
export function mieszaj(postep) {
  for (const klucz of Object.keys(CIEPLO)) {
    AKTUALNA[klucz].lerpColors(CIEPLO[klucz], CHLOD[klucz], postep)
  }
  return AKTUALNA
}

/** Wygładzenie postępu: wolniej na krańcach, szybciej w środku przejścia. */
export function wygladz(t) {
  return t * t * (3.0 - 2.0 * t)
}
