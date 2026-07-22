# Muzeum Miasta Lipowo — WERSJA 2 „plakatowa" (projekt demonstracyjny)

Druga wersja wizualna demo muzeum miejskiego **Muzeum Miasta Lipowo** — ta sama
fikcyjna marka i ta sama treść co w `muzeum_bezdanych`, ale w innym języku
graficznym: **styl plakatowy / Bauhaus** — bloki podstawowych kolorów
(ultramaryna, czerwień, żółć, czerń, krem), ostre krawędzie, grube kontury,
twarde cienie offsetowe, nagłówki wersalikami i geometryczne dekoracje (koło,
trójkąt, półkole) w hero. Marka jest **w pełni fikcyjna** — wszystkie nazwy,
adresy, godziny, ceny biletów, tytuły wystaw i grafiki to **dane przykładowe**.

Powstała jako alternatywna propozycja obok wersji 1 (ścieżka „pełna anonimizacja"
z `dema stron/TODO-PORTFOLIO.md`), więc może być pokazywana bez zgody właściciela
— nie ma właściciela. Responsywna: pełny układ na desktopie, zwijana nawigacja
z hamburgerem i jednokolumnowe siatki na telefonie.

## Czym różni się od wersji 1

- **Tylko warstwa wizualna (`src/styles.css` + hero SVG + favicon).** Struktura
  HTML, skrypty i cała bramka QA są wspólne — to pokazuje, że ten sam,
  przetestowany szkielet obsługuje różne motywy.
- Paleta: ultramaryna `#2436c9` (wiodąca), czerwień `#e5361f` (akcent), żółć
  `#f2b60a`, czerń `#141318`, krem `#f2ead6`.
- Kafelki: ostre prostokąty z grubym konturem i twardym cieniem po najechaniu
  (zamiast miękkiego uniesienia). Efekt nadal tylko na części kafelków
  (`.tile--hover`) i wyłączany przy `prefers-reduced-motion`.
- Hero: kremowe tło z blokami koloru i geometrią, plakat jubileuszowy z wielkimi
  cyframi w grubej czarnej ramie.

## Podstrony (6)

| Plik | Podstrona |
|---|---|
| `index.html` | Start — hero plakatowy, pasek godzin/kontaktu, wydarzenia, wystawy, o muzeum, liczby, kolekcja, CTA |
| `wystawy.html` | Wystawy — ekspozycja stała, wystawy czasowe, zapowiedzi |
| `wydarzenia.html` | Wydarzenia — kalendarz z filtrem kategorii (oprowadzania / warsztaty / spacery / spotkania) |
| `kolekcje.html` | Kolekcje — galeria wybranych obiektów + jak budujemy zbiory |
| `zwiedzanie.html` | Zwiedzanie — godziny, bilety (`#bilety`), dojazd, dostępność, FAQ |
| `kontakt.html` | Kontakt — dane, godziny, mapa poglądowa, formularz |

## Zasady utrzymane z wersji 1

- **Brak animacji wejścia** — zero reguł `@keyframes`, brak nakładki intro.
- Strona działa **bez JavaScriptu** (treść i nawigacja widoczne; hamburger i filtr
  kalendarza to progresywne ulepszenia).
- Bezpieczeństwo danych (marka fikcyjna), egzekwowane przez `scripts/validate.mjs`
  na każdej z 6 podstron: zero `tel:`, zero `http(s)://`, zero ciągów w formacie
  numeru telefonu, e-mail tylko w domenie `muzeumlipowo.example`, komplet oznaczeń
  „Projekt demonstracyjny" / „marka fikcyjna" / „Dane przykładowe", `robots noindex`.
- Grafiki w `public/assets/` to ręcznie rysowane wizualizacje koncepcyjne (SVG).

## Uruchomienie i bramka jakości

```powershell
npm.cmd install
npm.cmd run dev        # podgląd deweloperski
npm.cmd run check      # syntax, code-safety (AST), walidator, testy, build, budżety
npm.cmd run qa         # check + benchmark serwera (6 podstron + zasoby)
npm.cmd run stability  # qa + determinizm buildu + test pamięci + stress serwera
npm.cmd audit          # podatności zależności
```

Aktualne wyniki: `TEST-REPORT.md` i `STABILITY-REPORT.md`.
