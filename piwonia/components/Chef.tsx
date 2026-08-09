import Image from 'next/image'
import { chef } from '@/data/content'
import { photos } from '@/data/photos'
import Reveal from './ui/Reveal'
import Ornament from './ui/Ornament'

export default function Chef() {
  const portrait = photos[chef.photo]
  const second = photos[chef.secondPhoto]

  return (
    <section id="szefowa" className="bg-cream py-24 md:py-32">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-[var(--gutter)]">
        <Reveal className="lg:col-span-5" y={40}>
          <div className="relative aspect-3/4 overflow-hidden">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              quality={78}
              sizes="(max-width: 1024px) 100vw, 40vw"
              placeholder="blur"
              blurDataURL={portrait.blurDataURL}
              className="object-cover"
            />
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <p className="type-display text-2xl">{chef.name}</p>
            <p className="text-xs tracking-[0.14em] text-ink-soft uppercase">{chef.role}</p>
          </div>
        </Reveal>

        <div className="lg:col-span-7 lg:pl-8">
          <Reveal>
            <p className="eyebrow text-wine">{chef.eyebrow}</p>
            <h2 className="type-display type-h2 mt-5 max-w-[16ch] text-balance">{chef.heading}</h2>
          </Reveal>

          <div className="mt-8 flex flex-col gap-5">
            {chef.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 24)} delay={index * 0.05}>
                <p className="max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 border-t border-line pt-10">
            <blockquote className="flex gap-5">
              <Ornament className="mt-1 h-8 w-8 shrink-0 text-gold" />
              <p className="type-display max-w-lg text-2xl leading-snug italic md:text-3xl">
                &bdquo;{chef.quote}&rdquo;
              </p>
            </blockquote>
          </Reveal>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {chef.facts.map((fact, index) => (
              <Reveal key={fact.label} delay={index * 0.06}>
                <p className="type-display tabular text-4xl text-wine">{fact.value}</p>
                <p className="mt-1 text-xs tracking-[0.14em] text-ink-soft uppercase">
                  {fact.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Reveal className="shell mt-16" y={40}>
        <div className="relative aspect-16/9 overflow-hidden md:aspect-21/9">
          <Image
            src={second.src}
            alt={second.alt}
            fill
            quality={70}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={second.blurDataURL}
            className="object-cover"
          />
        </div>
      </Reveal>
    </section>
  )
}
