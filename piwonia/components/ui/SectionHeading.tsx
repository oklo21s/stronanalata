import Reveal from './Reveal'

type Props = {
  eyebrow: string
  heading: string
  lead?: string
  /** Wariant na ciemnym tle sekcji (wine / wine-deep). */
  tone?: 'dark' | 'light'
  align?: 'left' | 'center'
}

export default function SectionHeading({
  eyebrow,
  heading,
  lead,
  tone = 'dark',
  align = 'left',
}: Props) {
  const muted = tone === 'dark' ? 'text-ink-soft' : 'text-cream/60'
  const accent = tone === 'dark' ? 'text-wine' : 'text-cream/70'

  return (
    <Reveal className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}>
      <p className={`eyebrow ${accent}`}>{eyebrow}</p>
      <h2 className="type-display type-h2 mt-5 text-balance">{heading}</h2>
      {lead ? <p className={`mt-6 max-w-xl text-lg ${muted}`}>{lead}</p> : null}
    </Reveal>
  )
}
