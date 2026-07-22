# BudDem — projekt demonstracyjny strony firmy budowlanej

**BudDem nie istnieje.** Nazwa, logo, adres, e-mail i wszystkie liczby na tej
stronie zostały wymyślone na potrzeby portfolio. Projekt nie opisuje żadnego
realnego przedsiębiorstwa, nie jest ofertą i nie jest z nikim powiązany.

Powstał po to, żeby pokazać jedną umiejętność: **przeniesienie układu informacji
z serwisu dużego generalnego wykonawcy na jedną stronę**, bez podszywania się
pod istniejącą firmę.

## Dlaczego marka jest fikcyjna

Pozostałe dema w katalogu `dema stron/` używają danych realnych firm z Kozienic
i zgodnie z [TODO-PORTFOLIO.md](../TODO-PORTFOLIO.md) wymagają zgody właściciela
albo anonimizacji, zanim trafią do publicznego portfolio. BudDem od początku
idzie drugą ścieżką — jest w całości zmyślony, więc może być pokazywany bez
niczyjej zgody.

Praktyczne konsekwencje, wymuszone przez `scripts/validate.mjs`:

- **żadnego linku `tel:`** — zmyślony numer mógłby połączyć kogoś z przypadkową
  osobą, więc przyciski prowadzą do `#kontakt`;
- **żadnego adresu zewnętrznego** — brak map, profili i bibliotek z sieci;
- **żadnego ciągu wyglądającego jak numer telefonu** w treści;
- adres e-mail w domenie `.example`, zarezerwowanej do dokumentacji (RFC 2606);
- adres siedziby dobrany tak, żeby nie wskazywał realnego miejsca;
- dane rejestrowe (NIP, REGON, KRS) **świadomie pominięte** — zmyślony numer
  mógłby przypadkiem trafić w prawdziwą firmę.

Walidator traktuje oznaczenia „Projekt demonstracyjny”, „marka fikcyjna”
i „Dane przykładowe” jako **wymagane** — nie da się ich usunąć bez zerwania
bramki jakości.

## Skąd wzięty jest układ

Struktura odwzorowuje kolejność sekcji ze strony głównej dużego wykonawcy
(referencja spisana w [ORGANIZACJA-STRONY-BUDIMEX-TODO.md](../../budowlanka/ORGANIZACJA-STRONY-BUDIMEX-TODO.md)):

| Sekcja referencyjna | Odpowiednik w BudDem |
|---|---|
| Pasek notowań giełdowych | Pasek statusu: marka fikcyjna, dane przykładowe, brak telefonu |
| Hero ze sloganem korporacyjnym | Hero z konkretnym `h1` mówiącym, co firma robi |
| Obszary działalności (13 kart) | Sześć **otwartych** kart, bez zakładek |
| Firma w liczbach | Pasmo liczb jawnie opisane jako dane przykładowe |
| Kariera | Sekcja rekrutacji z zastrzeżeniem, że nabór nie jest prowadzony |
| Statystyki skali | Drugie pasmo liczb |
| „Budujemy dla ludzi” | Efekty pracy — sześć kafelków |
| Strategia ESG | Przebieg kontraktu — cztery etapy |
| Nasze spółki | Uczciwa notka o braku galerii realizacji |
| Stopka z KRS/NIP | Stopka z ujawnieniem fikcyjności, bez danych rejestrowych |

Świadomie **odrzucone**: slogan korporacyjny (walidator blokuje ten rejestr
jako anty-slop), relacje inwestorskie, rynki zagraniczne, wybór języka, ikony
mediów społecznościowych i wszelkie dane rejestrowe.

## Decyzje projektowe warte pokazania

1. **Zakres widoczny bez klikania.** Sześć obszarów działalności to otwarta
   siatka kart, nie zakładki. Cała treść jest czytelna przy wyłączonym
   JavaScripcie — test `all six activity cards stay open` tego pilnuje.
2. **Liczniki, które nie kłamią przy braku JS.** Wartość końcowa stoi
   w HTML-u; skrypt tylko animuje dojście do niej i na końcu przywraca
   dokładnie tekst ze źródła. Bez JS, bez `IntersectionObserver` i przy
   `prefers-reduced-motion` liczby są od razu poprawne.
3. **Dwie wersje z jednego źródła.** Wariant bez animacji jest generowany
   z `index.html`, a bramka pilnuje, żeby się nie rozjechały — zamiast
   kopiowania strony i utrzymywania dwóch kopii ręcznie.
4. **Animacja tylko na kompozytorze.** Reguła „wyłącznie `transform`
   i `opacity`" nie jest zaleceniem w komentarzu, tylko sprawdzanym warunkiem
   — test i `performance-check.mjs` odrzucają każdą klatkę kluczową
   animującą właściwość wymuszającą układ.
5. **Bramka jako zabezpieczenie treści, nie tylko kodu.** Walidator blokuje
   publikację działającego telefonu i linków wychodzących — czyli dokładnie te
   dwie rzeczy, które w demie marki fikcyjnej mogłyby trafić w kogoś realnego.
6. **Brak zdjęć.** Cztery ilustracje to ręcznie napisane SVG (razem 7,9 kB).
   Nie ma stocku ani cudzych realizacji podanych jako własne.

## Dwie wersje strony

Projekt buduje **dwie strony z jednej treści**:

| Plik | Adres | Różnica |
|---|---|---|
| `index.html` | `/` | z animacją wejścia |
| `bez-intro.html` | `/bez-intro.html` | bez animacji wejścia |

Obie mają w górnym pasku przełącznik na drugą wersję, więc da się je porównać
jednym kliknięciem.

**Wariant jest generowany, nie pisany ręcznie.** Po każdej zmianie w
`index.html` uruchom:

```powershell
npm.cmd run variant
```

Reguły różnicy siedzą w jednym miejscu — `scripts/variant.mjs`. Korzysta z nich
generator **oraz walidator**, który odtwarza wariant z bieżącego `index.html`
i porównuje z plikiem na dysku. Jeśli ktoś zmieni treść i zapomni przegenerować,
bramka przerywa z komunikatem `bez-intro.html rozjechał się z index.html`.

## Animacja wejścia — na co zwrócono uwagę

Pierwsza wersja animacji zacinała się. Przyczyny i poprawki:

1. **Kreska rosła przez `width: 0 → 24rem`** — to wymusza przeliczenie układu
   w każdej klatce. Teraz szerokość jest stała, a rośnie `transform: scaleX()`,
   które obsługuje kompozytor.
2. **`overflow: hidden` na czas animacji** zabierał i oddawał pasek przewijania,
   przesuwając całą stronę na starcie i na końcu. Naprawione przez
   `scrollbar-gutter: stable` na `html`.
3. **Animacja startowała w tej samej klatce co pierwszy układ strony.**
   `initIntro()` idzie teraz **przed** `renderIcons()`, które synchronicznie
   tworzy kilkadziesiąt SVG — nakładka zasłania stronę, zanim ta praca ruszy.
4. Elementy animowane dostały `will-change` i `backface-visibility: hidden`.

Reguła „tylko `transform` i `opacity`” jest **egzekwowana**: test
`the intro animation touches only compositor-friendly properties` i osobna
kontrola w `performance-check.mjs` przeglądają wszystkie pięć klatek kluczowych
i odrzucają każdą właściwość wymuszającą układ.

### Skrócenie i cztery naprawione błędy

Pierwsza wersja trwała 1,15 s obrazu plus 250 ms martwego czasu i miała cztery
usterki, wszystkie widoczne dla użytkownika:

| Błąd | Objaw | Poprawka |
|---|---|---|
| Kreska i napis nie gasły | żółta linia i „BUDDEM” wisiały nad treścią strony przez ~0,75 s po odjeździe paneli | wspólna klatka `intro-fade-out` gasi je razem z panelami |
| Pominięcie kasowało animacje | `skip()` zdejmował `is-playing`, więc panele wracały skokiem na cały ekran i dopiero gasły | klasa zostaje, gaśnie tylko nakładka |
| Niewidzialny, klikalny przycisk | `opacity: 0` nie wyłącza trafień — przycisk „Pomiń” łapał kliknięcia w rogu jeszcze pół sekundy | `visibility: hidden` w klatce `skip-out` |
| Martwy czas na końcu | scroll zablokowany 250 ms po zniknięciu obrazu | limit zsunięty z 1 400 do 900 ms |

**Oś czasu teraz:** kreska 0–0,28 s → napis 0,16–0,46 s → wygaszenie treści
i odjazd paneli 0,44–0,82 s. Twardy limit w JS: 900 ms.

Trzy warunki są **sprawdzane automatycznie** (`performance-check.mjs` plus test
`the intro clears the screen well before the hard limit`), bo dokładnie na nich
poległa pierwsza wersja:

- animacja kończy się przed progiem 1 400 ms,
- twardy limit jest **późniejszy** niż koniec ostatniej animacji,
- martwy czas między nimi nie przekracza 250 ms.

Kontrola parsuje skrót `animation` z arkusza i porównuje z `setTimeout`
w `app.js`. Sprawdzone celowym zepsuciem obu progów — bramka przerywa
z konkretnym komunikatem, która animacja i o ile wystaje.

Animacja jest pomijalna przyciskiem i `Escape`, odtwarza się raz na sesję
(`?intro=1` wymusza powtórkę) i jest całkowicie wyłączona przy
`prefers-reduced-motion`.

## Uruchomienie

```powershell
npm.cmd install
npm.cmd run dev
```

Wersja z animacją: `/` · wersja bez animacji: `/bez-intro.html` ·
powtórka animacji: `/?intro=1`

## Bramka jakości

Kolejność jest obowiązkowa — każdy krok dokłada, nie powtarza:

```powershell
npm.cmd run check      # skladnia, AST, walidator, testy, build, budzety
npm.cmd run qa         # + benchmark serwera
npm.cmd run stability  # + determinizm buildu, pamiec, stress
npm.cmd audit          # podatnosci
```

Wyniki ostatniego uruchomienia: [TEST-REPORT.md](TEST-REPORT.md)
i [STABILITY-REPORT.md](STABILITY-REPORT.md).

## Czego ten projekt nie pokazuje

- Nie ma galerii realizacji — firma fikcyjna niczego nie zbudowała.
- Nie ma działającego formularza ani backendu.
- Nie wykonano kontroli w prawdziwej przeglądarce ani pomiaru Lighthouse
  (wymaga Chrome, niedostępny w środowisku, w którym projekt powstał).
