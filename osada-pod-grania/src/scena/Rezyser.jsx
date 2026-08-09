import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { mieszaj, wygladz, AKTUALNA } from './paleta'
import { stanScrolla } from '../scroll/stanScrolla'

/*
  Jedyne miejsce, w którym postęp narracji jest całkowany, a paleta mieszana.

  Priorytet -10 gwarantuje, że ten callback wykona się przed wszystkimi innymi
  w danej klatce, więc każdy shader dostaje już zaktualizowane kolory. Wartość
  ujemna nie odbiera R3F automatycznego renderowania (to robi dopiero priorytet
  dodatni), więc pętla renderowania zostaje nietknięta.
*/

/*
  Trzy klatki kluczowe zamiast dwóch. Kamera najpierw wchodzi w masyw, gdy
  gaśnie światło, a potem cofa się i unosi - dopiero z tej odległości widać
  siatkę podłogi rozchodzącą się do horyzontu, a góra staje się tłem sekcji
  nocnych, zamiast je zasłaniać.
*/
const KLATKI = [
  { p: 0.0, promien: 134, kat: 0.1, wysokosc: 58, cel: 26 },
  { p: 0.5, promien: 98, kat: 0.44, wysokosc: 47, cel: 24 },
  { p: 1.0, promien: 152, kat: 0.9, wysokosc: 53, cel: 14 },
]

function miedzyKlatkami(postep) {
  let i = 0
  while (i < KLATKI.length - 2 && postep > KLATKI[i + 1].p) i += 1
  const a = KLATKI[i]
  const b = KLATKI[i + 1]
  const t = wygladz(THREE.MathUtils.clamp((postep - a.p) / (b.p - a.p), 0, 1))
  return {
    promien: THREE.MathUtils.lerp(a.promien, b.promien, t),
    kat: THREE.MathUtils.lerp(a.kat, b.kat, t),
    wysokosc: THREE.MathUtils.lerp(a.wysokosc, b.wysokosc, t),
    cel: THREE.MathUtils.lerp(a.cel, b.cel, t),
  }
}

export function Rezyser() {
  const { scene, camera } = useThree()

  const tlo = useMemo(() => {
    const kolor = new THREE.Color()
    scene.background = kolor
    return kolor
  }, [scene])

  const cel = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30)

    if (stanScrolla.ograniczonyRuch) {
      stanScrolla.postep = stanScrolla.docelowy
    } else {
      stanScrolla.postep = THREE.MathUtils.damp(
        stanScrolla.postep,
        stanScrolla.docelowy,
        4.5,
        dt
      )
    }

    const p = stanScrolla.postep

    mieszaj(p)
    tlo.copy(AKTUALNA.niebo)

    const k = miedzyKlatkami(p)

    // Oddech kamery: bardzo powolny, żeby kadr nie zastygał, ale też nie kołysał.
    const oddech = stanScrolla.ograniczonyRuch
      ? 0
      : Math.sin(state.clock.elapsedTime * 0.19) * 0.9

    camera.position.set(
      Math.sin(k.kat) * k.promien,
      k.wysokosc + oddech,
      Math.cos(k.kat) * k.promien
    )
    cel.set(0, k.cel, 0)
    camera.lookAt(cel)
  }, -10)

  return null
}
