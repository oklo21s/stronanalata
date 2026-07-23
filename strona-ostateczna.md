# strona-ostateczna — migracja dem z Netlify na własną domenę

## 1. DNS (Hostinger — panel DNS domeny stronanalata.pl)
- [ ] Dodaj rekord wildcard: Typ `A`, Nazwa `*`, Wartość `187.127.94.195`, TTL `3600`

## 2. Coolify — 5 nowych aplikacji (repo oklo21s/stronanalata, Build Pack: Dockerfile)

| Folder w repo | Subdomena | Base Directory | Port |
|---|---|---|---|
| `buddem` | `buddem.stronanalata.pl` | `/buddem` | 80 |
| `buddem-bez-animacji` | `buddem-bez-animacji.stronanalata.pl` | `/buddem-bez-animacji` | 80 |
| `marka_wlasna` | `krojnia.stronanalata.pl` | `/marka_wlasna` | 80 |
| `muzeum_bezdanych` | `muzeum.stronanalata.pl` | `/muzeum_bezdanych` | 80 |
| `muzeum_bezdanych_v2` | `muzeum-plakat.stronanalata.pl` | `/muzeum_bezdanych_v2` | 80 |

Dla każdej aplikacji:
- [ ] Build Pack: `Dockerfile`
- [ ] Dockerfile Location: `/Dockerfile`
- [ ] Build Stage Target: puste
- [ ] Ports Exposes: `80`, Port Mappings: puste
- [ ] Domains: wpisz subdomenę z tabeli wyżej
- [ ] Deploy

## 3. Podmień linki w kodzie źródłowym
Plik: `moja-wizytowka/index.html` (NIE `dist/index.html` — to zbudowany output)

- [ ] `budden.netlify.app` → `buddem.stronanalata.pl`
- [ ] `budden-animacja.netlify.app` → `buddem-bez-animacji.stronanalata.pl`
- [ ] `marka-wlasna.netlify.app` → `krojnia.stronanalata.pl`
- [ ] `muzeum.netlify.app` → `muzeum.stronanalata.pl`
- [ ] `muzeumv2.netlify.app` → `muzeum-plakat.stronanalata.pl`

## 4. Deploy wizytówki
- [ ] Commit + push zmian w `moja-wizytowka/index.html`
- [ ] Redeploy aplikacji `moja-wizytowka` w Coolify (ręcznie, jeśli brak auto-deploy webhooka)

## 5. Test każdego dema
- [ ] `buddem.stronanalata.pl`
- [ ] `buddem-bez-animacji.stronanalata.pl`
- [ ] `krojnia.stronanalata.pl`
- [ ] `muzeum.stronanalata.pl`
- [ ] `muzeum-plakat.stronanalata.pl`
- [ ] Sprawdź tryb ciemny na każdym (pułapki: `@keyframes` w komentarzu CSS, `--ink` jako podwójny token w v2)

## 6. SSL
- [ ] Sprawdź certyfikat Let's Encrypt dla każdej subdomeny (powinien wystawić się automatycznie, tak jak dla stronanalata.pl)

## 7. Sprzątanie
- [ ] Po potwierdzeniu, że wszystko działa — usuń/wyłącz strony na Netlify (budden, budden-animacja, marka-wlasna, muzeum, muzeumv2)
