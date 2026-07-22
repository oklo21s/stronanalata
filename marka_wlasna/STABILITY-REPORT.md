# Raport stabilności — Krojnia

- **Data uruchomienia:** 21 lipca 2026 r.
- **Środowisko:** Windows 11 Pro 10.0.26200, Node.js v24.18.0
- **Komenda:** `npm.cmd run stability` (uruchamia po drodze `qa` i `check`)
- **Wszystkie liczby pochodzą z tego uruchomienia w katalogu `dema stron/marka_wlasna`.**
- **Kontekst:** pełny przebieg powtórzony po poprawce układu `header.site-header`
  (grupowanie `desktop-nav` + `nav-search` w `.header-center`, ograniczenie
  szerokości szukajki) — zmiana dotyczy tylko CSS/HTML nagłówka, JS
  niezmieniony, stąd liczby pamięci/stress serwera pozostają w tym samym
  rzędzie wielkości co poprzednio.

## Wynik zbiorczy

| Krok | Wynik |
|---|---|
| Determinizm buildu | ✅ 10 plików identycznych |
| Test pamięci (90 000 interakcji) | ✅ wzrost 4,1 MB przy limicie 12 MB |
| Stress serwera (1 200 żądań, 32 równolegle) | ✅ 0 błędów |

## Determinizm buildu

```
Build deterministyczny: 10 plików ma identyczne SHA-256 po dwóch kompilacjach.
```

Build produkuje obie wersje (`index.html` i `bez-intro.html`) z jednego
przebiegu. Dwa kolejne `vite build` dają bajtowo identyczne wyjście — nazwy
plików z hashem nie zmieniają się między kompilacjami.

## Test pamięci

Node uruchomiony z `--expose-gc`. Dokument załadowany z realnego `index.html`
z wyciętymi znacznikami `<script>`, `bootstrap()` wykonany raz.

| Miara | Wartość |
|---|---|
| Interakcje łącznie | 90 000 |
| — klatki liczników | 50 000 |
| — przełączenia menu | 20 000 |
| — przełączenia FAQ | 20 000 |
| Sterta na starcie | 29 076 312 B |
| Po licznikach | 29 168 536 B |
| Po menu | 33 086 096 B |
| Sterta na końcu | 33 186 016 B |
| **Wzrost** | **4 109 704 B** |
| Limit | 12 582 912 B |

Jedna „klatka licznika” odpowiada temu, co robi animacja w przeglądarce:
policzenie postępu przez `easeOutCubic`, sformatowanie wartości przez
`formatStatValue` i zapis do `textContent`. 50 000 takich klatek podniosło
stertę o ok. 111 kB — zdecydowana większość wzrostu pochodzi z przełączeń menu.

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
| Przesłano | 11,10 MB |
| Przepustowość | 2 716,35 req/s |
| p50 | 11,57 ms |
| p95 | 17,85 ms |
| p99 | 24,43 ms |
| max | 28,80 ms |

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
