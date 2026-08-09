'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Cienka linia postepu na gorze okna.
 *
 * Przy pelnym ruchu wartosc idzie przez spreżyne, zeby pasek nie drgal razem
 * z inercyjnym przewijaniem Lenisa. Przy ograniczonym ruchu bierzemy surowa
 * pozycje — pasek nadal dziala jako wskaznik, tylko bez wygladzania,
 * bo to ono jest tu ruchem dodanym ponad to, co robi przegladarka.
 */
export function PasekPostepu() {
  const { scrollYProgress } = useScroll();
  const ruchOgraniczony = usePrefersReducedMotion();

  const wygladzony = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX: ruchOgraniczony ? scrollYProgress : wygladzony }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-lipa"
      aria-hidden
    />
  );
}
