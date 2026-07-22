# Raport testów — Krojnia

- **Data uruchomienia:** 21 lipca 2026 r.
- **Środowisko:** Windows 11 Pro 10.0.26200, Node.js v24.18.0, npm z `npm.cmd`
- **Katalog:** `dema stron/marka_wlasna`
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
| Audyt zależności | `npm.cmd audit` | ✅ 0 podatności |

## Walidator

```
Walidacja OK — index.html: 1 h1, 20 unikalnych ID, 6 otwartych kart,
8 liczników, brak linków tel: i zewnętrznych, test anty-slop.
Walidacja OK — bez-intro.html: 1 h1, 20 unikalnych ID, 6 otwartych kart,
8 liczników, brak linków tel: i zewnętrznych, test anty-slop.
Różnica między wersjami ogranicza się do nakładki animacji wejścia.
```

Walidator sprawdza na **każdej** ze stron:

- brak jakiegokolwiek `href="tel:"`,
- brak jakiegokolwiek adresu `http(s)://` w `href` i `src`,
- brak ciągu w formacie numeru telefonu (`123 456 789`, także z `+48`),
- obecność oznaczeń `Krojnia`, `Projekt demonstracyjny`, `marka fikcyjna`,
  `Dane przykładowe`, `krojnia.example`,
- dokładnie 6 otwartych kart wyrobów i 8 liczników,
- brak dziesięciu zwrotów z listy anty-slop.

Dodatkowo odtwarza `bez-intro.html` z bieżącego `index.html` i porównuje
z plikiem na dysku. Po podmianie jednego słowa w wariancie walidator kończy się
kodem 1 i komunikatem
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
- sześć kart wyrobów pozostaje otwartych, brak `[role="tab"]` i `[data-tabs]`;
- brak linku `tel:` i celu zewnętrznego w całym dokumencie;
- każda z ośmiu statystyk zgadza się ze swoim `data-count-to`;
- **wersja bez animacji** — brak `[data-intro]`, ta sama liczba kart
  i liczników, przełącznik prowadzący z powrotem do `index.html`, poprawny
  bootstrap także przy wyłączonym `reduced-motion`;
- **obie wersje zgodne z generatorem** — `makeVariant(index.html)` daje
  bajtowo to samo, co `bez-intro.html`.

## Budżety wydajności

Zmierzone ponownie po poprawce układu `header.site-header` (grupowanie
nawigacji i wyszukiwarki w `.header-center`, ograniczenie szerokości
`.nav-search`) — 21 lipca 2026 r.

| Zasób | raw | gzip | brotli | Budżet raw | Budżet gzip |
|---|---|---|---|---|---|
| HTML (`index.html`) | 27 220 B | 6 474 B | 5 742 B | 40 960 B | 8 192 B |
| HTML (`bez-intro.html`) | 26 805 B | 6 373 B | 5 657 B | 40 960 B | 8 192 B |
| CSS | 20 410 B | 5 031 B | 4 415 B | 32 768 B | 8 192 B |
| JavaScript | 11 598 B | 4 646 B | 4 011 B | 15 360 B | 6 144 B |
| Hero (`hero-odziez-koncept.svg`) | 2 837 B | — | — | 256 000 B | — |

- Szacowany transfer pierwszego widoku: **18 988 B** (budżet 286 720 B).
- Wszystkie obrazy razem: **10 494 B** (budżet 1 075 200 B).
- Obrazy `loading="lazy"`: **3 na każdej stronie** (wymagane dokładnie 3).
- Hero ma `fetchpriority="high"` na obu stronach; brak zewnętrznych skryptów
  i arkuszy.

## Benchmark serwera lokalnego

`vite preview` na `127.0.0.1:4174`, 40 żądań na zasób. Próg: p95 ≤ 100 ms.

| URL | bajty | mediana | p95 | max |
|---|---|---|---|---|
| `/` | 27 220 B | 15,43 ms | 16,27 ms | 16,95 ms |
| `/bez-intro.html` | 26 805 B | 15,39 ms | 15,82 ms | 15,97 ms |
| `/assets/hero-odziez-koncept.svg` | 2 837 B | 15,36 ms | 15,92 ms | 17,10 ms |

Wszystkie **8** zasobów wewnętrznych odpowiada HTTP 200.

## Audyt zależności

```
found 0 vulnerabilities
```

Cztery zależności: `vite`, `lucide`, `acorn`, `happy-dom`.

## Animacja wejścia — na co zwrócono uwagę

Reguła „tylko `transform` i `opacity`” (plus skokowa `visibility`) jest
**egzekwowana**: `performance-check.mjs` i test
`the intro animation touches only compositor-friendly properties` przeglądają
wszystkie sześć klatek kluczowych i odrzucają każdą właściwość wymuszającą
układ. Kreska skaluje się `transform: scaleX()` zamiast rosnąć przez `width`,
a `scrollbar-gutter: stable` na `html` nie pozwala blokadzie scrolla przesuwać
strony.

**Oś czasu:** kreska 0–0,28 s → napis 0,16–0,46 s → wygaszenie treści i odjazd
paneli 0,44–0,82 s. Twardy limit 900 ms.

```
Animacja wejścia: koniec 820 ms, twardy limit 900 ms.
```

### Kontrola automatyczna czasów

`performance-check.mjs` parsuje skrót `animation` z arkusza i porównuje
z `setTimeout` w `app.js`. Trzy warunki: koniec ≤ 1 400 ms, twardy limit
późniejszy niż koniec ostatniej animacji, martwy czas między nimi ≤ 250 ms.

## Poprawka `header.site-header` (21 lipca 2026) — kontrola wizualna

Nagłówek desktopowy grupował wcześniej cztery elementy (`brand`, `desktop-nav`,
`nav-search`, `header-actions`) w jednym `display:flex; justify-content:space-between`
z `.nav-search{flex:1 1 auto; max-width:48rem}`. Ten ostatni pochłaniał całą wolną
przestrzeń paska (tłem zlewającym się z tłem nagłówka), przez co po prawej
stronie elementy akcji były ściśnięte, a odstępy między grupami nierówne.

Zmiana: `desktop-nav` i `nav-search` zostały zamknięte we wspólnym
`.header-center` (`flex:1 1 auto`, `justify-content:center`), które centruje
tę parę między marką (stała szerokość) a akcjami (stała szerokość).
`.nav-search` dostał `flex:0 1 15rem; max-width:15rem; min-width:8rem` — już
nie rośnie ponad rozsądny rozmiar. Usunięto martwą regułę
`.nav-search{max-width:22rem}` z media query `1100px` (nie miała już efektu
przy `flex-grow:0`). Fallback bez JS (`html:not(.js) .header-inner` przy
`max-width:900px`) zaktualizowany o jawne `html:not(.js) .header-center{display:flex;
flex:1 1 100%}` i `html:not(.js) .nav-search{display:none}`, żeby zachować
dokładnie to samo zachowanie co przed zmianą (nawigacja widoczna i zawijana
pełną szerokością, szukajka i akcje nadal ukryte na wąskich ekranach bez JS).

Zweryfikowano headless Chromium (Playwright 1.61, `npx playwright screenshot`
+ własny skrypt) na **buildzie produkcyjnym** (`vite preview`, `dist/`), żeby
uniknąć artefaktu Vite dev (w trybie dev arkusz CSS jest wstrzykiwany przez
JS, więc test „bez JS” na serwerze deweloperskim dawał czystą, niestylowaną
stronę — to pułapka narzędzia, nie usterka strony):

- **Z JS, `index.html`/`bez-intro.html`:** szerokości 480/768/900/1000/1100/
  1200/1440 px — marka, para nawigacja+szukajka i akcje trzymają spójny rytm
  odstępów; szukajka nie rozpycha już paska.
- **Bez JS (`javaScriptEnabled:false`), build `dist/`:** 1440 px — nagłówek
  wygląda identycznie jak z JS (żaden styl headera nie zależy od skryptu, poza
  cieniem przy scrollu). 800 px — marka + pełna nawigacja zawinięta pod spodem,
  szukajka/akcje/hamburger ukryte, dokładnie jak przed zmianą.
- **Menu mobilne (JS, 700 px):** kliknięcie `.menu-toggle` otwiera
  `#mobile-menu`, zero błędów w konsoli (`console --errors` / `pageerror`).
- **`prefers-reduced-motion` + animacja wejścia (JS, 1280 px):** strona
  renderuje treść, intro się nie blokuje.

## Czego NIE sprawdzono i dlaczego

- **Lighthouse i Core Web Vitals** — wymaga Chrome DevTools Protocol w trybie
  z pełnym UI/profilowaniem; nie uruchomiono w tym przejściu.
- **Rzeczywiste odczucie płynności animacji (FPS)** — headless Chromium
  potwierdza tylko obecność i poprawność DOM/CSS w danym stanie, nie mierzy
  klatek renderowania.
- **Czytnik ekranu i realna nawigacja klawiaturą na sprzęcie** — nie
  testowano fizycznym AT, tylko strukturą (role, aria-*, kolejność DOM).
- **Nagłówki HTTP produkcyjne** (CSP, HSTS) — zależą od hostingu, projekt nie
  jest wdrożony.
