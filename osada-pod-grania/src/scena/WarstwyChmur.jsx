import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { SZUM_GLSL } from './szum'
import { AKTUALNA } from './paleta'
import { stanScrolla } from '../scroll/stanScrolla'

/*
  Morze chmur pod szczytem: cztery przezroczyste płaszczyzny na różnych
  wysokościach, każda z własną fazą fBM i własnym dryfem. Przy postępie
  narracji warstwy opadają i gasną, odsłaniając siatkę podłogi pod spodem.
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

uniform float uCzas;
uniform float uFaza;
uniform float uDryf;
uniform float uKrycie;
uniform float uGestosc;
uniform vec3 uKolor;

varying vec2 vUv;

${SZUM_GLSL}

void main() {
  vec2 p = vUv * 5.2 + vec2(uCzas * uDryf, uCzas * uDryf * 0.42) + uFaza;
  float n = fbm5(p) * 0.5 + 0.5;
  n = smoothstep(0.42, 0.92, n * uGestosc);

  // Wygaszenie brzegów, żeby płaszczyzna nie kończyła się widoczną krawędzią.
  float krawedz =
      smoothstep(0.0, 0.26, vUv.x) * smoothstep(1.0, 0.74, vUv.x) *
      smoothstep(0.0, 0.26, vUv.y) * smoothstep(1.0, 0.74, vUv.y);

  float a = n * krawedz * uKrycie;
  if (a < 0.004) discard;

  gl_FragColor = vec4(uKolor, a);
  #include <colorspace_fragment>
}
`

const WARSTWY = [
  { y: 12.0, rozmiar: 300, dryf: 0.010, faza: 0.0, krycie: 0.85, gestosc: 1.15 },
  { y: 17.5, rozmiar: 340, dryf: 0.014, faza: 11.3, krycie: 0.7, gestosc: 1.0 },
  { y: 23.0, rozmiar: 380, dryf: 0.008, faza: 27.9, krycie: 0.55, gestosc: 0.9 },
  { y: 29.5, rozmiar: 420, dryf: 0.017, faza: 41.2, krycie: 0.36, gestosc: 0.78 },
]

function Warstwa({ konfig }) {
  const meshRef = useRef(null)
  const materialRef = useRef(null)

  const geometria = useMemo(() => {
    const g = new THREE.PlaneGeometry(konfig.rozmiar, konfig.rozmiar, 1, 1)
    g.rotateX(-Math.PI / 2)
    return g
  }, [konfig.rozmiar])

  const uniformy = useMemo(
    () => ({
      uCzas: { value: 0 },
      uFaza: { value: konfig.faza },
      uDryf: { value: konfig.dryf },
      uKrycie: { value: konfig.krycie },
      uGestosc: { value: konfig.gestosc },
      uKolor: { value: AKTUALNA.chmura },
    }),
    [konfig]
  )

  useFrame((state) => {
    const mat = materialRef.current
    const mesh = meshRef.current
    if (!mat || !mesh) return

    if (!stanScrolla.ograniczonyRuch) {
      mat.uniforms.uCzas.value = state.clock.elapsedTime
    }

    const p = stanScrolla.postep
    // Opadanie i rozpraszanie: im dalej w noc, tym niżej i rzadziej.
    mesh.position.y = konfig.y - p * (konfig.y + 6.5)
    mat.uniforms.uKrycie.value = konfig.krycie * (1.0 - p * 0.94)
    mat.uniforms.uGestosc.value = konfig.gestosc * (1.0 - p * 0.35)
  })

  return (
    <mesh ref={meshRef} geometry={geometria} position={[0, konfig.y, 0]} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniformy}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export function WarstwyChmur() {
  return (
    <group>
      {WARSTWY.map((konfig) => (
        <Warstwa key={konfig.faza} konfig={konfig} />
      ))}
    </group>
  )
}
