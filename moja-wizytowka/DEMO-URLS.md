# Adresy dem w sekcji Realizacje

Sekcja `#realizacje` w `index.html` linkuje 5 kafelków do żywych dem pod `stronanalata.pl`
(hosting Coolify, path-based). Stare adresy Netlify zostały wycofane.

## Lista adresów (mapowanie po treści demo)

| `data-demo`            | Katalog źródłowy demo             | URL                                        |
| ---------------------- | --------------------------------- | ------------------------------------------ |
| `buddem`               | `dema stron/buddem/`              | https://stronanalata.pl/buddem             |
| `buddem-bez-animacji`  | `dema stron/buddem-bez-animacji/` | https://stronanalata.pl/buddem-bez-animacji |
| `krojnia`              | `dema stron/marka_wlasna/`        | https://stronanalata.pl/krojnia            |
| `muzeum`               | `dema stron/muzeum_bezdanych/`    | https://stronanalata.pl/muzeum             |
| `muzeum-plakat`        | `dema stron/muzeum_bezdanych_v2/` | https://stronanalata.pl/muzeum-plakat      |

Mapowanie w `index.html` jest zrobione po **treści** (co pokazuje demo), nie po nazwie
katalogu — np. `marka_wlasna` serwuje markę „Krojnia" pod ścieżką `/krojnia`.

## Gdy zmienisz adresy demo

1. Podmień **oba** wystąpienia URL-a dla danego kafelka (link na miniaturze
   `project-card__visual` i link tekstowy `project-card__link`). Szukaj po `data-demo`.
2. Zostaw `target="_blank" rel="noopener"` bez zmian.
3. Uruchom `npm run qa` i sprawdź, że każdy link otwiera właściwe demo w nowej karcie.

## Miniatury

`public/assets/project-*.svg` to lekkie podglądy układu (~1,3 KB, 16:10), nie zrzuty
ekranu. Realne screenshoty: WebP/AVIF 16:10, `width="720" height="450"` (zero CLS),
`loading="lazy"`, budżet `npm run performance` (cały build ≤ 220 000 B).
