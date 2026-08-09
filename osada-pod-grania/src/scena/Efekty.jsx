import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { stanScrolla } from '../scroll/stanScrolla'

/*
  Bloom tylko na tym, co realnie świeci: cząstkach, węzłach siatki i smugach.
  Próg luminancji trzyma efekt z dala od zboczy góry, żeby nie rozmyć krawędzi.

  Moduł jest ładowany leniwie (`React.lazy` w `Scena.jsx`) i montowany wyłącznie
  na mocniejszych urządzeniach, więc telefon nie płaci za niego ani bajtem
  transferu, ani klatką.
*/
export default function Efekty() {
  const bloomRef = useRef(null)

  useFrame(() => {
    if (!bloomRef.current) return
    // W dzień poświata jest ledwo obecna, w nocy niesie cały klimat sceny.
    bloomRef.current.intensity = 0.18 + stanScrolla.postep * 1.05
  })

  return (
    <EffectComposer disableNormalPass multisampling={0}>
      <Bloom
        ref={bloomRef}
        mipmapBlur
        intensity={0.18}
        luminanceThreshold={0.58}
        luminanceSmoothing={0.22}
      />
    </EffectComposer>
  )
}
