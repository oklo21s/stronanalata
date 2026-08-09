# stronanalata — dema stron + wizytówka

Monorepo z niezależnymi stronami (każda to osobny projekt z własnym `Dockerfile`).
Repo jest gotowe pod hosting na **Hostinger VPS + EasyPanel** — każdy folder
wdrażasz jako osobną aplikację.

## Projekty

| Folder                  | Typ                      | Obraz            | Port |
| ----------------------- | ------------------------ | ---------------- | ---- |
| `buddem`                | statyczny (Vite)         | nginx            | 80   |
| `buddem-bez-animacji`   | statyczny (Vite)         | nginx            | 80   |
| `marka_wlasna`          | statyczny (Vite)         | nginx            | 80   |
| `muzeum_bezdanych`      | statyczny (Vite)         | nginx            | 80   |
| `muzeum_bezdanych_v2`   | statyczny (Vite)         | nginx            | 80   |
| `moja-wizytowka`        | Vite + formularz **PHP** | php:8.2-apache   | 80   |
| `wypozyczalnia-aut`     | statyczny (Vite)         | nginx            | 80   |
| `meridian-expeditions`  | Vite + **React/Tailwind**| nginx            | 80   |
| `osada-pod-grania`      | Vite + React Three Fiber | nginx            | 80   |
| `kwartal-lipowy`        | **Next.js 14** (SSR)     | node:22-slim     | 3000 |
| `piwonia`               | **Next.js 15** (SSR)     | node:22-slim     | 3000 |
| `puls`                  | **Next.js 15** (SSR)     | node:22-slim     | 3000 |

Każdy build jest wielostopniowy: Node buduje projekt, a finalny obraz zawiera tylko
gotowy wynik (mały obraz, brak deweloperskich `node_modules` w produkcji).

Strony na Vite kończą się statycznym `dist/` serwowanym przez nginx. Cztery ostatnie
z tabeli to aplikacje Next.js — nie da się ich sprowadzić do czystych plików, bo
używają renderowania po stronie serwera i optymalizacji obrazków `next/image`, więc
finalny obraz uruchamia serwer Node (`output: 'standalone'`) i **nasłuchuje na porcie
3000**, nie 80. Trzeba to ustawić w EasyPanel przy tworzeniu aplikacji.

### Podścieżki, czyli dlaczego demo ma `basePath`

Dema stoją pod adresami typu `stronanalata.pl/piwonia`, a nie na własnych domenach.
Żeby odsyłacze do zasobów (`/_next/…`, `/assets/…`) nie uciekały do korzenia domeny,
każde demo ma na sztywno wpisany swój prefiks:

- Vite → `base` w `vite.config.js` + obcięcie prefiksu w `nginx.conf`,
- Next.js → `basePath` w `next.config.*`.

Gdy przenosisz demo na własną domenę lub subdomenę, usuń `basePath` (Next) albo
ustaw `base: '/'` i skasuj blok `rewrite` z `nginx.conf` (Vite). Inaczej strona
odpowie 404 w korzeniu.

> Założenie: proxy przekazuje do kontenera pełną ścieżkę **razem z prefiksem**
> (tak działają dema na Vite). Gdyby EasyPanel obcinał prefiks przed przekazaniem,
> dema na Vite dalej zadziałają (`nginx.conf` radzi sobie z obiema wersjami), ale
> Next.js odpowie 404 — wtedy trzeba usunąć z niego `basePath` i wystawić demo na
> osobnej subdomenie.

## Wdrożenie w EasyPanel (dla każdej strony osobno)

1. **Create → App**.
2. **Source**: ten repozytorium z GitHuba (gałąź `main`).
3. **Build**: metoda **Dockerfile**.
   - **Build Context / Path**: nazwa folderu, np. `buddem`.
   - **Dockerfile Path**: `buddem/Dockerfile` (Context: root repo) *lub* `Dockerfile`,
     jeśli Context ustawisz na sam folder — zależnie od wersji EasyPanel. Ważne, żeby
     kontekstem budowania był katalog danego projektu.
4. **Port**: `80` — z wyjątkiem `kwartal-lipowy`, `piwonia` i `puls`, gdzie jest `3000`
   (patrz tabela wyżej).
5. **Domains**: podepnij domenę/subdomenę; EasyPanel wystawi HTTPS (Let's Encrypt).
6. Powtórz dla pozostałych folderów.

### Dodatkowo dla `moja-wizytowka` (formularz PHP)

Formularz `kontakt.php` wysyła maile przez SMTP i wymaga **sekretu poza katalogiem
publicznym**. PHPMailer jest już wbudowany w obraz (`/var/www/phpmailer`), musisz
dostarczyć tylko konfigurację SMTP:

1. Skopiuj `moja-wizytowka/kontakt.config.example.php` → `kontakt.config.php`
   i uzupełnij danymi skrzynki (host, port, login, hasło, `from_email`).
   Zostaw `'phpmailer_dir' => __DIR__ . '/phpmailer'` — w obrazie rozwiązuje się to na
   `/var/www/phpmailer`.
2. W EasyPanel w tej aplikacji dodaj **Mount → File**:
   - treść pliku: zawartość Twojego `kontakt.config.php`,
   - ścieżka w kontenerze: `/var/www/kontakt.config.php`
     (dokładnie poziom nad docrootem `/var/www/html` — tam szuka go `kontakt.php`).
3. Deploy. Test: wyślij formularz — sukces przekierowuje na `/dziekuje.html`.

> `kontakt.config.php` jest w `.gitignore` i nie trafia do repo. Trzymaj hasło skrzynki
> wyłącznie w mountcie EasyPanel.

## Lokalny podgląd (opcjonalnie)

```bash
cd buddem
npm ci
npm run dev      # serwer deweloperski Vite
npm run build    # produkcyjny dist/
```

Test obrazu Dockera lokalnie:

```bash
cd buddem
docker build -t buddem .
docker run --rm -p 8080:80 buddem   # http://localhost:8080/buddem/
```

Dla dema na Next.js port w kontenerze to 3000, a strona siedzi pod swoim prefiksem:

```bash
cd piwonia
docker build -t piwonia .
docker run --rm -p 8080:3000 piwonia   # http://localhost:8080/piwonia
```
