'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import type { Group } from 'three';

/**
 * Bryla inwestycji: cztery niskie budynki wokol dziedzinca.
 *
 * Model jest budowany proceduralnie z prymitywow, a nie wczytywany z pliku GLB.
 * Dwa powody: nie ma zewnetrznego assetu, ktory moglby sie nie doladowac, i nie
 * ma zaleznosci od CDN-u. Z tego samego powodu nie uzywamy <Environment /> z drei
 * — ono pobiera mape HDR z sieci.
 */

type BudynekProps = {
  pozycja: [number, number, number];
  rozmiar: [number, number, number];
};

function Budynek({ pozycja, rozmiar }: BudynekProps) {
  const [szerokosc, wysokosc, glebokosc] = rozmiar;

  return (
    <group position={pozycja}>
      <mesh castShadow receiveShadow position={[0, wysokosc / 2, 0]}>
        <boxGeometry args={[szerokosc, wysokosc, glebokosc]} />
        <meshStandardMaterial color="#F0EAE0" roughness={0.85} metalness={0} />
      </mesh>
      {/* Attyka — cienki, ciemniejszy pas, ktory rysuje krawedz dachu */}
      <mesh position={[0, wysokosc + 0.06, 0]}>
        <boxGeometry args={[szerokosc + 0.12, 0.12, glebokosc + 0.12]} />
        <meshStandardMaterial color="#3B3F45" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Lipa({ pozycja, skala = 1 }: { pozycja: [number, number, number]; skala?: number }) {
  return (
    <group position={pozycja} scale={skala}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.075, 0.7, 8]} />
        <meshStandardMaterial color="#6B5A46" roughness={1} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.46, 20, 16]} />
        <meshStandardMaterial color="#5C7355" roughness={0.95} />
      </mesh>
    </group>
  );
}

function Scena({ uproszczona }: { uproszczona: boolean }) {
  const grupa = useRef<Group>(null);

  useFrame((stan, delta) => {
    if (!grupa.current) return;

    // Powolny obrot + delikatne podazanie za kursorem. Bez kursora (dotyk)
    // pointer zostaje w zerze i widok po prostu sie obraca.
    const docelowy = stan.pointer.x * 0.25;
    grupa.current.rotation.y += delta * 0.12;
    grupa.current.rotation.x += (docelowy * 0.12 + 0.02 - grupa.current.rotation.x) * 0.04;
  });

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight
        position={[4, 7, 3]}
        intensity={1.5}
        castShadow={!uproszczona}
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 3, -4]} intensity={0.35} color="#C8D6C2" />

      {/* Na waskim ekranie kadr jest wysoki i chudy, wiec ta sama bryla
          wychodzi bokami poza kadr — stad mniejsza skala. */}
      <group
        ref={grupa}
        position={[0, -0.9, 0]}
        rotation={[0.02, 0.5, 0]}
        scale={uproszczona ? 0.56 : 0.78}
      >
        {/* Plyta dziedzinca */}
        <mesh receiveShadow position={[0, -0.05, 0]}>
          <boxGeometry args={[5.4, 0.1, 5.4]} />
          <meshStandardMaterial color="#E6DFD4" roughness={1} />
        </mesh>

        {/* Cztery budynki ustawione w kwartal, kazdy innej dlugosci */}
        <Budynek pozycja={[0, 0, -1.85]} rozmiar={[3.6, 1.5, 0.95]} />
        <Budynek pozycja={[0, 0, 1.85]} rozmiar={[3.0, 1.25, 0.95]} />
        <Budynek pozycja={[-1.85, 0, 0]} rozmiar={[0.95, 1.4, 2.6]} />
        <Budynek pozycja={[1.85, 0, 0]} rozmiar={[0.95, 1.15, 2.2]} />

        {/* Starodrzew na dziedzincu */}
        <Lipa pozycja={[-0.75, 0, 0.35]} skala={1.1} />
        <Lipa pozycja={[0.7, 0, -0.5]} skala={0.85} />
        <Lipa pozycja={[0.35, 0, 0.85]} skala={0.7} />
      </group>

      {!uproszczona && (
        <ContactShadows
          position={[0, -1.02, 0]}
          opacity={0.32}
          scale={11}
          blur={2.6}
          far={4.5}
          resolution={512}
          color="#15171A"
        />
      )}
    </>
  );
}

export default function BrylaKwartalu({ uproszczona = false }: { uproszczona?: boolean }) {
  return (
    <Canvas
      // Ograniczamy pixel ratio recznie — na ekranach 3x scena bez tego
      // renderuje sie w rozdzielczosci, ktorej i tak nie widac.
      dpr={uproszczona ? [1, 1.5] : [1, 2]}
      shadows={!uproszczona}
      camera={{ position: [6.4, 4.4, 7.2], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none' }}
      aria-hidden
    >
      <Scena uproszczona={uproszczona} />
    </Canvas>
  );
}
