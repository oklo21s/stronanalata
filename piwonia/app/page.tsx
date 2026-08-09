import Hero from '@/components/Hero'
import Manifest from '@/components/Manifest'
import Pillars from '@/components/Pillars'
import Menu from '@/components/Menu'
import Chef from '@/components/Chef'
import Gallery from '@/components/Gallery'
import Events from '@/components/Events'
import Testimonials from '@/components/Testimonials'
import Reservation from '@/components/Reservation'
import Footer from '@/components/Footer'

export default function Page() {
  return (
    <>
      <Hero />
      <main id="tresc">
        <Manifest />
        <Pillars />
        <Menu />
        <Chef />
        <Gallery />
        <Events />
        <Testimonials />
        <Reservation />
      </main>
      <Footer />
    </>
  )
}
