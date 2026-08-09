'use client'

import type { ReactNode } from 'react'
import { useMagnetic } from '@/hooks/useMagnetic'

type MagneticButtonProps = {
  href: string
  children: ReactNode
  className?: string
  strength?: number
}

/** Otoczka na CTA: link przyciaga sie do kursora w promieniu 80 px. */
export function MagneticButton({
  href,
  children,
  className = '',
  strength = 8,
}: MagneticButtonProps) {
  const ref = useMagnetic<HTMLAnchorElement>({ strength })

  return (
    <a ref={ref} href={href} className={className} data-cursor="grow">
      {children}
    </a>
  )
}
