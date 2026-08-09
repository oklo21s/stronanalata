import { testimonials } from '@/data/content'
import Reveal from './ui/Reveal'
import Ornament from './ui/Ornament'

export default function Testimonials() {
  return (
    <section id="opinie" className="bg-wine py-24 text-cream md:py-32">
      <div className="shell">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-cream/60">{testimonials.eyebrow}</p>
            <h2 className="type-display type-h2 mt-5">{testimonials.heading}</h2>
          </div>
          <Ornament className="hidden h-12 w-12 text-cream/40 md:block" />
        </Reveal>

        <ul className="mt-16 grid gap-x-[var(--gutter)] gap-y-12 md:grid-cols-2">
          {testimonials.items.map((item, index) => (
            <Reveal as="li" key={item.author} delay={index * 0.06}>
              <figure className="flex h-full flex-col border-t border-line-dark pt-8">
                <blockquote className="type-display flex-1 text-2xl leading-snug md:text-[1.75rem]">
                  &bdquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-baseline gap-3">
                  <span className="text-sm tracking-[0.14em] uppercase">{item.author}</span>
                  <span className="text-xs text-cream/55">{item.meta}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
