'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap, SplitText, useGSAP, willChange } from '@/lib/gsap'
import { scrollToTarget } from '@/lib/lenis-store'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cta, hero, site } from '@/data/content'
import { photos } from '@/data/photos'

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const el = root.current
      const heading = headingRef.current
      if (!el || !heading) return

      const targets = el.querySelectorAll('[data-hero-item]')

      if (reducedMotion) {
        gsap.set([heading, ...Array.from(targets)], { autoAlpha: 1, y: 0 })
        return
      }

      gsap.set(heading, { autoAlpha: 0 })
      gsap.set(targets, { autoAlpha: 0, y: 18 })

      // Split dopiero po zaladowaniu fontu — inaczej linie policzylyby sie dla
      // fallbacku i po podmianie rozjechalyby maski. Animacje powstale w tym
      // `then` nie trafilyby do kontekstu useGSAP, dlatego wlasny gsap.context.
      let split: SplitText | undefined
      const ctx = gsap.context(() => {}, el)

      void document.fonts.ready.then(() => {
        if (!headingRef.current) return

        ctx.add(() => {
          split = SplitText.create(heading, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
          })

          gsap.set(heading, { autoAlpha: 1 })
          willChange(split.lines, 'transform')

          gsap
            .timeline()
            .from(split.lines, {
              yPercent: 115,
              duration: 1.25,
              stagger: 0.09,
              ease: 'expo.out',
              onComplete: () => willChange(split?.lines ?? null, null),
            })
            .to(targets, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, '-=0.75')
        })
      })

      // Parallax tla: zdjecie jedzie wolniej niz tresc.
      const media = el.querySelector('[data-hero-media]')
      if (media) {
        gsap.to(media, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
        })
      }

      return () => {
        split?.revert()
        ctx.revert()
      }
    },
    { dependencies: [reducedMotion], scope: root },
  )

  const photo = photos[hero.photo]

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden text-cream"
    >
      {/* Zdjecie jest wyzsze od sekcji o 12%, zeby mialo w co jechac przy parallaksie. */}
      <div data-hero-media="" className="absolute inset-x-0 top-0 h-[112%]">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority
          quality={78}
          sizes="100vw"
          placeholder="blur"
          blurDataURL={photo.blurDataURL}
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/95 via-wine-deep/45 to-transparent" />
      <div className="absolute inset-0 bg-wine-deep/25" />
      {/* Osobna zaslona pod nawigacja — zdjecie ma tu najjasniejszy punkt
          (zyrandol) i bez niej linki tracily kontrast. */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-wine-deep/70 to-transparent" />

      <div className="shell relative z-10 pt-28 pb-10 md:pb-14">
        <p data-hero-item="" className="eyebrow text-cream/70">
          {hero.eyebrow}
        </p>

        <h1 ref={headingRef} className="type-display type-h1 mt-6 max-w-[15ch]">
          {hero.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <p data-hero-item="" className="max-w-lg text-lg text-cream/85 lg:col-span-5">
            {hero.intro}
          </p>

          <div data-hero-item="" className="flex flex-wrap gap-3 lg:col-span-4">
            <a
              href={cta.reserveHref}
              onClick={(event) => {
                event.preventDefault()
                scrollToTarget(cta.reserveHref)
              }}
              className="btn btn-solid"
            >
              {cta.reserve}
            </a>
            <a
              href={cta.menuHref}
              onClick={(event) => {
                event.preventDefault()
                scrollToTarget(cta.menuHref)
              }}
              className="btn btn-ghost-light"
            >
              {cta.menu}
            </a>
          </div>

          <dl data-hero-item="" className="flex gap-8 lg:col-span-3 lg:justify-end">
            {hero.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="sr-only">{fact.label}</dt>
                <dd className="type-display tabular text-3xl">{fact.value}</dd>
                <dd className="mt-1 text-[0.7rem] tracking-[0.14em] text-cream/60 uppercase">
                  {fact.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          data-hero-item=""
          className="mt-12 flex items-center justify-between border-t border-cream/25 pt-5"
        >
          <span className="text-xs tracking-[0.2em] text-cream/60 uppercase">
            {hero.scrollLabel}
          </span>
          <span className="tabular text-xs tracking-[0.14em] text-cream/60">
            {site.street}, {site.city}
          </span>
        </div>
      </div>
    </section>
  )
}
