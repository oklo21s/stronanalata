/** Siatka 64 px wygaszona radialna maska. Statyczna, bez JS. */
export function GridOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgb(255 255 255 / 0.025) 1px, transparent 1px),' +
          'linear-gradient(to bottom, rgb(255 255 255 / 0.025) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, #000 40%, transparent 75%)',
        maskImage: 'radial-gradient(ellipse at 50% 0%, #000 40%, transparent 75%)',
      }}
    />
  )
}
