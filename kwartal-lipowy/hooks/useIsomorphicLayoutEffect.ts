'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * useLayoutEffect odpala sie przed paintem, wiec GSAP zdazy ustawic stan
 * poczatkowy zanim przegladarka cokolwiek narysuje — bez tego elementy
 * animowane przez gsap.from() mrugaja.
 *
 * Na serwerze useLayoutEffect nie istnieje i React wypisuje ostrzezenie,
 * dlatego przy renderze SSR schodzimy na useEffect (i tak sie nie wykona).
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
