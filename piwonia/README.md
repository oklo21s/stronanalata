# PIWONIA — one-page restauracji

Jednostronicowa witryna restauracji kuchni polskiej: karta z zakładkami, sekcja
przyjęć okolicznościowych i formularz rezerwacji. Next.js 15 (App Router, SSG),
TypeScript strict, Tailwind 4 w wariancie CSS-first, GSAP + ScrollTrigger + SplitText,
Lenis.

> **Marka jest fikcyjna.** Nazwa, adres, telefon, NIP, nazwisko szefowej kuchni,
> opinie gości i ceny są przykładowe — powstały na potrzeby projektu
> demonstracyjnego. Przed wdrożeniem trzeba je podmienić na dane klienta
> (wszystko siedzi w `data/content.ts` i `data/menu.ts`).
> Zdjęcia pochodzą z Unsplash i pokazują inne lokale — patrz sekcja „Zdjęcia".

## Uruchomienie

```bash
npm install
npm run dev          # http://localhost:3000
```

Produkcyjnie:

```bash
npm run build
npm run start
```

Kontrola jakości:

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run format       # prettier --write .
```

## Struktura

```
app/
  layout.tsx              fonty (next/font), metadata, JSON-LD Restaurant, nawigacja
  page.tsx                kompozycja sekcji
  globals.css             @theme + tokeny + warstwa base/components
  icon.svg                favicon
components/
  SmoothScroll.tsx        Lenis <-> ScrollTrigger, refresh po obrazach i przy resize
  Nav.tsx                 przezroczysta nad hero, pełna po zejściu; panel mobilny
  Hero.tsx                SplitText na linie w maskach + parallax tła
  Manifest.tsx            nagłówek + akapit odsłaniany słowo po słowie
  Pillars.tsx             cztery zasady kuchni, siatka ze zdjęciami
  Menu.tsx                karta z zakładkami (wzorzec ARIA tablist), zestawy, znaczniki dietetyczne
  Chef.tsx                sylwetka szefowej kuchni
  Gallery.tsx             siatka z parallaksą kafli (wyłączona na mobile)
  Events.tsx              sale, przebieg organizacji przyjęcia
  Testimonials.tsx        opinie gości
  Reservation.tsx         formularz rezerwacji + walidacja + panel z godzinami
  Footer.tsx              kontakt, dojazd, godziny, wordmark, podpisy pod zdjęciami
  ui/
    Reveal.tsx            odsłanianie przy scrollu (opakowanie dla sekcji)
    TextReveal.tsx        akapit odsłaniany słowo po słowie, scrub
    SectionHeading.tsx    nadpis + nagłówek + lead
    Ornament.tsx          znak firmowy (piwonia), używany też jako favicon
hooks/
  useIsMobile.ts          matchMedia (max-width: 767.98px)
  useReducedMotion.ts     matchMedia (prefers-reduced-motion: reduce)
lib/
  gsap.ts                 rejestracja pluginów, willChange(), scheduleRefresh()
  lenis-store.ts          dostęp do instancji Lenisa spoza Reacta
data/
  content.ts              cała treść strony poza kartą
  menu.ts                 karta: działy, dania, ceny, zestawy
  photos.ts               GENEROWANY rejestr zdjęć (wymiary, blurDataURL, autor)
public/img/               20 zdjęć — każde używane, bez zapasów
netlify.toml
```

W JSX nie ma żadnego zdania na sztywno — korekta tekstu to edycja `data/`.

## Formularz rezerwacji

Formularz jest **demonstracyjny i nie ma backendu**: po walidacji pokazuje ekran
potwierdzenia, ale nigdzie nie wysyła danych. Informuje o tym napis obok przycisku
(`reservation.demoNote` w `data/content.ts`).

Żeby go podłączyć, wystarczy zastąpić `setSent(true)` w `components/Reservation.tsx`
wywołaniem własnego endpointu. Uwagi na potem:

- walidacja po stronie klienta jest wygodą, nie zabezpieczeniem — serwer musi
  sprawdzić dane jeszcze raz,
- pole zgody (`consent`) jest wymagane i trzeba zapisywać jego treść razem
  ze zgłoszeniem,
- warto dołożyć ochronę przed botami (honeypot lub captcha) — adres skrzynki
  restauracji szybko trafia na listy spamerskie.

## Zdjęcia

20 zdjęć w `public/img/` pochodzi z Unsplash (licencja Unsplash, użycie
komercyjne bez opłat, atrybucja mile widziana). Autorzy są wypisani w rozwijanej
liście w stopce — dane biorą się z `data/photos.ts`, więc lista nie rozjedzie się
z plikami.

**To są zdjęcia innych lokali.** Do wdrożenia u realnego klienta trzeba je wymienić
na jego własne — inaczej strona obiecuje wnętrze i talerze, których nie ma.

`data/photos.ts` jest generowany: trzyma wymiary (potrzebne, żeby układ nie skakał),
`blurDataURL` (16 px WebP w base64) oraz podpis autora. Przy podmianie zdjęć
najprościej wygenerować go ponownie — plik jest w całości mechaniczny, poza opisami
`alt`, które trzeba napisać ręcznie.

## Dostępność

- `prefers-reduced-motion: reduce` wyłącza Lenisa i wszystkie animacje
  scrollowe (elementy ustawiane są od razu w stanie końcowym przez `gsap.set`).
- Karta dań to pełny wzorzec ARIA `tablist` — działa strzałkami w lewo i w prawo.
- Formularz: etykiety związane z polami, `aria-invalid` i `aria-describedby`
  przy błędach, fokus skacze do pierwszego błędnego pola.
- Link „Przejdź do treści" na początku dokumentu.
- Bez JavaScriptu `<noscript>` odblokowuje dokument i odsłania elementy ukryte
  na potrzeby animacji — strona zostaje w pełni czytelna.

## SEO

`app/layout.tsx` wstrzykuje JSON-LD typu `Restaurant`: adres, telefon, kuchnia,
przedział cenowy, godziny otwarcia i informacja, że lokal przyjmuje rezerwacje.
Wszystko czyta z `data/content.ts` — godziny mają tam obok wersji dla ludzi
(`value`) drugą w formacie schema.org (`schema`), więc jedna zmiana wystarcza.

## Deploy

Netlify, `netlify.toml` w repozytorium (`@netlify/plugin-nextjs`, Node 22).
