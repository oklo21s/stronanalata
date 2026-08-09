import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { SZUM_GLSL } from './szum'
import { AKTUALNA } from './paleta'
import { stanScrolla } from '../scroll/stanScrolla'

/*
  Masyw górski: jedna płaszczyzna 128 x 128 segmentów, wypiętrzona w vertex
  shaderze przez fBM. Nie ma tu geometrii z pliku ani heightmapy z tekstury -
  cały kształt liczy karta graficzna, więc do pobrania nie ma nic.

  Kolory materiału są mieszane na CPU (`paleta.mieszaj`) i wstrzykiwane tu
  jako uniformy, dzięki czemu światła, mgła i fresnel biegną po dokładnie
  tej samej krzywej co reszta sceny.
*/

const WSPOLNE = /* glsl */ `
uniform float uSkala;

float profil(vec2 p) {
  float d1 = length((p - vec2(0.0, 6.0)) * vec2(1.0, 1.22));
  float g1 = exp(-pow(d1 / 52.0, 1.75));
  float d2 = length((p - vec2(72.0, 34.0)) * vec2(1.05, 1.0));
  float g2 = exp(-pow(d2 / 42.0, 1.85)) * 0.58;
  float d3 = length((p + vec2(78.0, -26.0)) * vec2(1.0, 1.12));
  float g3 = exp(-pow(d3 / 38.0, 1.90)) * 0.44;
  return g1 + g2 + g3;
}

float wysokosc(vec2 p) {
  float baza = profil(p);
  // Dwie skale grzbietu. Przy jednej zagięcia szumu "ridged" biegną przez cały
  // masyw jako proste ściany widoczne jako pionowa krecha w kadrze; druga,
  // gęstsza skala je łamie i daje czytelne żebra zamiast jednej płaszczyzny.
  float grzbietDuzy = 1.0 - abs(fbm4(p * 0.011));
  float grzbietMaly = 1.0 - abs(fbm4(p * 0.032 + 17.0));
  float grzbiet = grzbietDuzy * 0.60 + grzbietMaly * 0.40;
  float detal = fbm5(p * 0.05) * 0.5 + 0.5;
  float h = baza * (0.58 + 0.50 * grzbiet) * uSkala;
  h += detal * 3.4 * (0.30 + baza * 1.6);
  float maska = smoothstep(1.0, 0.50, length(p) / 128.0);
  return h * maska - (1.0 - maska) * 7.0;
}
`

const VERTEX = /* glsl */ `
varying vec3 vSwiat;
varying vec3 vNormalna;
varying float vWysokosc;

${SZUM_GLSL}
${WSPOLNE}

void main() {
  vec2 p = position.xz;
  float h = wysokosc(p);

  float e = 0.9;
  float hx = wysokosc(p + vec2(e, 0.0));
  float hz = wysokosc(p + vec2(0.0, e));
  vNormalna = normalize(vec3(h - hx, e, h - hz));

  vec3 poz = vec3(position.x, h, position.z);
  vSwiat = poz;
  vWysokosc = h;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(poz, 1.0);
}
`

const FRAGMENT = /* glsl */ `
precision highp float;

uniform vec3 uSkalaKolor;
uniform vec3 uSzczyt;
uniform vec3 uRim;
uniform vec3 uSlonce;
uniform vec3 uOtoczenie;
uniform vec3 uMgla;
uniform vec3 uKierunekSlonca;
uniform float uPostep;
uniform float uMaxWysokosc;

varying vec3 vSwiat;
varying vec3 vNormalna;
varying float vWysokosc;

void main() {
  // Fasetowanie: normalna z pochodnych daje czytelny low-poly, zmieszana
  // z normalną analityczną, żeby zbocza nie rozpadły się na plamy.
  vec3 nPlaska = normalize(cross(dFdx(vSwiat), dFdy(vSwiat)));
  if (dot(nPlaska, vNormalna) < 0.0) nPlaska = -nPlaska;
  vec3 n = normalize(mix(vNormalna, nPlaska, 0.55));

  vec3 kierunekWidoku = normalize(cameraPosition - vSwiat);

  float wysokoscN = clamp(vWysokosc / uMaxWysokosc, 0.0, 1.0);
  float nachylenie = clamp(n.y, 0.0, 1.0);

  // Śnieg trzyma się wierzchołków i połogich pól, nie pionowych ścian.
  float snieg = smoothstep(0.52, 0.86, wysokoscN) * smoothstep(0.38, 0.72, nachylenie);
  vec3 albedo = mix(uSkalaKolor, uSzczyt, snieg);
  albedo = mix(albedo * 0.72, albedo, smoothstep(0.0, 0.35, wysokoscN));

  float lambert = clamp(dot(n, normalize(uKierunekSlonca)), 0.0, 1.0);
  float odbicieNieba = 0.5 + 0.5 * n.y;

  vec3 kolor = albedo * (uOtoczenie * 0.42 * odbicieNieba + uSlonce * lambert * 1.15);

  // Fresnel na krawędziach - w akcie ciepłym rozgrzewa kontur szczytu,
  // w nocnym zamienia się w zimną obwódkę.
  float fresnel = pow(1.0 - clamp(dot(n, kierunekWidoku), 0.0, 1.0), 2.6);
  kolor += uRim * fresnel * mix(0.85, 1.35, uPostep);

  // Mgła: dystansowa plus przyziemna. Przyziemna słabnie, gdy chmury opadają.
  float dystans = length(cameraPosition - vSwiat);
  float mglaD = smoothstep(95.0, 265.0, dystans);
  float mglaP = smoothstep(24.0, -2.0, vWysokosc) * mix(0.85, 0.18, uPostep);
  float mgla = clamp(mglaD + mglaP, 0.0, 1.0);
  kolor = mix(kolor, uMgla, mgla);

  gl_FragColor = vec4(kolor, 1.0);
  #include <colorspace_fragment>
}
`

export function Gora() {
  const materialRef = useRef(null)

  const geometria = useMemo(() => {
    const g = new THREE.PlaneGeometry(260, 260, 128, 128)
    g.rotateX(-Math.PI / 2)
    return g
  }, [])

  const uniformy = useMemo(
    () => ({
      uSkala: { value: 46 },
      uMaxWysokosc: { value: 52 },
      uPostep: { value: 0 },
      uSkalaKolor: { value: AKTUALNA.skala },
      uSzczyt: { value: AKTUALNA.szczyt },
      uRim: { value: AKTUALNA.rim },
      uSlonce: { value: AKTUALNA.slonce },
      uOtoczenie: { value: AKTUALNA.otoczenie },
      uMgla: { value: AKTUALNA.mgla },
      uKierunekSlonca: { value: new THREE.Vector3(0.42, 0.34, 0.84).normalize() },
    }),
    []
  )

  // Słońce zachodzi w trakcie przejścia: kierunek światła schodzi pod grań
  // i przesuwa się za masyw, więc szczyt gaśnie od dołu.
  const kierunekCieply = useMemo(() => new THREE.Vector3(0.42, 0.34, 0.84).normalize(), [])
  const kierunekChlodny = useMemo(() => new THREE.Vector3(-0.36, 0.62, -0.7).normalize(), [])

  useFrame(() => {
    const mat = materialRef.current
    if (!mat) return
    mat.uniforms.uPostep.value = stanScrolla.postep
    mat.uniforms.uKierunekSlonca.value
      .copy(kierunekCieply)
      .lerp(kierunekChlodny, stanScrolla.postep)
      .normalize()
  })

  return (
    <mesh geometry={geometria} frustumCulled={false} position={[0, 0, 0]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniformy}
      />
    </mesh>
  )
}
