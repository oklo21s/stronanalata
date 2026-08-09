'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap, useGSAP, willChange } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { gallery } from '@/data/content'
import { photos } from '@/data/photos'
import Reveal from './ui/Reveal'

/** Ustawienie kafli w siatce 12-kolumnowej — kolumna, przesuniecie, proporcje. */
const LAYOUT = [
  { span: 'lg:col-span-7', offset: '', ratio: 'aspect-4/3' },
  { span: 'lg:col-span-5', offset: 'lg:mt-24', ratio: 'aspect-3/4' },
  { span: 'lg:col-span-5', offset: 'lg:-mt-12', ratio: 'aspect-3/4' },
  { span: 'lg:col-span-7', offset: 'lg:mt-16', ratio: 'aspect-4/3' },
  { span: 'lg:col-span-6', offset: '', ratio: 'aspect-square' },
  { span: 'lg:col-span-6', offset: 'lg:mt-20', ratio: 'aspect-square' },
] as const

export default function Gallery() {
  const root = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()

  useGSAP(
    () => {
      // Na mobile kafle sa jeden pod drugim — parallax tylko dokladalby pracy GPU.
      if (reducedMotion || isMobile) return

      const figures = gsap.utils.toArray<HTMLElement>('[data-parallax]')

      for (const [index, figure] of figures.entries()) {
        const media = figure.querySelector('[data-parallax-media]')
        if (!media) continue

        // Sasiednie kafle jada w przeciwne strony — stad zmiana znaku.
        const dir = index % 2 === 0 ? 1 : -1

        gsap.fromTo(
          media,
          { yPercent: -6 * dir },
          {
            yPercent: 6 * dir,
            ease: 'none',
            scrollTrigger: {
              trigger: figure,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              onToggle: (self) => willChange(media, self.isActive ? 'transform' : null),
            },
          },
        )
      }
    },
    { dependencies: [reducedMotion, isMobile], scope: root },
  )

  return (
    <section ref={root} id="galeria" className="bg-wine-deep py-24 text-cream md:py-32">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-cream/60">{gallery.eyebrow}</p>
          <h2 className="type-display type-h2 mt-5">{gallery.heading}</h2>
          <p className="mt-6 text-lg text-cream/70">{gallery.lead}</p>
        </Reveal>

        <ul className="mt-16 grid gap-x-[var(--gutter)] gap-y-10 lg:grid-cols-12">
          {gallery.items.map((item, index) => {
            const photo = photos[item.photo]
            const layout = LAYOUT[index] ?? LAYOUT[0]
            return (
              <Reveal as="li" key={item.photo} className={`${layout.span} ${layout.offset}`} y={36}>
                <figure data-parallax="">
                  {/* Wewnetrzny kontener jest wyzszy od ramki, zeby parallax
                      nie odslonil krawedzi zdjecia. */}
                  <div className={`relative overflow-hidden ${layout.ratio}`}>
                    <div data-parallax-media="" className="absolute inset-x-0 -top-[8%] h-[116%]">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        quality={70}
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        placeholder="blur"
                        blurDataURL={photo.blurDataURL}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-3 text-xs tracking-[0.12em] text-cream/55 uppercase">
                    {item.caption}
                  </figcaption>
                </figure>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
