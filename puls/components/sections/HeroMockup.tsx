import {
  Bell,
  CalendarClock,
  ChevronDown,
  LayoutGrid,
  Plug,
  Rocket,
  Search,
  Settings,
  Siren,
} from 'lucide-react'

/** Błędy na minutę — stała seria, żeby SSR i klient renderowały identycznie. */
const SERIES = [
  22, 26, 21, 28, 24, 30, 26, 33, 28, 35, 30, 27, 31, 28, 34, 30, 39, 35, 42, 38, 45, 60, 98, 134,
  120, 88, 64, 50, 42, 37, 34, 31, 29, 32, 28, 26, 30, 27, 25, 28,
]

const W = 600
const H = 180
const CEILING = 150
const SPIKE = 23

const px = (i: number) => (i * W) / (SERIES.length - 1)
const py = (v: number) => H - 10 - (v / CEILING) * (H - 30)

const points = SERIES.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`)
const linePath = `M${points.join(' L')}`
const areaPath = `${linePath} L${W},${H} L0,${H} Z`

const NAV = [
  { icon: LayoutGrid, label: 'Przegląd' },
  { icon: Siren, label: 'Zdarzenia', badge: '3' },
  { icon: Rocket, label: 'Wydania' },
  { icon: CalendarClock, label: 'Dyżury' },
  { icon: Plug, label: 'Integracje' },
  { icon: Settings, label: 'Ustawienia' },
]

const TILES = [
  { label: 'Otwarte zdarzenia', value: '3', tone: 'crit', delta: '+2 dziś' },
  { label: 'Mediana do alertu', value: '41 s', tone: 'ok', delta: '−12 s' },
  { label: 'Budżet błędów', value: '78%', tone: 'warn', delta: 'do 31.08' },
]

const INCIDENTS = [
  {
    tone: 'crit',
    title: 'TypeError: cannot read properties of undefined',
    where: 'koszyk-web · produkcja',
    count: '1 284',
    who: 'MZ',
    when: '2 min',
  },
  {
    tone: 'warn',
    title: 'Timeout bramki płatniczej po 8 s',
    where: 'platnosci-api · produkcja',
    count: '317',
    who: 'TW',
    when: '26 min',
  },
  {
    tone: 'ok',
    title: 'Kolejka webhooków opóźniona o 40 s',
    where: 'webhooks · staging',
    count: '54',
    who: 'KD',
    when: '3 godz.',
  },
]

const toneDot: Record<string, string> = {
  crit: 'bg-crit',
  warn: 'bg-warn',
  ok: 'bg-ok',
}

const toneText: Record<string, string> = {
  crit: 'text-crit',
  warn: 'text-warn',
  ok: 'text-ok',
}

/**
 * Atrapa panelu produktu. Cała zbudowana z HTML i SVG zamiast zrzutu ekranu:
 * ostra na każdym DPI, zerowy transfer obrazu i zero CLS przy ładowaniu.
 */
export function HeroMockup() {
  return (
    <div
      role="img"
      aria-label="Panel Pulsa: lista otwartych zdarzeń, wykres liczby błędów na minutę ze skokiem po wdrożeniu oraz osoba na dyżurze."
      className="inset-top-highlight relative aspect-4/3 w-full overflow-hidden rounded-xl border border-line bg-bg-elev shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)] sm:aspect-16/10"
    >
      {/* pasek okna */}
      <div className="flex h-9 items-center gap-3 border-b border-line bg-white/[0.02] px-3 sm:px-4">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-crit/70" />
          <span className="size-2.5 rounded-full bg-warn/70" />
          <span className="size-2.5 rounded-full bg-ok/70" />
        </div>
        <div className="mx-auto flex h-5 w-full max-w-[280px] items-center gap-1.5 rounded-[999px] border border-line bg-black/30 px-2.5 font-mono text-[10px] text-text-dim">
          <Search className="size-2.5" />
          puls.dev/atlas-retail/zdarzenia
        </div>
        <Bell className="hidden size-3.5 text-text-dim sm:block" />
      </div>

      <div className="flex h-[calc(100%-2.25rem)]">
        {/* boczna nawigacja */}
        <aside className="hidden w-[164px] shrink-0 flex-col border-r border-line p-3 md:flex">
          <div className="flex items-center gap-2 rounded-md border border-line bg-white/[0.02] px-2 py-1.5">
            <span className="grid size-5 place-items-center rounded-[6px] bg-gradient-to-br from-accent to-accent-2 font-mono text-[9px] font-medium text-white">
              AR
            </span>
            <span className="truncate text-[11px] font-medium text-text">Atlas Retail</span>
            <ChevronDown className="ml-auto size-3 text-text-dim" />
          </div>

          <nav className="mt-3 flex flex-col gap-0.5">
            {NAV.map((item, index) => (
              <span
                key={item.label}
                className={`flex items-center gap-2 rounded-[8px] px-2 py-1.5 text-[11px] ${
                  index === 1 ? 'bg-white/[0.06] text-text' : 'text-text-dim'
                }`}
              >
                <item.icon className="size-3.5" />
                {item.label}
                {item.badge ? (
                  <span className="ml-auto grid h-4 min-w-4 place-items-center rounded-[999px] bg-crit/20 px-1 font-mono text-[9px] text-crit">
                    {item.badge}
                  </span>
                ) : null}
              </span>
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-2 border-t border-line pt-3">
            <span className="grid size-6 place-items-center rounded-full bg-white/10 font-mono text-[9px] text-text">
              MZ
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] text-text">Marta Z.</span>
              <span className="flex items-center gap-1 font-mono text-[9px] text-ok">
                <span className="size-1 rounded-full bg-ok" />
                na dyżurze
              </span>
            </span>
          </div>
        </aside>

        {/* treść panelu */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-5">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-semibold tracking-[-0.02em] text-text sm:text-[15px]">
              Zdarzenia
            </h3>
            <span className="rounded-[999px] border border-line px-2 py-0.5 font-mono text-[9px] text-text-dim">
              produkcja
            </span>
            <span className="hidden rounded-[999px] border border-line px-2 py-0.5 font-mono text-[9px] text-text-dim sm:inline">
              ostatnie 24 h
            </span>
            <span className="ml-auto hidden rounded-[999px] bg-white px-2.5 py-1 text-[10px] font-medium text-cta-text sm:inline">
              Nowa reguła
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {TILES.map((tile, index) => (
              <div
                key={tile.label}
                className={`rounded-md border border-line bg-white/[0.02] p-2 sm:p-3 ${
                  index === 2 ? 'hidden sm:block' : ''
                }`}
              >
                <p className="font-mono text-[9px] tracking-[0.08em] text-text-dim uppercase">
                  {tile.label}
                </p>
                <p className="tabular mt-1 flex items-baseline gap-1.5 text-[17px] font-semibold tracking-[-0.03em] text-text sm:text-[20px]">
                  {tile.value}
                  <span className={`font-mono text-[9px] font-normal ${toneText[tile.tone]}`}>
                    {tile.delta}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* wykres */}
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-md border border-line bg-white/[0.02] p-2 sm:p-3">
            <div className="mb-1 flex items-center gap-2">
              <p className="font-mono text-[9px] tracking-[0.08em] text-text-dim uppercase">
                Błędy na minutę
              </p>
              <span className="ml-auto flex items-center gap-1 font-mono text-[9px] text-text-dim">
                <span className="size-1.5 rounded-full bg-accent-2" />
                próg dynamiczny
              </span>
            </div>

            <div className="relative h-[calc(100%-1rem)] min-h-[72px] w-full">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                className="h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="mockup-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6E5BF6" stopOpacity="0.42" />
                    <stop offset="100%" stopColor="#6E5BF6" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="mockup-stroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3BA9F5" />
                    <stop offset="100%" stopColor="#6E5BF6" />
                  </linearGradient>
                </defs>

                {[0.25, 0.5, 0.75].map((ratio) => (
                  <line
                    key={ratio}
                    x1="0"
                    x2={W}
                    y1={H * ratio}
                    y2={H * ratio}
                    stroke="rgb(255 255 255 / 0.06)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}

                <line
                  x1="0"
                  x2={W}
                  y1={py(52)}
                  y2={py(52)}
                  stroke="#3BA9F5"
                  strokeOpacity="0.5"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  vectorEffect="non-scaling-stroke"
                />

                <path d={areaPath} fill="url(#mockup-fill)" />
                <path
                  d={linePath}
                  fill="none"
                  stroke="url(#mockup-stroke)"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />

                <line
                  x1={px(SPIKE)}
                  x2={px(SPIKE)}
                  y1="0"
                  y2={H}
                  stroke="rgb(255 95 87 / 0.45)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* znacznik anomalii — pozycjonowany procentowo, żeby trzymał się skali SVG */}
              <span
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(px(SPIKE) / W) * 100}%`, top: `${(py(134) / H) * 100}%` }}
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-crit opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-crit ring-2 ring-bg-elev" />
                </span>
              </span>
              <span
                className="absolute hidden -translate-x-1/2 rounded-[6px] border border-line bg-bg px-1.5 py-0.5 font-mono text-[9px] whitespace-nowrap text-text-muted sm:block"
                style={{ left: `${(px(SPIKE) / W) * 100}%`, top: '4%' }}
              >
                wydanie 4.18.2
              </span>
            </div>
          </div>

          {/* lista zdarzeń */}
          <ul className="hidden shrink-0 flex-col divide-y divide-line overflow-hidden rounded-md border border-line bg-white/[0.02] lg:flex">
            {INCIDENTS.map((incident) => (
              <li key={incident.title} className="flex items-center gap-3 px-3 py-2.5">
                <span className={`size-1.5 shrink-0 rounded-full ${toneDot[incident.tone]}`} />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-mono text-[10.5px] text-text">
                    {incident.title}
                  </span>
                  <span className="truncate text-[10px] text-text-dim">{incident.where}</span>
                </span>
                <span className="tabular ml-auto shrink-0 font-mono text-[10px] text-text-muted">
                  {incident.count}
                </span>
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white/10 font-mono text-[8.5px] text-text">
                  {incident.who}
                </span>
                <span className="tabular w-12 shrink-0 text-right font-mono text-[10px] text-text-dim">
                  {incident.when}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
