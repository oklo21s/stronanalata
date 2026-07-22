# Raport stabilności — BudDem bez animacji

- **Data uruchomienia:** 20 lipca 2026 r.
- **Środowisko:** Windows 11 Pro 10.0.26200, Node.js v24.18.0
- **Komendy:** `stability:build`, `stability:memory`, `stability:server`,
  uruchomione po zielonych `check` i `performance:server`.
- **Wszystkie liczby pochodzą z tego uruchomienia w katalogu
  `dema stron/buddem-bez-animacji`.**

## Wynik zbiorczy

| Krok | Wynik |
|---|---|
| Determinizm buildu | ✅ 9 plików identycznych |
| Test pamięci (90 000 interakcji) | ✅ wzrost 4,14 MB przy limicie 12 MB |
| Stress serwera (1 200 żądań, 32 równolegle) | ✅ 0 błędów |

## Determinizm buildu

```
Build deterministyczny: 9 plików ma identyczne SHA-256 po dwóch kompilacjach.
```

Dziewięć, nie dziesięć jak w `buddem` — brakuje drugiej strony
(`bez-intro.html`), bo ten projekt buduje tylko `index.html`.

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
| Sterta na starcie | 28 431 464 B |
| Po licznikach | 28 545 472 B |
| Po menu | 32 471 584 B |
| Sterta na końcu | 32 575 808 B |
| **Wzrost** | **4 144 344 B** |
| Limit | 12 582 912 B |

Jedna „klatka licznika" odpowiada temu, co robi animacja liczb w przeglądarce:
policzenie postępu przez `easeOutCubic`, sformatowanie wartości przez
`formatStatValue` i zapis do `textContent`. 50 000 takich klatek podniosło
stertę o 114 kB — zdecydowana większość wzrostu pochodzi z przełączeń menu.

Wynik jest praktycznie taki sam jak w wersji animowanej (4,14 MB wobec
4,14 MB). To spodziewane: nakładka wejściowa i tak żyła jedną sesję i była
usuwana z drzewa, więc nie miała udziału w tej pętli.

Po zakończeniu pętli sprawdzane jest, czy interfejs wrócił do spójnego stanu:

- menu zamknięte (`aria-expanded="false"`, brak klasy `menu-open`),
- każda z ośmiu statystyk pokazuje z powrotem wartość zgodną ze swoim
  `data-count-to`.

## Stress serwera

`vite preview`, 9 zasobów, 1 200 żądań przy równoległości 32.

| Miara | Wartość |
|---|---|
| Żądania udane | 1 200 / 1 200 |
| Przesłano | 7,38 MB |
| Przepustowość | 2 554,94 req/s |
| p50 | 12,06 ms |
| p95 | 19,18 ms |
| p99 | 23,12 ms |
| max | 27,98 ms |

Mniej przesłanych megabajtów niż w `buddem` (7,38 wobec 9,95 MB), bo pula
zasobów jest o jedną stronę krótsza — skrypt czyta odnośniki z
`dist/index.html`, a tutaj nie ma już linku do wariantu.

Dodatkowo: **100 na 100** żądań przerwanych przez klienta w trakcie pobierania;
serwer po nich przeszedł **50** kontroli zdrowia. Brak błędów HTTP, brak
uszkodzonych odpowiedzi, proces serwera nie został przerwany.

## Zachowanie awaryjne sprawdzone w testach

- Brak `IntersectionObserver` w oknie — liczniki nie ruszają znaczników,
  wartości końcowe zostają widoczne (`the real document keeps every statistic
  readable without an observer`).
- `prefers-reduced-motion` — liczniki nie startują, sekcje od razu odsłonięte.
  Nie ma tu animacji wejścia do wyłączenia.
- 1 000 naciśnięć `Escape` pod adresem `?intro=1` — treść nietknięta,
  `sessionStorage` pusty, zero błędów w konsoli.
- 2 000 przełączeń menu wraca do czystego stanu zamkniętego; 1 000 przełączeń
  FAQ nigdy nie zostawia więcej niż jednej otwartej pozycji.
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
