'use client';

import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import {
  BackSide,
  NoToneMapping,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from 'three';

/**
 * Panorama sferyczna (equirectangular) do rozgladania sie po otoczeniu.
 *
 * Zasada dzialania: kamera stoi w srodku duzej kuli, na ktora od wewnatrz
 * nalozone jest zdjecie 2:1. Obracanie kamery = rozgladanie sie.
 *
 * Dwa szczegoly, bez ktorych kula jest niewidoczna albo pokazuje lustro:
 *
 * 1. `side={BackSide}`. Domyslnie widac tylko zewnetrzna strone scianek,
 *    a my patrzymy od srodka. Kuszace `scale={[-1, 1, 1]}` na siatce NIE
 *    dziala — three wykrywa ujemna wyznacznik macierzy i sam odwraca
 *    kierunek scianek z powrotem, wiec culling dalej wycina wnetrze
 *    i canvas zostaje przezroczysty.
 * 2. Odwrocenie tekstury w poziomie (`repeat.x = -1`). Patrzac na kule od
 *    wewnatrz widzimy jej mapowanie w lustrzanym odbiciu; bez korekty napisy
 *    i uklad otoczenia sa odbite.
 */

type SferaProps = {
  plik: string;
  onGotowa?: () => void;
};

function Sfera({ plik, onGotowa }: SferaProps) {
  const tekstura = useTexture(plik) as Texture;

  useEffect(() => {
    // Bez jawnej przestrzeni barw zdjecie wychodzi wyprane — three zaklada
    // dane liniowe, a JPEG jest zapisany w sRGB.
    tekstura.colorSpace = SRGBColorSpace;
    tekstura.wrapS = RepeatWrapping;
    tekstura.repeat.x = -1;
    tekstura.needsUpdate = true;
    onGotowa?.();
  }, [tekstura, onGotowa]);

  return (
    <mesh>
      <sphereGeometry args={[50, 64, 40]} />
      <meshBasicMaterial map={tekstura} side={BackSide} />
    </mesh>
  );
}

type Props = {
  plik: string;
  /** Czy uzytkownik moze chwycic i obrocic. Na dotyku wlaczane przyciskiem. */
  interaktywna: boolean;
  /** Powolny obrot bez udzialu uzytkownika. */
  autoObrot: boolean;
  onGotowa?: () => void;
};

export default function Panorama360({
  plik,
  interaktywna,
  autoObrot,
  onGotowa,
}: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 0.1], fov: 74 }}
      dpr={[1, 1.75]}
      // Bez wylaczenia tonemappingu R3F przepuszcza zdjecie przez krzywa ACES,
      // przewidziana dla renderu HDR. Zwykly JPEG traci wtedy kontrast
      // i robi sie mlecznie wyprany.
      gl={{ antialias: true, toneMapping: NoToneMapping }}
      // touch-action zdejmujemy tylko wtedy, gdy panorama faktycznie lapie
      // gesty — inaczej na telefonie nie dalo by sie przewinac strony palcem
      // po obszarze hero.
      style={{ touchAction: interaktywna ? 'none' : 'pan-y' }}
    >
      <Suspense fallback={null}>
        <Sfera plik={plik} onGotowa={onGotowa} />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={interaktywna}
        // Ujemna predkosc odwraca kierunek: swiat idzie za kursorem,
        // zamiast uciekac w przeciwna strone.
        rotateSpeed={-0.32}
        autoRotate={autoObrot}
        autoRotateSpeed={0.22}
        enableDamping
        dampingFactor={0.06}
        // Blokada zenitu i nadiru — tam zbiegaja sie poludniki zdjecia
        // i widac charakterystyczne rozmycie na biegunie.
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.75}
      />
    </Canvas>
  );
}
