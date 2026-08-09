/*
  Cała treść strony w jednym miejscu.

  UWAGA: Osada pod Granią jest marką fikcyjną, zbudowaną na potrzeby tej
  realizacji. Nazwy, ceny, metraże i dane kontaktowe są przykładowe i przed
  wdrożeniem u realnego klienta muszą zostać podmienione na potwierdzone.
*/

export const MARKA = {
  fragmenty: ['Osada', 'pod', 'Granią'],
  pelna: 'Osada pod Granią',
  telefon: '33 867 41 20',
  telefonLink: '+48338674120',
  email: 'rezerwacje@osadapodgrania.pl',
  lokalizacja: 'Beskid Żywiecki',
}

export const NAWIGACJA = [
  { etykieta: 'Domki', kotwica: '#domki' },
  { etykieta: 'Udogodnienia', kotwica: '#udogodnienia' },
  { etykieta: 'Kontakt', kotwica: '#rezerwacja' },
]

/** Jedna intencja, jedna etykieta - ten sam napis w nawigacji, hero i stopce. */
export const CTA_GLOWNE = 'Sprawdź terminy'

export const HERO = {
  opis:
    'Sześć domów z drewna i szkła na wysokości 940 m. Beskid Żywiecki, dwie godziny drogi od Krakowa.',
  ctaDrugie: 'Zobacz domki',
}

export const PRZEJSCIE = {
  naglowek: 'Po zmroku zostaje samo niebo',
  opis:
    'Osada gasi światła zewnętrzne o dwudziestej drugiej. Od tej godziny nad graniami widać Drogę Mleczną gołym okiem.',
}

export const UDOGODNIENIA = [
  {
    id: 'balia',
    ksztalt: 'balia',
    naglowek: 'Balia i sauna przy każdym domku',
    opis:
      'Balia grzana drewnem stoi na tarasie, sauna mieści sześć osób. Palimy przed Waszym przyjazdem, jeśli dacie znać dzień wcześniej.',
    etykietaObiektu: 'Uproszczony model balii z drewnianą obręczą',
  },
  {
    id: 'szlaki',
    ksztalt: 'grzbiet',
    naglowek: 'Szlaki zaczynają się za bramą',
    opis:
      'Żółty na Halę Miziową odbija 300 metrów od osady. Zimą podwozimy do wyciągu busem, dwa kursy rano i dwa po południu.',
    etykietaObiektu: 'Uproszczony model trzech szczytów tworzących grań',
  },
  {
    id: 'niebo',
    ksztalt: 'niebo',
    naglowek: 'Niebo bez łuny miasta',
    opis:
      'Najbliższe uliczne latarnie świecą siedem kilometrów niżej. Na tarasie widokowym stoi teleskop, obsługi uczymy w pięć minut.',
    etykietaObiektu: 'Kopuła nieba jako siatka krawędzi ze świecącym punktem',
  },
]

/*
  TODO PRZED WDROŻENIEM: zdjęcia są tymczasowe. To fotografie z Unsplash,
  ładowane z zewnętrznego CDN-u, dobrane tematycznie (drewniany dom w górach),
  ale nieprzedstawiające realnych obiektów klienta.

  Do podmiany na własne zdjęcia osady: kadr główny 4:5, dwa pozostałe 4:3.
  Pliki przenieść do `public/zdjecia/` - wtedy strona przestaje odpytywać
  obcy host, co jest też lepsze dla LCP i dla prywatności odwiedzających.
*/
const KADR = (id, w, h) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=75`

export const DOMKI = [
  {
    id: 'jodla',
    nazwa: 'Jodła',
    osoby: '2',
    metraz: '38 m²',
    cena: 'od 690 zł',
    opis: 'Jedna sypialnia z widokiem na grań, kominek i taras od południa.',
    zdjecie: KADR('1475087542963-13ab5e611954', 1200, 1500),
    szerokosc: 1200,
    wysokosc: 1500,
    alt: 'Drewniany domek u podnóża górskiego zbocza',
  },
  {
    id: 'limba',
    nazwa: 'Limba',
    osoby: '4',
    metraz: '56 m²',
    cena: 'od 890 zł',
    opis: 'Dwie sypialnie, otwarta kuchnia, balia na tarasie i miejsce na ognisko.',
    zdjecie: KADR('1609349093648-51d2ceb5a72a', 1000, 750),
    szerokosc: 1000,
    wysokosc: 750,
    alt: 'Drewniany dom na hali, w tle ośnieżony grzbiet',
  },
  {
    id: 'kosodrzewina',
    nazwa: 'Kosodrzewina',
    osoby: '6',
    metraz: '74 m²',
    cena: 'od 1180 zł',
    opis: 'Trzy sypialnie, dwie łazienki i sauna w osobnym budynku obok.',
    zdjecie: KADR('1531057228999-37933ba12c52', 1000, 750),
    szerokosc: 1000,
    wysokosc: 750,
    alt: 'Drewniany dom otoczony świerkowym lasem',
  },
]

export const REZERWACJA = {
  naglowek: 'Napiszcie, sprawdzimy terminy',
  opis:
    'Odpowiadamy tego samego dnia do dwudziestej. Zapytanie nie jest rezerwacją, wolny termin potwierdzamy mailem.',
}
