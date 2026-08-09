/**
 * Cala tresc strony w jednym miejscu. W JSX nie ma zadnego zdania na sztywno —
 * korekta tekstu nie wymaga dotykania komponentow.
 *
 * PIWONIA jest marka fikcyjna, stworzona na potrzeby tego projektu.
 * Adres, telefon, NIP i nazwiska sa przykladowe — przed wdrozeniem
 * podmienia je dane klienta.
 */

import type { PhotoKey } from './photos'

export const site = {
  name: 'Piwonia',
  wordmark: 'Piwonia',
  tagline: 'Restauracja',
  kicker: 'Kuchnia polska od 2009 roku',
  city: 'Warszawa',
  timeZone: 'Europe/Warsaw',
  street: 'ul. Freta 21',
  postal: '00-227 Warszawa',
  district: 'Nowe Miasto',
  phone: '+48 22 831 44 20',
  phoneHref: '+48228314420',
  email: 'rezerwacje@piwonia.pl',
  eventsEmail: 'przyjecia@piwonia.pl',
  url: 'https://piwonia.pl',
  seats: 46,
  description:
    'Piwonia — restauracja kuchni polskiej na warszawskim Nowym Mieście. Karta pisana od nowa co sezon, pierogi lepione codziennie rano, kaczka z pieca. Rezerwacja stolika online.',
} as const

/**
 * Godziny otwarcia. `schema` to ten sam wiersz w formacie schema.org —
 * dzieki temu JSON-LD w layoucie czyta z tego samego zrodla co stopka
 * i nie da sie zmienic godzin w jednym miejscu, a zapomniec o drugim.
 */
export const hours = [
  { days: 'poniedziałek', value: 'nieczynne', closed: true, schema: null },
  { days: 'wtorek – czwartek', value: '13:00 – 22:00', closed: false, schema: 'Tu-Th 13:00-22:00' },
  { days: 'piątek – sobota', value: '13:00 – 23:00', closed: false, schema: 'Fr-Sa 13:00-23:00' },
  { days: 'niedziela', value: '12:00 – 20:00', closed: false, schema: 'Su 12:00-20:00' },
] as const

export const navLinks = [
  { label: 'Kuchnia', href: '#kuchnia' },
  { label: 'Karta', href: '#karta' },
  { label: 'Szefowa', href: '#szefowa' },
  { label: 'Przyjęcia', href: '#przyjecia' },
  { label: 'Kontakt', href: '#kontakt' },
] as const

export const cta = {
  reserve: 'Zarezerwuj stolik',
  reserveHref: '#rezerwacja',
  menu: 'Zobacz kartę',
  menuHref: '#karta',
} as const

export const hero = {
  /** Trzy linie nagłówka — SplitText rozbija je na maski. */
  lines: ['Kuchnia,', 'która pamięta,', 'skąd jest'],
  eyebrow: 'Nowe Miasto, Warszawa — od 2009',
  intro:
    'Rosół gotowany osiem godzin. Pierogi lepione o szóstej rano. Kaczka z Kurpi, grzyby z lasu pod Ostrołęką. Nic z hurtowni, nic na skróty.',
  scrollLabel: 'Przewiń',
  photo: 'sala-glowna' satisfies PhotoKey,
  facts: [
    { value: '2009', label: 'Rok otwarcia' },
    { value: '46', label: 'Miejsc na sali' },
    { value: '4', label: 'Karty w roku' },
  ],
} as const

export const manifest = {
  eyebrow: '01 — Zaczęło się od jednego stołu',
  heading: 'Gotujemy tak, jak się je w domu. Tylko lepiej.',
  /** Odsłaniany słowo po słowie przy scrollu. */
  body:
    'Piwonia zaczęła się w 2009 roku od czterech stołów i jednego pieca. Dziś stołów jest czternaście, ' +
    'piec ten sam. Nie gonimy za gwiazdkami i nie udajemy, że wymyśliliśmy polską kuchnię od nowa — ' +
    'ona była tu przed nami. Naszą robotą jest podać ją tak, żeby ktoś przy stole powiedział: ' +
    '„u babci było dokładnie takie".',
  signature: 'Marianna Rogalska',
  signatureRole: 'szefowa kuchni i właścicielka',
  photo: 'stol-kwiaty' satisfies PhotoKey,
  caption: 'Sala od strony okna, wtorkowe popołudnie',
} as const

export const pillars = {
  eyebrow: '02 — Cztery rzeczy, których nie odpuszczamy',
  heading: 'Cztery zasady',
  items: [
    {
      no: '01',
      title: 'Sezon',
      body: 'Karta zmienia się cztery razy w roku, bo tyle mamy pór roku. W lipcu nie ma dyni, w styczniu nie ma szparagów. Tak po prostu jest.',
      photo: 'grzyby' satisfies PhotoKey,
    },
    {
      no: '02',
      title: 'Ręka',
      body: 'Ciasto na pierogi wyrabiamy rano, każdego dnia od nowa. Maszyny są szybsze, ale ciasto z maszyny poznasz od razu — jest gładkie i głupie.',
      photo: 'ciasto' satisfies PhotoKey,
    },
    {
      no: '03',
      title: 'Ogień',
      body: 'Kaczkę pieczemy w piecu opalanym drewnem bukowym, cztery godziny przy niskiej temperaturze. Skóra ma chrupać, a nie pękać.',
      photo: 'ogien' satisfies PhotoKey,
    },
    {
      no: '04',
      title: 'Stół',
      body: 'Chleb, smalec i ogórki wjeżdżają na środek stołu, zanim ktokolwiek zamówi. Od tego się zaczyna każda porządna kolacja.',
      photo: 'chleb' satisfies PhotoKey,
    },
  ],
} as const

export const chef = {
  eyebrow: '04 — Szefowa kuchni',
  name: 'Marianna Rogalska',
  role: 'szefowa kuchni i właścicielka',
  heading: 'Nie skończyłam szkoły gastronomicznej',
  paragraphs: [
    'Skończyłam polonistykę i przez sześć lat redagowałam cudze książki. Gotowania nauczyła mnie babka ze wsi pod Łomżą — nie z przepisu, bo żadnego nie miała, tylko z ręki: tyle mąki, ile weźmie, i tyle soli, ile trzeba.',
    'W 2009 roku wynajęłam lokal na Frecie z jednym piecem i długiem, o którym wolę nie mówić. Pierwszego dnia przyszły cztery osoby. Trzy z nich wracają do dziś.',
    'Nie mam ambicji, żeby zaskakiwać. Mam ambicję, żeby ktoś odłożył widelec, zamilkł na chwilę i zapytał, kto to gotował.',
  ],
  quote: 'Jeżeli danie wymaga tłumaczenia, znaczy że jest źle ugotowane.',
  photo: 'szefowa' satisfies PhotoKey,
  secondPhoto: 'wydawka' satisfies PhotoKey,
  facts: [
    { value: '17', label: 'Lat w kuchni' },
    { value: '12', label: 'Osób w zespole' },
    { value: '6:00', label: 'O tej lepimy pierogi' },
  ],
} as const

export const gallery = {
  eyebrow: '05 — U nas',
  heading: 'Wieczór w Piwonii',
  lead: 'Bez inscenizacji. Zdjęcia z normalnych wieczorów, w świetle, które mamy.',
  items: [
    { photo: 'goscie' satisfies PhotoKey, caption: 'Sobota, stół przy kominku' },
    { photo: 'wnetrze' satisfies PhotoKey, caption: 'Sala główna przed otwarciem' },
    { photo: 'obsluga' satisfies PhotoKey, caption: 'Wydanie drugiego dania' },
    { photo: 'kieliszki' satisfies PhotoKey, caption: 'Stolik nr 7' },
    { photo: 'piwonie' satisfies PhotoKey, caption: 'Piwonie z targu na Wolskiej' },
    { photo: 'bar' satisfies PhotoKey, caption: 'Kwadrans po zamknięciu' },
  ],
} as const

export const events = {
  eyebrow: '06 — Przyjęcia',
  heading: 'Cały lokal na jeden wieczór',
  lead: 'Chrzciny, osiemnastki, kolacje firmowe, wesela w kameralnym składzie. Menu ustalamy przy stole, nie mailem.',
  photo: 'stol-dlugi' satisfies PhotoKey,
  rooms: [
    { name: 'Sala główna', capacity: '46 osób', note: 'przy stołach, z obsługą kelnerską' },
    { name: 'Antresola', capacity: '24 osoby', note: 'osobne wejście, własna nagłośnienie' },
    {
      name: 'Cały lokal',
      capacity: 'do 70 osób',
      note: 'na wyłączność, od poniedziałku do czwartku',
    },
  ],
  steps: [
    {
      no: '01',
      title: 'Rozmowa',
      body: 'Dzwonisz albo piszesz. Ustalamy datę, liczbę osób i budżet na osobę.',
    },
    {
      no: '02',
      title: 'Degustacja',
      body: 'Zapraszamy na próbę menu dla dwóch osób. Bezpłatnie, na dwa tygodnie przed.',
    },
    {
      no: '03',
      title: 'Wieczór',
      body: 'Przyjeżdżasz na gotowe. Kwiaty, świece i karta z nazwiskami są po naszej stronie.',
    },
  ],
  contactLabel: 'Napisz w sprawie przyjęcia',
} as const

export const testimonials = {
  eyebrow: '07 — Goście',
  heading: 'Co mówią przy wyjściu',
  items: [
    {
      quote:
        'Zamówiłem kaczkę, bo zawsze zamawiam kaczkę i zawsze jestem zawiedziony. Tym razem nie byłem. Skóra chrupała, mięso odchodziło od kości.',
      author: 'Tomasz',
      meta: 'Warszawa, gość od 2014',
    },
    {
      quote:
        'Przyszliśmy z teściową, która na wszystkim się zna i nic jej nie smakuje. Zjadła dwie porcje pierogów i poprosiła o przepis. Nie dostała.',
      author: 'Agnieszka',
      meta: 'Kolacja rodzinna, marzec',
    },
    {
      quote:
        'Robiliśmy tu wesele na 60 osób. Jedyna rzecz, o którą musiałam się martwić, to własna sukienka.',
      author: 'Karolina',
      meta: 'Wesele, wrzesień',
    },
    {
      quote:
        'Żurek jak u mojej mamy, a moja mama gotuje najlepszy żurek w Polsce. Wiem, co mówię, i nie mówię tego często.',
      author: 'Marek',
      meta: 'Lunch we wtorek',
    },
  ],
} as const

export const reservation = {
  eyebrow: '08 — Rezerwacja',
  heading: 'Stolik na wieczór',
  lead: 'Rezerwacje przyjmujemy do dwóch miesięcy w przód. Na grupy powyżej ośmiu osób prosimy o telefon — układamy wtedy stoły inaczej.',
  fields: {
    name: 'Imię i nazwisko',
    phone: 'Telefon',
    email: 'E-mail',
    date: 'Data',
    time: 'Godzina',
    guests: 'Liczba osób',
    notes: 'Uwagi',
    notesPlaceholder: 'Alergie, wózek, urodziny, stolik przy oknie...',
  },
  guestOptions: [
    '1 osoba',
    '2 osoby',
    '3 osoby',
    '4 osoby',
    '5 osób',
    '6 osób',
    '7 osób',
    '8 osób',
  ],
  timeOptions: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
  consent:
    'Zgadzam się na przetwarzanie moich danych w celu obsługi rezerwacji. Dane usuwamy 30 dni po wizycie.',
  submit: 'Wyślij prośbę o rezerwację',
  submitting: 'Wysyłam...',
  successTitle: 'Mamy Twoją prośbę',
  successBody:
    'Oddzwonimy w ciągu godziny w godzinach otwarcia. Rezerwacja jest potwierdzona dopiero po naszym telefonie.',
  again: 'Wyślij kolejną',
  /** Demo: formularz nie ma backendu, patrz README. */
  demoNote: 'Formularz demonstracyjny — nie wysyła danych na żaden serwer.',
  rules: [
    'Stolik trzymamy 15 minut od godziny rezerwacji.',
    'Grupy powyżej 8 osób — wyłącznie telefonicznie.',
    'Odwołanie prosimy zgłosić do 12:00 w dniu wizyty.',
    'Psy są mile widziane, miski dajemy od siebie.',
  ],
} as const

export const contact = {
  eyebrow: '09 — Kontakt',
  heading: 'Freta 21',
  directions: [
    { label: 'Metro', value: 'Ratusz Arsenał, 7 minut pieszo' },
    { label: 'Tramwaj', value: 'przystanek Franciszkańska' },
    { label: 'Parking', value: 'strefa płatna, wjazd od Świętojerskiej' },
  ],
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
  ],
  mapLabel: 'Otwórz w mapach',
  mapHref: 'https://www.google.com/maps/search/?api=1&query=Freta+21+Warszawa',
} as const

export const footer = {
  legal: `© 2026 Restauracja ${site.name}`,
  company: 'Piwonia sp. z o.o., NIP 000-000-00-00',
  credit: 'Marka fikcyjna, przygotowana jako projekt demonstracyjny',
  photoCredit: 'Zdjęcia: Unsplash',
  links: [
    { label: 'Polityka prywatności', href: '#kontakt' },
    { label: 'Regulamin rezerwacji', href: '#rezerwacja' },
  ],
} as const
