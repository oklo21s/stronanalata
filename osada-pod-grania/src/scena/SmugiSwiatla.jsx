import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { AKTUALNA } from './paleta'
import { stanScrolla } from '../scroll/stanScrolla'

/*
  Smugi światła zza grani. Additive quady w grupie, która obraca się za kamerą,
  więc smugi zawsze wychodzą zza masywu, a bufor głębi wycina te fragmenty,
  które powinny chować się za zboczem.

  Gasną razem ze złotą godziną: przy postępie 1 nie ma po nich śladu.
*/

const VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FRAGMENT = /* glsl */ `
precision highp float;

uniform vec3 uKolor;
uniform float uSila;
uniform float uCzas;
uniform float uFaza;

varying vec2 vUv;

void main() {
  float pion = smoothstep(1.0, 0.05, vUv.y);
  float poziom = smoothstep(0.0, 0.34, vUv.x) * smoothstep(1.0, 0.66, vUv.x);
  float puls = 0.68 + 0.32 * sin(uCzas * 0.32 + uFaza);
  float a = pion * poziom * puls * uSila;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uKolor * a, a);
  #include <colorspace_fragment>
}
`

const SMUGI = [
  { x: -46, y: 44, szer: 15, wys: 110, obrot: 0.16, faza: 0.0, sila: 0.34 },
  { x: -18, y: 50, szer: 11, wys: 124, obrot: 0.07, faza: 1.9, sila: 0.28 },
  { x: 8, y: 52, szer: 18, wys: 132, obrot: -0.05, faza: 3.4, sila: 0.4 },
  { x: 38, y: 46, szer: 13, wys: 116, obrot: -0.14, faza: 5.1, sila: 0.26 },
  { x: 64, y: 40, szer: 9, wys: 98, obrot: -0.22, faza: 6.6, sila: 0.2 },
]

function Smuga({ konfig }) {
  const materialRef = useRef(null)

  const uniformy = useMemo(
    () => ({
      uKolor: { value: AKTUALNA.rim },
      uSila: { value: konfig.sila },
      uCzas: { value: 0 },
      uFaza: { value: konfig.faza },
    }),
    [konfig]
  )

  useFrame((state) => {
    const mat = materialRef.current
    if (!mat) return
    if (!stanScrolla.ograniczonyRuch) {
      mat.uniforms.uCzas.value = state.clock.elapsedTime
    }
    mat.uniforms.uSila.value = konfig.sila * Math.max(0, 1 - stanScrolla.postep * 1.6)
  })

  return (
    <mesh position={[konfig.x, konfig.y, -58]} rotation={[0, 0, konfig.obrot]}>
      <planeGeometry args={[konfig.szer, konfig.wys, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniformy}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export function SmugiSwiatla() {
  const grupaRef = useRef(null)

  useFrame((state) => {
    const grupa = grupaRef.current
    if (!grupa) return
    // Obrót tylko wokół osi Y: smugi trzymają się kamery, ale zostają pionowe.
    grupa.rotation.y = Math.atan2(state.camera.position.x, state.camera.position.z)
  })

  return (
    <group ref={grupaRef}>
      {SMUGI.map((konfig) => (
        <Smuga key={konfig.faza} konfig={konfig} />
      ))}
    </group>
  )
}
