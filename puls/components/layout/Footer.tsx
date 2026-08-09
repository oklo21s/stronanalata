'use client'

import { useRef } from 'react'
import { LogoMark } from '@/components/layout/Logo'
import { gsap, useGSAP } from '@/lib/gsap'
import { footer, site } from '@/lib/content'

export function Footer() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = scope.current
      const wordmark = root?.querySelector('[data-wordmark]')
      if (!root || !wordmark) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          wordmark,
          { y: 40 },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: true,
            },
          },
        )
      })

      return () => mm.revert()
    },
    { scope },
  )

  return (
    <footer ref={scope} className="relative z-10 overflow-hidden pt-20 pb-0">
      <div className="shell relative">
        <div className="grid gap-10 pb-16 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))] lg:gap-8">
          <div className="flex flex-col gap-4">
            <a href="#tresc" className="flex w-fit items-center gap-2.5 text-text">
              <LogoMark id="logo-stopka" />
              <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.03em]">
                {site.name}
              </span>
            </a>
            <p className="max-w-[30ch] text-[0.875rem] text-text-muted">{footer.tagline}</p>
            <p className="mt-2 flex items-center gap-2 font-mono text-[0.6875rem] text-text-dim">
              <span className="size-1.5 rounded-full bg-ok" />
              Wszystkie systemy działają
            </p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
              <h2 className="eyebrow">{column.title}</h2>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="nav-link text-[0.875rem] text-text-muted"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.6875rem] text-text-dim">{footer.legal}</p>
          <p className="font-mono text-[0.6875rem] text-text-dim">
            Zbudowane w Polsce · serwery we Frankfurcie
          </p>
        </div>
      </div>

      {/* Wielki wordmark przycięty dolną krawędzią. */}
      <div aria-hidden="true" className="pointer-events-none relative h-[13vw] overflow-hidden">
        <span
          data-wordmark
          className="absolute inset-x-0 -bottom-[4.2vw] block text-center font-display leading-none font-semibold tracking-[-0.06em] text-white select-none"
          style={{ fontSize: '18vw', opacity: 0.04 }}
        >
          {site.name}
        </span>
      </div>
    </footer>
  )
}
