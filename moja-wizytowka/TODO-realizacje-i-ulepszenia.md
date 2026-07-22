# TODO — dodać Realizacje (dema) i ulepszyć wizytówkę

Zakres: `moja-wizytowka/` (Mikołaj Oczkowski, prawdziwy mail, Netlify).
Stan na 2026-07-22: sekcje w `index.html` to Hero → Usługi → Proces → Standard → FAQ → Kontakt.
**Brak sekcji Realizacje/Portfolio — żadne demo nie jest linkowane.** To główna luka.

---

## A. Które dema wolno pokazać (przeczytaj najpierw)

**BEZPIECZNE (marki fikcyjne / zanonimizowane — wolno linkować publicznie):**
- `dema stron/buddem/` + `dema stron/buddem-bez-animacji/` — budowlanka (fikcyjna marka)
- `dema stron/marka_wlasna/` — Krojnia (fikcyjna marka odzieżowa)
- `dema stron/muzeum_bezdanych/` + `dema stron/muzeum_bezdanych_v2/` — muzeum miejskie (fikcyjne)
- `dema stron/restauracja_bezdanych/` — gastronomia (fikcyjna)
- `dema stron/klimatyzacja_bezdanych/` — klimatyzacja (fikcyjna)

**NIE PUBLIKOWAĆ (nazwane realne firmy — leady bez zgody na publikację):**
`fizjomax`, `trend-kozienice`, `gluszek-instalacje`, `wincent-klimatyzacja`, `budowlanka-wojcicki`,
`budowlanka-wolos`, `adam-instruktor`, `alina-dendera`, `lucky-grill-bar`, `nowy-swiat-wlosow`,
`piekne-studio`, `rach-ciach`, `u-organisty`, `strona-taksi`.

- [ ] Wybierz **3–6 kafelków** różnych branż (nie 15 podobnych). Rekomendacja: buddem (budowlanka),
      Krojnia (odzież), muzeum_bezdanych (kultura), restauracja_bezdanych (gastronomia).

## B. Osadzenie sekcji Realizacje — konkret w kodzie

- [ ] Dodaj link do nawigacji: w `index.html` po `<a href="#proces">Proces</a>` (linia ~45)
      wstaw `<a href="#realizacje">Realizacje</a>`. Dodaj też w stopce (linia ~217).
- [ ] Wstaw **nową sekcję** `<section class="section realizacje" id="realizacje">` między
      Proces (koniec ~linia 151) a Standard (~linia 153). Wzór układu: sekcja `.projects`
      w wizytówce `strony.chat` (`...krok po kroku.../wizytowka/`).
- [ ] Kafelek = **karta z podglądem (screenshot) + link otwierający żywe demo w nowej karcie**:
      `<a href="..." target="_blank" rel="noopener">`. **Bez `<iframe>` inline.**
- [ ] Każde demo zdeployuj osobno (własny subpath/subdomena Netlify), żeby link prowadził do
      działającej strony, a nie pliku lokalnego. Zbierz listę URL-i przed budową sekcji.
- [ ] Podpis kafelka: 1 zdanie o decyzji projektowej + etykieta **„projekt pokazowy · marka fikcyjna"**.

## C. Zrzuty ekranu (żeby sekcja nie ważyła za dużo)

- [ ] Prawdziwe screenshoty (nie rysowane SVG). Format **WebP/AVIF**, `loading="lazy"`,
      stały `width`/`height` na `<img>` (zero CLS).
- [ ] Jednolity kadr wszystkich miniatur (ta sama proporcja, np. 16:10), żeby siatka była równa.

## D. Ulepszenia treści (pozycjonowanie + konwersja)

- [ ] **Dowód liczbowy:** dodaj pasek z testów jakości (`1200/1200 żądań`, `0 błędów`, `0 luk`)
      — jest w `strony.chat`, brakuje go tutaj. Dobre miejsce: pod Realizacjami albo w sekcji Standard.
- [ ] **Pakiety:** przenieś model 3 pakietów ze `strony.chat` (wizytówkowa / firmowa / rozbudowana
      z listą „co wchodzi"). Zachowaj zasadę „bez cennika, wycena po rozmowie" w jednym miejscu.
- [ ] **CTA:** rozważ „bezpłatny szkic pierwszego ekranu" jako główne wezwanie zamiast ogólnego
      „Napisz do mnie" (Hero linia ~58 i Kontakt).
- [ ] Do klienta lokalnego **nie wypisuj stosu** (HTML/CSS/Vite/Netlify) — mów korzyściami:
      „lekko, bez wtyczek", „bez cudzych trackerów", „działa na telefonie", „testy przed oddaniem".
      Ewentualny stos → krótka drugorzędna stopka „Jak to buduję" dla klientów technicznych.

## E. Drobne domknięcia

- [ ] Pusty `<span aria-hidden="true"></span>` w eyebrow Hero (`index.html:54`) — wstaw kropkę/ikonę albo usuń.
- [ ] Pusty `<span aria-hidden="true"></span>` w `footer-status` (`index.html:218`) — jw.
- [ ] Kod zostaw bez komentarzy (jest czytelny dzięki BEM). Wyjątek: 1-liniowe nagłówki sekcji w CSS.
      Pułapka: **nie wstawiaj literału `@keyframes` do komentarza CSS** — myli narzędzia stabilności.

## F. Bramka QA (po dodaniu sekcji — przed publikacją)

- [ ] `npm run build` bez błędów; sprawdź wagę strony (screenshoty nie mogą rozdąć transferu).
- [ ] Uruchom `scripts/performance-check.mjs` i `scripts/stability.mjs`.
- [ ] Mobile: siatka Realizacji czytelna na małym ekranie; brak przewijania w poziomie.
- [ ] Klawiatura: karty-linki i menu dostępne z Tab; widoczny focus.
- [ ] Zero CLS na miniaturach (stałe wymiary `<img>`).
- [ ] Każdy link demo działa i otwiera się w nowej karcie z `rel="noopener"`.

---

### Kolejność wykonania
1) A (wybór dem) → 2) deploy dem + zebranie URL-i → 3) screenshoty (C) →
4) sekcja Realizacje w kodzie (B) → 5) treść: dowód/pakiety/CTA (D) → 6) drobne (E) → 7) QA (F).

> Uwaga: pokrywa się częściowo z `TODO-poprawki.md`. Ten plik jest wersją „do wykonania" —
> konkretne miejsca w `index.html` i lista bezpiecznych dem. Po zamknięciu można scalić.
