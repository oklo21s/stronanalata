# Kwartał Lipowy — strona scrollytelling

Jednostronicowa witryna inwestycji mieszkaniowej. Cała narracja rozgrywa się
przy przewijaniu: elementy reagują na pozycję scrolla, a nie tylko pojawiają się
na wejściu w kadr.

> **Projekt demonstracyjny.** Nazwa inwestycji, dane kontaktowe, liczby i opinie
> są przykładowe. Przed użyciem dla realnego klienta każdą z tych wartości trzeba
> zastąpić danymi potwierdzonymi przez właściciela — patrz [Podmiana treści](#podmiana-treści).

## Uruchomienie

```bash
npm install
npm run dev        # http://localhost:3000
```

Pozostałe komendy:

```bash
npm run build      # build produkcyjny (uruchamia też lint i typy)
npm run start      # serwer produkcyjny po buildzie
npm run lint       # ESLint (next/core-web-vitals)
npm run typecheck  # tsc --noEmit
```

## Stack

| Warstwa | Biblioteka | Wersja |
|---|---|---|
| Framework | Next.js (App Router) | 14.2.35 |
| UI | React | 18.3.1 |
| Style | Tailwind CSS | 3.4 |
| Animacje scrollowe | GSAP + ScrollTrigger | 3.15 |
| Płynne przewijanie | Lenis | 1.3 |
| Mikrointerakcje | Framer Motion | 12.43 |
| Ikony | Lucide React | 1.27 |
| 3D | React Three Fiber + drei + three | 8.18 / 9.122 / 0.169 |

**Dlaczego te wersje 3D:** `@react-three/fiber` 9 i `drei` 10 wymagają Reacta 19.
Przy Reakcie 18 jedyna zgodna linia to fiber 8 + drei 9 + three 0.169.

## Struktura

```
app/
  layout.tsx          fonty (next/font), metadane, nawigacja, stopka
  page.tsx            złożenie sekcji
  globals.css         Tailwind, klasy Lenisa, globalny fallback reduced-motion
components/
  sections/           jedna sekcja = jeden plik
    Hero.tsx          100vh, panorama 360° do obracania, fade+scale w ~20% scrolla
    Oferta.tsx        karty ze staggerem + ikony na back.out, trigger "top 80%"
    Proces.tsx        harmonogram jako zakładki — klik/strzałki, bez pinningu
    Galeria.tsx       parallax trójwarstwowy + odsłona kadru przy wejściu
    Statystyki.tsx    kreska się rozciąga, liczba wychodzi spod niej, licznik biegnie
    Opinie.tsx        poziomy scroll-snap, slajdy wchodzą pojedynczo
    Kontakt.tsx       sticky reveal, karta i dopiero po niej pola formularza
  ui/
    SlowaZMaska.tsx   dzieli tekst na słowa w maskach (reveal nagłówków)
    PasekPostepu.tsx  linia postępu strony na górze okna
  providers/
    PlynnePrzewijanie.tsx   Lenis spięty z ScrollTriggerem
  three/
    Panorama360.tsx         panorama sferyczna hero (kula + OrbitControls)
    BrylaKwartalu.tsx       nieużywana scena 3D — patrz sekcja niżej
                      (poza tym: nawigacja, stopka, nagłówek sekcji, licznik)
hooks/                reduced-motion, media query, isomorphic layout effect
lib/
  content.ts          CAŁA treść strony + import zdjęć galerii
  gsap.ts             rejestracja pluginu + warunki matchMedia
public/zdjecia/       cztery zdjęcia galerii + ZRODLA.md z licencjami
```

## Jak działa warstwa animacji

**Lenis ↔ ScrollTrigger.** Trzy rzeczy muszą się zgadzać, inaczej pinning drga:
Lenis zgłasza każdą zmianę pozycji do `ScrollTrigger.update`, klatki Lenisa liczy
ticker GSAP (nie własny `requestAnimationFrame`), a `lagSmoothing(0)` wyłącza
nadrabianie zgubionych klatek skokiem czasu. Szczegóły w
[PlynnePrzewijanie.tsx](components/providers/PlynnePrzewijanie.tsx).

**Breakpointy i reduced-motion w jednym miejscu.** Zamiast
`ScrollTrigger.matchMedia()` (oznaczone jako deprecated od GSAP 3.11) używamy
następcy `gsap.matchMedia()`. Daje ten sam podział na breakpointy, dokłada
automatyczny cleanup i pozwala trzymać warunek `prefers-reduced-motion` obok
breakpointów zamiast w drugim, równoległym mechanizmie. Warunki są w
[lib/gsap.ts](lib/gsap.ts), każda sekcja czyta `context.conditions`.

**Wydajność.** Animowane są wyłącznie `transform`, `opacity` i `clip-path` —
żadnego `top` ani `left`.

**Wspólny słownik ruchu.** Krzywe czasu i odstępy staggerów siedzą w
[lib/gsap.ts](lib/gsap.ts) (`krzywe`, `rytm`), a nie w każdej sekcji z osobna.
Rozjechane easingi to najczęstszy powód, dla którego zestaw poprawnych animacji
składa się na niespójną całość. Trzy krzywe: `odslona` (expo.out — ostre
hamowanie, do tekstu wychodzącego spod maski), `plynne` (power3.out — przesunięcia
i zanikanie), `spokojne` (power2.inOut — rzeczy zmieniające stan w obie strony).

**Powtarzalne gesty** są w [lib/animacje.ts](lib/animacje.ts):

- `wejscieNaglowka()` — nadtytuł, słowa tytułu spod maski, lead; wszystko na
  jednej osi czasu z zakładkami, żeby czytało się jak jeden gest, a nie trzy
  osobne zdarzenia. Wywoływać wyłącznie wewnątrz `gsap.context()` sekcji —
  selektory są wtedy ograniczone do jej poddrzewa.
- `odslonaKadru()` — ramka rozsuwa się `clip-path`em od dołu, a obraz w środku
  schodzi ze skali. Dwie warstwy są konieczne: skalowanie ramki skalowałoby
  razem z nią zaokrąglony róg.

**Podział pracy z Framer Motion.** GSAP obsługuje wszystko, co zależy od pozycji
scrolla. Framer bierze interakcje interfejsu: hover i tap, menu mobilne, pasek
postępu oraz przełączanie zakładek w harmonogramie — patrz sekcja niżej.

**Reveal tekstu** robi [SlowaZMaska](components/ui/SlowaZMaska.tsx) — dzieli
nagłówek na słowa i wkłada każde do własnej maski. Trzy rzeczy, które łatwo tam
zepsuć: `overflow: hidden` obcina polskie ogonki (stąd zapas na dole), spacje
muszą zostać prawdziwymi węzłami tekstowymi (inaczej długi nagłówek nie zawinie
się naturalnie), a pocięty tekst trzeba podać czytnikom ekranu jako całość
przez `aria-label`.

## Zachowanie przy `prefers-reduced-motion: reduce`

Nie jest to jedno globalne wyłączenie, tylko cztery osobne decyzje:

- **Lenis w ogóle nie startuje** — zostaje natywne przewijanie przeglądarki.
- **Zdjęcie hero nie najeżdża** przy przewijaniu — zostaje nieruchome.
- **GSAP nie tworzy żadnych tweenów**; treść jest widoczna od razu. Dotyczy to
  także masek i `clip-path`: animacje robi `gsap.from()`, więc stanem domyślnym
  jest tekst na miejscu i kadr w pełni odsłonięty. Bez JS działa tak samo.
- **Pasek postępu zostaje**, ale bez wygładzania sprężyną — sam wskaźnik nie
  jest ruchem dodanym, wygładzanie już tak.
- **Zakładki harmonogramu przełączają się bez przenikania** — treść podmienia
  się od razu, sam mechanizm działa tak samo.
- Framer Motion dostaje `undefined` zamiast `whileHover`/`whileTap`.
- W `globals.css` siedzi dodatkowo globalny fallback CSS jako ostatnia linia obrony.

## Uproszczenia na małym ekranie

Sterowane przez `gsap.matchMedia()`:

| Element | Desktop | Mobile |
|---|---|---|
| Zakładki harmonogramu | pionowy spis z nazwami | poziomy pasek pigułek z numerami |
| Parallax galerii | pełna amplituda | 45% amplitudy |
| Stagger kart | 0,1 s | 0,06 s |
| Dystans wejścia | 44–90 px | 26–48 px |
| Najazd zdjęcia hero | do 1,12× | do 1,06× |
| Stagger słów w nagłówku | 0,055 s | 0,035 s |
| Odsłona kadru galerii | 1,25 s, start „top 82%" | 1 s, start „top 88%" |

Gradient nad zdjęciem hero też zmienia kierunek: na szerokim ekranie przykrywa
lewą stronę (tam stoi tekst), na wąskim górę i dół, bo tekst leży wtedy na
środku kadru.

## Harmonogram: zakładki zamiast sekcji przypiętej

Sekcja stała pierwotnie na pinningu — etapy zmieniały się wraz z pozycją
przewijania, a strona stała w miejscu przez kilka ekranów. Teraz etapy przełącza
się **klikiem albo strzałkami**, a strona przewija się przez sekcję normalnie.
Odebrane użytkownikowi przewijanie okazało się kosztować więcej niż był wart
sam efekt; przy okazji strona skróciła się o ~2 900 px.

Sekcja jest zbudowana jako pełny wzorzec ARIA tabs: `role="tablist"` / `"tab"` /
`"tabpanel"`, `aria-selected`, `aria-controls`, roving `tabIndex` oraz obsługa
strzałek, `Home` i `End`. Bez obsługi strzałek klawiatura utykałaby na pierwszym
przycisku, bo pozostałe mają `tabIndex={-1}`.

**Jedna lista dla obu układów**, przełączana klasami: na wąskim ekranie poziomy
pasek pigułek z numerami, na szerokim pionowy spis z nazwami. Dwie osobne listy
oznaczałyby dwa komplety tych samych identyfikatorów ARIA.

Przejścia robi Framer Motion, nie GSAP — to mikrointerakcja interfejsu,
niezwiązana z pozycją scrolla. GSAP został tu wyłącznie od wejścia nagłówka
w kadr.

## Panorama 360° w hero

Hero jest panoramą sferyczną, którą da się chwycić i obrócić:
[components/three/Panorama360.tsx](components/three/Panorama360.tsx). Kamera stoi
w środku dużej kuli, na którą od wewnątrz nałożone jest zdjęcie 2:1; obracanie
kamery to rozglądanie się.

**Trzy rzeczy, bez których to nie działa** (każda kosztowała osobne śledztwo):

1. **`side={BackSide}` na materiale.** Kuszące `scale={[-1, 1, 1]}` na siatce
   *nie* zadziała — three wykrywa ujemną wyznacznik macierzy i sam odwraca
   kierunek ścianek z powrotem, więc culling dalej wycina wnętrze kuli, a canvas
   zostaje **całkowicie przezroczysty**. Objaw jest mylący: wszystko renderuje się
   bez błędu, widać tylko zdjęcie leżące pod spodem.
2. **`repeat.x = -1` na teksturze.** Patrząc na kulę od wewnątrz widzimy jej
   mapowanie w lustrzanym odbiciu.
3. **`toneMapping: NoToneMapping`.** R3F domyślnie przepuszcza obraz przez krzywą
   ACES, przewidzianą dla renderu HDR. Zwykły JPEG traci wtedy kontrast i robi się
   mlecznie wyprany.

**Sterowanie różni się między myszą a dotykiem — celowo.** Na myszy przeciąganie
nie ma z czym kolidować, więc działa od razu. Na dotyku hero zajmuje cały ekran,
a gest przeciągnięcia jest jednocześnie gestem przewijania strony — panorama
łapiąca go od razu zablokowałaby zejście niżej. Dlatego na małym ekranie wchodzi
przyciskiem („Rozejrzyj się") i tak samo się ją wyłącza; `touch-action` schodzi
do `none` tylko wtedy.

Powolny autoobrót zachęca do chwycenia i **wyłącza się po pierwszym dotknięciu**,
żeby nie walczyć z użytkownikiem.

Statyczne `hero.jpg` leży pod panoramą i zostaje: jest lekkie, ma `priority`,
więc to ono liczy się jako LCP, a panorama (~800 kB) dochodzi później i wchodzi
przenikaniem. Dzięki temu nie ma momentu pustego tła.

Przy `prefers-reduced-motion` panorama **nie jest montowana w ogóle** — zostaje
samo zdjęcie.

### Wcześniejsza bryła 3D

Hero stało kiedyś na proceduralnej bryle kwartału:
[components/three/BrylaKwartalu.tsx](components/three/BrylaKwartalu.tsx). Plik
został w projekcie, choć nic go nie importuje — projekt nie jest pod kontrolą
wersji, więc skasowanie byłoby nieodwracalne. Zależności `three` /
`@react-three/*` są teraz z powrotem w użyciu przez panoramę.

## Podmiana treści

Cała treść siedzi w [lib/content.ts](lib/content.ts) jako typowane obiekty.
Komponenty sekcji nie mają tekstów na sztywno, więc zmiana klienta czy branży
nie wymaga dotykania animacji.

Do zmiany przy nowym kliencie:

1. **[lib/content.ts](lib/content.ts)** — nazwa, sekcje, liczby, opinie, kontakt.
2. **[tailwind.config.ts](tailwind.config.ts)** — paleta (`lipa`, `mosiadz`,
   neutralne) i fonty.
3. **[app/layout.tsx](app/layout.tsx)** — fonty z `next/font`. Uwaga: przy foncie
   zmiennym nie podawaj listy `weight` obok `axes` — build wywala się na
   „Axes can only be defined for variable fonts".
4. **[public/zdjecia/](public/zdjecia/)** — podmień zdjęcia na materiały klienta.
   Są importowane statycznie w `content.ts`, więc `next/image` sam bierze z nich
   wymiary i generuje `blurDataURL`; zachowaj kadr 4:5, inaczej rozjadą się
   wysokości kafelków. Przeczytaj [ZRODLA.md](public/zdjecia/ZRODLA.md) — jest
   tam powód, dla którego podpisy nie wskazują konkretnych miejsc.
5. **Hero** stoi na zdjęciu `hero.jpg` w kadrze poziomym. Jeśli podmienisz je na
   ciemniejsze, popraw gradient czytelności w [Hero.tsx](components/sections/Hero.tsx)
   — grafitowy tekst potrzebuje jasnego podkładu po lewej stronie.

## Czego ta strona NIE ma

- **Formularz nie ma backendu.** Nic nie wysyła i nic nie zapisuje; po
  zatwierdzeniu pokazuje komunikat mówiący to wprost. Endpoint podłącza się
  w funkcji `przySubmit` w [Kontakt.tsx](components/sections/Kontakt.tsx).
  Wraz z nim dojdzie obsługa błędu, stanu ładowania i zgody RODO.
- Brak analityki, cookie bannera i polityki prywatności.
- **Żadne zdjęcie na stronie — w hero ani w galerii — nie przedstawia realnej
  inwestycji.** Pochodzą z Unsplash i Pexels. Dlatego podpisy opisują zamysł („do czego dążymy"),
  a nie miejsca na budowie, i dlatego pod galerią stoi zastrzeżenie mówiące to
  wprost. Podpisanie zdjęcia stockowego jako „elewacja południowa budynku B"
  byłoby wprowadzaniem kupującego w błąd. Licencje: [ZRODLA.md](public/zdjecia/ZRODLA.md).
- `sitemap.xml` i `robots.txt` są generowane, ale wskazują na przykładową domenę
  z `firma.domena` w [content.ts](lib/content.ts) — podmień przed wdrożeniem.

## Stan weryfikacji

Sprawdzone realnym uruchomieniem 28 lipca 2026:

- `npm run build` — przechodzi, wszystko prerenderowane statycznie (strona,
  `robots.txt`, `sitemap.xml`), 191 kB First Load JS
- `npm run typecheck` — bez błędów
- Każde z czterech zdjęć obejrzane przed wstawieniem; dwóch pierwszych
  kandydatów odrzucono (render CGI zamiast fotografii, wieżowiec zamiast niskiej
  zabudowy)
- Edge (headless), trzy tryby: desktop 1440×900, mobile 390×844,
  `prefers-reduced-motion: reduce` — **konsola czysta w każdym**, zero błędów
  hydratacji, brak poziomego przewijaka
- Potwierdzone zachowanie: pinning aktywny tylko na desktopie (`position: absolute`
  na panelach), na mobile i przy reduced-motion panele zostają w `position: static`;
  scena 3D nie montuje się przy reduced-motion; licznik dolicza do wartości końcowej

**Nie sprawdzone:** Lighthouse, Safari i iOS (środowisko Windows), realne
urządzenia dotykowe, czytniki ekranu.
