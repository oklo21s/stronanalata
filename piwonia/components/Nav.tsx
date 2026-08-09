'use client'

import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ScrollTrigger, useGSAP } from '@/lib/gsap'
import { getLenis, scrollToTarget } from '@/lib/lenis-store'
import { cta, navLinks, site } from '@/data/content'
import Ornament from './ui/Ornament'

export default function Nav() {
  const root = useRef<HTMLElement>(null)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  // --- Tlo paska pojawia sie dopiero po zejsciu z hero ------------------------
  useGSAP(
    () => {
      const trigger = ScrollTrigger.create({
        // Hero ma 100svh; przelaczamy sie tuz przed jego koncem.
        start: 'top -80vh',
        onEnter: () => setSolid(true),
        onLeaveBack: () => setSolid(false),
      })
      return () => trigger.kill()
    },
    { scope: root },
  )

  // --- Menu mobilne: blokada scrolla + Escape --------------------------------
  useEffect(() => {
    if (!open) return

    const lenis = getLenis()
    lenis?.stop()
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)

    return () => {
      lenis?.start()
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Kotwice obsluguje Lenis — natywny skok pominalby wygladzanie scrolla.
  const go = (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setOpen(false)
    // Panel mobilny zdejmuje blokade scrolla dopiero w cleanupie efektu,
    // wiec przewijamy w nastepnej klatce.
    requestAnimationFrame(() => scrollToTarget(href))
  }

  return (
    <>
      <header
        ref={root}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500 ${
          solid
            ? 'border-b border-line bg-cream/95 text-ink backdrop-blur-sm'
            : 'border-b border-transparent text-cream'
        }`}
      >
        <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
          <a
            href="#top"
            onClick={go('#top')}
            className="flex items-center gap-3"
            aria-label={`${site.name} — początek strony`}
          >
            <Ornament className={`h-7 w-7 ${solid ? 'text-wine' : 'text-cream'}`} />
            <span className="type-display text-2xl tracking-[0.18em] uppercase md:text-[1.7rem]">
              {site.wordmark}
            </span>
          </a>

          <nav aria-label="Główna" className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={go(link.href)}
                className="link-underline text-xs tracking-[0.16em] uppercase"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${site.phoneHref}`}
              className="tabular hidden text-xs tracking-[0.12em] xl:block"
            >
              {site.phone}
            </a>
            <a
              href={cta.reserveHref}
              onClick={go(cta.reserveHref)}
              className={`btn hidden sm:inline-flex ${solid ? 'btn-solid' : 'btn-ghost-light'}`}
            >
              {cta.reserve}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="p-2 lg:hidden"
              aria-label="Otwórz menu"
              aria-expanded={open}
              aria-controls="menu-mobilne"
            >
              <Menu className="h-6 w-6" strokeWidth={1.25} />
            </button>
          </div>
        </div>
      </header>

      {/* Panel mobilny. Renderowany warunkowo, zeby nie trzymac focusowalnych
          elementow poza ekranem. */}
      {open ? (
        <div
          id="menu-mobilne"
          className="fixed inset-0 z-[60] flex flex-col bg-wine-deep text-cream lg:hidden"
        >
          <div className="shell flex h-16 items-center justify-between md:h-20">
            <span className="type-display text-2xl tracking-[0.18em] uppercase">
              {site.wordmark}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2"
              aria-label="Zamknij menu"
              autoFocus
            >
              <X className="h-6 w-6" strokeWidth={1.25} />
            </button>
          </div>

          <nav aria-label="Główna (mobilna)" className="shell flex flex-1 flex-col justify-center">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={go(link.href)}
                    className="type-display flex items-baseline gap-4 py-3 text-4xl sm:text-5xl"
                  >
                    <span className="tabular text-xs tracking-[0.2em] text-gold">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="shell flex flex-col gap-4 border-t border-line-dark py-8">
            <a href={`tel:${site.phoneHref}`} className="tabular text-lg">
              {site.phone}
            </a>
            <a href={cta.reserveHref} onClick={go(cta.reserveHref)} className="btn btn-ghost-light">
              {cta.reserve}
            </a>
          </div>
        </div>
      ) : null}
    </>
  )
}
