# Raport kontroli jakości

Data: 26 lipca 2026 r.

Zakres: kopia wizytówki rozbudowana o dwie podstrony sprzedażowe — `/oferta/`
i `/realizacje/` — oraz przebudowa strony głównej pod nową nawigację. Zmiany nie
zostały opublikowane na hostingu w ramach tej kontroli.

Poprzedni raport (19 lipca 2026 r.) dotyczył wersji jednostronicowej. Liczby
poniżej pochodzą z uruchomień wykonanych **dla tej wersji**; wszystko, czego nie
uruchomiono, jest wypisane w sekcji „Kontrole niewykonane”.

## `npm run release:check`

Wynik: **OK** (składnia → walidacja → testy → build → wydajność → stabilność → audit)

- składnia JavaScript i PowerShell: OK,
- walidacja treści, struktury, SEO i prywatności dla **trzech** stron: OK,
- 12/12 testów interakcji: OK (8 zastanych + 4 nowe dla routingu podstron),
- build Vite w trybie wielostronicowym: OK, 3 wejścia HTML,
- `npm audit`: **0 znanych podatności**.

## Budżety wydajności

Budżet pierwszego widoku liczony osobno dla każdej strony (HTML + wspólny CSS +
wspólny JS, gzip), limit `50 000 B`:

| Strona         | HTML raw | HTML gzip | Pierwszy widok gzip |
| -------------- | -------- | --------- | ------------------- |
| `/`            | 28 795 B | 7 992 B   | **18 113 B**        |
| `/oferta/`     | 21 904 B | 6 585 B   | **16 706 B**        |
| `/realizacje/` | 22 588 B | 5 559 B   | **15 680 B**        |

Wspólne zasoby: CSS `40 512 B raw / 8 430 B gzip`, JS `4 246 B raw / 1 691 B gzip`.
JavaScript mieści się w budżecie `15 kB raw / 6 kB gzip` z instrukcji budowy.

Cały build: `225 323 B raw` przy budżecie `280 000 B`.

**Zmiana budżetu:** poprzedni limit całego builda wynosił `220 000 B` i został
podniesiony do `280 000 B`, ponieważ projekt urósł z jednej strony do trzech
(dwa nowe pliki HTML + pięć podglądów SVG ≈ 52 kB). Skrypt liczy teraz pierwszy
widok osobno dla każdej strony zamiast szukać jednego kompletu plików — stara
wersja i tak przestała działać, bo Vite nazywa teraz wspólne pliki `main-*`
zamiast `index-*`.

## `npm run stability`

Wynik: **OK**

- dwa kolejne buildy: 29 identycznych plików SHA-256,
- menu: 20 000 przełączeń, prawidłowy stan końcowy.

## Nowe testy i dowód, że działają

Cztery testy dopisane do `tests/app.test.mjs` pokrywają zmianę w `initRouting()`
i `initStickyCta()`. Test „na podstronie router nie przechwytuje odnośników do
sekcji strony głównej” **sprawdzono przez celowe wyłączenie zabezpieczenia**
w `src/app.js` — bez niego test zawodzi (11/12), po przywróceniu przechodzi
(12/12). Nie jest to więc test, który przechodzi zawsze.

## Kontrole statyczne

Wynik: **OK**

Dla każdej z trzech indeksowanych stron sprawdzono automatycznie: dokładnie jeden
`h1`, `lang="pl"`, `<main id="main">`, opis dłuższy niż 60 znaków, `index,follow`,
własny `canonical` i `og:url`, link pomijający nawigację, znak marki w nagłówku
i stopce, brak zewnętrznych skryptów i arkuszy, brak stylu inline (CSP), brak
placeholderów, cele wszystkich kotwic `#`.

Poza tym:

- **odnośniki wewnętrzne w `dist/`**: wszystkie prowadzą do istniejących plików
  (skrypt jednorazowy, nie część bramki QA),
- **dostępność podstawowa**: 24 obrazy, wszystkie z atrybutem `alt`; brak
  przeskoków poziomów nagłówków; brak przycisków bez dostępnej nazwy,
- sitemap zawiera dokładnie trzy adresy i pokrywa się z listą stron,
- `.htaccess` nie przekierowuje `/oferta` ani `/realizacje` na `index.html`,
- na stronie oferty jest dokładnie jedna cena („od 600 zł”); walidator odrzuca
  build z widełkami `x–y zł`, których właściciel nie zatwierdził,
- galeria linkuje do dziesięciu dem, każde z opisem decyzji i oznaczeniem
  „marka fikcyjna”,
- brak cookies, local/session storage, analityki i znanych trackerów,
- CSP, HSTS, `nosniff`, blokada ramek, polityka referrera i uprawnień bez zmian.

## Kontrole niewykonane

- **Kontrola wizualna: nie wykonana.** Podstrony nie zostały obejrzane
  w przeglądarce. Rozszerzenie Chrome zwracało błąd wstrzykiwania skryptu przy
  każdej próbie zrzutu ekranu; sam serwer podglądu odpowiadał poprawnie
  (tytuł strony wczytał się prawidłowo). Wygląd `/oferta/` i `/realizacje/`
  — w szczególności nowe komponenty `.package`, `.prep-card` i `.page-cta`
  oraz ich wersja mobilna i tryb ciemny — jest **niesprawdzony**.
- Nie wykonano ręcznego testu klawiaturą ani z czytnikiem ekranu.
- Nie sprawdzono dostępności dziesięciu adresów dem, do których linkuje galeria.
  Pięć z nich z pewnością nie jest jeszcze wdrożonych — patrz `WDROZENIE-DEM.md`.
- Nie zweryfikowano zachowania produkcyjnego 404 ani reguł `.htaccess`; Vite
  Preview ich nie stosuje, więc sprawdzenie jest możliwe dopiero po wdrożeniu.
- Formularz kontaktowy nie był wysyłany — backend PHP nie działa pod Vite
  Preview. Zmiany go nie dotyczyły.
- Nie zweryfikowano wpływu nowych stron na wyniki wyszukiwania; sitemapa wymaga
  ponownego zgłoszenia po publikacji.

## Co wymaga decyzji właściciela

- Ceny dla zakresów 02 i 03 pozostają nieokreślone („wycena po analizie”,
  „najpierw audyt”) — zgodnie z decyzją z 26 lipca 2026 r.
- Roczny koszt domeny i hostingu opisany jest słownie, bez kwoty.
- Pięć dem wymaga wdrożenia, a trzy z nich najpierw sposobu wdrożenia
  (brak `Dockerfile`) — szczegóły w `WDROZENIE-DEM.md`.
