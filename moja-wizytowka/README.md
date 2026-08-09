# Mikołaj Oczkowski — osobista wizytówka

Lekka, osobista wizytówka twórcy stron internetowych z Kozienic. Projekt korzysta z granatowego logo MO / WEB DESIGN, pomarańczowo-czarnego kierunku interfejsu i prostego stosu Vite.

Aktualny adres produkcyjny: `https://stronanalata.pl/`.

Strona jest przygotowana pod hosting Hostinger (Apache + PHP): statyczny build
Vite, backend formularza w `public/kontakt.php` i nagłówki bezpieczeństwa w
`public/.htaccess`.

## Struktura adresów

Strona jest **wielostronicowa** — trzy osobne pliki HTML, każdy z własnym
`canonical`, opisem i wpisem w sitemapie:

| Adres          | Plik źródłowy           | Rola                                                    |
| -------------- | ----------------------- | ------------------------------------------------------- |
| `/`            | `index.html`            | strona główna: skrót oferty, cztery realizacje, formularz |
| `/oferta/`     | `oferta/index.html`     | pełny zakres trzech pakietów, terminy, koszty stałe, FAQ |
| `/realizacje/` | `realizacje/index.html` | wszystkie czternaście projektów pokazowych, pogrupowane     |

Poza tym `/o-mnie`, `/uslugi`, `/proces`, `/faq` i `/kontakt` to **sekcje strony
głównej** — `.htaccess` serwuje na nich `index.html`, a `initRouting()`
w `src/app.js` przewija do właściwego miejsca. Router celowo nie zna adresów
`/oferta/` i `/realizacje/`, żeby przeglądarka otwierała je normalnie; pilnują
tego testy w `tests/app.test.mjs`.

Dodanie kolejnej podstrony wymaga trzech kroków: nowe wejście w
`vite.config.js`, nowy `<url>` w `public/sitemap.xml` i dopisanie strony do
tablicy `pages` w `scripts/validate.mjs`.

## Uruchomienie

```powershell
npm.cmd install
npm.cmd run dev
```

## Kontrola jakości

```powershell
npm.cmd run check
npm.cmd run qa
npm.cmd run stability
npm.cmd audit
# albo pełny zestaw przed wydaniem:
npm.cmd run release:check
```

## Formularz i wysyłka e-mail (PHP + PHPMailer + SMTP)

Formularz wysyła dane POST do `public/kontakt.php`, a odbiorcą zgłoszeń jest
`mikolajoczkowski42@gmail.com`. Backend:

- sprawdza honeypot `bot-field` (bot dostaje pozorny sukces bez wysyłki),
- waliduje po stronie serwera te same limity co HTML (firma 2–120, e-mail ≤ 254,
  wiadomość 20–3000) i odrzuca zgłoszenie stroną z komunikatem,
- wysyła mail przez PHPMailer i uwierzytelniony SMTP Hostingera,
- jeśli konfiguracji SMTP/PHPMailera brak (albo wysyłka SMTP zawiedzie), korzysta
  z transportu zapasowego przez funkcję `mail()` serwera — formularz działa więc
  od razu po wgraniu na hosting, a po dodaniu SMTP automatycznie go używa,
- ustawia `Reply-To` na adres klienta i rozpoznawalny temat wiadomości,
- po sukcesie przekierowuje 303 na `/dziekuje.html`,
- nie zapisuje treści zgłoszeń w logach.

> Transport zapasowy `mail()` wysyła z adresu `formularz@<domena-strony>`. Aby
> wiadomości nie trafiały do spamu, w hPanelu powinny być ustawione rekordy
> SPF/DKIM/DMARC domeny. Pełny, uwierzytelniony SMTP nadal jest zalecany dla
> najlepszej dostarczalności.

Konfiguracja SMTP leży **poza repozytorium i poza katalogiem publicznym** — wzór
z instrukcją wdrożenia znajduje się w `kontakt.config.example.php`. Prawdziwy
`kontakt.config.php` (oraz pliki PHPMailer) wgrywa się na serwer jeden poziom nad
`public_html`; plik jest wpisany do `.gitignore`.

## Bezpieczeństwo formularza

- Honeypot odrzuca proste boty, a walidacja serwerowa powtarza limity z HTML.
- Adres e-mail i nazwa firmy są czyszczone ze znaków nowej linii (ochrona przed
  wstrzyknięciem nagłówków SMTP).
- Plik `public/.htaccess` ustawia CSP, blokadę osadzania strony w ramkach, `nosniff`, HSTS, ograniczoną politykę uprawnień i ochronę referrera.
- Formularz może wysyłać dane wyłącznie do tej samej domeny (`form-action 'self'`).
- Hasło SMTP nigdy nie jest zapisywane w kodzie ani w plikach projektu.
- Jeżeli mimo honeypota pojawi się spam, można dodać limit częstotliwości wysyłki
  albo CAPTCHA; zewnętrzna CAPTCHA to dodatkowy dostawca danych i wymaga
  aktualizacji polityki prywatności.

## Ważne przed publikacją

- **Dema podlinkowane z `/realizacje/` muszą być wdrożone**, inaczej galeria prowadzi w 404. Lista wymaganych adresów i stan przygotowania: `WDROZENIE-DEM.md`.
- Canonical, Open Graph, `robots.txt` i `sitemap.xml` wskazują `https://stronanalata.pl/`. Po zmianie domeny trzeba zmienić wszystkie adresy SEO — w **trzech** plikach HTML, nie w jednym.
- Indeksowanie wszystkich trzech stron jest włączone. Polityka prywatności, strona podziękowania i 404 pozostają poza indeksem.
- Uzupełnij potwierdzone dane usługodawcy i ustal, czy formularz wymaga regulaminu świadczenia usług drogą elektroniczną.
- Roboczy projekt regulaminu znajduje się w `REGULAMIN-FORMULARZA-ROBOCZY.md`; nie
  jest podlinkowany na stronie i wymaga uzupełnienia pełnych danych oraz weryfikacji
  prawnej przed publikacją.
- Sprawdź, czy opis odbiorców danych w polityce prywatności odpowiada faktycznie używanym usługom Hostinger i Google.
- Załóż skrzynkę SMTP w hPanelu, wgraj `kontakt.config.php` i PHPMailer nad `public_html`, ustaw SPF/DKIM/DMARC, a następnie wykonaj produkcyjne wysłanie formularza i potwierdź wiadomość e-mail.

## Zasada dotycząca liczb i cen

Na stronie znajduje się dokładnie jedna cena — „od 600 zł” przy pakiecie
wizytówkowym. Pozostałe zakresy mówią „wycena po analizie”, bo właściciel nie
zatwierdził żadnych widełek. `scripts/validate.mjs` **odrzuci build**, w którym
na stronie oferty pojawi się zakres cenowy w formacie `x–y zł`. To celowa
blokada: gdy zdecydujesz się podać widełki, najpierw usuń ten test, a potem
wpisz liczby — nie odwrotnie.

## Cookies i analityka

Strona nie używa cookies, analityki, reklam ani zewnętrznych trackerów, dlatego nie
wyświetla banera zgody. Przed dodaniem analityki, reCAPTCHA, mapy, filmu, czatu,
piksela reklamowego lub innego zewnętrznego osadzenia trzeba przeprowadzić ponowną
ocenę prywatności i zablokować niekonieczne technologie do czasu uzyskania zgody.
