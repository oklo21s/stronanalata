# stronanalata — dema stron + wizytówka

Monorepo z sześcioma niezależnymi stronami (każda to osobny projekt Vite z własnym
`Dockerfile`). Repo jest gotowe pod hosting na **Hostinger VPS + EasyPanel** — każdy
folder wdrażasz jako osobną aplikację.

## Projekty

| Folder                  | Typ                     | Obraz            |
| ----------------------- | ----------------------- | ---------------- |
| `buddem`                | statyczny (Vite)        | nginx            |
| `buddem-bez-animacji`   | statyczny (Vite)        | nginx            |
| `marka_wlasna`          | statyczny (Vite)        | nginx            |
| `muzeum_bezdanych`      | statyczny (Vite)        | nginx            |
| `muzeum_bezdanych_v2`   | statyczny (Vite)        | nginx            |
| `moja-wizytowka`        | Vite + formularz **PHP**| php:8.2-apache   |

Każdy build jest wielostopniowy: Node buduje `dist/`, a finalny obraz tylko serwuje
gotowe pliki (mały obraz, brak `node_modules` w produkcji).

## Wdrożenie w EasyPanel (dla każdej strony osobno)

1. **Create → App**.
2. **Source**: ten repozytorium z GitHuba (gałąź `main`).
3. **Build**: metoda **Dockerfile**.
   - **Build Context / Path**: nazwa folderu, np. `buddem`.
   - **Dockerfile Path**: `buddem/Dockerfile` (Context: root repo) *lub* `Dockerfile`,
     jeśli Context ustawisz na sam folder — zależnie od wersji EasyPanel. Ważne, żeby
     kontekstem budowania był katalog danego projektu.
4. **Port**: `80`.
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
docker run --rm -p 8080:80 buddem   # http://localhost:8080
```
