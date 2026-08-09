'use client'

import { useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { LogoMark } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'
import { useLenisControls } from '@/components/providers/SmoothScroll'
import { ScrollTrigger, gsap, useGSAP } from '@/lib/gsap'
import { nav, site } from '@/lib/content'

export function Navbar() {
  const scope = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const lenis = useLenisControls()

  // Stan przyklejony: wyzwalany ScrollTriggerem, nie nasluchem scroll.
  useGSAP(
    () => {
      const header = scope.current
      const bar = header?.querySelector('[data-bar]')
      const inner = header?.querySelector('[data-inner]')
      if (!header || !bar || !inner) return

      // t = 0.00 s sekwencji page-load.
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          header,
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        )
      })

      const tl = gsap
        .timeline({ paused: true })
        .to(bar, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0)
        .to(inner, { height: 56, duration: 0.3, ease: 'power2.out' }, 0)

      const trigger = ScrollTrigger.create({
        start: 'top -60',
        end: 99999,
        onEnter: () => tl.play(),
        onLeaveBack: () => tl.reverse(),
      })

      return () => {
        trigger.kill()
        tl.kill()
        mm.revert()
      }
    },
    { scope },
  )

  // Menu mobilne: wjazd panelu + stagger linkow po 40 ms.
  useGSAP(
    () => {
      const panel = menuRef.current
      if (!panel) return
      const items = panel.querySelectorAll('[data-menu-item]')

      if (open) {
        lenis.stop()
        gsap.set(panel, { display: 'flex' })
        gsap
          .timeline()
          .fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.24, ease: 'power2.out' })
          .fromTo(
            items,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.04 },
            0.06,
          )
      } else {
        lenis.start()
        gsap.to(panel, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => gsap.set(panel, { display: 'none' }),
        })
      }
    },
    { dependencies: [open] },
  )

  return (
    <header ref={scope} className="fixed inset-x-0 top-0 z-50" data-load>
      <div
        data-bar
        aria-hidden="true"
        className="absolute inset-0 border-b border-line opacity-0 backdrop-blur-[16px]"
        style={{ backgroundColor: 'rgb(8 9 11 / 0.72)' }}
      />

      <nav aria-label="Główna" className="shell relative">
        <div data-inner className="flex items-center justify-between" style={{ height: 64 }}>
          <a
            href="#tresc"
            className="flex items-center gap-2.5 text-text"
            aria-label={`${site.name} — strona główna`}
          >
            <LogoMark id="logo-nav" />
            <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.03em]">
              {site.name}
            </span>
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {nav.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="nav-link text-[0.875rem] text-text-muted">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-4 lg:flex">
            <a href={nav.login.href} className="nav-link text-[0.875rem] text-text-muted">
              {nav.login.label}
            </a>
            <Button href={nav.cta.href} variant="primary" size="md">
              {nav.cta.label}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobilne"
            aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
            className="flex size-9 items-center justify-center rounded-md border border-line text-text lg:hidden"
          >
            {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
          </button>
        </div>
      </nav>

      <div
        id="menu-mobilne"
        ref={menuRef}
        className="fixed inset-0 z-40 hidden flex-col bg-bg/95 px-6 pt-24 pb-10 backdrop-blur-xl lg:hidden"
      >
        <ul className="flex flex-col gap-1">
          {nav.links.map((link) => (
            <li key={link.href} data-menu-item>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block border-b border-line py-4 text-h3 text-text"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-3 pt-8" data-menu-item>
          <Button href={nav.cta.href} variant="primary" size="lg" className="w-full">
            {nav.cta.label}
          </Button>
          <Button href={nav.login.href} variant="secondary" size="lg" className="w-full">
            {nav.login.label}
          </Button>
        </div>
      </div>
    </header>
  )
}
