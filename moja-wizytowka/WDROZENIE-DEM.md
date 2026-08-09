# Wdrożenie dem podlinkowanych z `/realizacje/`

Galeria realizacji linkuje do dziesięciu adresów w domenie `stronanalata.pl`.
Pięć z nich **nie jest jeszcze wdrożone** — dopóki nie staną się dostępne,
te kafle prowadzą w 404.

Kody źródłowe dem leżą w `C:\Users\mikol\Desktop\stronanalata\` (osobne repo).

## 1. Adresy wymagane przez galerię

| Adres w galerii                       | Folder źródłowy w repo `stronanalata` | Stan            |
| ------------------------------------- | ------------------------------------- | --------------- |
| `stronanalata.pl/buddem`              | `buddem`                              | wdrożone        |
| `stronanalata.pl/buddem-bez-animacji` | `buddem-bez-animacji`                 | wdrożone        |
| `stronanalata.pl/krojnia`             | `marka_wlasna`                        | wdrożone        |
| `stronanalata.pl/muzeum`              | `muzeum_bezdanych`                    | wdrożone        |
| `stronanalata.pl/muzeum-plakat`       | `muzeum_bezdanych_v2`                 | wdrożone        |
| `stronanalata.pl/glow-room`           | `glow-room`                           | **do wdrożenia** |
| `stronanalata.pl/drivenow`            | `wypozyczalnia-aut`                   | **do wdrożenia** |
| `stronanalata.pl/ostoja`              | `ostoja-zoo`                          | **do wdrożenia** |
| `stronanalata.pl/meridian`            | `meridian-expeditions`                | **do wdrożenia** |
| `stronanalata.pl/perspektywa`         | `studio-perspektywa`                  | **do wdrożenia** |

Stan „wdrożone” pochodzi z tego, że adresy te były już podlinkowane na
poprzedniej wersji wizytówki. **Sprawdź je** przed publikacją — nie
weryfikowałem ich dostępności.

## 2. Czego brakuje po stronie dem

Trzy dema są pojedynczymi plikami `index.html` bez builda i bez `Dockerfile`,
więc nie da się ich wystawić w EasyPanel tak jak pozostałych:

- `glow-room` — `index.html` + `favicon.svg` + `README.md`
- `ostoja-zoo` — sam `index.html` (brak też `README.md`)
- `studio-perspektywa` — `index.html` + `favicon.svg` + `README.md`

Dla każdego z nich potrzeba `Dockerfile` z `nginx` serwującym katalog, albo
wrzucenia plików wprost do podkatalogu `public_html` na Hostingerze. Ta druga
droga jest prostsza i nie wymaga niczego dopisywać do kodu dem.

Uwaga na treść: `glow-room` ładuje z sieci Google Fonts, zdjęcia z Unsplash i
mapę OpenStreetMap w `<iframe>`. To kłóci się z zasadą „zero zasobów
zewnętrznych”, którą deklaruje wizytówka, i wymaga decyzji przed publikacją —
albo lokalne zasoby, albo zmiana deklaracji.

`wypozyczalnia-aut` i `meridian-expeditions` mają już `Dockerfile` i `nginx.conf`,
więc idą tą samą ścieżką co reszta.

## 3. Kolejność

1. Wdróż pięć brakujących dem pod adresami z tabeli powyżej.
2. Otwórz `/realizacje/` i kliknij każdy z dziesięciu kafli.
3. Dopiero potem zgłoś sitemapę w Google Search Console.

Punkt 2 jest ważny: strona z pięcioma martwymi linkami szkodzi bardziej niż
galeria z pięcioma projektami.

## 4. Gdy zmienisz slug dema

Adresy są sprawdzane automatycznie. Po zmianie któregokolwiek zaktualizuj
tablicę `demoSlugs` w `scripts/validate.mjs` — inaczej `npm run validate`
przestanie przechodzić.
