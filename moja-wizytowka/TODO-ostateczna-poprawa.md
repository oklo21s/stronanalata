# TODO — ostateczna poprawa

Zakres: `moja-wizytowka/` (wizytówka usług — Mikołaj Oczkowski).
Stan na 2026-07-23: sekcje w `index.html` to Hero → O mnie → Usługi → Proces →
Realizacje → Standard → FAQ → Kontakt. Sekcja Realizacje już wdrożona.
Cel tej listy: **strona ma lepiej proponować usługi** — droga zaufanie → oferta → kontakt.
Uszeregowane wg wpływu na konwersję, nie wg łatwości.

> Zasada nadrzędna: **nie zmyślać.** Żadnych fałszywych opinii, logo ani liczb.
> Ceny, telefon i treść gwarancji podaje właściciel — dopóki ich nie poda, punkt zostaje otwarty.

---

## A. Największe dźwignie (zrób najpierw)

- [ ] **A1. Orientacyjny przedział cen przy każdym pakiecie.**
      Nie łamać zasady „bez cennika, wycena po rozmowie" — dodać jedną kotwicę:
      „projekty zwykle w przedziale –Y zł" albo „od ok. 700 zł" na każdej karcie usług
      (`index.html`, sekcja `#uslugi`, `.service-card__status`).
      **Blokada:** właściciel musi podać przedziały.
- [ ] **A2. Konkretne CTA wejścia zamiast „Napisz do mnie".**
      Główne wezwanie → „Bezpłatny szkic pierwszego ekranu" (nowa strona) lub
      „Bezpłatny mini-audyt obecnej strony" (poprawa). Zmiana w Hero
      (`.hero__actions`, `index.html:66`) i w sekcji Kontakt (`.contact__copy`).
- [ ] **A3. Kotwice zaufania na wierzchu.** Krótki pasek/blok blisko oferty lub kontaktu:
      „Umowa i faktura · Kod i strona są Twoją własnością · Pracuję aż zaakceptujesz zakres".
      Trzecie zdanie wyciągnąć z FAQ 05 (`index.html:281`) wyżej, nie kasować FAQ.

## B. Oferta i pozycjonowanie

- [ ] **B1. Karty usług — jeden bullet na kartę przełożyć z funkcji na korzyść.**
      „mobile-first" → „klient dzwoni z telefonu jednym dotknięciem";
      „oferta na jednym ekranie" → „oferta zrozumiała w 5 sekund".
      Sekcja `#uslugi`, `.service-card__list`.
- [ ] **B2. Pasek „Standard" na język klienta, nie programisty.**
      `6/6 testów`, `0 trackerów`, `20 000 przełączeń` → „strona nie padnie, gdy wtyczka
      się zepsuje", „ładuje się szybko też na słabym internecie", „nie sprzedaję Twoich danych".
      Twardy dowód techniczny zostawić jako drugorzędny. Sekcja `.standards`, `.proof-strip`.
- [ ] **B3. Blok „kreator vs. strona pod Ciebie".** Krótkie porównanie (2–4 punkty)
      uprzedzające obiekcję „po co, skoro jest Wix/Canva/kuzyn". Nowy mały blok
      przy Usługach albo Standardzie.

## C. Domknięcia konwersji

- [ ] **C1. Telefon / „wolisz zadzwonić?".** Lokalny klient często woli dzwonić.
      Dodać numer w Kontakcie i stopce, jeśli właściciel gotów. 452-448-277
      **Blokada:** właściciel musi podać numer (lub świadomie zrezygnować).
- [ ] **C2. FAQ — dodać dwa pytania kupującego:**
      „Czy podpisujemy umowę?" i „Czyją własnością jest strona i kod po zakończeniu?".
      Sekcja `#faq`, `.faq-list` (kolejne `<details class="faq-item">`).
- [ ] **C3. Realizacje — jeden kafelek jako mini-historia** problem → decyzja → efekt,
      zamiast samego „Otwórz demo". Dopisać zdanie „realne prace pokażę prywatnie na życzenie".
      Sekcja `#realizacje`.
- [ ] **C4. Sticky CTA na mobile.** Pływający przycisk „Napisz" u dołu ekranu na wąskich
      widokach, żeby kontakt był zawsze pod ręką. CSS + drobny JS (bez nowych zależności).

## D. Drobne domknięcia (z poprzednich TODO, wciąż otwarte)

- [ ] **D1.** Pusty `<span aria-hidden="true"></span>` w eyebrow Hero (`index.html:63`)
      — wstawić kropkę/ikonę albo usunąć.
- [ ] **D2.** Pusty `<span aria-hidden="true"></span>` w `footer-status` (`index.html:316`) — jw.

## E. Bramka QA (przed publikacją)

- [ ] `npm run check` bez błędów (syntax → validate → test → build).
- [ ] `node scripts/performance-check.mjs` i `node scripts/stability.mjs` przechodzą.
- [ ] Mobile: brak przewijania w poziomie; sticky CTA nie zasłania treści ani stopki.
- [ ] Klawiatura: nowe CTA, telefon i FAQ dostępne z Tab; widoczny focus.
- [ ] Zero CLS na nowych elementach (stałe wymiary, brak skoków układu).
- [ ] Ceny/telefon: publikować dopiero po potwierdzeniu przez właściciela — zero wartości zmyślonych.

---

### Kolejność wykonania
1) A (ceny, CTA, zaufanie — czeka na dane od właściciela) →
2) B (przekaz oferty — można robić od razu) →
3) C (telefon, FAQ, historia, sticky CTA) →
4) D (drobne) →
5) E (QA).

> Punkty A1, A2, A3 to trójka o największym wpływie: trafiają w trzy strachy kupującego —
> *ile to kosztuje*, *co dostanę na start*, *czy mnie nie wykiwa*.
> A1 i C1 są zablokowane danymi od właściciela; reszta jest wykonalna od ręki.
