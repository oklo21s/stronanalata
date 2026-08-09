import Image from 'next/image'
import { events, site } from '@/data/content'
import { photos } from '@/data/photos'
import Reveal from './ui/Reveal'

export default function Events() {
  const photo = photos[events.photo]

  return (
    <section id="przyjecia" className="bg-paper py-24 md:py-32">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-wine">{events.eyebrow}</p>
          <h2 className="type-display type-h2 mt-5">{events.heading}</h2>
          <p className="mt-6 text-lg text-ink-soft">{events.lead}</p>
        </Reveal>

        <Reveal className="mt-14" y={40}>
          <div className="relative aspect-16/9 overflow-hidden md:aspect-21/9">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              quality={78}
              sizes="100vw"
              placeholder="blur"
              blurDataURL={photo.blurDataURL}
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-[var(--gutter)]">
          <div className="lg:col-span-5">
            <Reveal>
              <h3 className="eyebrow text-ink-soft">Sale</h3>
            </Reveal>
            <ul className="mt-6 flex flex-col">
              {events.rooms.map((room, index) => (
                <Reveal
                  as="li"
                  key={room.name}
                  delay={index * 0.06}
                  className="border-b border-line py-5 first:border-t"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="type-display type-h4">{room.name}</span>
                    <span className="tabular text-sm tracking-[0.1em] text-wine">
                      {room.capacity}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">{room.note}</p>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <h3 className="eyebrow text-ink-soft">Jak to wygląda</h3>
            </Reveal>
            <ol className="mt-6 flex flex-col gap-8">
              {events.steps.map((step, index) => (
                <Reveal as="li" key={step.no} delay={index * 0.06} className="flex gap-6">
                  <span className="tabular pt-1 text-xs tracking-[0.24em] text-gold">
                    {step.no}
                  </span>
                  <div>
                    <h4 className="type-display type-h4">{step.title}</h4>
                    <p className="mt-2 max-w-md text-[0.95rem] text-ink-soft">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>

            <Reveal className="mt-10">
              <a href={`mailto:${site.eventsEmail}`} className="btn btn-ghost">
                {events.contactLabel}
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
