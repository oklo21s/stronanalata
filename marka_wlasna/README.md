# Krojnia — projekt demonstracyjny strony własnej marki odzieży

**Krojnia nie istnieje.** Nazwa, logo, adres, e-mail i wszystkie liczby na tej
stronie zostały wymyślone na potrzeby portfolio. Projekt nie opisuje żadnej
realnej marki ani szwalni, nie jest ofertą i nie jest z nikim powiązany.

Powstał po to, żeby pokazać jedną umiejętność: **przeniesienie układu informacji
strony marki odzieżowej (bluzy, swetry, podkoszulki) na jedną stronę**, bez
podszywania się pod istniejącą firmę.

## Dlaczego marka jest fikcyjna

Pozostałe dema w katalogu `dema stron/` używają danych realnych firm z Kozienic
i zgodnie z [TODO-PORTFOLIO.md](../TODO-PORTFOLIO.md) wymagają zgody właściciela
albo anonimizacji, zanim trafią do publicznego portfolio. Krojnia od początku
idzie drugą ścieżką — jest w całości zmyślona, więc może być pokazywana bez
niczyjej zgody.

Praktyczne konsekwencje, wymuszone przez `scripts/validate.mjs`:

- **żadnego linku `tel:`** — zmyślony numer mógłby połączyć kogoś z przypadkową
  osobą, więc przyciski prowadzą do `#kontakt`;
- **żadnego adresu zewnętrznego** — brak map, profili i bibliotek z sieci;
- **żadnego ciągu wyglądającego jak numer telefonu** w treści;
- adres e-mail w domenie `.example`, zarezerwowanej do dokumentacji (RFC 2606);
- adres pracowni dobrany tak, żeby nie wskazywał realnego miejsca;
- dane rejestrowe (NIP, REGON, KRS) **świadomie pominięte** — zmyślony numer
  mógłby przypadkiem trafić w prawdziwą firmę.

Walidator traktuje oznaczenia „Projekt demonstracyjny”, „marka fikcyjna”
i „Dane przykładowe” jako **wymagane** — nie da się ich usunąć bez zerwania
bramki jakości.

## Skąd wzięty jest układ

Struktura odwzorowuje kolejność sekcji typową dla strony głównej marki
odzieżowej, z regułą „sześć **otwartych** kart, bez zakładek” przeniesioną
z [ORGANIZACJA-STRONY-BUDIMEX-TODO.md](../../budowlanka/ORGANIZACJA-STRONY-BUDIMEX-TODO.md):

| Sekcja typowej strony marki | Odpowiednik w Krojni |
|---|---|
| Pasek promocyjny / notka | Pasek statusu: marka fikcyjna, dane przykładowe, brak telefonu |
| Hero ze sloganem | Hero z konkretnym `h1` mówiącym, co marka robi |
| Kategorie produktów | Sześć **otwartych** kart wyrobów, bez zakładek |
| Marka w liczbach | Pasmo liczb jawnie opisane jako dane przykładowe |
| Pracownia / o nas | Sekcja pracowni z zastrzeżeniem, że nabór nie jest prowadzony |
| Skala produkcji | Drugie pasmo liczb |
| Dlaczego własna marka | Efekty pracy — sześć kafelków |
| Jak powstaje kolekcja | Przebieg zamówienia — cztery etapy |
| Galeria produktów | Uczciwa notka o braku zdjęć gotowych ubrań |
| Stopka z danymi firmy | Stopka z ujawnieniem fikcyjności, bez danych rejestrowych |

Świadomie **odrzucone**: pusty slogan (walidator blokuje ten rejestr jako
anty-slop), zmyślone opinie klientów, ceny podane jako realne, sklep
z koszykiem, wybór języka i ikony mediów społecznościowych.

## Decyzje projektowe warte pokazania

1. **Zakres widoczny bez klikania.** Sześć wyrobów to otwarta siatka kart, nie
   zakładki. Cała treść jest czytelna przy wyłączonym JavaScripcie — test
   `all six activity cards stay open` tego pilnuje.
2. **Liczniki, które nie kłamią przy braku JS.** Wartość końcowa stoi
   w HTML-u; skrypt tylko animuje dojście do niej i na końcu przywraca
   dokładnie tekst ze źródła. Bez JS, bez `IntersectionObserver` i przy
   `prefers-reduced-motion` liczby są od razu poprawne.
3. **Dwie wersje z jednego źródła.** Wariant bez animacji jest generowany
   z `index.html`, a bramka pilnuje, żeby się nie rozjechały — zamiast
   kopiowania strony i utrzymywania dwóch kopii ręcznie.
4. **Animacja tylko na kompozytorze.** Reguła „wyłącznie `transform`
   i `opacity`" nie jest zaleceniem w komentarzu, tylko sprawdzanym warunkiem
   — test i `performance-check.mjs` odrzucają każdą klatkę kluczową
   animującą właściwość wymuszającą układ.
5. **Bramka jako zabezpieczenie treści, nie tylko kodu.** Walidator blokuje
   publikację działającego telefonu i linków wychodzących — czyli dokładnie te
   dwie rzeczy, które w demie marki fikcyjnej mogłyby trafić w kogoś realnego.
6. **Brak zdjęć.** Cztery ilustracje to ręcznie napisane SVG (razem ok. 10,5 kB).
   Nie ma stocku ani cudzych produktów podanych jako własne.

## Dwie wersje strony

Projekt buduje **dwie strony z jednej treści**:

| Plik | Adres | Różnica |
|---|---|---|
| `index.html` | `/` | z animacją wejścia |
| `bez-intro.html` | `/bez-intro.html` | bez animacji wejścia |

Obie mają w górnym pasku przełącznik na drugą wersję, więc da się je porównać
jednym kliknięciem.

**Wariant jest generowany, nie pisany ręcznie.** Po każdej zmianie w
`index.html` uruchom:

```powershell
npm.cmd run variant
```

Reguły różnicy siedzą w jednym miejscu — `scripts/variant.mjs`. Korzysta z nich
generator **oraz walidator**, który odtwarza wariant z bieżącego `index.html`
i porównuje z plikiem na dysku. Jeśli ktoś zmieni treść i zapomni przegenerować,
bramka przerywa z komunikatem `bez-intro.html rozjechał się z index.html`.

## Animacja wejścia — na co zwrócono uwagę

Reguła „tylko `transform` i `opacity`” jest **egzekwowana**: test
`the intro animation touches only compositor-friendly properties` i osobna
kontrola w `performance-check.mjs` przeglądają wszystkie sześć klatek kluczowych
i odrzucają każdą właściwość wymuszającą układ. Kreska zamiast rosnąć przez
`width` skaluje się `transform: scaleX()`, a `scrollbar-gutter: stable` na `html`
nie pozwala blokadzie scrolla przesuwać strony na starcie i na końcu.

**Oś czasu:** kreska 0–0,28 s → napis 0,16–0,46 s → wygaszenie treści i odjazd
paneli 0,44–0,82 s. Twardy limit w JS: 900 ms.

Trzy warunki są **sprawdzane automatycznie** (`performance-check.mjs` plus test
`the intro clears the screen well before the hard limit`):

- animacja kończy się przed progiem 1 400 ms,
- twardy limit jest **późniejszy** niż koniec ostatniej animacji,
- martwy czas między nimi nie przekracza 250 ms.

Animacja jest pomijalna przyciskiem i `Escape`, odtwarza się raz na sesję
(`?intro=1` wymusza powtórkę) i jest całkowicie wyłączona przy
`prefers-reduced-motion`.

## Uruchomienie

```powershell
npm.cmd install
npm.cmd run dev
```

Wersja z animacją: `/` · wersja bez animacji: `/bez-intro.html` ·
powtórka animacji: `/?intro=1`

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

- Nie ma galerii produktów — marka fikcyjna niczego nie uszyła.
- Nie ma działającego formularza, koszyka ani backendu.
- Nie wykonano kontroli w prawdziwej przeglądarce ani pomiaru Lighthouse
  (wymaga Chrome, niedostępny w środowisku, w którym projekt powstał).
