# Prompt: jednostronicowa witryna scrollytelling z panoramą 360°

Prompt odtwarzający tę stronę od zera. Zawiera ustalenia z całej realizacji —
także te, które wyszły dopiero w trakcie i kosztowały osobne śledztwa.

Do wypełnienia przed użyciem: `[NAZWA FIRMY]`, `[BRANŻA]`, `[DOMENA]`.

---

## Zadanie

Zbuduj responsywną, jednostronicową witrynę typu scrollytelling dla
**[NAZWA FIRMY]** z branży **[BRANŻA]**. Strona ma się czytać jak jedna płynna
podróż od góry do dołu: elementy reagują na przewijanie, a nie tylko pojawiają
się statycznie.

Cała treść ma siedzieć w jednym pliku `lib/content.ts` jako typowane obiekty.
Komponenty sekcji nie mogą zawierać tekstów na sztywno — zmiana klienta ma nie
wymagać dotykania animacji.

## Stack — dokładnie te wersje

| Warstwa | Pakiet | Wersja |
|---|---|---|
| Framework | `next` (App Router) | ^14.2 |
| UI | `react`, `react-dom` | ^18.3 |
| Style | `tailwindcss` | ^3.4 |
| Animacje scrollowe | `gsap` (+ ScrollTrigger) | ^3.15 |
| Płynne przewijanie | `lenis` | ^1.3 |
| Mikrointerakcje | `framer-motion` | ^12 |
| Ikony | `lucide-react` | ^1 |
| 3D | `@react-three/fiber` | **^8.18** |
| 3D | `@react-three/drei` | **^9.122** |
| 3D | `three` | **^0.169** |
| Obrazy | `sharp` | ^0.35 |

**Wersje 3D nie są przypadkowe.** `@react-three/fiber` 9 i `drei` 10 wymagają
Reacta 19. Przy Reakcie 18 jedyna zgodna linia to fiber 8 + drei 9 + three 0.169.
Sprawdź `peerDependencies`, zanim zainstalujesz cokolwiek nowszego.

Cała stylistyka w Tailwindzie, bez CSS-in-JS. Paleta i typografia dobrane do
branży: jeden font display (nagłówki) + jeden tekstowy, oba przez `next/font`.
Dla polskiej treści `subsets: ['latin', 'latin-ext']` jest obowiązkowe —
bez tego diakrytyki lecą na font zastępczy.

## Struktura

```
app/
  layout.tsx        fonty, metadane + OG, nawigacja, pasek postępu, stopka
  page.tsx          złożenie sekcji
  globals.css       Tailwind, klasy Lenisa, globalny fallback reduced-motion
  robots.ts, sitemap.ts, icon.svg
components/
  sections/         jedna sekcja = jeden plik
  providers/PlynnePrzewijanie.tsx    Lenis spięty z ScrollTriggerem
  three/Panorama360.tsx              panorama sferyczna hero
  ui/               nawigacja, stopka, nagłówek sekcji, licznik,
                    SlowaZMaska, PasekPostepu
hooks/              usePrefersReducedMotion, useMediaQuery,
                    useIsomorphicLayoutEffect
lib/
  content.ts        CAŁA treść + import zdjęć
  gsap.ts           rejestracja pluginu, warunki matchMedia, krzywe, rytm
  animacje.ts       powtarzalne gesty (wejście nagłówka, odsłona kadru)
public/zdjecia/     zdjęcia + ZRODLA.md z licencjami
```

## Sekcje i ich zachowanie

1. **Hero (100vh)** — panorama 360°, którą da się chwycić i obrócić (szczegóły
   niżej). Nagłówek wjeżdża słowo po słowie spod maski, treść blaknie i kurczy
   się w pierwszych ~20% scrolla, zdjęcie w tym czasie powoli najeżdża.
2. **Oferta** — karty wjeżdżają ze staggerem (0,1 s desktop / 0,06 s mobile),
   trigger `start: "top 80%"`. Ikony ruszają chwilę po kartach, na `back.out`.
3. **Harmonogram / proces** — **zakładki, nie sekcja przypięta.** Etapy
   przełącza się klikiem albo strzałkami; strona przewija się przez sekcję
   normalnie. Pinning odbierający przewijanie na kilka ekranów kosztuje więcej,
   niż jest wart. Pełny wzorzec ARIA tabs: `role="tablist"/"tab"/"tabpanel"`,
   `aria-selected`, `aria-controls`, roving `tabIndex`, obsługa strzałek,
   `Home` i `End`. Jedna lista dla obu układów przełączana klasami (poziome
   pigułki z numerami na mobile, pionowy spis z nazwami na desktopie) — dwie
   osobne listy dałyby dwa komplety tych samych identyfikatorów ARIA.
4. **Galeria** — parallax trójwarstwowy: tło ~0,3× prędkości scrolla, kadry
   ~0,6×, tekst 1×. Do tego odsłona przy wejściu w kadr: ramka rozsuwa się
   `clip-path`em od dołu, a obraz w środku schodzi ze skali 1,18×. Dwie warstwy
   są konieczne — skalowanie ramki skalowałoby razem z nią zaokrąglony róg.
5. **Statystyki** — kreska rozciąga się od lewej, liczba wychodzi spod niej,
   licznik odlicza w górę. Uruchamiany dokładnie przy wejściu sekcji w kadr
   (`start: "top 85%"`, `once: true`).
6. **Opinie** — poziomy scroll-snap ze sterowaniem przyciskami; slajdy wchodzą
   pojedynczo z lekkim przesunięciem w bok.
7. **Kontakt** — sticky reveal: kolumna z danymi zostaje w kadrze, formularz
   przesuwa się obok niej. Najpierw wjeżdża karta, dopiero po niej pola —
   równolegle ich ruch znosi się z ruchem tła.

## Panorama 360° w hero

Kamera stoi w środku dużej kuli, na którą od wewnątrz nałożone jest zdjęcie
sferyczne (equirectangular, proporcja **dokładnie 2:1**). Obracanie kamery to
rozglądanie się. Sterowanie: `OrbitControls` z `enableZoom={false}`,
`enablePan={false}`, ujemnym `rotateSpeed` (świat idzie za kursorem),
`enableDamping` i blokadą zenitu/nadiru, gdzie zbiegają się południki zdjęcia.

**Trzy rzeczy, bez których to nie działa:**

1. **`side={BackSide}` na materiale.** Kuszące `scale={[-1, 1, 1]}` na siatce
   *nie* zadziała — three wykrywa ujemną wyznacznik macierzy i sam odwraca
   kierunek ścianek z powrotem, więc culling dalej wycina wnętrze kuli.
   Objaw jest mylący: zero błędów, canvas po prostu **całkowicie przezroczysty**,
   widać tylko to, co leży pod nim.
2. **`repeat.x = -1` na teksturze** (plus `wrapS = RepeatWrapping`). Patrząc na
   kulę od wewnątrz widzimy jej mapowanie w lustrzanym odbiciu.
3. **`toneMapping: NoToneMapping`.** R3F domyślnie przepuszcza obraz przez
   krzywą ACES, przewidzianą dla renderu HDR. Zwykły JPEG traci kontrast
   i robi się mlecznie wyprany.

**Sterowanie musi się różnić między myszą a dotykiem.** Na myszy przeciąganie
nie ma z czym kolidować — działa od razu. Na dotyku hero zajmuje cały ekran,
a gest przeciągnięcia jest jednocześnie gestem przewijania strony; panorama
łapiąca go od razu **zablokowałaby zejście niżej**. Na małym ekranie włączaj ją
przyciskiem („Rozejrzyj się") i tak samo wyłączaj; `touch-action: none` tylko
wtedy. Powolny autoobrót zachęca do chwycenia i wyłącza się po pierwszym
dotknięciu.

**Uważaj na warstwy nad canvasem.** Gradient czytelności i kontener treści
przechwycą przeciąganie, jeśli nie dostaną `pointer-events: none`. Kontener
rozciąga się na całą szerokość strony, więc zjadłby drag także tam, gdzie nie ma
żadnego tekstu — wskaźnik ma łapać dopiero sam blok treści.

**Waga.** Tekstura trafia do GPU nieskompresowana, więc panorama 8192×4096
zajęłaby ~134 MB pamięci karty. Przygotuj dwa warianty przez `sharp`:
~3072×1536 (desktop) i ~1536×768 (mały ekran), zachowując proporcję 2:1.
Pod panoramą zostaw lekkie zdjęcie statyczne z `priority` — to ono ma liczyć się
jako LCP, a panorama dochodzi później i wchodzi przenikaniem.

## Warstwa animacji

**Lenis ↔ ScrollTrigger — trzy rzeczy muszą się zgadzać**, inaczej pinning
i scrub drgają:

1. Lenis zgłasza każdą zmianę pozycji do `ScrollTrigger.update`.
2. Klatki Lenisa liczy ticker GSAP, a nie własny `requestAnimationFrame` —
   dwie pętle animacji obok siebie się rozjeżdżają.
3. `gsap.ticker.lagSmoothing(0)` — GSAP domyślnie nadrabia zgubione klatki
   skokiem czasu, co przy scrubie widać jako przeskok.

Dorzuć `ScrollTrigger.refresh()` po `load` i `document.fonts.ready` — fonty
i obrazy zmieniają wysokość dokumentu już po pierwszym pomiarze. Kotwice `#…`
muszą iść przez `lenis.scrollTo`, bo natywny skok omija jego wewnętrzną pozycję.

**Breakpointy i reduced-motion trzymaj w jednym mechanizmie.** Użyj
`gsap.matchMedia()` — `ScrollTrigger.matchMedia()` jest oznaczone jako
deprecated od GSAP 3.11. Warunki: `(min-width: 768px) and (prefers-reduced-motion: no-preference)`,
analogicznie dla `max-width`, plus `(prefers-reduced-motion: reduce)`.

**Wspólny słownik ruchu** w `lib/gsap.ts`: nazwane krzywe (`expo.out` do tekstu
spod maski, `power3.out` do przesunięć, `power2.inOut` do zmian stanu w obie
strony) i odstępy staggerów. Rozjechane easingi to najczęstszy powód, dla
którego zbiór poprawnych animacji nie składa się w spójną całość.

**Animuj wyłącznie `transform`, `opacity` i `clip-path`** — nigdy `top`/`left`.

**Podział pracy:** GSAP obsługuje wszystko zależne od pozycji scrolla. Framer
Motion bierze interakcje interfejsu — hover, tap, menu, pasek postępu,
przełączanie zakładek.

**Uproszczenia na małym ekranie** przez `gsap.matchMedia()`: krótszy parallax
(~45% amplitudy), mniejszy stagger, mniejsze dystanse wejścia, lżejsza panorama.

## Reduced-motion — osobne decyzje, nie jeden przełącznik

- Lenis **w ogóle nie startuje** — zostaje natywne przewijanie przeglądarki.
- Panorama **nie jest montowana**; zostaje samo zdjęcie.
- GSAP nie tworzy żadnych tweenów. Ponieważ wszystko idzie przez `gsap.from()`,
  stanem domyślnym jest treść widoczna i kadr odsłonięty — **działa tak samo
  bez JS**. To dotyczy również masek tekstu i `clip-path`.
- Framer dostaje `undefined` zamiast `whileHover`/`whileTap`.
- Pasek postępu zostaje, ale bez wygładzania sprężyną: sam wskaźnik nie jest
  ruchem dodanym, wygładzanie już tak.
- W `globals.css` dodatkowo globalny fallback CSS jako ostatnia linia obrony.

## Bez błędów hydratacji

- Lenis, GSAP i Three inicjalizowane w `useEffect` / komponencie `'use client'`.
- Three dotyka `window` przy imporcie → `dynamic(..., { ssr: false })`.
- Hooki `usePrefersReducedMotion` i `useMediaQuery` **muszą startować od
  `false`**, tak jak render serwerowy; prawdziwą odpowiedź podstawia dopiero
  efekt po hydratacji.
- **Nie używaj `Intl.NumberFormat` do formatowania liczb w liczniku.** Potrafi
  zwrócić inny separator tysięcy w Node i w przeglądarce (U+00A0 kontra U+202F,
  zależnie od wersji ICU) — tekst z serwera rozjedzie się z pierwszym renderem
  klienta. Napisz deterministyczną funkcję ze spacją nierozdzielającą.

## Reveal tekstu spod maski

Podziel nagłówek na słowa, każde do własnej maski `overflow: hidden`.
Trzy rzeczy, które łatwo tam zepsuć:

1. **Polskie ogonki.** `overflow: hidden` obcina wszystko poniżej linii
   bazowej — bez zapasu na dole (`padding-bottom: 0.16em`) „ą" i „ę" tracą
   ogonki, a „y" i „p" descendery.
2. **Zawijanie.** Spacje muszą zostać prawdziwymi węzłami tekstowymi między
   spanami, a nie marginesem — inaczej długi nagłówek nie złamie się naturalnie
   i straci właściwą szerokość spacji dla danego kroju.
3. **Czytniki ekranu.** Tekst pocięty na kilkanaście elementów bywa czytany
   z pauzami: pełne zdanie idzie w `aria-label`, kawałki znikają z drzewa
   dostępności.

## Materiał zdjęciowy — wymóg uczciwości

Jeśli używasz zdjęć ze stocków (Unsplash, Pexels, Poly Haven), **nie wolno ich
podpisywać tak, jakby przedstawiały wytwór klienta.** Podpis w rodzaju
„elewacja południowa budynku B" pod zdjęciem stockowym to wprowadzanie odbiorcy
w błąd, nie skrót redakcyjny.

- Podpisy mają opisywać **zamysł**, nie konkretne miejsce.
- Pod galerią musi stać zastrzeżenie mówiące wprost, że zdjęcia są poglądowe
  i nie przedstawiają tej realizacji.
- Załóż `public/zdjecia/ZRODLA.md` z tabelą: plik, źródło, licencja, adres,
  plus instrukcja podmiany dla realnego klienta.
- **Obejrzyj każde zdjęcie przed wstawieniem.** Odrzucaj rendery CGI, gdy
  zamawiano fotografię, i kadry kłócące się z paletą.

Wszystkie dane firmy (nazwa, telefon, adres, liczby, opinie) są przykładowe,
dopóki klient ich nie potwierdzi — oznacz to w stopce i w README.

## Dodatkowo

- `metadataBase` + obrazek Open Graph i karta Twittera.
- `robots.ts` i `sitemap.ts` wskazujące na `[DOMENA]`.
- Link „przejdź do treści" dla klawiatury, widoczny stan `:focus-visible`.
- Formularz kontaktowy bez backendu ma **mówić to wprost** po zatwierdzeniu,
  a nie udawać wysłane zgłoszenie. Zostaw komentarz w miejscu na endpoint.

## Kryterium ukończenia

- [ ] `npm run lint`, `npm run typecheck`, `npm run build` — wszystko zielone
- [ ] Strona uruchomiona w przeglądarce w trzech trybach: desktop, mobile
      (390×844) i `prefers-reduced-motion: reduce` — **konsola czysta w każdym**,
      zero ostrzeżeń o hydratacji
- [ ] Brak poziomego przewijaka w żadnym trybie
- [ ] Panorama faktycznie obraca się pod przeciągnięciem — zweryfikowane
      pomiarem, nie „wygląda na to, że działa"
- [ ] Zakładki harmonogramu przełączają się klikiem **i** strzałkami
- [ ] Licznik dolicza do wartości końcowej
- [ ] Przy reduced-motion żadna treść nie zostaje ukryta pod maską
- [ ] Każde zdjęcie obejrzane; licencje spisane w `ZRODLA.md`
- [ ] Raport wymienia jawnie, czego **nie** sprawdzono

## Uwagi warsztatowe

- **Nie uruchamiaj `npm run build` równolegle z działającym dev serverem** —
  dzielą katalog `.next`, build podmieni chunki pod serwerem i posypią się
  błędy 404/500, które wyglądają jak regresja w kodzie.
- `next/font` z fontem zmiennym: **nie podawaj listy `weight` obok `axes`** —
  build wywala się na „Axes can only be defined for variable fonts".
- Porównując zrzuty ekranu w testach, dekoduj je do surowych pikseli.
  `screenshot()` zwraca skompresowany PNG; porównanie jego bajtów mierzy szum
  kompresji, nie obraz. Metryka „ile pikseli się zmieniło" też jest bezużyteczna
  przy zdjęciu z drobnym detalem — użyj średniej różnicy jasności.
- Komentarz JSX nie może stać wewnątrz nawiasu wyrażenia warunkowego przed
  elementem — to dwa węzły zamiast jednego i błąd składni.
