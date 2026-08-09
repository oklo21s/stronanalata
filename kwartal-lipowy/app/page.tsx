import { Hero } from '@/components/sections/Hero';
import { Oferta } from '@/components/sections/Oferta';
import { Proces } from '@/components/sections/Proces';
import { Galeria } from '@/components/sections/Galeria';
import { Statystyki } from '@/components/sections/Statystyki';
import { Opinie } from '@/components/sections/Opinie';
import { Kontakt } from '@/components/sections/Kontakt';

export default function Strona() {
  return (
    <>
      <Hero />
      <Oferta />
      <Proces />
      <Galeria />
      <Statystyki />
      <Opinie />
      <Kontakt />
    </>
  );
}
