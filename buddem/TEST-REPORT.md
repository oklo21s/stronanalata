# Raport testów — BudDem

- **Data uruchomienia:** 20 lipca 2026 r.
- **Środowisko:** Windows 11 Pro 10.0.26200, Node.js v24.18.0, npm z `npm.cmd`
- **Katalog:** `dema stron/buddem`
- **Zakres:** dwie strony — `index.html` (z animacją wejścia)
  i `bez-intro.html` (bez niej). Obie przechodzą ten sam zestaw reguł.
- **Wszystkie liczby poniżej pochodzą z uruchomienia w tym katalogu.** Nic nie
  zostało przepisane z innego dema.

## Wynik zbiorczy

| Krok | Komenda | Wynik |
|---|---|---|
| Składnia | `npm.cmd run syntax` | ✅ |
| Bezpieczeństwo kodu (AST) | `npm.cmd run code:safety` | ✅ |
| Walidator treści i dostępności | `npm.cmd run validate` | ✅ obie strony |
| Testy jednostkowe i stabilnościowe | `npm.cmd test` | ✅ 29/29 |
| Build produkcyjny | `npm.cmd run build` | ✅ 2 strony |
| Budżety wydajności | `npm.cmd run performance:bundle` | ✅ |
| Benchmark serwera | `npm.cmd run performance:server` | ✅ |
| Audyt zależności | `npm.cmd audit --audit-level=moderate` | ✅ 0 podatności |

## Walidator

```
Walidacja OK — index.html: 1 h1, 19 unikalnych ID, 6 otwartych kart,
8 liczników, brak linków tel: i zewnętrznych, test anty-slop.
Walidacja OK — bez-intro.html: 1 h1, 19 unikalnych ID, 6 otwartych kart,
8 liczników, brak linków tel: i zewnętrznych, test anty-slop.
Różnica między wersjami ogranicza się do nakładki animacji wejścia.
```

Walidator sprawdza na **każdej** ze stron:

- brak jakiegokolwiek `href="tel:"`,
- brak jakiegokolwiek adresu `http(s)://` w `href` i `src`,
- brak ciągu w formacie numeru telefonu (`123 456 789`, także z `+48`),
- obecność oznaczeń `BudDem`, `Projekt demonstracyjny`, `marka fikcyjna`,
  `Dane przykładowe`, `buddem.example`,
- dokładnie 6 otwartych kart obszarów i 8 liczników,
- brak dziesięciu zwrotów z listy anty-slop.

Dodatkowo odtwarza `bez-intro.html` z bieżącego `index.html` i porównuje
z plikiem na dysku. **Sprawdzone celowym rozjazdem:** po podmianie jednego
słowa w wariancie walidator kończy się kodem 1 i komunikatem
`bez-intro.html rozjechał się z index.html — uruchom node scripts/build-variant.mjs`.

## Testy — 29 przypadków, 0 nieudanych

Zakres:

- `easeOutCubic` — odrzucanie wartości nieskończonych i nienumerycznych,
  przycięcie do przedziału [0, 1], monotoniczność na 1 000 próbek;
- `formatStatValue` — grupowanie tysięcy twardą spacją, przecinek dziesiętny,
  odmowa przy nieprawidłowej liczbie miejsc po przecinku;
- liczniki — brak elementów, `prefers-reduced-motion`, start od zera,
  dojście do wartości końcowej, wartość niemożliwa do sparsowania;
- animacja wejścia — usunięcie przy `reduced-motion`;
- **klatki kluczowe animacji animują wyłącznie `transform`, `opacity`
  i `visibility`** (wszystkie sześć sprawdzane po nazwach; `visibility` jest
  dozwolona, bo przełącza się skokowo i nie wymusza przeliczenia układu);
- **przycisk pominięcia przestaje łapać kliknięcia** — klatka `skip-out`
  musi zawierać `visibility: hidden`, nie tylko `opacity: 0`;
- **pominięcie nie cofa paneli** — `skip()` nie może zdejmować `is-playing`;
- **czasy animacji** — koniec ≤ 1 400 ms, twardy limit późniejszy niż koniec,
  martwy czas między nimi ≤ 250 ms;
- pełny dokument — bootstrap bez wyjątku, wyrenderowane ikony;
- sześć kart obszarów pozostaje otwartych, brak `[role="tab"]` i `[data-tabs]`;
- brak linku `tel:` i celu zewnętrznego w całym dokumencie;
- każda z ośmiu statystyk zgadza się ze swoim `data-count-to`;
- **wersja bez animacji** — brak `[data-intro]`, ta sama liczba kart
  i liczników, przełącznik prowadzący z powrotem do `index.html`, poprawny
  bootstrap także przy wyłączonym `reduced-motion`;
- **obie wersje zgodne z generatorem** — `makeVariant(index.html)` daje
  bajtowo to samo, co `bez-intro.html`.

## Budżety wydajności

| Zasób | raw | gzip | brotli | Budżet raw | Budżet gzip |
|---|---|---|---|---|---|
| HTML (`index.html`) | 26 192 B | 6 334 B | 5 627 B | 40 960 B | 8 192 B |
| HTML (`bez-intro.html`) | 25 778 B | 6 228 B | 5 532 B | 40 960 B | 8 192 B |
| CSS | 15 877 B | 4 113 B | 3 601 B | 32 768 B | 8 192 B |
| JavaScript | 10 715 B | 4 390 B | 3 777 B | 15 360 B | 6 144 B |
| Hero (`hero-budowa-koncept.svg`) | 2 878 B | — | — | 256 000 B | — |

- Szacowany transfer pierwszego widoku: **17 715 B** (budżet 286 720 B).
- Wszystkie obrazy razem: **7 894 B** (budżet 1 075 200 B).
- Obrazy `loading="lazy"`: **3 na każdej stronie** (wymagane dokładnie 3).
- Hero ma `fetchpriority="high"` na obu stronach; brak zewnętrznych skryptów
  i arkuszy.

## Benchmark serwera lokalnego

`vite preview` na `127.0.0.1:4174`, 40 żądań na zasób. Próg: p95 ≤ 100 ms.

| URL | bajty | mediana | p95 | max |
|---|---|---|---|---|
| `/` | 26 192 B | 15,33 ms | 15,96 ms | 16,68 ms |
| `/bez-intro.html` | 25 778 B | 15,45 ms | 15,94 ms | 16,04 ms |
| `/assets/hero-budowa-koncept.svg` | 2 878 B | 15,39 ms | 15,73 ms | 16,34 ms |

Wszystkie **8** zasobów wewnętrznych odpowiada HTTP 200.

## Audyt zależności

```
found 0 vulnerabilities
```

Drzewo: 27 pakietów, `vite`, `lucide`, `acorn`, `happy-dom`.

## Animacja wejścia — dwie rundy poprawek

### Runda 1: zacinanie

| Przyczyna | Poprawka | Weryfikacja |
|---|---|---|
| `@keyframes rule-draw` animował `width` (przeliczenie układu co klatkę) | stała szerokość + `transform: scaleX()` | w `dist` klatka to `transform:translate(-50%,-50%)scaleX(0→1)` |
| `overflow: hidden` zabierał pasek przewijania, przesuwając stronę | `scrollbar-gutter: stable` na `html` | obecne w zbudowanym CSS |
| animacja startowała razem z pierwszym układem strony | `initIntro()` przed `renderIcons()` | kolejność w `bootstrap()` |
| brak promocji warstwy | `will-change` + `backface-visibility` | 3 wystąpienia `will-change` w `dist` |

### Runda 2: za długo i błędy wizualne

| Błąd | Objaw | Poprawka |
|---|---|---|
| kreska i napis nie gasły | wisiały nad treścią ~0,75 s po odjeździe paneli | wspólna klatka `intro-fade-out` |
| pominięcie kasowało animacje | panele wracały skokiem na cały ekran | `is-playing` zostaje przy pominięciu |
| niewidzialny, klikalny przycisk | „Pomiń” łapał kliknięcia mimo `opacity: 0` | `visibility: hidden` w `skip-out` |
| martwy czas | scroll zablokowany 250 ms po zniknięciu obrazu | limit 1 400 → 900 ms |

**Oś czasu:** kreska 0–0,28 s → napis 0,16–0,46 s → wygaszenie i odjazd paneli
0,44–0,82 s. Twardy limit 900 ms. Skrócenie z 1,15 s do 0,82 s obrazu.

```
Animacja wejścia: koniec 820 ms, twardy limit 900 ms.
```

### Kontrola automatyczna czasów

`performance-check.mjs` parsuje skrót `animation` z arkusza i porównuje
z `setTimeout` w `app.js`. Sprawdzone celowym zepsuciem obu progów:

| Scenariusz | Komunikat bramki |
|---|---|
| limit 1 400 ms | `Martwy czas 580 ms między końcem animacji a usunięciem nakładki przekracza 250 ms` |
| limit 700 ms | `Twardy limit 700 ms nie jest późniejszy niż koniec animacji „panel-up" (820 ms)` |

Przy pisaniu tej kontroli sama bramka wykryła w niej dwa błędy: podział listy
animacji przecinkiem rozcinał `cubic-bezier(0.65, 0, 0.35, 1)` w środku
(gubiąc opóźnienie), a wyrażenie na limit trafiało w krótszy timer pominięcia.
Oba naprawione przed zaliczeniem testu.

## Czego NIE sprawdzono i dlaczego

- **Realna płynność animacji w przeglądarce** — nie zmierzono klatek ani
  czasu renderowania w DevTools. Poprawki wynikają z usunięcia znanych
  przyczyn przeliczania układu, a nie z pomiaru przed/po. **To jest istotne
  zastrzeżenie: nie mam dowodu, że zacinanie zniknęło u użytkownika.**
- **Lighthouse i Core Web Vitals** — wymaga Chrome, niedostępnego
  w środowisku, w którym projekt powstał.
- **Kontrola wizualna w prawdziwej przeglądarce** — nie było sesji
  przeglądarkowej. Układ zweryfikowany przez strukturę HTML i CSS, nie przez
  oglądanie.
- **Szerokości 320 / 375 / 768 / 1024 / 1440 px** — punkty łamania są napisane,
  ale nie zostały obejrzane.
- **Czytnik ekranu i realna nawigacja klawiaturą** — nie testowano na sprzęcie.
- **Nagłówki HTTP produkcyjne** (CSP, HSTS) — zależą od hostingu, projekt nie
  jest wdrożony.
