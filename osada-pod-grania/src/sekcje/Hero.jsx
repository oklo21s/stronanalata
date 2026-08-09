import { forwardRef } from 'react'
import { ArrowDown, ArrowRight } from '@phosphor-icons/react'
import { MARKA, HERO, CTA_GLOWNE } from '../dane'

/*
  Warstwa tekstowa hero. Leży nad kanwą, w akcie ciepłym niebo jest jasne,
  więc cała typografia jest pisana atramentem `noc` - kontrast na jasnym
  kremie wychodzi znacznie powyżej progu AA.

  Nazwa marki jest rozbita na trzy fragmenty rozstawione na szerokość ekranu;
  `justify-between` robi tu robotę, którą inaczej trzeba by liczyć ręcznie.
*/
export const Hero = forwardRef(function Hero({ wStrefie = true }, ref) {
  return (
    <div
      ref={ref}
      className={
        wStrefie
          ? 'absolute inset-0 z-10 flex flex-col justify-between pt-24 pb-8'
          : 'relative z-10 flex min-h-[100dvh] flex-col justify-between pt-24 pb-8'
      }
    >
      <h1 className="sr-only">
        {MARKA.pelna}. Domki wypoczynkowe w Beskidzie Żywieckim.
      </h1>

      {/*
        Dwie kremowe zasłony, u góry i u dołu kadru. Bez nich kontrast ciemnej
        typografii zależałby od tego, czy akurat wypadnie na chmurze, czy na
        ciemnym zboczu. Z nimi jest policzalny w każdym położeniu kamery.
        Obie leżą wewnątrz hero, więc znikają razem z nim przy przejściu w noc.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32%] bg-gradient-to-b from-kremowa/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[46%] bg-gradient-to-t from-kremowa/90 via-kremowa/55 to-transparent"
      />

      <div
        aria-hidden="true"
        className="tytul-wyswietlany flex w-full items-baseline justify-between px-5 text-noc uppercase md:px-10"
      >
        <span className="text-[clamp(1.35rem,6.2vw,5.2rem)] tracking-[0.22em] md:tracking-[0.3em]">
          {MARKA.fragmenty[0]}
        </span>
        <span className="text-[clamp(0.8rem,2.6vw,2.1rem)] tracking-[0.3em] opacity-65">
          {MARKA.fragmenty[1]}
        </span>
        <span className="-mr-[0.22em] text-[clamp(1.35rem,6.2vw,5.2rem)] tracking-[0.22em] md:-mr-[0.3em] md:tracking-[0.3em]">
          {MARKA.fragmenty[2]}
        </span>
      </div>

      <div className="px-5 md:px-10">
        <p className="max-w-[34ch] text-[15px] leading-relaxed text-noc/80 md:text-base">
          {HERO.opis}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href="#rezerwacja"
            className="group inline-flex items-center gap-2.5 bg-zloto px-7 py-3.5 text-sm font-medium whitespace-nowrap text-noc transition-colors duration-300 hover:bg-zar hover:text-kremowa active:translate-y-px"
          >
            {CTA_GLOWNE}
            <ArrowRight
              size={16}
              weight="light"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
          <a
            href="#domki"
            className="inline-flex items-center border border-noc/35 bg-kremowa/35 px-7 py-3.5 text-sm font-medium whitespace-nowrap text-noc backdrop-blur-sm transition-colors duration-300 hover:bg-kremowa/70 active:translate-y-px"
          >
            {HERO.ctaDrugie}
          </a>
        </div>

        <div className="mt-10 flex justify-center md:mt-8">
          <ArrowDown size={20} weight="light" className="tetno text-noc" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
})
