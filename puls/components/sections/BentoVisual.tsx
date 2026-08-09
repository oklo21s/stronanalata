import type { BentoCard } from '@/lib/content'

const SPARK = [30, 26, 34, 29, 38, 33, 44, 39, 52, 46, 58, 51, 63, 55, 68, 60]

function sparkPath(width: number, height: number) {
  const max = 76
  return SPARK.map((value, index) => {
    const x = (index * width) / (SPARK.length - 1)
    const y = height - (value / max) * (height - 4) - 2
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

/** Miniatury do kart bento. Każda pokazuje realny fragment produktu, nie ikonę. */
export function BentoVisual({ kind }: { kind: BentoCard['visual'] }) {
  if (kind === 'grouping') {
    return (
      <div className="relative flex flex-col gap-1.5 font-mono text-[10.5px]">
        {['api/koszyk.ts:118', 'api/koszyk.ts:118', 'api/koszyk.ts:118'].map((row, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-[8px] border border-line bg-white/[0.02] px-2.5 py-1.5 text-text-dim"
            style={{
              marginLeft: `${index * 10}px`,
              opacity: 1 - index * 0.32,
            }}
          >
            <span className="size-1.5 shrink-0 rounded-full bg-crit/70" />
            <span className="truncate">{row}</span>
          </div>
        ))}
        <div className="mt-1 flex items-center gap-2 rounded-[8px] border border-accent/40 bg-accent-soft px-2.5 py-2 text-text">
          <span className="size-1.5 shrink-0 rounded-full bg-crit" />
          <span className="truncate">TypeError · koszyk.ts:118</span>
          <span className="tabular ml-auto shrink-0 rounded-[999px] bg-white/10 px-1.5 py-0.5 text-[9.5px]">
            ×1 284
          </span>
        </div>
      </div>
    )
  }

  if (kind === 'oncall') {
    const days = ['pn', 'wt', 'śr', 'cz', 'pt', 'so', 'nd']
    return (
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={day}
              className={`flex flex-col items-center gap-1 rounded-[8px] border py-1.5 ${
                index === 2
                  ? 'border-accent/50 bg-accent-soft'
                  : 'border-line bg-white/[0.02]'
              }`}
            >
              <span className="font-mono text-[9px] text-text-dim">{day}</span>
              <span
                className={`grid size-5 place-items-center rounded-full font-mono text-[8.5px] ${
                  index === 2 ? 'bg-white text-cta-text' : 'bg-white/10 text-text-muted'
                }`}
              >
                {['TW', 'KD', 'MZ', 'AB', 'GL', 'TW', 'KD'][index]}
              </span>
            </div>
          ))}
        </div>
        <p className="font-mono text-[9.5px] tracking-[0.06em] text-text-dim uppercase">
          eskalacja: 8 min → kolejna osoba
        </p>
      </div>
    )
  }

  if (kind === 'replay') {
    const steps = [
      { t: '−28 s', label: 'klik „Zapłać”', tone: 'text-text-muted' },
      { t: '−12 s', label: 'POST /platnosc', tone: 'text-text-muted' },
      { t: '−0,4 s', label: '500 z bramki', tone: 'text-crit' },
    ]
    return (
      <ul className="flex flex-col gap-1.5 font-mono text-[10px]">
        {steps.map((step) => (
          <li key={step.t} className="flex items-center gap-2">
            <span className="tabular w-10 shrink-0 text-right text-text-dim">{step.t}</span>
            <span className="h-3 w-px bg-line-strong" />
            <span className={`truncate ${step.tone}`}>{step.label}</span>
          </li>
        ))}
      </ul>
    )
  }

  if (kind === 'baseline') {
    return (
      <div className="relative h-16 w-full">
        <svg viewBox="0 0 200 64" preserveAspectRatio="none" className="h-full w-full">
          <path
            d={`${sparkPath(200, 64)} L200,64 L0,64 Z`}
            fill="rgb(110 91 246 / 0.16)"
          />
          <path
            d={sparkPath(200, 64)}
            fill="none"
            stroke="#6E5BF6"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={sparkPath(200, 64)}
            fill="none"
            stroke="#3BA9F5"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.6"
            transform="translate(0,-12)"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="absolute right-0 -bottom-1 font-mono text-[9px] text-text-dim">
          próg = mediana z 14 dni
        </span>
      </div>
    )
  }

  return (
    <div className="rounded-[10px] border border-line bg-black/40 p-3 font-mono text-[10.5px] leading-relaxed">
      <p className="text-text-dim">
        <span className="text-accent-2">$</span> npm i @puls/sdk
      </p>
      <p className="mt-1 text-text-dim">
        <span className="text-accent-2">$</span> npx puls init --klucz plk_a91f
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-ok">
        <span className="size-1.5 rounded-full bg-ok" />
        pierwsze zdarzenie odebrane
      </p>
    </div>
  )
}
