# Adresy dem w sekcji Realizacje

Sekcja `#realizacje` w `index.html` linkuje 5 kafelków do żywych dem na Netlify.
**Stan: adresy wstawione i zweryfikowane (żywe, HTTP 200).** Placeholderów `example.com`
już nie ma.

## Lista adresów (mapowanie po treści demo, nie po nazwie sajta)

| `data-demo`            | Katalog źródłowy demo             | URL                                    |
| ---------------------- | --------------------------------- | -------------------------------------- |
| `buddem`               | `dema stron/buddem/`              | https://budden.netlify.app/            |
| `buddem-bez-animacji`  | `dema stron/buddem-bez-animacji/` | https://budden-animacja.netlify.app/   |
| `krojnia`              | `dema stron/marka_wlasna/`        | https://marka-wlasna.netlify.app/      |
| `muzeum`               | `dema stron/muzeum_bezdanych/`    | https://muzeum.netlify.app/            |
| `muzeum-plakat`        | `dema stron/muzeum_bezdanych_v2/` | https://muzeumv2.netlify.app/          |

## ⚠️ Uwaga: nazwy Netlify są odwrócone względem treści

- `budden.netlify.app` serwuje wersję **z** animacją wejścia → kafelek `buddem`.
- `budden-animacja.netlify.app` ma w tytule „BudDem **bez** animacji" → kafelek `buddem-bez-animacji`.

Mapowanie w `index.html` jest zrobione po **treści** (co pokazuje demo), więc jest
poprawne mimo mylących nazw subdomen. Gdybyś kiedyś zmieniał adresy, patrz na treść,
nie na nazwę sajta.

## Gdy zmienisz adresy demo

1. Podmień **oba** wystąpienia URL-a dla danego kafelka (link na miniaturze
   `project-card__visual` i link tekstowy `project-card__link`). Szukaj po `data-demo`.
2. Zostaw `target="_blank" rel="noopener"` bez zmian.
3. Uruchom `npm run qa` i sprawdź, że każdy link otwiera właściwe demo w nowej karcie.

## Miniatury

`public/assets/project-*.svg` to lekkie podglądy układu (~1,3 KB, 16:10), nie zrzuty
ekranu. Realne screenshoty: WebP/AVIF 16:10, `width="720" height="450"` (zero CLS),
`loading="lazy"`, budżet `npm run performance` (cały build ≤ 220 000 B).
