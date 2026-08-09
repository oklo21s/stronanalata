import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { AKTUALNA } from './paleta'
import { stanScrolla } from '../scroll/stanScrolla'

/*
  Nieskończona podłoga: jedna duża płaszczyzna z siatką rysowaną w shaderze.
  Grubość linii liczona z `fwidth`, więc siatka nie migocze w oddali, a krycie
  gaśnie do horyzontu. W węzłach świecą punkty.

  Podłoga leży pod poziomem masywu i przy postępie 0 jest niewidoczna -
  wynurza się dokładnie wtedy, gdy chmury opadają.
*/

const VERTEX = /* glsl */ `
varying vec2 vUv;
varying vec3 vSwiat;
void main() {
  vUv = uv;
  vec4 swiat = modelMatrix * vec4(position, 1.0);
  vSwiat = swiat.xyz;
  gl_Position = projectionMatrix * viewMatrix * swiat;
}
`

const FRAGMENT = /* glsl */ `
precision highp float;

uniform float uCzas;
uniform float uKrycie;
uniform float uPodzialka;
uniform vec3 uKolorLinii;
uniform vec3 uKolorWezla;

varying vec2 vUv;
varying vec3 vSwiat;

void main() {
  vec2 siatkaUv = vUv * uPodzialka + vec2(0.0, uCzas * 0.06);
  vec2 f = abs(fract(siatkaUv) - 0.5);
  vec2 szerokosc = fwidth(siatkaUv);

  vec2 linie = 1.0 - smoothstep(vec2(0.0), szerokosc * 1.4, f);
  float siatka = max(linie.x, linie.y);

  float wezel = 1.0 - smoothstep(0.0, max(szerokosc.x, szerokosc.y) * 4.5, length(f));

  // Zanik do horyzontu liczony w przestrzeni świata, nie w UV: dzięki temu
  // krawędź płaszczyzny nigdy nie jest widoczna jako prosta linia.
  float dystans = length(vSwiat.xz) / 460.0;
  float zanik = smoothstep(1.0, 0.06, dystans);

  // Przy samym horyzoncie jeden rząd pikseli zbiera setki linii naraz i robi
  // się z tego ostra krecha przez cały ekran. Wygaszenie po kącie patrzenia
  // usuwa ją u źródła, zamiast maskować gradientem w warstwie DOM.
  vec3 doKamery = normalize(cameraPosition - vSwiat);
  float pochylenie = smoothstep(0.015, 0.13, abs(doKamery.y));

  float a = (siatka * 0.26 + wezel * 0.85) * zanik * pochylenie * uKrycie;
  if (a < 0.004) discard;

  vec3 kolor = mix(uKolorLinii, uKolorWezla, wezel);
  gl_FragColor = vec4(kolor, a);
  #include <colorspace_fragment>
}
`

export function PodlogaSiatki() {
  const materialRef = useRef(null)

  const geometria = useMemo(() => {
    const g = new THREE.PlaneGeometry(920, 920, 1, 1)
    g.rotateX(-Math.PI / 2)
    return g
  }, [])

  const uniformy = useMemo(
    () => ({
      uCzas: { value: 0 },
      uKrycie: { value: 0 },
      uPodzialka: { value: 70 },
      uKolorLinii: { value: AKTUALNA.siatka },
      uKolorWezla: { value: AKTUALNA.czastka },
    }),
    []
  )

  useFrame((state) => {
    const mat = materialRef.current
    if (!mat) return
    if (!stanScrolla.ograniczonyRuch) {
      mat.uniforms.uCzas.value = state.clock.elapsedTime
    }
    // Wynurzenie w drugiej połowie przejścia, razem z opadaniem chmur.
    const p = stanScrolla.postep
    mat.uniforms.uKrycie.value = Math.max(0, (p - 0.34) / 0.66) * 0.92
  })

  return (
    <mesh geometry={geometria} position={[0, -6.5, 0]} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniformy}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
