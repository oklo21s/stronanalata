# STABILITY-REPORT — Muzeum Miasta Lipowo (projekt demonstracyjny)

- **Data uruchomienia:** 21 lipca 2026 r.
- **Środowisko:** Windows 11, Node.js v24.18.0, Vite 8.1.5.
- **Zakres:** `npm.cmd run stability` (obejmuje `qa`) + `npm.cmd audit`.
- Wszystkie liczby pochodzą z realnego uruchomienia w tym katalogu.

## Wynik zbiorczy

| Krok | Komenda | Wynik |
|---|---|---|
| Determinizm buildu | `npm run stability:build` | ✅ 22 pliki, identyczne SHA-256 po 2 kompilacjach |
| Test pamięci | `npm run stability:memory` | ✅ 100 000 interakcji |
| Stress serwera | `npm run stability:server` | ✅ 1 200 żądań, 0 błędów |
| Audyt zależności | `npm audit` | ✅ 0 podatności |

## Determinizm buildu

Dwa kolejne `vite build` dają **22 pliki o identycznych sumach SHA-256** —
build jest powtarzalny.

## Test pamięci (`--expose-gc`)

100 000 interakcji: 40 000 przełączeń menu mobilnego, 40 000 przełączeń FAQ,
20 000 wywołań filtra kalendarza. Interakcje obciążają podstronę „Zwiedzanie”
(to na niej występuje akordeon FAQ).

| Metryka | Wartość |
|---|---|
| Sterta na starcie | 24 669 296 B |
| Po przełączaniu menu | 31 079 784 B |
| Po przełączaniu FAQ | 31 154 424 B |
| Sterta na końcu | 31 111 176 B |
| **Wzrost sterty** | **6 441 880 B** (limit 12 582 912 B) |

Interfejs wrócił do spójnego stanu (menu zamknięte, najwyżej jedna pozycja FAQ
otwarta, filtr zgodny z oczekiwaniem). Brak nieograniczonego wzrostu sterty.

## Stress serwera (`vite preview`)

1 200 żądań, równoległość 32, po 23 adresach (6 podstron + zasoby + `robots.txt`).
Każda odpowiedź porównana co do rozmiaru i sumy SHA-256 z bazową.

| Metryka | Wartość |
|---|---|
| Udane odpowiedzi | 1 200 / 1 200 |
| Przepustowość | 2 813 req/s |
| p50 / p95 / p99 | 10,72 / 18,20 / 22,17 ms |
| max | 25,24 ms |
| Anulowane przez klienta | 100 / 100 obsłużone |
| Kontrole zdrowia po soak | 50 / 50 |

Brak błędów HTTP, brak uszkodzeń odpowiedzi, serwer nie przerwał pracy, `stderr`
czysty. p99 (22,17 ms) daleko poniżej progu 1 000 ms.

## Audyt zależności

`npm audit` → **found 0 vulnerabilities**.

## Czego NIE sprawdzono

- Realna kontrola wizualna i klawiaturowa w przeglądarce (bez JS oraz z
  `prefers-reduced-motion`) — wymaga sesji przeglądarkowej, nie było jej w tym
  przejściu.
- Nagłówki produkcyjne (HSTS, CSP), które zależą od docelowego hostingu.
