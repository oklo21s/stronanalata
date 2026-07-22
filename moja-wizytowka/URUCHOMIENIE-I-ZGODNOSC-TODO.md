# Uruchomienie i zgodność strony — zadania pozostałe

Aktualizacja: 19 lipca 2026 r.

Lista zawiera wyłącznie zadania niewykonane. Ukończone pozycje zostały usunięte.
Nie zastępuje indywidualnej porady prawnej. Nie publikować strony, dopóki pozycje
oznaczone **BLOKER** nie zostaną zamknięte.

## Legenda

- `[ ]` — do wykonania,
- **BLOKER** — wymagane przed pełną publikacją lub przyjęciem pierwszego zlecenia,
- **PO PUBLIKACJI** — możliwe dopiero na działającej domenie,
- **WARUNKOWE** — wykonać tylko po dodaniu wskazanej funkcji.

## 1. Decyzje i dane właściciela

- [ ] **BLOKER:** podać adres do kontaktu prawnego, który może być opublikowany.
- [ ] **BLOKER:** ustalić z prawnikiem lub księgowym, czy trzeba podawać NIP,
  REGON albo inne oznaczenie działalności nierejestrowanej.
- [ ] **BLOKER:** podać dokładną własną domenę.
- [ ] Wybrać docelowy adres e-mail we własnej domenie.

Szczegółowe pytania znajdują się w `DANE-DO-UZUPELNIENIA.md`.

## 2. Obowiązki prawne i dokumenty

- [ ] **BLOKER PRAWNY:** sprawdzić z prawnikiem pełne dane usługodawcy, obowiązek
  informacyjny RODO i zastosowanie regulaminu świadczenia usług drogą
  elektroniczną do formularza.
- [ ] **BLOKER PRAWNY:** poprawić i zatwierdzić
  `REGULAMIN-FORMULARZA-ROBOCZY.md` albo udokumentować, dlaczego nie ma
  zastosowania.
- [ ] **BLOKER PRAWNY:** przed pierwszą umową z konsumentem przygotować i sprawdzić
  wzór informacji przedumownych zawierający pełny zakres, cenę brutto, dane
  usługodawcy, reklamację i prawo odstąpienia; po zawarciu przekazywać potwierdzenie
  na trwałym nośniku.
- [ ] Przyjąć podstawową zasadę nierozpoczynania usługi przed upływem 14 dni od
  zawarcia umowy z konsumentem; wyjątek obsługiwać wyłącznie po uprzednim,
  wyraźnym żądaniu utrwalonym na trwałym nośniku i przekazaniu informacji o
  skutkach.
- [ ] Przed pierwszą odpłatną sprzedażą skonsultować z księgowym podatek dochodowy,
  VAT, kasę fiskalną, NIP i KSeF — nie odkładać konsultacji do czasu po sprzedaży.
- [ ] Przed pierwszą sprzedażą utworzyć uproszczoną ewidencję zawierającą co
  najmniej numer wpisu, datę, kwotę sprzedaży i sumę narastającą; w 2026 r.
  kontrolować limit 10 813,50 zł przychodu na kwartał.
- [ ] Przed pierwszą fakturą przygotować jej wzór i potwierdzić, czy dana faktura
  B2B wymaga NIP oraz wystawienia w KSeF.
- [ ] Po uzyskaniu danych uzupełnić politykę prywatności, stopkę i zatwierdzone
  dokumenty o pełne dane usługodawcy.
- [ ] Zapisać datę zaakceptowania właściwych warunków i DPA Hostinger oraz dostawcy
  poczty.

## 3. Wybór Hostinger i domeny

- [ ] Wybrać zarządzany plan Hostinger obsługujący statyczne pliki, PHP oraz
  bezpieczną wysyłkę formularza; VPS nie jest potrzebny dla tej strony.
- [ ] Przed zakupem sprawdzić pełną cenę okresu początkowego i cenę odnowienia.
- [ ] Wybrać centrum danych możliwie blisko odbiorców w Polsce.
- [ ] Kupić domenę na konto właściciela i włączyć automatyczne odnowienie oraz 2FA.
- [ ] Utworzyć skrzynkę we własnej domenie i włączyć 2FA, jeśli dostawca je
  udostępnia.
- [ ] Potwierdzić, że zakupiony plan obejmuje wymagane kopie zapasowe i możliwość
  ich samodzielnego przywracania.
- [ ] Zapisać w dokumentacji nazwę planu, datę zakupu, termin odnowienia, dostawcę
  poczty i lokalizację danych — bez haseł i tokenów.

## 4. Migracja formularza i kodu na Hostinger

Backend `public/kontakt.php` (PHP + PHPMailer + SMTP), walidacja serwerowa,
honeypot, neutralne komunikaty błędów, `Reply-To`, nagłówki w `public/.htaccess`,
`ErrorDocument 404` i polityka prywatności są już przygotowane w kodzie.
Pozostają zadania serwerowe:

- [ ] **BLOKER:** założyć skrzynkę SMTP w hPanelu (np. `kontakt@stronanalata.pl`)
  i wgrać `kontakt.config.php` oraz pliki PHPMailer jeden poziom **nad**
  `public_html`, według instrukcji z `kontakt.config.example.php`.
- [ ] Wysyłkę wykonywać z adresu należącego do własnej domeny (pole `from_email`
  w konfiguracji), nie z adresu Gmail.
- [ ] Ustawić SPF, DKIM i DMARC dla domeny.
- [ ] Rozważyć limit częstotliwości wysyłki, jeżeli po uruchomieniu pojawi się
  spam mimo honeypota.
- [ ] Po wdrożeniu sprawdzić rzeczywistą obecność nagłówków z `.htaccess` i kod
  HTTP 404 dla nieistniejącego adresu.
- [ ] W dniu migracji wyłączyć stary formularz Netlify; po potwierdzeniu nowej
  strony wyeksportować tylko potrzebne zgłoszenia, a pozostałe dane, powiadomienia,
  tokeny i stary projekt usunąć najpóźniej w ciągu 7 dni.

## 5. Domena, SEO i konfiguracja publikacji

- [ ] **BLOKER:** potwierdzić, że `stronanalata.pl` to ostatecznie zarejestrowana
  domena; przy każdej zmianie domeny zaktualizować canonical, `og:url`,
  `og:image`, `twitter:image`, `robots.txt`, `sitemap.xml` i dokumentację.
- [ ] Skonfigurować DNS, certyfikat TLS i przekierowanie wszystkich wariantów hosta
  oraz HTTP na jedną wersję HTTPS.
- [ ] Ustawić katalog publikacji na zawartość `dist` oraz bezpiecznie dodać backend
  formularza i konfigurację serwera.
- [ ] Sprawdzić, czy pliki konfiguracyjne, źródła, mapy źródeł, logi i sekrety nie są
  publicznie dostępne.
- [ ] Sprawdzić datę ważności domeny i działanie automatycznego odnowienia.

## 6. Kontrola przed publikacją

- [ ] Uruchomić `npm.cmd ci` w czystym środowisku.
- [ ] Uruchomić `npm.cmd run qa` po wszystkich zmianach domeny i formularza.
- [ ] Uruchomić `npm.cmd run stability` po wszystkich zmianach.
- [ ] Uruchomić `npm.cmd audit` i zaakceptować wynik albo naprawić podatności.
- [ ] Uruchomić pełne `npm.cmd run release:check`.
- [ ] Sprawdzić widoki 320, 375, 768, 1024 i 1440 px.
- [ ] Sprawdzić klawiaturą Tab, Shift+Tab, Enter, Spację i Escape.
- [ ] Sprawdzić powiększenie tekstu do 200%.
- [ ] Wykonać test czytnikiem ekranu przynajmniej w jednym zestawie system +
  przeglądarka.
- [ ] Uruchomić Lighthouse lub równoważne narzędzie i ręcznie przejrzeć wyniki.
- [ ] Sprawdzić różnice w plikach pod kątem sekretów i danych testowych.
- [ ] Zapisać rzeczywiste wyniki i niewykonane kontrole w `TEST-REPORT.md`.

## 7. Kontrola po publikacji

- [ ] **PO PUBLIKACJI:** potwierdzić HTTP 200 dla strony głównej, polityki
  prywatności i strony podziękowania.
- [ ] **PO PUBLIKACJI:** potwierdzić HTTP 404 i własny widok dla nieistniejącego
  adresu.
- [ ] **PO PUBLIKACJI:** sprawdzić `robots.txt`, `sitemap.xml`, canonical, Open Graph
  i obraz 1200 × 630 na właściwej domenie.
- [ ] **PO PUBLIKACJI:** sprawdzić CSP, HSTS, `nosniff`, blokadę ramek, politykę
  referrera i uprawnień.
- [ ] **BLOKER / PO PUBLIKACJI:** wysłać oznaczone zgłoszenie testowe i potwierdzić
  dostarczenie, treść, brak danych w logach, `Reply-To` oraz stronę podziękowania.
- [ ] **PO PUBLIKACJI:** sprawdzić błędy formularza dla pustych, za krótkich i
  nieprawidłowych danych oraz zachowanie przy awarii SMTP.
- [ ] **PO PUBLIKACJI:** sprawdzić SPF, DKIM i DMARC w nagłówkach dostarczonej
  wiadomości.
- [ ] **PO PUBLIKACJI:** potwierdzić brak opcjonalnych cookies, trackerów i
  zewnętrznych żądań przed zgodą.
- [ ] **PO PUBLIKACJI:** sprawdzić wszystkie linki, zasoby i `mailto:`.
- [ ] **PO PUBLIKACJI:** dodać domenę do Google Search Console i wysłać sitemapę.
- [ ] **PO PUBLIKACJI:** sprawdzić podgląd udostępniania w komunikatorach.
- [ ] Dopiero po przejściu kontroli przełączyć domenę na nową wersję i zakończyć
  używanie starego wdrożenia Netlify.

## 8. Bezpieczeństwo i dane po publikacji

- [ ] Włączyć alerty logowania i 2FA dla hostingu, poczty, domeny, repozytorium i
  pozostałych kont administracyjnych.
- [ ] Pierwszy przegląd danych wykonać 30 dni po publikacji; następne wykonywać raz
  w miesiącu.
- [ ] Co miesiąc usuwać niepotrzebne zgłoszenia i spam zgodnie z okresem retencji.
- [ ] Co miesiąc sprawdzać aktualizacje zależności i `npm audit`.
- [ ] Co kwartał testować formularz, linki, nagłówki bezpieczeństwa, TLS i możliwość
  odtworzenia kopii zapasowej.
- [ ] Co najmniej raz w roku przeglądać politykę prywatności, regulamin, dostawców i
  okresy retencji.
- [ ] Prowadzić prosty rejestr żądań dotyczących danych i udzielonych odpowiedzi.
- [ ] Przy naruszeniu danych zabezpieczyć dostęp, zachować fakty, ocenić ryzyko,
  udokumentować decyzję i wykonać wymagane prawem zgłoszenia oraz zawiadomienia.
- [ ] Nie wykorzystywać adresów z formularza do newslettera ani marketingu bez
  właściwej podstawy prawnej.

## 9. Zadania warunkowe i rozwój

- [ ] **WARUNKOWE:** przed dodaniem analityki, reklam, Hotjar, Clarity lub pikseli
  wdrożyć blokowanie opcjonalnych technologii do czasu zgody.
- [ ] **WARUNKOWE:** przed dodaniem mapy, YouTube, czatu, reCAPTCHA lub zewnętrznego
  formularza sprawdzić cookies, transfery danych i potrzebę zgody.
- [ ] **WARUNKOWE:** jeśli panel zgód stanie się potrzebny, zapewnić równie łatwe
  odrzucenie i akceptację, oddzielne cele oraz możliwość późniejszego wycofania.
- [ ] Dodawać realizacje wyłącznie prawdziwe albo jednoznacznie oznaczone jako
  projekty demonstracyjne.
- [ ] Dodawać opinie dopiero po otrzymaniu treści i zgody na publikację.
- [ ] Dodać telefon albo publiczne ceny dopiero po uzupełnieniu zasad w
  `DANE-DO-UZUPELNIENIA.md`.

## Definicja ukończenia

Strona jest gotowa do pełnego uruchomienia, gdy wszystkie blokery są zamknięte,
formularz został sprawdzony od wysłania do odbioru, dane i dokumenty odpowiadają
faktycznym dostawcom, testy automatyczne i ręczne przechodzą, a domena, SEO, TLS,
nagłówki bezpieczeństwa i mechanizm retencji są potwierdzone na produkcji.
