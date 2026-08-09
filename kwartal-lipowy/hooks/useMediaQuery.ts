'use client';

import { useEffect, useState } from 'react';

/**
 * Zawsze startuje od `false`, tak jak render serwerowy — dopiero efekt po
 * hydratacji podstawia prawdziwa odpowiedz. Odwrotna kolejnosc dawalaby
 * rozjazd HTML-a z serwera i klienta.
 */
export function useMediaQuery(zapytanie: string): boolean {
  const [pasuje, setPasuje] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(zapytanie);
    setPasuje(mq.matches);

    const przyZmianie = (e: MediaQueryListEvent) => setPasuje(e.matches);
    mq.addEventListener('change', przyZmianie);
    return () => mq.removeEventListener('change', przyZmianie);
  }, [zapytanie]);

  return pasuje;
}
