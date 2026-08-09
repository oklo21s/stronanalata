'use client'

import { useCounter } from '@/hooks/useCounter'
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll'
import { metrics, type Metric } from '@/lib/content'

function MetricItem({ item }: { item: Metric }) {
  const ref = useCounter({ value: item.value, decimals: item.decimals, suffix: item.suffix })

  return (
    <li className="flex flex-col gap-2 px-0 py-6 sm:px-6 lg:py-2" data-reveal>
      <span
        ref={ref}
        className="tabular font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-none font-semibold tracking-[-0.04em] text-text"
      >
        0
      </span>
      <span className="eyebrow max-w-[22ch]">{item.label}</span>
    </li>
  )
}

export function Metrics() {
  const scope = useRevealOnScroll<HTMLDivElement>({ blur: false })

  return (
    <section id="liczby" className="section relative z-10">
      <div className="shell" ref={scope}>
        <p className="eyebrow mb-10" data-reveal>
          {metrics.eyebrow}
        </p>

        <ul className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {metrics.items.map((item) => (
            <MetricItem key={item.label} item={item} />
          ))}
        </ul>

        <p className="mt-10 max-w-[60ch] font-mono text-[0.6875rem] text-text-dim" data-reveal>
          {metrics.footnote}
        </p>
      </div>
    </section>
  )
}
