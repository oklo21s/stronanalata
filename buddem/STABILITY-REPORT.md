# Raport stabilności — BudDem

- **Data uruchomienia:** 20 lipca 2026 r.
- **Środowisko:** Windows 11 Pro 10.0.26200, Node.js v24.18.0
- **Komenda:** `npm.cmd run stability` (uruchamia po drodze `qa` i `check`)
- **Wszystkie liczby pochodzą z tego uruchomienia w katalogu `dema stron/buddem`.**

## Wynik zbiorczy

| Krok | Wynik |
|---|---|
| Determinizm buildu | ✅ 9 plików identycznych |
| Test pamięci (90 000 interakcji) | ✅ wzrost 4,1 MB przy limicie 12 MB |
| Stress serwera (1 200 żądań, 32 równolegle) | ✅ 0 błędów |

## Determinizm buildu

```
Build deterministyczny: 10 plików ma identyczne SHA-256 po dwóch kompilacjach.
```

Dziesiąty plik to druga strona (`bez-intro.html`) — build produkuje obie wersje
z jednego przebiegu.

Dwa kolejne `vite build` dają bajtowo identyczne wyjście — nazwy plików
z hashem nie zmieniają się między kompilacjami.

## Test pamięci

Node uruchomiony z `--expose-gc`. Dokument załadowany z realnego `index.html`
z wyciętymi znacznikami `<script>`, `bootstrap()` wykonany raz.

| Miara | Wartość |
|---|---|
| Interakcje łącznie | 90 000 |
| — klatki liczników | 50 000 |
| — przełączenia menu | 20 000 |
| — przełączenia FAQ | 20 000 |
| Sterta na starcie | 28 504 432 B |
| Po licznikach | 28 616 888 B |
| Po menu | 32 536 512 B |
| Sterta na końcu | 32 640 592 B |
| **Wzrost** | **4 136 160 B** |
| Limit | 12 582 912 B |

Jedna „klatka licznika” odpowiada temu, co robi animacja w przeglądarce:
policzenie postępu przez `easeOutCubic`, sformatowanie wartości przez
`formatStatValue` i zapis do `textContent`. 50 000 takich klatek podniosło
stertę o 126 kB — zdecydowana większość wzrostu pochodzi z przełączeń menu.

Po zakończeniu pętli sprawdzane jest, czy interfejs wrócił do spójnego stanu:

- menu zamknięte (`aria-expanded="false"`, brak klasy `menu-open`),
- każda z ośmiu statystyk pokazuje z powrotem wartość zgodną ze swoim
  `data-count-to`.

## Stress serwera

`vite preview`, 10 zasobów (obie strony plus zasoby), 1 200 żądań przy
równoległości 32.

| Miara | Wartość |
|---|---|
| Żądania udane | 1 200 / 1 200 |
| Przesłano | 9,95 MB |
| Przepustowość | 2 719,65 req/s |
| p50 | 11,18 ms |
| p95 | 18,63 ms |
| p99 | 25,79 ms |
| max | 30,65 ms |

Wersja bez animacji trafiła do puli automatycznie — skrypt czyta odnośniki
z `dist/index.html`, a przełącznik wersji jest zwykłym linkiem względnym.

Dodatkowo: **100 na 100** żądań przerwanych przez klienta w trakcie pobierania;
serwer po nich przeszedł **50** kontroli zdrowia. Brak błędów HTTP, brak
uszkodzonych odpowiedzi, proces serwera nie został przerwany.

## Zachowanie awaryjne sprawdzone w testach

- Brak `IntersectionObserver` w oknie — liczniki nie ruszają znaczników,
  wartości końcowe zostają widoczne (`the real document keeps every statistic
  readable without an observer`).
- `prefers-reduced-motion` — animacja wejścia usuwana przed startem, liczniki
  nie startują, sekcje od razu odsłonięte.
- 100 konkurencyjnych kliknięć „Pomiń animację” i naciśnięć `Escape` —
  sprzątanie wykonuje się dokładnie raz, bez błędu w konsoli.
- 50 000 losowych, deterministycznych próbek `easeOutCubic` mieści się
  w przedziale [0, 1]; 20 000 wywołań `formatStatValue` zwraca zawsze łańcuch
  albo `null`, nigdy `NaN` ani `undefined` w treści.

## Czego NIE sprawdzono

- **Zachowania pod realnym obciążeniem sieciowym** — pomiary są lokalne
  (`127.0.0.1`), bez opóźnień, strat pakietów i kompresji serwera
  produkcyjnego.
- **Stabilności w przeglądarce przez dłuższy czas** — brak sesji
  przeglądarkowej, więc nie zmierzono wycieków w realnym silniku renderującym
  ani płynności animacji liczników w klatkach.
- **Zachowania na urządzeniu mobilnym** — nie testowano na sprzęcie.
- **Odporności hostingu** — projekt nie jest wdrożony.
