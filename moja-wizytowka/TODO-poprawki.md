# TODO — poprawki wizytówki

Stan wyjściowy (ustalony 2026-07-21):

- Są **dwie** wizytówki: `moja-wizytowka/` (Mikołaj Oczkowski, prawdziwy mail, netlify) oraz
  `robienie strony internetowej krok po kroku aby zarobic pierwsze pieniadze/wizytowka/` (marka „strony.chat").
- `moja-wizytowka` **nie ma sekcji realizacji/portfolio** — nie linkuje żadnego dema.
- `strony.chat` ma sekcję „Realizacje", ale pokazuje tylko **3 zaślepki** (`/projekty/ruch|remont|bistro.html`),
  a nie prawdziwe ~20 dem z `dema stron/`.
- Kod jest **już bez komentarzy** (app.js 0, style.css 1228 linii / 0 komentarzy).

---

## 0. Decyzja bazowa (zrób najpierw)

- [ ] Ustal jedną wizytówkę jako „tę właściwą". Rekomendacja: zostaw `moja-wizytowka`
  (prawdziwe nazwisko + mail + polityka prywatności), a najlepsze rozwiązania ze `strony.chat`
  (sekcja Realizacje, „bezpłatny szkic", pakiety) przenieś do niej.

## 1. Osadzenie dem — najważniejsza luka

- [ ] Dodaj sekcję „Realizacje / Portfolio" do `moja-wizytowka` (wzór gotowy w `strony.chat`, sekcja `.projects`).
- [ ] Wybierz TYLKO dema fikcyjne/zanonimizowane do publicznego linkowania:
  `buddem`, `marka_wlasna` (Krojnia), `muzeum_bezdanych`, `restauracja_bezdanych`, `klimatyzacja_bezdanych`.
  **Nie linkuj publicznie** dem nazwanych realnych firm (fizjomax, trend-kozienice, gluszek, wincent itd.) —
  to leady bez zgody na publikację.
- [ ] Nie osadzaj przez `<iframe>` inline. Zamiast tego: karta z podglądem (screenshot) → link otwiera
  żywe demo w nowej karcie (`target="_blank" rel="noopener"`).
- [ ] Zdeployuj wybrane dema osobno (każde na własny subdomeny/subpath Netlify), żeby link prowadził
  do działającej strony, a nie pliku lokalnego.
- [ ] Zrób prawdziwe zrzuty ekranu dem (nie rysowane SVG). Optymalizuj do WebP/AVIF, `loading="lazy"`,
  stały `width`/`height` (bez CLS).
- [ ] Podpisz każde demo jednym zdaniem o decyzji projektowej + etykietą „projekt pokazowy / marka fikcyjna".
- [ ] 3–6 kafelków wystarczy; pokaż różne branże, nie 15 podobnych.

## 2. „Czym się zajmuję" (pozycjonowanie)

- [ ] Dodaj dowód: pasek liczb z testów jakości ze `strony.chat` (`1200/1200 żądań`, `0 błędów`, `0 luk`) —
  w osobistej wizytówce go nie ma.
- [ ] Ujednolić przekaz „jedna osoba, jeden proces: projekt + treść + kod" (mocniej niż dziś).

## 3. „W jakich technologiach" — czy w ogóle wpisywać

- [ ] Do klienta lokalnego: NIE wypisuj stosu technologicznego (HTML/CSS/Vite/Netlify). Mów korzyściami:
  „lekko, bez wtyczek", „bez cudzych trackerów", „działa na telefonie", „testy przed oddaniem".
- [ ] Wyjątek: dla klientów technicznych/agencji — osobna, krótka sekcja/stopka „Jak to buduję"
  (czysty HTML/CSS, minimum zależności, statyczny hosting). Drugorzędna.

## 4. „Co oferuję" (oferta/pakiety)

- [ ] Przenieś model 3 pakietów ze `strony.chat` (jednostronicowa / firmowa / rozbudowana z listami „co wchodzi").
- [ ] Zachowaj zasadę „bez cennika, wycena po rozmowie" — trzymaj ją w jednym miejscu.
- [ ] Rozważ „bezpłatny szkic pierwszego ekranu" jako główne CTA zamiast ogólnego „Napisz do mnie".

## 5. Komentarze w kodzie — werdykt

- [ ] Zostaw kod bez komentarzy — nie dodawaj ich. `app.js` (53 l.) i `style.css` (1228 l.) mają 0 komentarzy
  i są czytelne dzięki nazwom klas (BEM). Dla jednostronicowej wizytówki komentarze to zbędny balast w wysyłanym pliku.
- [ ] Jedyny sensowny wyjątek: 1-liniowe nagłówki sekcji w CSS (np. `/* === Hero === */`) dla własnej nawigacji.
  To wygoda dla Ciebie, nie dokumentacja.
- [ ] Pułapka: literał `@keyframes` w komentarzu CSS potrafi zmylić narzędzia — unikaj składni CSS w komentarzach.

## 6. Drobne, ale warte domknięcia

- [ ] Pusty `<span aria-hidden="true"></span>` w eyebrow hero (`index.html:54`) — wstaw ikonę/kropkę albo usuń.
- [ ] Dodaj link „Realizacje" do nawigacji po dodaniu sekcji.
- [ ] Po dodaniu screenshotów dem — przejdź bramkę QA (waga plików, CLS, mobile, klawiatura).
