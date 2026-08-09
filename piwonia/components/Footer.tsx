import { contact, footer, hours, site } from '@/data/content'
import { photos } from '@/data/photos'
import Reveal from './ui/Reveal'
import Ornament from './ui/Ornament'

/** Autorzy zdjec, bez powtorzen — Unsplash prosi o podpis tam, gdzie to mozliwe. */
const credits = Array.from(
  new Map(Object.values(photos).map((photo) => [photo.credit.author, photo.credit])).values(),
).sort((a, b) => a.author.localeCompare(b.author, 'pl'))

export default function Footer() {
  return (
    <footer id="kontakt" className="bg-wine-deep pt-24 pb-10 text-cream md:pt-32">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-[var(--gutter)]">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-cream/60">{contact.eyebrow}</p>
              <h2 className="type-display type-h2 mt-5">{contact.heading}</h2>
              <address className="mt-6 text-lg not-italic">
                {site.street}
                <br />
                {site.postal}
                <br />
                <span className="text-cream/60">{site.district}</span>
              </address>
              <a
                href={contact.mapHref}
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline mt-6 inline-block text-xs tracking-[0.16em] uppercase"
              >
                {contact.mapLabel}
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-3">
            <Reveal>
              <h3 className="eyebrow text-cream/60">Dojazd</h3>
              <dl className="mt-5 flex flex-col gap-4 text-sm">
                {contact.directions.map((row) => (
                  <div key={row.label}>
                    <dt className="text-xs tracking-[0.14em] text-cream/50 uppercase">
                      {row.label}
                    </dt>
                    <dd className="mt-1">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <Reveal>
              <h3 className="eyebrow text-cream/60">Godziny</h3>
              <dl className="mt-5 flex flex-col gap-2 text-sm">
                {hours.map((row) => (
                  <div key={row.days} className="flex items-baseline justify-between gap-4">
                    <dt className="text-cream/80">{row.days}</dt>
                    <dd className={`tabular ${row.closed ? 'text-cream/40' : ''}`}>{row.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-col gap-2">
                <a href={`tel:${site.phoneHref}`} className="link-underline tabular w-fit">
                  {site.phone}
                </a>
                <a href={`mailto:${site.email}`} className="link-underline w-fit">
                  {site.email}
                </a>
              </div>

              <ul className="mt-8 flex gap-6">
                {contact.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-underline text-xs tracking-[0.16em] uppercase"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* Wordmark przyciety dolna krawedzia — domkniecie strony. */}
        <div className="mt-20 overflow-hidden md:mt-28">
          <p
            aria-hidden="true"
            className="type-display translate-y-[0.18em] text-center leading-[0.8] tracking-[0.04em] text-cream/90 uppercase"
            style={{ fontSize: 'clamp(4rem, 18vw, 17rem)' }}
          >
            {site.wordmark}
          </p>
        </div>

        <div className="rule-dark mt-10" />

        <div className="flex flex-col gap-6 pt-8 text-xs text-cream/50 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-1">
            <p>{footer.legal}</p>
            <p>{footer.company}</p>
            <p className="text-cream/35">{footer.credit}</p>
          </div>

          <ul className="flex gap-6">
            {footer.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="link-underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <details className="max-w-sm">
            <summary className="cursor-pointer list-none">
              <span className="link-underline">{footer.photoCredit}</span>
            </summary>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-cream/40">
              {credits.map((credit) => (
                <li key={credit.author}>
                  <a href={credit.href} target="_blank" rel="noreferrer noopener">
                    {credit.author}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          <Ornament className="h-8 w-8 shrink-0 text-cream/30" />
        </div>
      </div>
    </footer>
  )
}
