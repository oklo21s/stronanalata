# Osada pod Granią

Strona główna dla osady domków wypoczynkowych w górach. Jedna scena 3D leży
na stałe pod całym dokumentem i przechodzi ze złotej godziny w noc w miarę
przewijania: kamera okrąża masyw, paleta stygnie, morze chmur opada, spod niego
wynurza się świecąca siatka podłogi, a tło gęstnieje polem drobin.

**Marka jest fikcyjna.** Nazwa, ceny, metraże, telefon i adres e-mail są
przykładowe. Przed użyciem u realnego klienta patrz „Do podmiany przed wdrożeniem".

---

## Uruchomienie

```powershell
npm.cmd install
npm.cmd run dev        # serwer deweloperski
npm.cmd run check      # kontrola ustalen + build produkcyjny
npm.cmd run preview    # podglad zbudowanej wersji
```

Na Windows używaj `npm.cmd`, nie `npm` - `npm.ps1` bywa blokowany przez
Execution Policy.

## Stack

| Warstwa | Wybór |
|---|---|
| Aplikacja | React 18 + Vite 6 |
| Scena 3D | three 0.169 + `@react-three/fiber` 8 + `@react-three/drei` 9 |
| Post-processing | `@react-three/postprocessing` (bloom), ładowany leniwie |
| Scroll | GSAP 3 + ScrollTrigger |
| Style | Tailwind v4 (wtyczka Vite, konfiguracja w CSS) |
| Ikony | `@phosphor-icons/react`, waga `light` |
| Kroje | Space Grotesk (display) + Inter Tight (tekst), self-hosted przez Fontsource |

R3F w linii 9 wymaga Reacta 19. Ponieważ projekt stoi na Reacie 18, użyta jest
linia `@react-three/fiber@8` razem z `drei@9` - to jedyna zgodna para.

## Architektura

```
src/
├─ scroll/stanScrolla.js     jedno źródło prawdy o postępie narracji
├─ scena/                    kanwa tła: góra, chmury, smugi, siatka, drobiny
│  ├─ Rezyser.jsx            całkuje postęp, miesza paletę, prowadzi kamerę
│  ├─ Gora.jsx               plane 128x128, wypiętrzenie fBM w vertex shaderze
│  ├─ WarstwyChmur.jsx       4 przezroczyste płaszczyzny, opadają z postępem
│  ├─ SmugiSwiatla.jsx       additive quady zza grani, gasną razem z dniem
│  ├─ PodlogaSiatki.jsx      siatka w shaderze, świecące węzły, zanik do horyzontu
│  ├─ PoleCzastek.jsx        Points, dryf liczony w shaderze
│  └─ paleta.js              dwa krańce kolorów + `lerpColors` co klatkę
├─ obiekty/ObiektOferty.jsx  trzy małe kanwy przy blokach oferty
├─ sekcje/                   warstwa DOM nad kanwą
└─ dane.js                   cała treść strony
```

**Postęp scrolla nie przechodzi przez stan Reacta.** ScrollTrigger zapisuje
wartość do zwykłego obiektu modułowego, `useFrame` ją czyta i dogania tłumieniem.
Gdyby to był `useState`, całe drzewo przerysowywałoby się kilkadziesiąt razy
na sekundę scrolla.

**Przyklejenie hero robi `position: sticky`, nie `pin` ScrollTriggera.** Sticky
nie przepisuje układu dokumentu, więc nie ma skoków przy przeliczaniu wysokości.
ScrollTrigger odpowiada tylko za wartości.

## Decyzje projektowe

**Jeden motyw, jedno przejście.** Strona nie ma trybu jasnego i ciemnego do
przełączania - kolor jest tu treścią, nie preferencją. Akt dzienny ma akcent
złoty, nocny lodowo-niebieski. To jedno, zamierzone przejście motywu, a nie
przypadkowa zmiana tonacji między sekcjami.

**Zero zaokrągleń.** Przyciski, pola formularza, panele i zdjęcia mają promień 0.
Jeden system kształtu na całą stronę.

**Zasłony pod typografią.** Ciemny tekst hero leży na kremowym gradiencie u góry
i u dołu kadru, jasny tekst przejścia na granatowym gradiencie po prawej. Bez nich
kontrast zależałby od tego, na co akurat wypadnie kamera. Kolor `stal` (`#c2d0e8`)
jest jaśniejszy niż typowy tekst pomocniczy właśnie po to, żeby utrzymać 4.5:1
także nad rozświetloną drobiną pod zasłoną sekcji.

**Rytm sekcji oferty.** Brief zakładał trzy bloki naprzemienne. Trzeci podział
na pół z rzędu czyta się jak szablon, więc trzeci blok jest pełnej szerokości,
z obiektem 3D nad tekstem. Obiekt zostaje przy każdym z trzech.

## Wydajność

- terrain: plane 128 x 128 segmentów (górna granica z briefu), kształt liczy GPU
- `dpr={[1, 1.5]}`, na mobile `[1, 1]`; `PerformanceMonitor` z drei schodzi do 1 przy spadku FPS
- cienie wyłączone w całej scenie
- drobiny: 1200 desktop / 700 słabszy sprzęt / 380 mobile
- bloom: `React.lazy`, montowany tylko poza mobile i poza `prefers-reduced-motion`
- małe kanwy oferty mają `frameloop="never"` poza kadrem (IntersectionObserver)
- ukryta karta przeglądarki zatrzymuje pętlę renderowania w całości
- zero nasłuchów zdarzenia `scroll` - postęp prowadzi ScrollTrigger, widoczność IntersectionObserver
- animowane są wyłącznie `transform` i `opacity`

Rozmiary po `npm run build` (gzip): `three` 176 kB, aplikacja 128 kB, `gsap` 28 kB,
bloom 16 kB w osobnym chunku. Ciężar `three` jest nieusuwalny przy tym briefie.

## Dostępność

- `prefers-reduced-motion`: znika przyklejenie i przewijanie sterowane animacją,
  hero i przejście stają się zwykłymi sekcjami, kanwa przechodzi w tryb `demand`
  i przeskakuje między dwoma stanami, czas w shaderach stoi, bloom nie startuje
- link „Przejdź do treści" jako pierwszy element w tabulacji
- kanwa jest `aria-hidden`, nagłówek `h1` żyje w warstwie tekstowej
- formularz: etykiety nad polami, podpowiedzi i błędy pod polami, `aria-invalid`,
  `aria-describedby`, komunikat stanu w `aria-live`, fokus wraca na pierwsze błędne pole
- widoczny `:focus-visible` w kolorze akcentu na całej stronie
- `<noscript>` z numerem telefonu

## Co zostało sprawdzone, a co nie

**Sprawdzone realnym uruchomieniem** (headless Chrome, WebGL przez SwiftShader,
1440x900 i 390x844): brak błędów konsoli i błędów strony, cztery żywe konteksty
WebGL, kompilacja wszystkich shaderów, kadry na całej długości scrolla, walidacja
i stan sukcesu formularza, wariant `prefers-reduced-motion`, układ mobilny.

**Niesprawdzone:** Lighthouse i realne Core Web Vitals (brak Chrome z GPU w tym
środowisku - liczby wyżej to rozmiary bundla, nie zmierzony LCP), zachowanie na
prawdziwym sprzęcie mobilnym, Safari i iOS, czytniki ekranu.

## Do podmiany przed wdrożeniem

1. **Zdjęcia domków** (`src/dane.js`) - obecnie fotografie z Unsplash ładowane
   z obcego CDN-u, dobrane tematycznie, ale nieprzedstawiające obiektów klienta.
   Docelowo własne zdjęcia w `public/zdjecia/`: kadr główny 4:5, dwa pozostałe 4:3.
   Pliki lokalne poprawią też LCP i usuną zapytanie do obcego hosta.
2. **Backend formularza** (`src/sekcje/Rezerwacja.jsx`, funkcja `wyslijZapytanie`)
   - dziś udaje wysyłkę i zwraca sukces. Do podmiany na realny endpoint plus
   zabezpieczenie antyspamowe.
3. **Dane firmy** (`src/dane.js`) - nazwa, telefon, e-mail, ceny, metraże,
   liczba domków, wysokość n.p.m., godziny doby hotelowej.
4. **Treść merytoryczna** - nazwy szlaków, kursy busa, wyposażenie. Wszystko
   dziś jest wiarygodne, ale zmyślone.

## Kontrola

`npm.cmd run kontrola` sprawdza rzeczy, których nie złapie ani linter, ani
przeglądarka, a które są tu ustaleniami: brak długiego myślnika w treści, brak
`h-screen` (na iOS pasek adresu zmienia `100vh` w trakcie scrolla), brak nasłuchu
zdarzenia `scroll`. Kod wyjścia 1 przy pierwszym naruszeniu. `npm.cmd run check`
uruchamia kontrolę przed buildem.
