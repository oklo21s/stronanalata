type LogoProps = {
  /** Gradient potrzebuje unikalnego id — komponent bywa na stronie kilka razy. */
  id: string
  className?: string
}

export function LogoMark({ id, className = '' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect x="1" y="1" width="22" height="22" rx="7" stroke={`url(#${id})`} strokeWidth="1.5" />
      <path
        d="M5 12.4h2.6l1.8-4.6 2.7 9.2 1.9-4.6H19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6E5BF6" />
          <stop offset="1" stopColor="#3BA9F5" />
        </linearGradient>
      </defs>
    </svg>
  )
}
