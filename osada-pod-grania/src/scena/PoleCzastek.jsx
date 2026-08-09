import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { AKTUALNA } from './paleta'
import { stanScrolla } from '../scroll/stanScrolla'

/*
  Pole świecących punktów. Gęstnieje w miarę wchodzenia w noc: przy postępie 0
  widać kilka drobin w smugach światła, przy 1 - pełne rozgwieżdżone tło.

  Dryf liczony jest w vertex shaderze (`mod` po czasie), więc bufor pozycji
  nie jest przepisywany co klatkę. Liczba punktów zależy od profilu urządzenia.
*/

const VERTEX = /* glsl */ `
attribute float aSkala;
attribute float aProg;
attribute float aPredkosc;

uniform float uCzas;
uniform float uPostep;
uniform float uRozmiar;
uniform float uZakres;

varying float vKrycie;

void main() {
  vec3 poz = position;
  poz.y = mod(poz.y + uCzas * aPredkosc, uZakres);

  // Każda drobina ma własny próg pojawienia się - pole gęstnieje stopniowo,
  // a nie całe naraz.
  vKrycie = smoothstep(aProg, aProg + 0.28, uPostep) * 0.35 + uPostep * 0.65;

  vec4 mv = modelViewMatrix * vec4(poz, 1.0);
  gl_PointSize = uRozmiar * aSkala * (260.0 / max(-mv.z, 1.0));
  gl_Position = projectionMatrix * mv;
}
`

const FRAGMENT = /* glsl */ `
precision highp float;

uniform vec3 uKolor;

varying float vKrycie;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d) * vKrycie;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uKolor * a, a);
  #include <colorspace_fragment>
}
`

const ZAKRES_Y = 120

export function PoleCzastek({ liczba = 1200 }) {
  const materialRef = useRef(null)

  const geometria = useMemo(() => {
    const pozycje = new Float32Array(liczba * 3)
    const skale = new Float32Array(liczba)
    const progi = new Float32Array(liczba)
    const predkosci = new Float32Array(liczba)

    for (let i = 0; i < liczba; i += 1) {
      // Pierścień wokół masywu, żeby drobiny nie tłoczyły się w jednym miejscu.
      const kat = Math.random() * Math.PI * 2
      const promien = 34 + Math.pow(Math.random(), 0.6) * 190
      pozycje[i * 3] = Math.cos(kat) * promien
      pozycje[i * 3 + 1] = Math.random() * ZAKRES_Y
      pozycje[i * 3 + 2] = Math.sin(kat) * promien

      skale[i] = 0.45 + Math.random() * 1.15
      progi[i] = Math.random() * 0.72
      predkosci[i] = 0.25 + Math.random() * 0.85
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pozycje, 3))
    g.setAttribute('aSkala', new THREE.BufferAttribute(skale, 1))
    g.setAttribute('aProg', new THREE.BufferAttribute(progi, 1))
    g.setAttribute('aPredkosc', new THREE.BufferAttribute(predkosci, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, ZAKRES_Y / 2, 0), 320)
    return g
  }, [liczba])

  useEffect(() => () => geometria.dispose(), [geometria])

  const uniformy = useMemo(
    () => ({
      uCzas: { value: 0 },
      uPostep: { value: 0 },
      uRozmiar: { value: 2.4 },
      uZakres: { value: ZAKRES_Y },
      uKolor: { value: AKTUALNA.czastka },
    }),
    []
  )

  useFrame((state) => {
    const mat = materialRef.current
    if (!mat) return
    if (!stanScrolla.ograniczonyRuch) {
      mat.uniforms.uCzas.value = state.clock.elapsedTime
    }
    mat.uniforms.uPostep.value = stanScrolla.postep
  })

  return (
    <points geometry={geometria} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniformy}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
