# Mikołaj Oczkowski — osobista wizytówka

Lekka, osobista wizytówka twórcy stron internetowych z Kozienic. Projekt korzysta z granatowego logo MO / WEB DESIGN, pomarańczowo-czarnego kierunku interfejsu i prostego stosu Vite.

Aktualny adres produkcyjny: `https://stronanalata.pl/`.

Strona jest przygotowana pod hosting Hostinger (Apache + PHP): statyczny build
Vite, backend formularza w `public/kontakt.php` i nagłówki bezpieczeństwa w
`public/.htaccess`.

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
- ustawia `Reply-To` na adres klienta i rozpoznawalny temat wiadomości,
- po sukcesie przekierowuje 303 na `/dziekuje.html`,
- nie zapisuje treści zgłoszeń w logach.

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

- Canonical, Open Graph, `robots.txt` i `sitemap.xml` wskazują `https://stronanalata.pl/`. Po zmianie domeny trzeba zmienić wszystkie adresy SEO.
- Indeksowanie strony głównej jest włączone. Polityka prywatności, strona podziękowania i 404 pozostają poza indeksem.
- Uzupełnij potwierdzone dane usługodawcy i ustal, czy formularz wymaga regulaminu świadczenia usług drogą elektroniczną.
- Roboczy projekt regulaminu znajduje się w `REGULAMIN-FORMULARZA-ROBOCZY.md`; nie
  jest podlinkowany na stronie i wymaga uzupełnienia pełnych danych oraz weryfikacji
  prawnej przed publikacją.
- Sprawdź, czy opis odbiorców danych w polityce prywatności odpowiada faktycznie używanym usługom Hostinger i Google.
- Załóż skrzynkę SMTP w hPanelu, wgraj `kontakt.config.php` i PHPMailer nad `public_html`, ustaw SPF/DKIM/DMARC, a następnie wykonaj produkcyjne wysłanie formularza i potwierdź wiadomość e-mail.

Pełna lista etapów przed i po publikacji znajduje się w `URUCHOMIENIE-I-ZGODNOSC-TODO.md`. Brakujące, niepotwierdzone dane są zebrane w `DANE-DO-UZUPELNIENIA.md`.

## Cookies i analityka

Strona nie używa cookies, analityki, reklam ani zewnętrznych trackerów, dlatego nie
wyświetla banera zgody. Przed dodaniem analityki, reCAPTCHA, mapy, filmu, czatu,
piksela reklamowego lub innego zewnętrznego osadzenia trzeba przeprowadzić ponowną
ocenę prywatności i zablokować niekonieczne technologie do czasu uzyskania zgody.
