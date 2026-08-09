/**
 * Znak firmowy: uproszczona piwonia. Uzywany jako separator sekcji
 * i jako favicon (app/icon.svg trzyma te sama sciezke).
 */
export default function Ornament({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M24 30c-6 0-10-3.4-10-8s4-8.6 10-8.6S34 17.4 34 22s-4 8-10 8Z" />
      <path d="M24 30c-3.4 0-5.8-2.6-5.8-6.2S20.6 17 24 17s5.8 3.2 5.8 6.8S27.4 30 24 30Z" />
      <path d="M24 26.4c-1.5 0-2.6-1.4-2.6-3.2s1.1-3.2 2.6-3.2 2.6 1.4 2.6 3.2-1.1 3.2-2.6 3.2Z" />
      <path d="M24 30v10" />
      <path d="M24 36c-2.6-.4-4.4-2-5-4.4 2.6-.3 4.4.9 5 4.4Z" />
      <path d="M24 39.4c2.6-.4 4.4-2 5-4.4-2.6-.3-4.4.9-5 4.4Z" />
    </svg>
  )
}
