'use client'

import { useId, useState } from 'react'
import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll'
import { pricing } from '@/lib/content'

const priceFormat = new Intl.NumberFormat('pl-PL')

export function Pricing() {
  const [yearly, setYearly] = useState(false)
  const scope = useRevealOnScroll<HTMLDivElement>({ blur: false, start: 'top 82%' })
  const groupId = useId()

  return (
    <section id="cennik" className="section relative z-10">
      <div className="shell flex flex-col gap-12" ref={scope}>
        <div className="flex flex-col items-center gap-8">
          <SectionHeading
            eyebrow={pricing.eyebrow}
            title={pricing.title}
            lead={pricing.lead}
            align="center"
          />

          <div
            role="radiogroup"
            aria-label="Okres rozliczeniowy"
            data-reveal
            className="relative flex items-center gap-1 rounded-[999px] border border-line bg-surface p-1 backdrop-blur-md"
          >
            {[false, true].map((value) => {
              const active = yearly === value
              return (
                <button
                  key={String(value)}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setYearly(value)}
                  className={`relative rounded-[999px] px-4 py-1.5 text-[0.8125rem] font-medium transition-colors duration-200 ${
                    active ? 'text-cta-text' : 'text-text-muted hover:text-text'
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId={`${groupId}-wskaznik`}
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-0 -z-10 rounded-[999px] bg-cta"
                    />
                  ) : null}
                  {value ? pricing.toggle.yearly : pricing.toggle.monthly}
                </button>
              )
            })}
            <span className="pr-2 pl-1 font-mono text-[0.625rem] tracking-[0.06em] text-accent-2 uppercase">
              {pricing.toggle.hint}
            </span>
          </div>
        </div>

        <ul className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
          {pricing.plans.map((plan) => {
            const price = yearly ? plan.yearly : plan.monthly
            return (
              <li
                key={plan.id}
                data-reveal
                className={`relative flex h-full flex-col gap-6 rounded-lg border p-6 backdrop-blur-md sm:p-7 ${
                  plan.featured
                    ? 'border-accent/50 bg-accent-soft lg:scale-[1.03]'
                    : 'border-line bg-surface'
                }`}
              >
                {plan.featured ? (
                  <span className="absolute -top-3 left-6 rounded-[999px] border border-accent/50 bg-bg px-3 py-1 font-mono text-[0.625rem] tracking-[0.08em] text-accent-2 uppercase">
                    Najpopularniejszy
                  </span>
                ) : null}

                <div className="flex flex-col gap-2">
                  <h3 className="text-h3">{plan.name}</h3>
                  <p className="min-h-[3rem] text-[0.9375rem] text-text-muted">{plan.pitch}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="flex items-baseline gap-2">
                    <span
                      className={`tabular font-display leading-none font-semibold tracking-[-0.04em] text-text ${
                        price === null ? 'text-[1.75rem]' : 'text-[2.75rem]'
                      }`}
                    >
                      {price === null ? 'Wycena indywidualna' : priceFormat.format(price)}
                    </span>
                    {plan.unit ? (
                      <span className="text-[0.8125rem] text-text-muted">{plan.unit}</span>
                    ) : null}
                  </p>
                  <p className="font-mono text-[0.6875rem] text-text-dim">{plan.note}</p>
                </div>

                <Button
                  href="#rejestracja"
                  variant={plan.featured ? 'primary' : 'secondary'}
                  size="lg"
                  className="w-full"
                >
                  {plan.cta}
                </Button>

                <ul className="flex flex-col gap-2.5 border-t border-line pt-5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-[0.875rem] text-text-muted"
                    >
                      <Check
                        aria-hidden="true"
                        className={`mt-0.5 size-4 shrink-0 ${plan.featured ? 'text-accent-2' : 'text-text-dim'}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
