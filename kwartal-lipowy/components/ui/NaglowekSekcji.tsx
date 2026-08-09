import { SlowaZMaska } from '@/components/ui/SlowaZMaska';

type Props = {
  nadtytul: string;
  tytul: string;
  lead?: string;
  jasny?: boolean;
  wyrownanie?: 'lewo' | 'srodek';
};

export function NaglowekSekcji({
  nadtytul,
  tytul,
  lead,
  jasny = false,
  wyrownanie = 'lewo',
}: Props) {
  return (
    <div
      className={`${wyrownanie === 'srodek' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}
      data-naglowek
    >
      <p data-naglowek-nad className={`nadtytul ${jasny ? 'text-kosc/50' : ''}`}>
        {nadtytul}
      </p>

      {/* Tytul jedzie slowo po slowie spod maski — animacja siedzi
          w lib/animacje.ts, tutaj zostaje sam podzial. */}
      <SlowaZMaska
        jako="h2"
        tekst={tytul}
        className={`mt-5 font-display text-sekcja ${jasny ? 'text-kosc' : 'text-grafit'}`}
      />

      {lead && (
        <p
          data-naglowek-lead
          className={`mt-6 text-lead ${jasny ? 'text-kosc/65' : 'text-wegiel/70'}`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
