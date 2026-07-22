# Raport kontroli jakości

Data: 19 lipca 2026 r.

Zakres: lokalny kod po poprawkach produkcyjnych. Zmiany nie zostały opublikowane
na Netlify w ramach tej kontroli.

## `npm.cmd run qa`

Wynik: **OK**

- składnia JavaScript i PowerShell: OK,
- walidacja treści, struktury, SEO i prywatności: OK,
- 6/6 testów interakcji: OK,
- build Vite: OK,
- rozmiar pierwszego widoku: `12 488 B gzip` przy budżecie `50 000 B`,
- cały build: `87 010 B raw` przy budżecie `220 000 B`.

## `npm.cmd run stability`

Wynik: **OK**

- dwa kolejne buildy: 15 identycznych plików SHA-256,
- menu: 20 000 przełączeń, prawidłowy stan końcowy.

## `npm.cmd audit`

Wynik: **0 znanych podatności** według rejestru npm w dniu kontroli.

## Kontrole statyczne

Wynik: **OK**

- produkcyjny canonical, Open Graph, sitemap i odblokowany `robots.txt`,
- brak cookies, local/session storage, analityki i znanych trackerów,
- brak zewnętrznych skryptów, fontów i arkuszy,
- formularz Netlify z honeypotem i limitami pól,
- spójna informacja przy formularzu i polityka prywatności,
- potwierdzone dane oferty: małe firmy z całej Polski, termin 3–21 dni,
  indywidualna wycena, pomoc z publikacją i uzgadniana opieka,
- usunięta niepotwierdzona obietnica bezpłatnego szkicu przed zamówieniem,
- indywidualny zakres poprawy istniejącej strony oraz obsługa zgłoszeń od
  poniedziałku do piątku w godz. 10:00–18:00,
- rozpoczęcie pracy nad zgłoszeniem w ramach uzgodnionej opieki najpóźniej w ciągu
  dwóch dni roboczych,
- płatność po zakończeniu uzgodnionych prac i indywidualna wycena audytu,
- oddzielenie poprawek uzgodnionego zakresu od dodatkowo płatnych funkcji,
- poprawione zestawienia kolorów głównego CTA i sekcji kontaktowej,
- CSP, HSTS, `nosniff`, blokada ramek, polityka referrera i uprawnień,
- własna strona 404 i konfiguracja builda Netlify.

## Lokalny test HTTP

Wynik częściowy: **OK**

- strona główna: HTTP 200,
- `robots.txt`: HTTP 200,
- `sitemap.xml`: HTTP 200,
- canonical obecny w zbudowanym HTML.

Vite Preview zwraca stronę główną z kodem 200 dla nieznanej ścieżki. Zachowanie
produkcyjnego 404 trzeba sprawdzić po wdrożeniu na Netlify, gdzie plik `404.html`
powinien być obsłużony przez hosting.

## Kontrole niewykonane

- Nie wykonano pełnej kontroli wizualnej desktop/mobile ani ręcznego testu
  klawiaturą, ponieważ środowisko nie udostępniło żadnej przeglądarki.
- Nie opublikowano zmian na Netlify, więc publiczna strona nie zawiera jeszcze
  wyników tej pracy.
- Właściciel zadeklarował wcześniejsze skonfigurowanie powiadomienia Netlify Forms
  i odbiór testowej wiadomości, ale testu nie powtórzono dla aktualnego builda.
- Nie wdrożono formularza na planowanym Hostingerze. Netlify Forms trzeba przed
  migracją zastąpić backendem działającym na wybranym planie.
- Potwierdzono działalność nierejestrowaną, lecz nadal nie potwierdzono pełnego
  adresu usługodawcy, dokładnej domeny, warunków/DPA dostawców ani ostatecznej
  potrzeby i treści regulaminu. Są to zadania opisane w
  `URUCHOMIENIE-I-ZGODNOSC-TODO.md`.

## Stan publicznej wersji przed kolejnym wdrożeniem

- adres produkcyjny odpowiada HTTP 200,
- nadal zawiera `noindex,nofollow`,
- nadal nie zawiera canonical,
- nie ustawia nagłówka `Set-Cookie` na stronie głównej.

Oznacza to, że poprawki są gotowe lokalnie, ale wymagają osobnego wdrożenia,
zanim wyszukiwarki i użytkownicy zobaczą nową wersję.
