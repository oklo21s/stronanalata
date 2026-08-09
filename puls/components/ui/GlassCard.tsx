import type { ReactNode } from 'react'

type GlassCardProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'li'
}

export function GlassCard({ children, className = '', as: Tag = 'div' }: GlassCardProps) {
  return (
    <Tag
      className={`relative overflow-hidden rounded-lg border border-line bg-surface backdrop-blur-md transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-line-strong ${className}`}
    >
      {children}
    </Tag>
  )
}
