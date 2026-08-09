import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useWKadrze } from '../hooks/useWKadrze'
import { useOgraniczonyRuch } from '../hooks/useOgraniczonyRuch'
import { useProfilUrzadzenia } from '../hooks/useProfilUrzadzenia'

/*
  Małe obiekty przy blokach oferty. Każdy dostaje własną, bardzo lekką kanwę:
  jedna geometria o niskiej poligonizacji, zero świateł, zero cieni, materiał
  liczony w całości fresnelem. Kanwa renderuje tylko wtedy, gdy blok jest
  w kadrze - poza kadrem `frameloop` jest wyłączony.
*/

const VERTEX = /* glsl */ `
varying vec3 vNormalna;
varying vec3 vWidok;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormalna = normalize(normalMatrix * normal);
  vWidok = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`

const FRAGMENT = /* glsl */ `
precision highp float;

uniform vec3 uBaza;
uniform vec3 uAkcent;
uniform float uSila;

varying vec3 vNormalna;
varying vec3 vWidok;

void main() {
  vec3 n = normalize(vNormalna);
  float fresnel = pow(1.0 - clamp(dot(n, normalize(vWidok)), 0.0, 1.0), 2.3);
  float lambert = clamp(dot(n, normalize(vec3(0.35, 0.82, 0.55))), 0.0, 1.0);
  vec3 kolor = uBaza * (0.20 + 0.52 * lambert) + uAkcent * fresnel * uSila;
  gl_FragColor = vec4(kolor, 1.0);
  #include <colorspace_fragment>
}
`

function MaterialFresnela({ sila = 1.15 }) {
  const uniformy = useMemo(
    () => ({
      uBaza: { value: new THREE.Color('#1b2c52') },
      uAkcent: { value: new THREE.Color('#6fd8f2') },
      uSila: { value: sila },
    }),
    [sila]
  )
  return <shaderMaterial vertexShader={VERTEX} fragmentShader={FRAGMENT} uniforms={uniformy} />
}

/** Balia i sauna: walec z obręczą, wyraźnie fasetowany. */
function Balia() {
  return (
    <group>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[1.05, 0.88, 0.9, 11, 1]} />
        <MaterialFresnela />
      </mesh>
      <mesh position={[0, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.06, 0.055, 6, 22]} />
        <MaterialFresnela sila={1.9} />
      </mesh>
      <mesh position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.0, 22]} />
        <MaterialFresnela sila={1.6} />
      </mesh>
    </group>
  )
}

/** Grzbiet: trzy stożki o pięciu ścianach, ustawione w szereg jak grań. */
function Grzbiet() {
  // Skala poniżej jedynki: przy obrocie najbliższy stożek podchodzi pod kamerę
  // i bez niej wychodziłby poza kadr kanwy.
  return (
    <group position={[0, -0.3, 0]} scale={0.82}>
      <mesh position={[-0.85, 0.12, 0.2]}>
        <coneGeometry args={[0.58, 1.15, 5, 1]} />
        <MaterialFresnela />
      </mesh>
      <mesh position={[0.08, 0.42, -0.1]}>
        <coneGeometry args={[0.82, 1.85, 5, 1]} />
        <MaterialFresnela />
      </mesh>
      <mesh position={[0.98, 0.02, 0.28]}>
        <coneGeometry args={[0.5, 0.95, 5, 1]} />
        <MaterialFresnela />
      </mesh>
    </group>
  )
}

/** Niebo: kopuła jako siatka krawędzi z jasnym punktem w środku. */
function Niebo() {
  const krawedzie = useMemo(() => {
    const bryla = new THREE.IcosahedronGeometry(1.25, 1)
    const wynik = new THREE.WireframeGeometry(bryla)
    bryla.dispose()
    return wynik
  }, [])

  return (
    <group>
      <lineSegments geometry={krawedzie}>
        <lineBasicMaterial color="#4b9fc4" transparent opacity={0.75} />
      </lineSegments>
      <mesh>
        <icosahedronGeometry args={[0.26, 0]} />
        <MaterialFresnela sila={3.2} />
      </mesh>
    </group>
  )
}

const KSZTALTY = { balia: Balia, grzbiet: Grzbiet, niebo: Niebo }

function Unoszacy({ ksztalt, ograniczonyRuch }) {
  const grupaRef = useRef(null)
  const Ksztalt = KSZTALTY[ksztalt] ?? Balia

  useFrame((state) => {
    const g = grupaRef.current
    if (!g || ograniczonyRuch) return
    const t = state.clock.elapsedTime
    g.rotation.y = t * 0.24
    g.position.y = Math.sin(t * 0.75) * 0.09
  })

  return (
    <group ref={grupaRef} rotation={[0.18, 0.5, 0]}>
      <Ksztalt />
    </group>
  )
}

export function ObiektOferty({ ksztalt, etykieta }) {
  const [ref, wKadrze] = useWKadrze({ margines: '200px' })
  const ograniczonyRuch = useOgraniczonyRuch()
  const profil = useProfilUrzadzenia()

  const frameloop = ograniczonyRuch ? 'demand' : wKadrze ? 'always' : 'never'

  return (
    <div
      ref={ref}
      className="relative aspect-square w-full max-w-[22rem] justify-self-center md:max-w-none"
      role="img"
      aria-label={etykieta}
    >
      <Canvas
        dpr={[1, profil.mobilny ? 1 : 1.5]}
        frameloop={frameloop}
        gl={{ antialias: !profil.mobilny, alpha: true, stencil: false, depth: true }}
        camera={{ fov: 34, near: 0.1, far: 20, position: [0, 0.4, 5.6] }}
      >
        <Unoszacy ksztalt={ksztalt} ograniczonyRuch={ograniczonyRuch} />
      </Canvas>
    </div>
  )
}
