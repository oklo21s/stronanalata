import dynamic from 'next/dynamic'
import { Aurora } from '@/components/fx/Aurora'
import { Grain } from '@/components/fx/Grain'
import { GridOverlay } from '@/components/fx/GridOverlay'
import { CustomCursor } from '@/components/fx/CustomCursor'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/sections/Hero'
import { LogoCloud } from '@/components/sections/LogoCloud'

// Sekcje poniżej pierwszego ekranu: kod dzielony, ale nadal renderowane
// po stronie serwera — treść jest w HTML, więc bez kosztu w SEO i CLS.
const BentoFeatures = dynamic(() =>
  import('@/components/sections/BentoFeatures').then((m) => m.BentoFeatures),
)
const FeatureRows = dynamic(() =>
  import('@/components/sections/FeatureRows').then((m) => m.FeatureRows),
)
const Metrics = dynamic(() => import('@/components/sections/Metrics').then((m) => m.Metrics))
const Testimonials = dynamic(() =>
  import('@/components/sections/Testimonials').then((m) => m.Testimonials),
)
const Pricing = dynamic(() => import('@/components/sections/Pricing').then((m) => m.Pricing))
const Faq = dynamic(() => import('@/components/sections/Faq').then((m) => m.Faq))
const CtaFinal = dynamic(() => import('@/components/sections/CtaFinal').then((m) => m.CtaFinal))
const Footer = dynamic(() => import('@/components/layout/Footer').then((m) => m.Footer))

export default function Home() {
  return (
    <>
      <Aurora />
      <GridOverlay />
      <Grain />
      <CustomCursor />

      <Navbar />

      <main id="tresc">
        <Hero />
        <LogoCloud />
        <BentoFeatures />
        <FeatureRows />
        <Metrics />
        <Testimonials />
        <Pricing />
        <Faq />
        <CtaFinal />
      </main>

      <Footer />
    </>
  )
}
