import Image from 'next/image'
import { manifest } from '@/data/content'
import { photos } from '@/data/photos'
import Reveal from './ui/Reveal'
import TextReveal from './ui/TextReveal'
import Ornament from './ui/Ornament'

export default function Manifest() {
  const photo = photos[manifest.photo]

  return (
    <section id="o-nas" className="bg-cream py-24 md:py-36">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-[var(--gutter)]">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow text-wine">{manifest.eyebrow}</p>
            <h2 className="type-display type-h2 mt-5 max-w-[18ch] text-balance">
              {manifest.heading}
            </h2>
          </Reveal>

          <TextReveal className="mt-10 max-w-xl text-lg leading-relaxed md:text-xl">
            {manifest.body}
          </TextReveal>

          <Reveal className="mt-10 flex items-center gap-4">
            <Ornament className="h-9 w-9 shrink-0 text-gold" />
            <div>
              <p className="type-display text-2xl italic">{manifest.signature}</p>
              <p className="text-xs tracking-[0.16em] text-ink-soft uppercase">
                {manifest.signatureRole}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-5" y={40}>
          <figure>
            {/* Stale proporcje zamiast naturalnej wysokosci — inaczej kolumna
                ze zdjeciem wystawalaby ponizej kolumny z tekstem. */}
            <div className="relative aspect-4/5 overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                quality={78}
                sizes="(max-width: 1024px) 100vw, 40vw"
                placeholder="blur"
                blurDataURL={photo.blurDataURL}
                className="object-cover object-bottom"
              />
            </div>
            <figcaption className="mt-3 text-xs tracking-[0.12em] text-ink-soft uppercase">
              {manifest.caption}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
