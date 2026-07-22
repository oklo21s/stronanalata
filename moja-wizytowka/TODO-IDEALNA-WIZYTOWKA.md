# TODO — idealna wizytówka

Utworzono: 20 lipca 2026 r.
Źródło reguł: `../definicje_agentow/BUDOWA-STRONY.md` (fazy A–C, anty-slop,
definicja „gotowe”) · `../definicje_agentow/wiki/narzedzia/bramka-qa.md` ·
`../definicje_agentow/wiki/agenci/`

Ta lista **nie zastępuje** [TODO-AUTENTYCZNOSC-STRONY.md](TODO-AUTENTYCZNOSC-STRONY.md)
ani [URUCHOMIENIE-I-ZGODNOSC-TODO.md](URUCHOMIENIE-I-ZGODNOSC-TODO.md) — jest
nadrzędnym porządkiem prac. Punkty pokrywające się są tam oznaczone odsyłaczem.

Zasada nadrzędna źródła:

> Dobra strona nie wygląda „jak z AI”. Wygląda tak, jakby ktoś uważnie poznał
> konkretną firmę, jej klientów i sposób pracy, a następnie usunął wszystko,
> co przeszkadza w podjęciu decyzji.

Kolejność faz jest obowiązkowa. Nie przechodź dalej bez kryterium zakończenia.

---

## 0. Czego agent NIE odhacza sam

Odhaczenie tych punktów przez agenta = sfałszowany odbiór. Wymagają decyzji
Mikołaja jako właściciela strony.

- [ ] Prawdziwość: telefon, e-mail, godziny obsługi, obszar działania.
- [ ] Realność terminu „3–21 dni”, odpowiedzi w 24 h, startu w 2 dni robocze,
      płatności po zakończeniu prac. → [TODO-AUTENTYCZNOSC-STRONY.md § P0](TODO-AUTENTYCZNOSC-STRONY.md)
- [ ] Prawa do zdjęć, logo, screenshotów dem, cudzych nazw firm.
- [ ] Treść polityki prywatności i klauzul zgody.
- [ ] Decyzja o pokazaniu zdjęcia/profilu osobistego.
- [ ] DNS, HTTPS, skrzynka formularza, kopie zapasowe.
- [ ] Test na prawdziwym telefonie, w Safari i na wolnym łączu.
- [ ] Lighthouse (wymaga Chrome — niedostępny w środowisku agenta).

**Brak danej → brak sekcji.** Nie „ok. rok doświadczenia” bez potwierdzenia.

---

## Faza A — przed pierwszą linijką kodu

### A1. Cel i jedna akcja główna

- [ ] Zapisać jedno zdanie: „Strona ma pomóc **[kto]** zrozumieć **[co]**
      i wykonać **[jedna akcja]**”. Bez słów „nowoczesna”, „profesjonalna”.
- [ ] Ustalić **jedną** akcję główną (formularz vs. e-mail vs. telefon)
      i najwyżej jedną pomocniczą. Obecnie strona prowadzi do formularza —
      potwierdzić, że to celowo jedyna ścieżka.
- [ ] Zapisać, skąd przychodzi odbiorca (polecenie / lokalna grupa FB / kontakt
      bezpośredni). To zmienia treść hero.

**Kryterium:** projekt da się ocenić jednym pytaniem — czy właściciel małej
firmy rozumie ofertę i wysyła zapytanie bez przeszkód?

### A2. Fakty i materiały

- [ ] Wypisać potwierdzone: nazwa, forma prawna/status, kontakt, godziny, obszar.
- [ ] Wypisać **osobno** listę „do potwierdzenia” (sekcja 0 wyżej).
- [ ] Oferta: pełna lista usług → wybrać 3–6. Dla każdej: dla kogo, co obejmuje,
      jaki problem rozwiązuje, jak przebiega, od czego zależy cena.
- [ ] Zapisać wprost, **czego Mikołaj nie robi** (np. sklepy, systemy CMS,
      kampanie reklamowe) — to często najbardziej użyteczna treść.

**Kryterium:** żadna dana na stronie nie jest zgadywana.

### A3. Rozpoznanie rynku

- [ ] Otworzyć 5–8 stron freelancerów/mikroagencji z okolicy.
- [ ] Zanotować, co powtarza się wszędzie i co wszędzie kuleje (ukryta cena,
      brak przykładów, kontakt tylko przez formularz).
- [ ] Wybrać **3 pytania**, na które wizytówka musi odpowiedzieć przed kontaktem.
- [ ] Nie kopiować układu ani haseł.

### A4. Architektura informacji

Kolejność sekcji = kolejność pytań odbiorcy.

- [ ] Zweryfikować obecną kolejność: hero → `#o-mnie` → `#uslugi` → `#proces` →
      standard → `#faq` → `#kontakt`.
- [ ] Rozstrzygnąć, czy „o mnie” ma stać **przed** usługami — reguła I.2 mówi:
      główna akcja i oferta wyżej niż historia firmy.
- [ ] Sprawdzić, czy sekcja „Standard” wnosi coś ponad hero i usługi; jeśli nie —
      usunąć. → [TODO-AUTENTYCZNOSC-STRONY.md § P2](TODO-AUTENTYCZNOSC-STRONY.md)
- [ ] Zdecydować o sekcji dowodu (dema). Bez niej podpis „Oferta → dowód →
      kontakt” w hero jest nieprawdziwy — poprawić albo dodać dowód.
- [ ] Sprawdzić: wejście z linku prosto do dowolnej sekcji nadal pokazuje,
      jak się skontaktować.

### A5. Treść przed projektem

- [ ] Hero: `h1` z rzeczywistą usługą, 1–2 zdania doprecyzowania, konkretny
      przycisk. Zweryfikować obecne „Projektuję strony, które prowadzą prosto
      do kontaktu” — czy pasowałoby do dowolnego freelancera?
- [ ] Usługi: 2–4 zdania każda — problem, zakres, efekt, następny krok.
      Nie powtarzać tej samej konstrukcji zdania.
- [ ] Przepisać „O mnie” na konkret. → [TODO-AUTENTYCZNOSC-STRONY.md § P1](TODO-AUTENTYCZNOSC-STRONY.md)
- [ ] FAQ: 4–8 pytań naprawdę zadawanych, nie chowanie warunków.
- [ ] Kontakt: powtórzyć e-mail, czas odpowiedzi, obszar; napisać, co warto
      podać w pierwszej wiadomości.
- [ ] Redakcja: przeczytać na głos, akapity 2–4 zdania, jednolita forma zwracania
      się, sprawdzona pisownia nazw i miejscowości.

**Kryterium:** sam tekst, bez grafiki, wystarcza żeby zrozumieć ofertę,
ocenić wiarygodność i wysłać zapytanie.

### A6. Wireframe telefonu (360–390 px)

- [ ] Najdłuższe słowo nagłówka mieści się bez przycinania.
- [ ] Główny przycisk w pierwszym ekranie albo tuż pod krótkim hero.
- [ ] Widać fragment następnej sekcji.
- [ ] Narysować stany: rozwinięte menu, otwarte FAQ, błąd formularza.
- [ ] **Test 10 sekund** na osobie nieznającej projektu: co oferuje, dla kogo,
      jak się skontaktować. Trzy trafne odpowiedzi albo poprawka wireframe’u.

### A7. System wizualny

- [ ] Zapisać 3–5 prawdziwych przymiotników o sposobie pracy Mikołaja,
      **każdy z widoczną konsekwencją** („dokładny = jeden akcent, równa siatka,
      zero dekoracji bez funkcji”).
- [ ] Paleta: neutralne tło, czytelny tekst, **jeden** kolor akcji + stany
      (hover, focus, błąd, sukces, disabled). Zweryfikować pomarańcz + granat.
- [ ] Zaokrąglenia ≤ 8 px, `letter-spacing: 0` poza logotypem.
- [ ] Skala odstępów 4/8/12/16/24/32/48/64 px — sprawdzić zmienne w
      [src/style.css](src/style.css).
- [ ] Polskie znaki we **wszystkich** używanych wagach fontu.
- [ ] Pięć stanów każdego elementu interaktywnego.

---

## Faza B — kod

### B1. Fundament

- [ ] `lang`, tytuł, opis, dokładnie jeden `h1`.
- [ ] Semantyka `header`/`nav`/`main`/`section`/`footer`, poziomy nagłówków
      bez przeskoków dla wyglądu.
- [ ] Link „Przejdź do treści” widoczny po fokusie.
- [ ] Unikalne `id` sekcji używanych przez nawigację (`#o-mnie`, `#uslugi`,
      `#proces`, `#faq`, `#kontakt`).
- [ ] Zmienne CSS: kolory, odstępy, promienie, szerokości, typografia.
- [ ] Fokus nieusunięty bez zastępstwa.

### B2. Nagłówek i nawigacja

- [ ] Menu mobilne jako `<button>` z dostępną nazwą i `aria-expanded`.
- [ ] Zamknięcie: przyciskiem, **Escape**, wyborem pozycji; fokus wraca do
      przycisku menu.
- [ ] Otwarte menu nie pozwala obsługiwać zasłoniętej treści i mieści się
      na niskim ekranie.
- [ ] Stała wysokość nagłówka — ładowanie fontu nie przesuwa układu.
- [ ] Offset scrollu: nagłówek nie zasłania tytułu sekcji po skoku z linku.

### B3. Hero

- [ ] `h1`, krótki opis, główny przycisk, zakres pracy, **jeden** mocny dowód.
- [ ] Wizualizacja pokazuje rzeczywistą pracę, nie dekorację. Sprawdzić, czy
      obecna ilustracja liniowa spełnia ten warunek.
- [ ] Podane wymiary/proporcje — zero przeskoku układu.
- [ ] Hero **bez** `loading="lazy"`.
- [ ] Najdłuższy nagłówek nie wychodzi poza ekran przy **320 px**.

### B4. Usługi

- [ ] Najważniejsza pierwsza; układ dobrany do treści, nie do równej siatki.
- [ ] Ikony tylko gdy odróżniają usługi — jeden zestaw, spójny rozmiar.
- [ ] Na telefonie jedna czytelna kolumna.
- [ ] Bez przycisku „więcej”, jeśli nie ma dokąd prowadzić.

### B5. Dowód pracy

- [ ] Zdecydować o pokazaniu 2–3 dem z `../dema stron/`.
      → [TODO-AUTENTYCZNOSC-STRONY.md § P1](TODO-AUTENTYCZNOSC-STRONY.md)
- [ ] Każde demo oznaczone jako **projekt demonstracyjny**, bez fikcyjnych
      wyników („więcej klientów”, „wzrost konwersji”).
- [ ] Miniatury o stałych proporcjach; podgląd nie obcina istotnej części.
- [ ] Jeśli jest lightbox — obsługa klawiaturą, zamykanie **Escape**.

**Kryterium:** sekcja bez opinii i liczb nadal wygląda uczciwie, a nie jak
niedokończony szablon.

### B6. FAQ, formularz, stopka

- [ ] Akordeon: nagłówki są przyciskami i przekazują stan.
- [ ] Formularz: tylko pola potrzebne przy pierwszym kontakcie, widoczna
      etykieta przy każdym (placeholder nie zastępuje etykiety), właściwy typ
      i autouzupełnianie.
- [ ] Walidacja wskazuje konkretne pole i mówi, jak poprawić.
      **Błąd nie może być przekazany samym kolorem.**
- [ ] Stan wysyłki, sukcesu i błędu; blokada podwójnego wysłania.
- [ ] `mailto:`/`tel:` faktycznie działające; linki zewnętrzne z `rel="noopener"`.
- [ ] Stopka bez pustych ikon social i bez mapy strony dla jednej podstrony.

---

## Faza C — dopracowanie i weryfikacja

### C1. Responsywność

- [ ] Sprawdzić 320, 375, 430, 768, 1024, 1366, 1440, 1920 px.
- [ ] **Przeciągnąć szerokość powoli** i znaleźć momenty łamania układu —
      nie poprawiać tylko punktów kontrolnych.
- [ ] Brak poziomego przewijania, nic nie wychodzi poza kontener, tekst nie
      nakłada się na obraz, przyciski nie zmieniają wysokości przez zawijanie.
- [ ] Orientacja pozioma telefonu **i** niski ekran laptopa.

### C2. Dostępność

- [ ] Cała strona `Tab`-em, kolejność zgodna z wizualną, brak pułapki klawiatury.
- [ ] `alt` opisujący dla obrazów informacyjnych, pusty dla dekoracyjnych;
      ikony dekoracyjne ukryte przed czytnikiem.
- [ ] Komunikat błędu i sukcesu **ogłaszany** czytnikowi.
- [ ] Powiększenie do **200%** i wykonanie głównej akcji.

### C3. Obrazy

- [ ] Każdy obraz ma rolę; wypełniacze usunięte.
- [ ] Rozmiary odpowiadające wyświetlaniu, nowoczesny format, sprawdzone detale
      po kompresji.
- [ ] Usunięte metadane mogące zdradzać lokalizację.

### C4. SEO i udostępnianie

- [ ] Tytuł: marka + najważniejsza usługa/lokalizacja, bez upychania fraz.
- [ ] Wersja testowa `noindex` do czasu publikacji na właściwej domenie.
- [ ] Obszar działania opisany naturalnie, **bez ukrytych list miast**.
- [ ] Dane strukturalne tylko dla informacji widocznych i prawdziwych.
- [ ] Sprawdzony **podgląd** udostępniania, nie sama obecność tagów
      (`npm.cmd run generate:og`).

---

## Faza D — animacje (dopiero po działającej stronie)

Kompletna strona bez animacji istnieje **przed** dodaniem ruchu.

- [ ] Każda animacja ma zapisane jednym zdaniem, po co istnieje.
- [ ] Budżety: intro 1–1,4 s (twardy limit ~1,8 s), mikroanimacja 120–300 ms,
      menu 180–240 ms, `reduced-motion` ≤ 100–150 ms.
- [ ] Twardy limit **późniejszy** niż opóźnienie + czas ostatniej animacji.
- [ ] Animowane wyłącznie `transform` i `opacity`; jedno easing w całym projekcie.
- [ ] Animowana **tylko warstwa nad treścią** — prawdziwa treść się nie przesuwa.
- [ ] Intro raz na sesję (`sessionStorage`), z widocznym „Pomiń”, kończone
      **Escape**, jedną wspólną funkcją sprzątającą.
- [ ] Bez JS strona zostaje widoczna — zasłona dodawana klasą na `<html>`.
- [ ] Sprawdzić katalog `../animacja/` — czy ten kierunek trafia na wizytówkę,
      czy zostaje tylko w demach.
- [ ] Przejść pełną macierz testów animacji (III.7): naturalny koniec, pominięcie
      na starcie i w połowie, Escape, szybkie odświeżenie, drugie wejście,
      nowa sesja, `reduced-motion`, wyłączony JS, wolne łącze, 320 px,
      zmiana orientacji w trakcie, klikalność przycisku zaraz po animacji,
      brak powrotu intro po wysłaniu formularza.
- [ ] Po zmianie markupu intro usunąć **stare klasy** w CSS — testy tego nie łapią.

---

## Faza E — test anty-slop

- [ ] Czy którekolwiek zdanie pasowałoby jednocześnie do dentysty, software
      house’u i firmy remontowej? → przepisać.
- [ ] Wyszukać: „pasja”, „kompleksowy”, „indywidualne podejście”, „najwyższa
      jakość”, „nowoczesny” bez dowodu w następnym zdaniu.
- [ ] Czy po podmianie logo strona mogłaby służyć dowolnej innej branży?
- [ ] Czy wszystkie sekcje to identyczne karty w siatce?
- [ ] Czy użyto więcej niż jednego mocnego efektu wizualnego?
- [ ] Inwentaryzacja ozdobników i wybór 2–3 motywów charakterystycznych.
      → [TODO-AUTENTYCZNOSC-STRONY.md § P2](TODO-AUTENTYCZNOSC-STRONY.md)
- [ ] **Kontrola rytmu:** pełne zrzuty telefonu i desktopu obejrzeć jako całość,
      zaznaczyć sekcje wyglądające identycznie — tam zmienić **strukturę**,
      nie kolor.

---

## Faza F — bramka QA

Kolejność obowiązkowa, każdy krok dokłada. Uruchomić **naprawdę**, nie
przepisywać wyników ze starszego raportu.

```powershell
npm.cmd install
npm.cmd run check      # skladnia, AST, walidator, testy, build, budzety
npm.cmd run qa         # + benchmark serwera
npm.cmd run stability  # + determinizm buildu, pamiec, stress
npm.cmd audit          # podatnosci
```

- [ ] Żaden krok czerwony. Odstępstwo od progu zapisane z powodem i decyzją.
- [ ] Porównać produkcyjny HTML i wygląd z wersją lokalną.
- [ ] Brak błędów konsoli i niedziałających zasobów.
- [ ] Zaktualizować [TEST-REPORT.md](TEST-REPORT.md) wyłącznie realnymi wynikami.

Uwagi środowiskowe: `npm.cmd`, nie `npm`. PowerShell 5.1 nie ma `&&` —
`A; if ($?) { B }`. Nie uruchamiać równolegle z serwerem dev na portach
3000/3001. Nie zabijać procesów Node bez sprawdzenia `CommandLine` — VS Code
też je uruchamia.

**Czego bramka nie sprawdza:** Lighthouse’a (brak Chrome), praw do zdjęć,
prawdziwości deklaracji handlowych.

---

## Faza G — test odbioru na ludziach

- [ ] Pokazać stronę co najmniej trzem osobom nieznającym projektu.
- [ ] Po pięciu sekundach zapytać: kto oferuje usługę, dla kogo, co wyróżnia
      wykonawcę, który element wygląda sztucznie, czy zaufaliby formularzowi.
- [ ] Zapisać odpowiedzi bez podpowiadania; poprawić to, co wskazały co najmniej
      dwie osoby.

---

## Kto co robi (agenci z `definicje_agentow`)

| Faza | Agent | Rola |
|---|---|---|
| A1–A3 | `szef-sztabu` | rozstrzygnięcie celu, jednej akcji, kolejności sekcji |
| A2 | `bibliotekarz` | co już wiemy z bazy, czego brakuje — bez zmyślania |
| A4–B6 | `budowniczy-stron` | treść, układ, kod |
| C, E | `recenzent` | zalety i wady zakotwiczone w pliku, przed decyzją |
| F | `rzeczoznawca` | werdykt zgodności + uruchomiona bramka z realnymi wynikami |
| po odbiorze | `kronikarz` | zapis ustaleń i odrzuconych wariantów do `_sesje/` |
| po drugiej podobnej robocie | `mistrz` | destylat do `wiki/dziedziny/` |

`rzeczoznawca` wydaje werdykt i **nie poprawia**. Poprawki wracają do
`budowniczy-stron`.

---

## Definicja „gotowe”

Nie oznaczaj pracy jako skończonej, dopóki każde zdanie nie jest prawdziwe.

- [ ] Strona realizuje **jeden** zapisany cel.
- [ ] Pierwszy ekran mówi: co Mikołaj robi, dla kogo, jak się skontaktować.
- [ ] Każda liczba i obietnica jest potwierdzona albo oznaczona
      „do potwierdzenia”. **Zero zmyślonych danych.**
- [ ] Strona pokazuje prawdziwy dowód pracy albo nie obiecuje, że go zawiera.
- [ ] Projekt wynika z marki i treści, nie z modnego szablonu.
- [ ] Strona nie jest zbiorem powtarzanych kart, sloganów i dekoracji.
- [ ] Intro (jeśli jest) ≤ ~1,4 s, pomijalne, raz na sesję, wyłączone przy
      `reduced-motion`.
- [ ] Bez JavaScriptu treść jest widoczna i użyteczna.
- [ ] Główna ścieżka działa na telefonie, desktopie, klawiaturze i przy 200%.
- [ ] Brak nakładania się elementów, poziomego przewijania i obciętego tekstu.
- [ ] Wszystkie linki, przyciski i formularz **ręcznie** wypróbowane.
- [ ] Poprawny tytuł, opis, favicon, podgląd udostępniania, reguły indeksowania.
- [ ] Raport jawnie wymienia, czego **nie** sprawdzono i dlaczego (sekcja 0).
