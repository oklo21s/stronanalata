'use client'

import { useSplitReveal } from '@/hooks/useSplitReveal'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  lead?: string
  align?: 'left' | 'center'
  className?: string
  /** Do podpięcia pod aria-labelledby sekcji. */
  titleId?: string
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  className = '',
  titleId,
}: SectionHeadingProps) {
  const titleRef = useSplitReveal<HTMLHeadingElement>({ type: 'lines' })

  return (
    // Szerokość w rem, nie w ch: jednostka `ch` liczy się od font-size nagłówka
    // sekcji (16 px), więc na kontenerze zdusiłaby H2 do czterech wierszy.
    <header
      className={`flex flex-col gap-4 ${align === 'center' ? 'mx-auto max-w-[46rem] text-center' : 'max-w-[42rem]'} ${className}`}
    >
      <p className="eyebrow" data-reveal>
        {eyebrow}
      </p>
      <h2 id={titleId} ref={titleRef} className="text-h2 text-balance">
        {title}
      </h2>
      {lead ? (
        <p className="max-w-[58ch] text-body text-text-muted" data-reveal>
          {lead}
        </p>
      ) : null}
    </header>
  )
}
