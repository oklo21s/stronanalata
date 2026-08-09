'use client'

import { useSyncExternalStore } from 'react'

/** Ten sam prog co Tailwindowy `md`, minus 0.02px na zaokraglenia. */
const QUERY = '(max-width: 767.98px)'

function subscribe(callback: () => void): () => void {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}
