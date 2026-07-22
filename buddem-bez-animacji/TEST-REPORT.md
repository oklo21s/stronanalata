# Raport testów — BudDem bez animacji

- **Data uruchomienia:** 20 lipca 2026 r.
- **Środowisko:** Windows 11 Pro 10.0.26200, Node.js v24.18.0, npm z `npm.cmd`
- **Katalog:** `dema stron/buddem-bez-animacji`
- **Zakres:** jedna strona — `index.html`, bez animacji wejścia.
- **Wszystkie liczby poniżej pochodzą z uruchomienia w tym katalogu.** Nic nie
  zostało przepisane z `dema stron/buddem`, mimo że projekt jest jego kopią.

## Wynik zbiorczy

| Krok | Komenda | Wynik |
|---|---|---|
| Składnia | `npm.cmd run syntax` | ✅ |
| Bezpieczeństwo kodu (AST) | `npm.cmd run code:safety` | ✅ 1 dzielnik, stały |
| Walidator treści i dostępności | `npm.cmd run validate` | ✅ |
| Testy jednostkowe i stabilnościowe | `npm.cmd test` | ✅ 23/23 |
| Build produkcyjny | `npm.cmd run build` | ✅ 1 strona, 249 ms |
| Budżety wydajności | `npm.cmd run performance:bundle` | ✅ |
| Benchmark serwera | `npm.cmd run performance:server` | ✅ |
| Audyt zależności | `npm.cmd audit` | ✅ 0 podatności |

Kroki uruchomione pojedynczo, w kolejności obowiązkowej. `npm run qa`
i `npm run stability` są złożeniami tych samych komend — nie powtarzano ich,
żeby nie zajmować portów drugi raz.

## Walidator

```
Walidacja OK — index.html: 1 h1, 19 unikalnych ID, 6 otwartych kart,
8 liczników, brak linków tel: i zewnętrznych, test anty-slop.
Brak nakładki animacji wejścia potwierdzony.
```

Walidator sprawdza:

- brak jakiegokolwiek `href="tel:"`,
- brak jakiegokolwiek adresu `http(s)://` w `href` i `src`,
- brak ciągu w formacie numeru telefonu (`123 456 789`, także z `+48`),
- obecność oznaczeń `BudDem`, `Projekt demonstracyjny`, `marka fikcyjna`,
  `Dane przykładowe`, `buddem.example`,
- dokładnie 6 otwartych kart obszarów i 8 liczników,
- brak dziesięciu zwrotów z listy anty-slop,
- **brak `data-intro` i `intro-overlay`** — czyli że nakładka nie wróciła.

Reguła porównująca dwie wersje strony, obecna w `buddem`, została **usunięta**:
tu jest jedna strona i nie ma czego z czym porównywać.

## Testy — 23 przypadki, 0 nieudanych

Zakres:

- `easeOutCubic` — odrzucanie wartości nieskończonych i nienumerycznych,
  przycięcie do przedziału [0, 1], monotoniczność na 1 000 próbek;
- `formatStatValue` — grupowanie tysięcy twardą spacją, przecinek dziesiętny,
  odmowa przy nieprawidłowej liczbie miejsc po przecinku;
- liczniki — brak elementów, `prefers-reduced-motion`, start od zera,
  dojście do wartości końcowej, wartość niemożliwa do sparsowania;
- **brak animacji wejścia w trzech plikach naraz** (`nothing on the page starts
  an entry animation`) — `index.html` bez `data-intro`/`intro-overlay`/
  `intro-skip`, `styles.css` bez `.intro-overlay|panel|rule|wordmark|skip`,
  `intro-active` i sześciu klatek kluczowych, `app.js` bez `initIntro`
  i `sessionStorage`;
- **bootstrap przy włączonym ruchu** — strona wstaje bez wyjątku i nie zakłada
  `intro-active` na `body`, mimo że `prefers-reduced-motion` jest wyłączone;
- pełny dokument — bootstrap bez wyjątku, wyrenderowane ikony;
- sześć kart obszarów pozostaje otwartych, brak `[role="tab"]` i `[data-tabs]`;
- brak linku `tel:` i celu zewnętrznego w całym dokumencie;
- każda z ośmiu statystyk zgadza się ze swoim `data-count-to`;
- **1 000 naciśnięć `Escape`** nie zmienia treści strony i nic nie zapisuje
  w `sessionStorage`, nawet pod adresem `?intro=1` (w wersji z animacją ten
  parametr wymuszał powtórkę — tutaj musi być bez znaczenia).

Testy usunięte względem `buddem`, wraz z powodem: sześć przypadków dotyczących
klatek kluczowych, przycisku pominięcia, osi czasu i zgodności wariantu
z generatorem — nie mają czego sprawdzać, bo nie ma ani animacji, ani wariantu.

## Budżety wydajności

| Zasób | raw | gzip | brotli | Budżet raw | Budżet gzip |
|---|---|---|---|---|---|
| HTML (`index.html`) | 25 770 B | 6 212 B | 5 529 B | 40 960 B | 8 192 B |
| CSS | 14 037 B | 3 677 B | 3 208 B | 32 768 B | 8 192 B |
| JavaScript | 9 783 B | 4 106 B | 3 533 B | 15 360 B | 6 144 B |
| Hero (`hero-budowa-koncept.svg`) | 2 878 B | — | — | 256 000 B | — |

- Szacowany transfer pierwszego widoku: **16 873 B** (budżet 286 720 B).
- Wszystkie obrazy razem: **7 894 B** (budżet 1 075 200 B).
- Obrazy `loading="lazy"`: **3** (wymagane dokładnie 3).
- Hero ma `fetchpriority="high"`; brak zewnętrznych skryptów i arkuszy.

**Porównanie z wersją animowaną** (liczby `buddem` z jego własnego raportu):
CSS 15 877 → 14 037 B raw, JS 10 715 → 9 783 B raw, HTML 26 192 → 25 770 B raw.
Transfer pierwszego widoku 17 715 → 16 873 B, czyli **842 B mniej**.

## Benchmark serwera lokalnego

`vite preview` na `127.0.0.1:4174`, 40 żądań na zasób. Próg: p95 ≤ 100 ms.

| URL | bajty | mediana | p95 | max |
|---|---|---|---|---|
| `/` | 25 770 B | 15,37 ms | 15,96 ms | 16,99 ms |
| `/assets/hero-budowa-koncept.svg` | 2 878 B | 15,41 ms | 15,90 ms | 16,03 ms |

Wszystkie **7** zasobów wewnętrznych odpowiada HTTP 200 (w `buddem` było 8 —
różnicę robi brak drugiej strony).

## Audyt zależności

```
found 0 vulnerabilities
```

## Czego NIE sprawdzono i dlaczego

- **Kontrola wizualna w prawdziwej przeglądarce** — nie było sesji
  przeglądarkowej. Układ zweryfikowany przez strukturę HTML i CSS, nie przez
  oglądanie. Dotyczy to również twierdzenia „treść widać od pierwszej klatki":
  jest ono poparte brakiem nakładki w markupie, a nie pomiarem renderowania.
- **Lighthouse i Core Web Vitals** — wymaga Chrome, niedostępnego
  w środowisku, w którym projekt powstał.
- **Szerokości 320 / 375 / 768 / 1024 / 1440 px** — punkty łamania są napisane,
  ale nie zostały obejrzane.
- **Czytnik ekranu i realna nawigacja klawiaturą** — nie testowano na sprzęcie.
- **Nagłówki HTTP produkcyjne** (CSP, HSTS) — zależą od hostingu, projekt nie
  jest wdrożony.
