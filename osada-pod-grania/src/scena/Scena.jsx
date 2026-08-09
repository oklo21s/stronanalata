import { Suspense, lazy, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { Rezyser } from './Rezyser'
import { Gora } from './Gora'
import { WarstwyChmur } from './WarstwyChmur'
import { SmugiSwiatla } from './SmugiSwiatla'
import { PodlogaSiatki } from './PodlogaSiatki'
import { PoleCzastek } from './PoleCzastek'
import { useOgraniczonyRuch } from '../hooks/useOgraniczonyRuch'
import { useProfilUrzadzenia } from '../hooks/useProfilUrzadzenia'

const Efekty = lazy(() => import('./Efekty'))

/**
 * Kanwa leży na stałe pod całą stroną. Nie przewija się razem z treścią -
 * to sekcje przesuwają się nad nią, a scena zmienia porę dnia zgodnie
 * z postępem scrolla.
 */
export function Scena() {
  const ograniczonyRuch = useOgraniczonyRuch()
  const profil = useProfilUrzadzenia()
  const [dpr, setDpr] = useState(profil.mobilny ? 1 : 1.5)
  const [kartaWidoczna, setKartaWidoczna] = useState(true)

  useEffect(() => {
    const naZmiane = () => setKartaWidoczna(!document.hidden)
    document.addEventListener('visibilitychange', naZmiane)
    return () => document.removeEventListener('visibilitychange', naZmiane)
  }, [])

  // Ograniczony ruch: renderujemy na żądanie, więc scena stoi, dopóki
  // obserwator sekcji nie przełączy pory dnia. Ukryta karta: nie renderujemy wcale.
  const frameloop = ograniczonyRuch ? 'demand' : kartaWidoczna ? 'always' : 'never'

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        dpr={[1, dpr]}
        frameloop={frameloop}
        gl={{
          antialias: profil.wygladzanie,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
        }}
        camera={{ fov: 42, near: 0.5, far: 1100, position: [13, 58, 133] }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <Rezyser />
        <Gora />
        <PodlogaSiatki />
        <WarstwyChmur />
        <SmugiSwiatla />
        <PoleCzastek liczba={profil.liczbaCzastek} />
        {profil.bloom && !ograniczonyRuch ? (
          <Suspense fallback={null}>
            <Efekty />
          </Suspense>
        ) : null}
      </Canvas>
    </div>
  )
}
