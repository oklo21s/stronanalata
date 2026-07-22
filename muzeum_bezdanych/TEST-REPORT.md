# TEST-REPORT — Muzeum Miasta Lipowo (projekt demonstracyjny)

- **Data uruchomienia:** 21 lipca 2026 r.
- **Środowisko:** Windows 11, Node.js v24.18.0, Vite 8.1.5, happy-dom (testy DOM).
- **Zakres:** `npm.cmd run check` + `npm.cmd run qa` (benchmark serwera).
- Wszystkie liczby pochodzą z realnego uruchomienia w tym katalogu.

## Wynik zbiorczy

| Krok | Komenda | Wynik |
|---|---|---|
| Składnia | `npm run syntax` (`node --check`) | ✅ |
| Bezpieczeństwo kodu (AST) | `npm run code:safety` | ✅ 0 operacji `/` i `%` do sprawdzenia |
| Walidacja HTML/treści | `npm run validate` | ✅ 6 podstron |
| Testy jednostkowe i DOM | `npm test` | ✅ 25/25 |
| Build produkcyjny | `npm run build` | ✅ 22 pliki w `dist/` |
| Budżety pakietu | `npm run performance:bundle` | ✅ |
| Benchmark serwera | `npm run performance:server` | ✅ |

## Walidacja (6 podstron)

Każda podstrona: dokładnie 1 `h1`, unikalne ID, kotwice i ARIA wskazują istniejące
elementy, obrazy mają `alt` i stałe wymiary, komplet oznaczeń marki fikcyjnej,
brak linków `tel:` i zewnętrznych, brak ciągów w formacie numeru telefonu.

- Kafelki z ruchem po najechaniu (`.tile--hover`): **8**
- Kafelki nieruchome (`.tile`): **15**
- Reguł `@keyframes` w CSS: **0** · nakładka intro: **brak**

## Testy (`node --test`) — 25/25

Funkcje `applyMenuFilter`, `initMenuFilter`, `initMobileMenu`, `initFaq`,
`setCurrentYear`; bootstrap każdej z 6 podstron bez błędu i z wyrenderowanymi
ikonami SVG; brak numerów `tel:` i celów zewnętrznych na każdej podstronie;
„część kafelków animuje się po najechaniu, część nie”; „nic nie startuje animacji
wejścia”. Testy stabilności: 30 000 przełączeń filtra, 2 000 przełączeń menu,
1 000 przełączeń FAQ, 2 000 kliknięć filtra, 1 000 wciśnięć Escape.

## Budżety pakietu (build produkcyjny)

| Zasób | Raw | Gzip | Budżet raw |
|---|---|---|---|
| HTML (największa podstrona — `index.html`) | 19 201 B | 4 470 B | 48 KB |
| CSS (`main-*.css`) | 15 836 B | 4 004 B | 40 KB |
| JavaScript (`main-*.js`) | 9 049 B | 3 771 B | 60 KB |
| Hero (`hero-muzeum-koncept.svg`) | 1 759 B | — | 120 KB |

- Szacowany transfer pierwszego widoku: **14 004 B**.
- Wszystkie obrazy razem: **10 219 B**; na stronie głównej **7** obrazów `loading="lazy"`.
- `dist/` nie ładuje żadnych zasobów zewnętrznych; hero ma `fetchpriority="high"`.

## Benchmark serwera (`vite preview`, 40 żądań/URL)

| URL | Bajty | Mediana | p95 | max |
|---|---|---|---|---|
| `/` (index) | 19 201 | 15,40 ms | 16,04 ms | 17,20 ms |
| `/wystawy.html` | 10 961 | 15,31 ms | 15,87 ms | 15,91 ms |
| `/assets/hero-muzeum-koncept.svg` | 1 759 | 15,38 ms | 15,86 ms | 15,95 ms |

6 podstron i 21 zasobów wewnętrznych odpowiada HTTP 200. Próg lokalnego p95
(100 ms) zachowany z zapasem.

## Czego NIE sprawdzono

- **Realna kontrola wizualna w przeglądarce** (Chrome/Firefox/Safari na
  szerokościach 320/375/768/1024/1440 px) — w tym przejściu nie była dostępna
  sesja przeglądarkowa. Do wykonania ręcznie.
- **Lighthouse / Core Web Vitals** — wymaga przeglądarki; nie mierzono.
- **Zgoda właściciela** — nie dotyczy: marka jest fikcyjna, brak realnej instytucji.
