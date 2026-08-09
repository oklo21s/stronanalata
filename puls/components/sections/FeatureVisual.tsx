import type { FeatureRow } from '@/lib/content'

type Props = { kind: FeatureRow['visual']; state: 'before' | 'after' }

const shell =
  'inset-top-highlight absolute inset-0 flex flex-col gap-3 overflow-hidden rounded-lg border border-line bg-bg-elev p-4 sm:p-5'

/**
 * Każdy wiersz ma dwa stany tej samej sceny: „przed" i „po".
 * Crossfade między nimi jest sterowany scrollem — to jest ta funkcja,
 * o której mówi nagłówek wiersza, pokazana zamiast opisana.
 */
export function FeatureVisual({ kind, state }: Props) {
  if (kind === 'trace') {
    return state === 'before' ? (
      <div className={shell}>
        <Header title="Stos wywołań" tag="z przeglądarki" />
        <pre className="overflow-hidden font-mono text-[10.5px] leading-[1.9] text-text-dim">
          {`TypeError: cannot read properties of undefined
  at r (main-4f2a9c.js:1:88204)
  at o (main-4f2a9c.js:1:88461)
  at t.n (vendor-71bd.js:2:19077)
  at i.dispatch (vendor-71bd.js:2:41155)
  at Object.Ne (main-4f2a9c.js:1:12903)
  at HTMLButtonElement.<anonymous>`}
        </pre>
        <p className="mt-auto flex items-center gap-2 rounded-md border border-line bg-white/[0.02] px-3 py-2 font-mono text-[10px] text-text-dim">
          <span className="size-1.5 shrink-0 rounded-full bg-warn" />
          sześć ramek, zero nazw z Twojego kodu
        </p>
      </div>
    ) : (
      <div className={shell}>
        <Header title="Stos wywołań" tag="po mapach źródeł" tone="ok" />
        <pre className="overflow-hidden font-mono text-[10.5px] leading-[1.9] text-text-muted">
          {`TypeError: cannot read properties of undefined
  at policzRabat (`}
          <span className="text-text">src/koszyk/rabaty.ts:118</span>
          {`)
  at podsumujKoszyk (src/koszyk/index.ts:44)
  at PrzyciskZaplac.onClick (src/ui/Zaplac.tsx:31)`}
        </pre>

        <div className="rounded-md border border-line bg-black/30 p-2.5">
          <p className="mb-1.5 font-mono text-[9px] tracking-[0.08em] text-text-dim uppercase">
            zmienne w ramce 118
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-[10px]">
            <dt className="text-text-dim">kupon</dt>
            <dd className="text-crit">undefined</dd>
            <dt className="text-text-dim">wartoscKoszyka</dt>
            <dd className="text-text-muted">248.90</dd>
            <dt className="text-text-dim">wydanie</dt>
            <dd className="text-text-muted">4.18.2</dd>
          </dl>
        </div>

        <div className="mt-auto flex items-center gap-2 rounded-md border border-line bg-white/[0.02] px-3 py-2">
          <span className="grid size-5 place-items-center rounded-full bg-white/10 font-mono text-[8.5px]">
            KD
          </span>
          <span className="text-[11px] text-text-muted">
            ostatnia zmiana linii 118 — <span className="text-text">a91f3c2</span>, 3 dni temu
          </span>
        </div>
      </div>
    )
  }

  if (kind === 'routing') {
    return state === 'before' ? (
      <div className={shell}>
        <Header title="#alerty-produkcja" tag="14:02–14:04" />
        <ul className="flex flex-col gap-1 overflow-hidden font-mono text-[10px] text-text-dim">
          {Array.from({ length: 8 }).map((_, index) => (
            <li
              key={index}
              className="flex items-center gap-2 rounded-[6px] bg-white/[0.02] px-2 py-1"
              style={{ opacity: 1 - index * 0.09 }}
            >
              <span className="size-1.5 shrink-0 rounded-full bg-crit/60" />
              <span className="truncate">[ALERT] TypeError w koszyk-web</span>
            </li>
          ))}
        </ul>
        <p className="mt-auto font-mono text-[10px] text-warn">kanał wyciszony przez 6 osób</p>
      </div>
    ) : (
      <div className={shell}>
        <Header title="Kierowanie zdarzenia" tag="reguła: płatności" tone="ok" />
        <div className="flex flex-col gap-2 text-[11px]">
          <Route label="usługa" value="platnosci-api" />
          <Route label="środowisko" value="produkcja" />
          <Route label="waga" value="krytyczna" tone />
          <Route label="kanał" value="telefon → SMS → Slack" />
        </div>

        <ol className="flex flex-col gap-1.5 font-mono text-[10px] text-text-dim">
          <li className="flex items-center gap-2">
            <span className="tabular w-9 shrink-0 text-right">14:02</span>
            <span className="size-1 rounded-full bg-text-dim" />
            zdarzenie przyjęte
          </li>
          <li className="flex items-center gap-2">
            <span className="tabular w-9 shrink-0 text-right">14:02</span>
            <span className="size-1 rounded-full bg-accent-2" />
            dopasowano regułę „płatności”
          </li>
          <li className="flex items-center gap-2 text-ok">
            <span className="tabular w-9 shrink-0 text-right">14:03</span>
            <span className="size-1 rounded-full bg-ok" />
            potwierdzone, bez eskalacji
          </li>
        </ol>

        <div className="mt-auto flex items-center gap-2.5 rounded-md border border-accent/40 bg-accent-soft px-3 py-2.5">
          <span className="grid size-6 place-items-center rounded-full bg-white/15 font-mono text-[9px]">
            TW
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[11px] text-text">Tomasz W. — dyżur do 08:00</span>
            <span className="font-mono text-[9.5px] text-text-muted">
              telefon · potwierdzono w 41 s
            </span>
          </span>
        </div>
      </div>
    )
  }

  return state === 'before' ? (
    <div className={shell}>
      <Header title="p99 czasu odpowiedzi" tag="7 dni" />
      <div className="flex flex-1 items-end gap-[3px]">
        {[38, 52, 44, 61, 49, 73, 58, 66, 42, 80, 55, 47, 69, 51, 63, 45, 77, 59, 40, 68].map(
          (value, index) => (
            <span
              key={index}
              className="flex-1 rounded-t-[2px] bg-white/12"
              style={{ height: `${value}%` }}
            />
          ),
        )}
      </div>
      <p className="font-mono text-[10px] text-text-dim">i co z tego wynika?</p>
    </div>
  ) : (
    <div className={shell}>
      <Header title="Budżet błędów — sierpień" tag="cel 99,9%" tone="ok" />
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="tabular text-[2rem] leading-none font-semibold tracking-[-0.03em] text-text">
            78%
          </span>
          <span className="font-mono text-[10px] text-text-dim">pozostało do 31.08</span>
        </div>
        <div className="h-2 overflow-hidden rounded-[999px] bg-white/8">
          <span
            className="block h-full rounded-[999px] bg-gradient-to-r from-accent-2 to-accent"
            style={{ width: '78%' }}
          />
        </div>
      </div>
      <ul className="mt-auto flex flex-col gap-1.5 font-mono text-[10px] text-text-muted">
        <li className="flex justify-between">
          <span>koszyk-web</span>
          <span className="text-ok">99,97%</span>
        </li>
        <li className="flex justify-between">
          <span>platnosci-api</span>
          <span className="text-warn">99,88%</span>
        </li>
        <li className="flex justify-between">
          <span>webhooks</span>
          <span className="text-ok">99,99%</span>
        </li>
      </ul>
    </div>
  )
}

function Header({ title, tag, tone }: { title: string; tag: string; tone?: 'ok' }) {
  return (
    <div className="flex items-center gap-2 border-b border-line pb-2.5">
      <span className={`size-1.5 rounded-full ${tone === 'ok' ? 'bg-ok' : 'bg-text-dim'}`} />
      <span className="text-[11px] font-medium text-text">{title}</span>
      <span className="ml-auto font-mono text-[9.5px] tracking-[0.06em] text-text-dim uppercase">
        {tag}
      </span>
    </div>
  )
}

function Route({ label, value, tone }: { label: string; value: string; tone?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-[8px] border border-line bg-white/[0.02] px-2.5 py-1.5">
      <span className="font-mono text-[9.5px] tracking-[0.06em] text-text-dim uppercase">
        {label}
      </span>
      <span className={`ml-auto font-mono text-[10.5px] ${tone ? 'text-crit' : 'text-text'}`}>
        {value}
      </span>
    </div>
  )
}
