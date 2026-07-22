# Muzeum Miasta Lipowo — muzeum miejskie (projekt demonstracyjny)

Wielopodstronowe demo strony muzeum miejskiego. **Marka jest w pełni fikcyjna** —
„Muzeum Miasta Lipowo” nie istnieje, a wszystkie nazwy, adresy, godziny, ceny
biletów, tytuły wystaw i grafiki to **dane przykładowe**. Projekt powstał jako
pozycja do portfolio, ścieżką „pełna anonimizacja” z `dema stron/TODO-PORTFOLIO.md`,
więc może być pokazywany bez zgody właściciela — nie ma właściciela.

Układ wzorowany na współczesnych stronach muzeów miejskich (hero jubileuszowy,
niebieski pasek informacyjny, siatki wydarzeń i wystaw, galeria zbiorów), ale
bez żadnych danych konkretnej instytucji. Responsywny: pełny układ na desktopie,
zwijana nawigacja z hamburgerem i jednokolumnowe siatki na telefonie.

## Co to jest

Statyczna strona (Vite + `lucide`, bez frameworka, bez fontów i zasobów
zewnętrznych) złożona z **sześciu podstron**:

| Plik | Podstrona |
|---|---|
| `index.html` | Start — hero jubileuszowy, pasek godzin/kontaktu, wydarzenia, wystawy, o muzeum, liczby, kolekcja, CTA |
| `wystawy.html` | Wystawy — ekspozycja stała, wystawy czasowe, zapowiedzi |
| `wydarzenia.html` | Wydarzenia — kalendarz z filtrem kategorii (oprowadzania / warsztaty / spacery / spotkania) |
| `kolekcje.html` | Kolekcje — galeria wybranych obiektów + jak budujemy zbiory |
| `zwiedzanie.html` | Zwiedzanie — godziny, bilety (`#bilety`), dojazd, dostępność, FAQ |
| `kontakt.html` | Kontakt — dane, godziny, mapa poglądowa, formularz |

## Dwie świadome decyzje projektowe

1. **Brak animacji wejścia.** Strona nie ma żadnej nakładki intro ani nic, co
   rusza się samo przy wczytaniu. W arkuszu stylów **nie ma ani jednej reguły
   klatek kluczowych** (`@keyframes`) — pilnują tego walidator, kontrola
   wydajności i test „nothing on the site starts an entry animation”.
2. **Ruch tylko po najechaniu i tylko na części kafelków.** Efekt uniesienia +
   zbliżenia obrazu ma klasa `.tile--hover` (karty wydarzeń i wystaw na stronie
   głównej, kafelki wystaw czasowych). Zwykłe kafelki informacyjne (`.tile` bez
   `--hover`) są nieruchome. Walidator liczy oba rodzaje i wymaga, żeby
   **istniały jedne i drugie** — „część, ale nie wszystkie”. Efekt jest wyłączany
   przy `prefers-reduced-motion`.

Strona działa **bez JavaScriptu**: treść i pełna nawigacja są widoczne (na wąskich
ekranach linki się zawijają; hamburgera i rozwijane menu włącza dopiero klasa
`js` dodawana przez mały skrypt w `<head>`). Filtr kalendarza wydarzeń to
progresywne ulepszenie — bez JS wszystkie kategorie są widoczne.

## Bezpieczeństwo danych (marka fikcyjna)

Egzekwuje `scripts/validate.mjs` — build się przerywa, jeśli którakolwiek reguła
padnie na dowolnej podstronie:

- zero linków `tel:` i zero adresów `http(s)://` w `href`/`src`;
- zero ciągów w formacie numeru telefonu;
- e-mail wyłącznie w zarezerwowanej domenie `muzeumlipowo.example`;
- na każdej podstronie muszą być oznaczenia: „Projekt demonstracyjny”,
  „marka fikcyjna”, „Dane przykładowe” oraz nazwa i domena marki;
- lista zakazanych ogólników (anty-slop);
- `robots: noindex, nofollow` + baner „Nieoficjalny prototyp”.

Dane rejestrowe (NIP/REGON), nazwiska i wizerunki są świadomie pominięte.
Telefon jest oznaczony „Do potwierdzenia” — demo nie publikuje działającego
numeru. Formularz kontaktowy niczego nie wysyła (jest oznaczony jako
demonstracyjny).

## Grafika

Wszystkie obrazy w `public/assets/` to **wektorowe wizualizacje koncepcyjne**
(SVG rysowane ręcznie), a nie zdjęcia: plakat jubileuszowy (hero), trzy grafiki
wystaw, wnętrze sali, sześć obiektów kolekcji i mapa poglądowa. Każdy ma podpis
„Wizualizacja koncepcyjna” lub „Dane przykładowe”. Nie przedstawiają istniejącej
instytucji ani konkretnych eksponatów.

## Uruchomienie

```powershell
npm.cmd install
npm.cmd run dev       # podgląd deweloperski
npm.cmd run build     # build produkcyjny do dist/
npm.cmd run preview   # podgląd buildu
```

## Bramka jakości

```powershell
npm.cmd run check      # syntax, code-safety (AST), walidator, testy, build, budżety
npm.cmd run qa         # check + benchmark serwera (6 podstron + zasoby)
npm.cmd run stability  # qa + determinizm buildu + test pamięci + stress serwera
npm.cmd audit          # podatności zależności
```

Aktualne wyniki: `TEST-REPORT.md` i `STABILITY-REPORT.md`.
