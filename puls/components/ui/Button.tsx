import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-[999px] font-medium whitespace-nowrap ' +
  'transition-[transform,background-color,border-color,filter] duration-[120ms] ease-out ' +
  'will-change-transform active:scale-[0.98]'

const variants: Record<Variant, string> = {
  primary: 'bg-cta text-cta-text hover:brightness-105 hover:scale-[1.02] shadow-[0_1px_0_rgb(255_255_255/0.4)_inset]',
  secondary:
    'border border-line-strong bg-white/[0.02] text-text hover:bg-surface-hover hover:border-white/25',
  ghost: 'text-text-muted hover:text-text',
}

const sizes: Record<Size, string> = {
  md: 'h-9 px-4 text-[0.875rem]',
  lg: 'h-11 px-5 text-[0.9375rem]',
}

type ButtonProps = {
  href: string
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
}

export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: ButtonProps) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      data-cursor="grow"
    >
      {children}
    </a>
  )
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md') =>
  `${base} ${variants[variant]} ${sizes[size]}`
