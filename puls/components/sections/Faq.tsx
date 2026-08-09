'use client'

import { useId, useState } from 'react'
import { Plus } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll'
import { faq } from '@/lib/content'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const scope = useRevealOnScroll<HTMLDivElement>({ blur: false })
  const baseId = useId()

  return (
    <section id="faq" className="section relative z-10">
      <div
        className="shell grid gap-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20"
        ref={scope}
      >
        <SectionHeading
          eyebrow={faq.eyebrow}
          title={faq.title}
          className="lg:sticky lg:top-32 lg:self-start"
        />

        <ul className="flex flex-col border-t border-line">
          {faq.items.map((item, index) => {
            const expanded = open === index
            const panelId = `${baseId}-panel-${index}`
            const buttonId = `${baseId}-przycisk-${index}`

            return (
              <li key={item.q} className="border-b border-line" data-reveal>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? null : index)}
                    className="flex w-full items-start gap-4 py-5 text-left transition-colors duration-200 hover:text-text"
                  >
                    <span
                      className={`flex-1 text-[1.0625rem] font-medium tracking-[-0.02em] transition-colors duration-200 ${
                        expanded ? 'text-text' : 'text-text-muted'
                      }`}
                    >
                      {item.q}
                    </span>
                    <Plus
                      aria-hidden="true"
                      className={`mt-0.5 size-4.5 shrink-0 text-text-dim transition-transform duration-300 ease-out ${
                        expanded ? 'rotate-45 text-accent-2' : ''
                      }`}
                    />
                  </button>
                </h3>

                {/* Wysokość przez grid-template-rows 0fr → 1fr: animowalna bez height:auto. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[62ch] pb-6 text-[0.9375rem] leading-relaxed text-text-muted">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
