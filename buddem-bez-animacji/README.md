# BudDem bez animacji — projekt demonstracyjny strony firmy budowlanej

**BudDem nie istnieje.** Nazwa, logo, adres, e-mail i wszystkie liczby na tej
stronie zostały wymyślone na potrzeby portfolio. Projekt nie opisuje żadnego
realnego przedsiębiorstwa, nie jest ofertą i nie jest z nikim powiązany.

Powstał po to, żeby pokazać jedną umiejętność: **przeniesienie układu informacji
z serwisu dużego generalnego wykonawcy na jedną stronę**, bez podszywania się
pod istniejącą firmę.

**To wersja bez animacji wejścia.** Bliźniaczy projekt [`buddem`](../buddem/)
ma tę samą treść i ten sam układ, ale otwiera się animowaną nakładką. Ten
katalog jest samodzielny: nakładka nie jest tu wyłączona ani ukryta, tylko
wycięta z markupu, arkusza i kodu — pilnują tego test
`nothing on the page starts an entry animation` oraz `scripts/validate.mjs`.

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
3. **Treść od pierwszej klatki.** Nic nie zasłania strony na starcie, nie ma
   nakładki do usunięcia, przewijanie nie jest blokowane ani przez moment,
   a `sessionStorage` nie jest w ogóle używany.
4. **Brak animacji jest pilnowany, nie deklarowany.** Trzy pliki
   (`index.html`, `src/styles.css`, `src/app.js`) są przeszukiwane przez test
   i `performance-check.mjs` pod kątem śladów nakładki. Wklejenie jej z powrotem
   zatrzymuje bramkę.
5. **Bramka jako zabezpieczenie treści, nie tylko kodu.** Walidator blokuje
   publikację działającego telefonu i linków wychodzących — czyli dokładnie te
   dwie rzeczy, które w demie marki fikcyjnej mogłyby trafić w kogoś realnego.
6. **Brak zdjęć.** Cztery ilustracje to ręcznie napisane SVG (razem 7,9 kB).
   Nie ma stocku ani cudzych realizacji podanych jako własne.

## Czym różni się od wersji z animacją

| | `buddem` | `buddem-bez-animacji` (ten katalog) |
|---|---|---|
| Otwarcie strony | nakładka: kreska, wordmark, odjazd paneli (~0,82 s) | brak, treść od razu |
| `src/app.js` | `initIntro()` + `sessionStorage` + obsługa `Escape` | żadnego z tych elementów |
| `src/styles.css` | 6 klatek kluczowych, `body.intro-active` | wycięte (~3,1 kB mniej źródła) |
| Strony w buildzie | `index.html` + generowany `bez-intro.html` | jedna strona |
| Skrypty | dodatkowo `variant.mjs`, `build-variant.mjs` | bez nich |

Treść, paleta, sekcje i liczby są **identyczne**. To celowe: obie wersje mają
być porównywalne, a jedyną zmienną ma być animacja wejścia.

Klasy `.intro__grid`, `.intro__copy` i `.intro__figure` zostają w arkuszu —
to nazwy sekcji „o firmie", nie nakładki. Kontrole rozpoznają tę różnicę
(`.intro-` z myślnikiem to nakładka, `.intro__` z podkreśleniami to sekcja).

## Uruchomienie

```powershell
npm.cmd install
npm.cmd run dev
```

Strona jest jedna, pod `/`.

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
