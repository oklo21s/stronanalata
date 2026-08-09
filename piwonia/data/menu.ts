/**
 * Karta. Ceny w zlotych, jako liczby — formatuje je `formatPrice`,
 * zeby nie rozjechaly sie miedzy sekcjami.
 *
 * Znaczniki: 'v' wegetarianskie, 'vg' weganskie, 'gf' bez glutenu,
 * 'sezon' dostepne tylko w danym okresie.
 */

import type { PhotoKey } from './photos'

export type Tag = 'v' | 'vg' | 'gf' | 'sezon'

export type Dish = {
  readonly name: string
  readonly description: string
  readonly price: number
  readonly tags?: readonly Tag[]
  readonly signature?: boolean
}

export type Course = {
  readonly id: string
  readonly title: string
  readonly note: string
  readonly photo: PhotoKey
  readonly dishes: readonly Dish[]
}

export const tagLabels: Record<Tag, string> = {
  v: 'wegetariańskie',
  vg: 'wegańskie',
  gf: 'bez glutenu',
  sezon: 'sezonowe',
}

export const menuIntro = {
  eyebrow: '03 — Karta',
  heading: 'Karta jesienna',
  lead: 'Obowiązuje od 22 września do 20 grudnia. Wszystko, co widzisz, jest robione u nas — poza chlebem, który piecze dla nas piekarnia na Stalowej.',
  seasonNote: 'Karta zimowa wchodzi 21 grudnia',
} as const

export const courses: readonly Course[] = [
  {
    id: 'przystawki',
    title: 'Przystawki',
    note: 'Do dzielenia. Chleb ze smalcem i ogórkiem podajemy od siebie.',
    photo: 'chleb',
    dishes: [
      {
        name: 'Tatar wołowy siekany nożem',
        description: 'polędwica, ogórek małosolny, marynowany borowik, żółtko przepiórcze',
        price: 54,
        signature: true,
      },
      {
        name: 'Śledź w oleju lnianym',
        description: 'pieczony burak, cebula, jabłko, olej tłoczony w Wielkopolsce',
        price: 39,
        tags: ['gf'],
      },
      {
        name: 'Wątróbki drobiowe na maśle',
        description: 'jabłko, majeranek, cebula karmelizowana, grzanka z zakwasu',
        price: 42,
      },
      {
        name: 'Pasztet z gęsi',
        description: 'konfitura z żurawiny, ogórek konserwowy, masło klarowane',
        price: 45,
      },
      {
        name: 'Placki ziemniaczane z kwaśną śmietaną',
        description: 'ziemniak z Mazowsza, cebula, koperek',
        price: 36,
        tags: ['v'],
      },
    ],
  },
  {
    id: 'zupy',
    title: 'Zupy',
    note: 'Wszystkie na własnym wywarze. Rosół gotujemy osiem godzin, bez pośpiechu.',
    photo: 'barszcz',
    dishes: [
      {
        name: 'Rosół z kaczki',
        description: 'domowy makaron, marchew, natka, kropla oleju z orzecha',
        price: 32,
        signature: true,
      },
      {
        name: 'Barszcz czerwony z uszkami',
        description: 'zakwas buraczany, uszka z borowikami, majeranek',
        price: 34,
      },
      {
        name: 'Żurek na zakwasie żytnim',
        description: 'biała kiełbasa, jajko, chrzan, chleb podany osobno',
        price: 36,
      },
      {
        name: 'Krem z pieczonej dyni',
        description: 'olej dyniowy, prażone pestki, imbir',
        price: 31,
        tags: ['v', 'gf'],
      },
      {
        name: 'Chłodnik litewski',
        description: 'młode buraki, ogórek, koperek, jajko — wraca w czerwcu',
        price: 30,
        tags: ['sezon', 'v'],
      },
    ],
  },
  {
    id: 'pierogi',
    title: 'Pierogi i kluski',
    note: 'Ciasto wyrabiamy o szóstej rano. Kiedy się skończą, to się skończą.',
    photo: 'pierogi',
    dishes: [
      {
        name: 'Pierogi ruskie ze skwarkami',
        description: 'twaróg od Piotrowskich, ziemniak, cebula, boczek wędzony',
        price: 42,
        signature: true,
      },
      {
        name: 'Pierogi z kaczką i suszoną śliwką',
        description: 'kaczka z pieca, śliwka węgierka, sos z pieczeni',
        price: 49,
      },
      {
        name: 'Pierogi z borowikami i kapustą',
        description: 'grzyby zbierane pod Ostrołęką, kapusta kiszona u nas',
        price: 47,
        tags: ['v'],
      },
      {
        name: 'Kopytka z masłem szałwiowym',
        description: 'twaróg, szałwia z ogrodu, orzechy laskowe',
        price: 39,
        tags: ['v'],
      },
      {
        name: 'Kluski śląskie z sosem pieczeniowym',
        description: 'sos z policzków wołowych, cebula, pieprz',
        price: 38,
      },
    ],
  },
  {
    id: 'glowne',
    title: 'Dania główne',
    note: 'Kaczka z pieca na drewnie potrzebuje czterech godzin — zamawiaj wcześnie.',
    photo: 'kaczka',
    dishes: [
      {
        name: 'Kaczka pieczona z jabłkami',
        description: 'kasza gryczana, modra kapusta, sos z pieczeni, cztery godziny w piecu',
        price: 89,
        signature: true,
      },
      {
        name: 'Policzki wołowe w ciemnym piwie',
        description: 'purée z selera, korzeń pietruszki, chrzan',
        price: 82,
        tags: ['gf'],
      },
      {
        name: 'Pstrąg z pieca',
        description: 'masło z koperkiem, młode ziemniaki, cytryna',
        price: 76,
        tags: ['gf'],
      },
      {
        name: 'Kotlet schabowy bity',
        description: 'ziemniaki z koperkiem, mizeria, bułka tarta z zakwasu',
        price: 68,
      },
      {
        name: 'Gołąbki w sosie pomidorowym',
        description: 'kapusta z beczki, wieprzowina i wołowina, wędzona papryka',
        price: 58,
      },
      {
        name: 'Warzywa korzeniowe z pieca',
        description: 'soczewica, chrzan, olej lniany, kiszona rzepa',
        price: 54,
        tags: ['vg', 'gf'],
      },
    ],
  },
  {
    id: 'desery',
    title: 'Desery',
    note: 'Ciasta pieczemy rano. Szarlotkę podajemy wyłącznie na ciepło.',
    photo: 'szarlotka',
    dishes: [
      {
        name: 'Szarlotka na ciepło',
        description: 'jabłka szara reneta, cynamon, gałka lodów śmietankowych',
        price: 32,
        tags: ['v'],
        signature: true,
      },
      {
        name: 'Sernik wiedeński',
        description: 'twaróg trzykrotnie mielony, konfitura z wiśni',
        price: 30,
        tags: ['v'],
      },
      {
        name: 'Naleśniki z serem',
        description: 'skórka pomarańczowa, śmietana, cukier puder',
        price: 28,
        tags: ['v'],
      },
      {
        name: 'Kompot z suszu z lodami piernikowymi',
        description: 'śliwka, jabłko, gruszka, goździki',
        price: 26,
        tags: ['v', 'gf'],
      },
    ],
  },
  {
    id: 'napoje',
    title: 'Do picia',
    note: 'Karta win — 60 pozycji, w tym 14 polskich. Pełną listę przynosi kelner.',
    photo: 'wino',
    dishes: [
      {
        name: 'Wino domu, kieliszek',
        description: 'białe: riesling z Mozeli / czerwone: blaufränkisch z Burgenlandu',
        price: 24,
      },
      {
        name: 'Wino z polskiej winnicy, kieliszek',
        description: 'solaris, regent albo rondo — zależnie od rocznika',
        price: 29,
      },
      {
        name: 'Nalewki domowe',
        description: 'pigwówka, orzechówka, wiśniówka — 40 ml',
        price: 18,
      },
      {
        name: 'Kwas chlebowy z beczki',
        description: 'nasz, z chleba z poprzedniego dnia',
        price: 16,
        tags: ['vg'],
      },
      {
        name: 'Lemoniada z melisy',
        description: 'melisa, cytryna, miód gryczany',
        price: 14,
        tags: ['v', 'gf'],
      },
      {
        name: 'Kompot z owoców sezonowych',
        description: 'gotowany rano, bez cukru',
        price: 12,
        tags: ['vg', 'gf'],
      },
    ],
  },
]

export const setMenus = [
  {
    id: 'stol',
    name: 'Stół Marianny',
    subtitle: 'sześć dań, dwie godziny',
    description:
      'Kolacja układana przez szefową w dniu wizyty, z tego, co przyszło rano. Podajemy dla całego stolika, od 18:00.',
    price: 189,
    unit: 'od osoby',
    extra: { label: 'z parowaniem win', price: 289 },
    highlight: true,
  },
  {
    id: 'lunch',
    name: 'Lunch',
    subtitle: 'wtorek – piątek, 13:00 – 16:00',
    description: 'Zupa dnia i danie główne z tablicy. Bez rezerwacji, dopóki są miejsca.',
    price: 59,
    unit: 'komplet',
    highlight: false,
  },
] as const

/** 89 → „89 zł". Twarda spacja, żeby cena nie łamała się na końcu linii. */
export function formatPrice(value: number): string {
  return `${value} zł`
}
