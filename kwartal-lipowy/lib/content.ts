/**
 * Jedyne miejsce z trescia strony.
 *
 * Podmiana pod innego klienta = edycja tego pliku. Komponenty sekcji nie
 * zawieraja tekstow na sztywno, wiec zmiana branzy nie wymaga ruszania animacji.
 *
 * UWAGA: wszystkie dane ponizej sa PRZYKLADOWE (projekt demonstracyjny).
 * Przed uzyciem dla realnego klienta kazda liczba, nazwisko i numer telefonu
 * musza zostac zastapione danymi potwierdzonymi przez wlasciciela.
 */

import fotoHero from '@/public/zdjecia/hero.jpg';
import dziedziniec from '@/public/zdjecia/dziedziniec.jpg';
import elewacja from '@/public/zdjecia/elewacja.jpg';
import wnetrze from '@/public/zdjecia/wnetrze.jpg';
import taras from '@/public/zdjecia/taras.jpg';
import panorama from '@/public/zdjecia/panorama.jpg';
import panoramaMala from '@/public/zdjecia/panorama-mala.jpg';

export const firma = {
  nazwa: 'Kwartał Lipowy',
  branza: 'Inwestycja mieszkaniowa',
  tagline: 'Kameralna inwestycja w cieniu starych lip',
  domena: 'kwartallipowy.pl',
} as const;

export const hero = {
  nadtytul: 'Etap I · odbiory 2027',
  tytul: ['Kwartał', 'Lipowy'],
  lead:
    'Trzydzieści dwa mieszkania w czterech niskich budynkach, ustawionych wokół wspólnego dziedzińca z zachowanym starodrzewem.',
  cta: { etykieta: 'Zobacz metraże', cel: '#oferta' },
  ctaDrugie: { etykieta: 'Umów spacer', cel: '#kontakt' },
  wskaznikScrolla: 'Przewiń',
  // Zdjecie dekoracyjne — cala tresc niesie naglowek obok, wiec w <Image>
  // idzie puste alt. Tak samo jak w galerii: nie przedstawia tej inwestycji.
  foto: fotoHero,

  // Panorama sferyczna 2:1. Dwa warianty wagowe — patrz README.
  //
  // Sciezki musza isc przez statyczny import, a nie napis '/zdjecia/...'.
  // Teksture pobiera `useTexture` z three, ktore strzela po URL samo i nie wie
  // nic o `basePath` z next.config — pod adresem stronanalata.pl/kwartal-lipowy
  // napis dawal 404, useTexture rzucalo wyjatek i cala strona konczyla sie
  // komunikatem "Application error". Statyczny import zwraca URL juz z
  // prefiksem i zostaje poprawny takze po przenosinach na wlasna domene.
  panorama: {
    plik: panorama.src,
    plikMaly: panoramaMala.src,
    podpowiedz: 'Przeciągnij, aby się rozejrzeć',
    wlacz: 'Rozejrzyj się',
    wylacz: 'Zakończ rozglądanie',
    opisPrzycisku:
      'Włącz obracanie panoramy otoczenia. Po włączeniu przeciąganie palcem obraca widok zamiast przewijać stronę.',
  },
} as const;

export const oferta = {
  nadtytul: 'Metraże',
  tytul: 'Cztery układy, jedna zasada: każde okno na zieleń',
  lead:
    'Budynki mają po trzy kondygnacje, bez wind szybowych na zewnątrz bryły. Każde mieszkanie ma ogród, taras albo loggię.',
  karty: [
    {
      ikona: 'Sprout',
      metraz: '32–41 m²',
      nazwa: 'Kawalerki z loggią',
      opis: 'Parter i pierwsze piętro, układ otwarty, loggia od strony dziedzińca.',
      liczba: '8 lokali',
    },
    {
      ikona: 'Home',
      metraz: '48–56 m²',
      nazwa: 'Dwa pokoje',
      opis: 'Salon z aneksem od południa, sypialnia od cichej strony kwartału.',
      liczba: '14 lokali',
    },
    {
      ikona: 'TreeDeciduous',
      metraz: '62–74 m²',
      nazwa: 'Trzy pokoje z ogrodem',
      opis: 'Wyłącznie parter, ogródek 30–60 m² wygrodzony żywopłotem grabowym.',
      liczba: '7 lokali',
    },
    {
      ikona: 'Sun',
      metraz: '88–104 m²',
      nazwa: 'Poddasza z tarasem',
      opis: 'Ostatnia kondygnacja, skosy 2,1 m w kalenicy, taras na dachu garażu.',
      liczba: '3 lokale',
    },
  ],
} as const;

export const proces = {
  nadtytul: 'Harmonogram',
  tytul: 'Pięć etapów inwestycji',
  lead: 'Stan na 28 lipca 2026. Aktualizujemy po każdym odbiorze częściowym.',
  etapy: [
    {
      numer: '01',
      nazwa: 'Koncepcja i inwentaryzacja zieleni',
      okres: 'II kw. 2025',
      status: 'zakończony',
      opis:
        'Dendrolog zinwentaryzował 41 drzew. Dziewięć lip przy zachodniej granicy działki objęliśmy ochroną — to one wyznaczyły obrys budynków, nie odwrotnie.',
    },
    {
      numer: '02',
      nazwa: 'Pozwolenie na budowę',
      okres: 'IV kw. 2025',
      status: 'zakończony',
      opis:
        'Decyzja prawomocna. Projekt przeszedł bez odstępstw od miejscowego planu — wysokość zabudowy trzymamy 3 m poniżej dopuszczalnej.',
    },
    {
      numer: '03',
      nazwa: 'Stan surowy zamknięty',
      okres: 'III kw. 2026',
      status: 'w toku',
      opis:
        'Budynki A i B mają zamknięty dach. C i D są na poziomie stropu nad drugą kondygnacją. Nasyp pod dziedziniec czeka na zejście z ciężkim sprzętem.',
    },
    {
      numer: '04',
      nazwa: 'Elewacje, instalacje, zieleń',
      okres: 'II kw. 2027',
      status: 'planowany',
      opis:
        'Cegła klinkierowa w formacie długim, stolarka drewniano-aluminiowa. Nasadzenia dziedzińca wchodzą jako ostatnie, po demontażu dróg technologicznych.',
    },
    {
      numer: '05',
      nazwa: 'Odbiory i wydanie kluczy',
      okres: 'IV kw. 2027',
      status: 'planowany',
      opis:
        'Odbiory z inspektorem po stronie kupującego. Protokół usterkowy zamykamy przed podpisaniem aktu, nie po.',
    },
  ],
} as const;

/**
 * UWAGA — uczciwosc materialu zdjeciowego.
 *
 * Ponizsze zdjecia pochodza z bankow zdjec i NIE przedstawiaja tej inwestycji.
 * Dlatego podpisy opisuja *zamysl* ("do czego dazymy"), a nie konkretne miejsce
 * na budowie. Zdjecie stockowe podpisane "elewacja poludniowa budynku B"
 * byloby wprowadzaniem kupujacego w blad, a nie skrotem redakcyjnym.
 *
 * W wersji dla realnego klienta wchodza tu fotografie z budowy albo
 * wizualizacje od architekta — i dopiero wtedy podpisy moga wskazywac miejsca.
 */
export const galeria = {
  nadtytul: 'Charakter',
  tytul: 'Do czego dążymy',
  zastrzezenie:
    'Zdjęcia mają charakter poglądowy i nie przedstawiają tej inwestycji — pochodzą z banków zdjęć (Unsplash, Pexels). Materiały i zieleń pokazane są jako kierunek, nie stan faktyczny. Nie stanowią oferty w rozumieniu art. 66 §1 Kodeksu cywilnego.',
  kadry: [
    {
      plik: dziedziniec,
      podpis: 'Kwartał zamknięty wokół wspólnego wnętrza',
      opis: 'Zabudowa obrysowuje dziedziniec, ruch kołowy zostaje na zewnątrz obrysu.',
    },
    {
      plik: elewacja,
      podpis: 'Loggie cofnięte w lico ściany',
      opis: 'Spokojna elewacja bez balkonów doklejanych do fasady, niska zabudowa.',
    },
    {
      plik: wnetrze,
      podpis: 'Wnętrza prowadzone światłem',
      opis: 'Okno jako punkt wyjścia układu, drewno i tynk zamiast wykończeń błyszczących.',
    },
    {
      plik: taras,
      podpis: 'Zieleń na poziomie mieszkania',
      opis: 'Trawy i byliny w donicach wkomponowanych w barierkę, nie doniczki na deskach.',
    },
  ],
} as const;

export const statystyki = {
  nadtytul: 'Inwestycja w liczbach',
  tytul: 'Cztery liczby, które nie zmienią się do odbioru',
  pozycje: [
    { wartosc: 32, sufiks: '', etykieta: 'mieszkań w całym kwartale', opis: 'Bez etapu II — ten teren zostaje zielony.' },
    { wartosc: 2400, sufiks: ' m²', etykieta: 'powierzchni biologicznie czynnej', opis: '47% działki, przy wymaganych 30%.' },
    { wartosc: 41, sufiks: '', etykieta: 'drzew objętych inwentaryzacją', opis: 'Dziewięć lip w ochronie na czas budowy.' },
    { wartosc: 68, sufiks: '', etykieta: 'miejsc postojowych', opis: 'Wszystkie w garażu podziemnym, dziedziniec bez aut.' },
  ],
} as const;

export const opinie = {
  nadtytul: 'Kupujący',
  tytul: 'Co mówią osoby po odbiorze etapu pilotażowego',
  slajdy: [
    {
      cytat:
        'Pytałam o wentylację trzy razy i trzy razy dostałam tę samą odpowiedź, z rysunkiem. Po dwóch latach szukania mieszkania to była odmiana.',
      autor: 'Marta K.',
      rola: 'mieszkanie 56 m², budynek A',
    },
    {
      cytat:
        'Protokół usterkowy zamknęli przed aktem. Zostały dwie rzeczy, obie poprawione w dwa tygodnie. Nie musiałem o nic walczyć.',
      autor: 'Piotr Zawadzki',
      rola: 'mieszkanie 74 m² z ogrodem',
    },
    {
      cytat:
        'Największym argumentem był dziedziniec bez samochodów. Dziecko wychodzi z klatki i już jest na trawie, nie na parkingu.',
      autor: 'Anna i Rafał',
      rola: 'poddasze 88 m², budynek D',
    },
    {
      cytat:
        'Doceniam, że nie obiecywali terminu, którego nie dowieźliby. Stan surowy poślizgnął się o miesiąc i dowiedziałem się o tym mailem, sam.',
      autor: 'Krzysztof M.',
      rola: 'mieszkanie 48 m², budynek B',
    },
  ],
} as const;

export const kontakt = {
  nadtytul: 'Kontakt',
  tytul: 'Umów spacer po budowie',
  lead:
    'Wchodzimy na teren w czwartki i soboty, w kaskach, w grupach do sześciu osób. Spotkanie trwa około godziny.',
  biuro: {
    adres: 'ul. Lipowa 14, 00-000 Warszawa',
    telefon: '+48 22 000 00 00',
    email: 'biuro@kwartallipowy.pl',
    godziny: 'pon.–pt. 9:00–17:00, sob. 10:00–14:00',
  },
  pola: {
    imie: 'Imię i nazwisko',
    email: 'Adres e-mail',
    telefon: 'Telefon (opcjonalnie)',
    metraz: 'Interesujący metraż',
    wiadomosc: 'Wiadomość',
  },
  metraze: ['32–41 m²', '48–56 m²', '62–74 m²', '88–104 m²', 'Jeszcze nie wiem'],
  przycisk: 'Wyślij zgłoszenie',
  zgoda:
    'Wysyłając formularz zgadzasz się na kontakt w sprawie tej inwestycji. Danych nie przekazujemy dalej.',
} as const;

export const nawigacja = [
  { etykieta: 'Metraże', cel: '#oferta' },
  { etykieta: 'Harmonogram', cel: '#proces' },
  { etykieta: 'Charakter', cel: '#galeria' },
  { etykieta: 'Liczby', cel: '#statystyki' },
  { etykieta: 'Kontakt', cel: '#kontakt' },
] as const;

export const stopka = {
  nota: 'Projekt demonstracyjny. Nazwa inwestycji, dane kontaktowe i wszystkie liczby są przykładowe.',
  prawa: `© ${new Date().getFullYear()} ${firma.nazwa}`,
} as const;
