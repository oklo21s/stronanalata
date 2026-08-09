import { ArrowRight } from 'lucide-react'

type BadgeProps = {
  href: string
  children: string
  className?: string
}

/** Pigulka ogloszeniowa nad H1. Strzalka przesuwa sie o 3 px na hover. */
export function Badge({ href, children, className = '' }: BadgeProps) {
  return (
    <a
      href={href}
      data-cursor="grow"
      className={`group inline-flex items-center gap-2 rounded-[999px] border border-line bg-surface py-1.5 pr-3 pl-2 text-[0.8125rem] text-text-muted backdrop-blur-md transition-colors duration-200 hover:border-line-strong hover:text-text ${className}`}
    >
      <span className="relative flex size-1.5 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
        <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
      </span>
      {children}
      <ArrowRight
        aria-hidden="true"
        className="size-3.5 shrink-0 transition-transform duration-150 ease-out group-hover:translate-x-[3px]"
      />
    </a>
  )
}
