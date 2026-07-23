# TODO — migracja dem z Netlify na stronanalata.pl

Aktualizacja: 23 lipca 2026 r.

Cel: 5 dem obecnie linkowanych z sekcji Realizacje w `moja-wizytowka` (patrz
`moja-wizytowka/DEMO-URLS.md`) ma zejść z subdomen Netlify na ładne, stałe
adresy pod własną domeną `stronanalata.pl`, hostowane już w Coolify (osobna
aplikacja na folder, zob. pamięć `stronanalata-coolify-hosting`).

## Proponowana mapa ścieżek

| Ścieżka docelowa | Folder w repo | Obecny adres Netlify |
|---|---|---|
| `stronanalata.pl/buddem` | `buddem` | `budden.netlify.app` |
| `stronanalata.pl/buddem-bez-animacji` | `buddem-bez-animacji` | `budden-animacja.netlify.app` |
| `stronanalata.pl/krojnia` | `marka_wlasna` | `marka-wlasna.netlify.app` |
| `stronanalata.pl/muzeum` | `muzeum_bezdanych` | `muzeum.netlify.app` |
| `stronanalata.pl/muzeum-plakat` | `muzeum_bezdanych_v2` | `muzeumv2.netlify.app` |

Do potwierdzenia: czy ta mapa nazw ścieżek jest ostateczna, zanim wejdzie do
`index.html` wizytówki.

## P0 — konfiguracja w panelu Coolify (ręcznie, po stronie Kacpra)

**Stan na 23 lipca 2026:** w Coolify (projekt „My first project" / env
„production") istnieje na razie **tylko jedna appka** — `moja-wizytowka`
(`https://stronanalata.pl`). Pozostałych 5 trzeba dopiero **stworzyć** przez
„+ New" w widoku Resources, każda wskazująca na ten sam repo
`oklo21s/stronanalata`, różniąca się tylko Base Directory.

- [ ] `buddem` — nowa appka: Build Pack `Dockerfile`, Base Directory
  `/buddem`, Dockerfile Location `/Dockerfile`, Docker Build Stage Target
  puste, Ports Exposes `80`, Domains `https://stronanalata.pl/buddem` →
  **Deploy** (pierwsze wdrożenie). Zrobić i sprawdzić tę jedną appkę jako
  pierwszą, zanim powieli się resztę — potwierdzić czy Coolify faktycznie
  dokłada strip-prefix dla ścieżki i czy assety Vite (JS/CSS root-relative)
  ładują się poprawnie spod subpath.
- [ ] `buddem-bez-animacji` — analogicznie, Base Directory
  `/buddem-bez-animacji`, Domains `/buddem-bez-animacji`.
- [ ] `marka_wlasna` — analogicznie, Base Directory `/marka_wlasna`, Domains
  `/krojnia`.
- [ ] `muzeum_bezdanych` — analogicznie, Base Directory `/muzeum_bezdanych`,
  Domains `/muzeum`.
- [ ] `muzeum_bezdanych_v2` — analogicznie, Base Directory
  `/muzeum_bezdanych_v2`, Domains `/muzeum-plakat`.
- [ ] `moja-wizytowka` — zostawić bez zmian, trzyma samą domenę
  `stronanalata.pl` (bez ścieżki), żeby nie kolidowała z powyższymi
  PathPrefixami.
- [ ] Po każdym wdrożeniu sprawdzić w przeglądarce, że adres faktycznie
  odpowiada (HTTP 200, właściwa treść, HTTPS/Let's Encrypt wystawiony).

## P0 — decyzja o `noindex`

- [ ] Zdecydować, czy `krojnia` (`marka_wlasna/index.html`, obecnie
  `<meta name="robots" content="noindex, nofollow">`) ma zostać zaindeksowana
  przez Google, skoro będzie na stałe wisieć jako portfolio linkowane z
  wizytówki (SEO wizytówki) — czy zostaje `noindex` tak jak dziś.
- [ ] Sprawdzić to samo dla pozostałych 4 dem (`buddem`,
  `buddem-bez-animacji`, `muzeum_bezdanych`, `muzeum_bezdanych_v2`) — ujednolicić
  decyzję, żeby nie było niespójności między kafelkami w tej samej sekcji.

## P1 — aktualizacja repo `strony.chat` (zrobię po potwierdzeniu, że adresy żyją)

- [ ] Podmienić 5 adresów w `moja-wizytowka/DEMO-URLS.md` z Netlify na nowe
  `stronanalata.pl/...`.
- [ ] Podmienić **oba** wystąpienia URL-a na kafelek w
  `moja-wizytowka/index.html` (miniatura `project-card__visual` i link
  tekstowy `project-card__link`), szukać po `data-demo`. `target="_blank"
  rel="noopener"` zostaje bez zmian.
- [ ] Uruchomić `npm run qa` w `moja-wizytowka` i kliknąć wszystkie 5 kafelków
  ręcznie, sprawdzić że każdy otwiera właściwe demo pod nowym adresem.

## P2 — porządki

- [ ] Po potwierdzeniu, że nowe adresy działają stabilnie, rozważyć wyłączenie/
  usunięcie starych stron na Netlify, żeby nie utrzymywać dwóch kopii.
- [ ] Zaktualizować `stronanalata/README.md` — dziś opisuje wdrożenie pod
  EasyPanel i osobne (sub)domeny per appka; dopisać wariant z PathPrefixami
  Coolify i przykładową wartość pola Domains ze ścieżką.
