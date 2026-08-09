import Image from 'next/image'
import { pillars } from '@/data/content'
import { photos } from '@/data/photos'
import Reveal from './ui/Reveal'

export default function Pillars() {
  return (
    <section id="kuchnia" className="bg-wine-deep py-24 text-cream md:py-32">
      <div className="shell">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-cream/60">{pillars.eyebrow}</p>
            <h2 className="type-display type-h2 mt-5">{pillars.heading}</h2>
          </div>
        </Reveal>

        <div className="rule-dark mt-12" />

        <ul className="grid gap-x-[var(--gutter)] gap-y-14 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.items.map((item, index) => {
            const photo = photos[item.photo]
            return (
              <Reveal as="li" key={item.no} delay={index * 0.08}>
                <div className="relative aspect-4/5 overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    quality={70}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    placeholder="blur"
                    blurDataURL={photo.blurDataURL}
                    className="object-cover"
                  />
                </div>
                <p className="tabular mt-6 text-xs tracking-[0.24em] text-gold">{item.no}</p>
                <h3 className="type-display type-h4 mt-2">{item.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-cream/70">{item.body}</p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
