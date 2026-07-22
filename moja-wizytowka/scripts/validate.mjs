import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (file) => readFile(path.join(root, file), 'utf8');
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function count(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

const productionUrl = 'https://stronanalata.pl/';

const [html, css, app, main, robots, sitemap, thanks, notFound, privacy, og, ogPng, securityHeaders, staticCss, contactBackend, launchTodo, missingData] = await Promise.all([
  read('index.html'),
  read('src/style.css'),
  read('src/app.js'),
  read('src/main.js'),
  read('public/robots.txt'),
  read('public/sitemap.xml'),
  read('public/dziekuje.html'),
  read('public/404.html'),
  read('public/polityka-prywatnosci.html'),
  read('public/assets/og-card.svg'),
  readFile(path.join(root, 'public/assets/og-card.png')),
  read('public/.htaccess'),
  read('public/static-pages.css'),
  read('public/kontakt.php'),
  read('URUCHOMIENIE-I-ZGODNOSC-TODO.md'),
  read('DANE-DO-UZUPELNIENIA.md'),
]);

const banned = [
  'najwyższa jakość',
  'indywidualne podejście',
  'kompleksowe rozwiązania',
  'innowacyjny',
  'nowy wymiar',
  'wieloletnie doświadczenie',
  'setki klientów',
];

check(count(html, /<h1(?:\s|>)/gi) === 1, 'Strona musi mieć dokładnie jeden nagłówek h1.');
check(/<html\s+lang="pl"/i.test(html), 'Brakuje języka dokumentu lang="pl".');
check(/<main\s+id="main"/i.test(html), 'Brakuje semantycznego elementu main.');
check(/<meta\s+name="description"/i.test(html), 'Brakuje meta description.');
check(/<meta\s+name="robots"\s+content="index,follow"/i.test(html), 'Strona produkcyjna nie ma index,follow.');
check(new RegExp(`<link\\s+rel="canonical"\\s+href="${productionUrl}"`, 'i').test(html), 'Canonical nie wskazuje adresu produkcyjnego.');
check(new RegExp(`<meta\\s+property="og:url"\\s+content="${productionUrl}"`, 'i').test(html), 'og:url nie wskazuje adresu produkcyjnego.');
check(/<link\s+rel="icon"[^>]+href="\/assets\/logo-mark\.png"[^>]+type="image\/png"/i.test(html), 'Favicon nie korzysta z aktualnego znaku marki.');
check(count(html, /class="brand__mark"[^>]+src="\/assets\/logo-mark\.png"/gi) === 2, 'Nagłówek i stopka nie korzystają z aktualnego znaku marki.');
check(count(html, /src="\/assets\/logo-web-design\.png"/gi) === 1, 'Pełne logo WEB DESIGN nie zostało osadzone dokładnie raz.');
check(!/nieoficjalny prototyp/i.test(html), 'Baner nieoficjalnego prototypu nie został usunięty.');
check(!/\[[^\]]+\]/.test(html), 'W publikowanym HTML pozostał placeholder w nawiasach kwadratowych.');
check(/Mikołaj Oczkowski/i.test(html), 'Brakuje potwierdzonego imienia i nazwiska.');
check(/href="mailto:mikolajoczkowski42@gmail\.com"/i.test(html), 'Brakuje prawidłowego linku mailto:.');
check(!/href="tel:/i.test(html), 'Telefon miał zostać pominięty, ale strona zawiera link tel:.');

check(/<form[^>]+action="\/kontakt\.php"/i.test(html), 'Formularz nie wysyła danych do backendu /kontakt.php.');
check(/<form[^>]+method="POST"/i.test(html), 'Formularz nie używa metody POST.');
check(!/data-netlify|netlify-honeypot|name="form-name"/i.test(html), 'Formularz nadal zawiera atrybuty Netlify Forms.');
check(/class="honeypot"[^>]*aria-hidden="true"/i.test(html) && /name="bot-field"[^>]+tabindex="-1"/i.test(html), 'Formularz nie ma ręcznego pola antyspamowego (honeypot).');
check(/accept-charset="UTF-8"/i.test(html), 'Formularz nie wymusza kodowania UTF-8.');
check(/id="firma"[^>]+minlength="2"[^>]+maxlength="120"/i.test(html), 'Pole imienia lub firmy nie ma bezpiecznych limitów długości.');
check(/id="email"[^>]+maxlength="254"/i.test(html), 'Pole e-mail nie ma limitu 254 znaków.');
check(/id="wiadomosc"[^>]+minlength="20"[^>]+maxlength="3000"/i.test(html), 'Pole wiadomości nie ma bezpiecznych limitów długości.');
check(!/name="privacy-accepted"/i.test(html), 'Formularz nadal zawiera zbędny checkbox potwierdzenia polityki prywatności.');
check(/class="form-disclosure"/i.test(html) && /polityce prywatności/i.test(html), 'Przy formularzu brakuje zwięzłej informacji o przetwarzaniu danych.');
check(/aria-describedby="form-privacy"/i.test(html) && /id="form-privacy"/i.test(html), 'Informacja o prywatności nie jest programowo powiązana z formularzem.');
check(count(html, /<label\s+(?:class="[^"]+"\s+)?for=/gi) === 3, 'Widoczne pola formularza nie mają kompletu trzech etykiet.');
check(count(html, /<article\s+class="service-card/gi) === 3, 'Sekcja usług musi zawierać trzy karty.');
check(count(html, /<details\s+class="faq-item"/gi) >= 4, 'FAQ musi zawierać co najmniej cztery pytania.');
check(/poniedziałku do piątku[^<]*10:00–18:00/i.test(html), 'FAQ nie zawiera potwierdzonych godzin obsługi zgłoszeń.');
check(/pracę[^<]*rozpoczynam[^<]*dwóch dni roboczych/i.test(html), 'FAQ nie opisuje terminu rozpoczęcia obsługi zgłoszenia.');
check(/Płatność[^<]*po zakończeniu uzgodnionych prac/i.test(html), 'FAQ nie zawiera potwierdzonej zasady płatności po wykonaniu zakresu.');
check(/dodatkowe funkcje wyceniam osobno/i.test(html), 'FAQ nie rozróżnia opieki od nowych, dodatkowo płatnych funkcji.');
check(!/pierwszy ekran do oceny|bezpłatn\w* szkic/i.test(html), 'Strona nadal obiecuje niepotwierdzony szkic przed realizacją.');
check(/<img[^>]+personal-hero\.svg[^>]+width="960"[^>]+height="720"/i.test(html), 'Ilustracja hero nie ma jawnych wymiarów.');
check(/fetchpriority="high"/i.test(html), 'Ilustracja pierwszego widoku nie ma wysokiego priorytetu.');
check(new RegExp(`property="og:image"\\s+content="${productionUrl}assets/og-card\\.png"`, 'i').test(html), 'Open Graph nie wskazuje bezwzględnego adresu obrazu PNG.');
check(new RegExp(`name="twitter:image"\\s+content="${productionUrl}assets/og-card\\.png"`, 'i').test(html), 'Twitter Card nie wskazuje bezwzględnego adresu obrazu PNG.');
check(/property="og:image:type"\s+content="image\/png"/i.test(html), 'Brakuje typu obrazu Open Graph.');
check(ogPng.subarray(1, 4).toString('ascii') === 'PNG', 'Obraz Open Graph nie jest prawidłowym plikiem PNG.');
check(ogPng.readUInt32BE(16) === 1200 && ogPng.readUInt32BE(20) === 630, 'Obraz Open Graph musi mieć 1200 × 630 px.');

check(/class="skip-link"/i.test(html), 'Brakuje linku pomijającego nawigację.');
check(/prefers-reduced-motion:\s*reduce/i.test(css), 'Brakuje obsługi prefers-reduced-motion.');
check(/--focus:\s*#d86100/i.test(css), 'Brakuje kontrastowego koloru fokusu dla jasnych i ciemnych teł.');
check(/\.button--primary\s*\{[^}]*color:\s*var\(--ink\)/is.test(css), 'Główny przycisk nadal używa zbyt jasnego tekstu na pomarańczowym tle.');
check(/\.contact\s*\{[^}]*background:\s*var\(--accent-dark\)/is.test(css), 'Sekcja kontaktowa nadal ma zbyt jasne tło dla białego tekstu.');
check(/\.contact\s+:focus-visible\s*\{[^}]*outline-color:\s*var\(--surface\)/is.test(css), 'Sekcja kontaktowa nie ma widocznego fokusu.');
check(/\.site-nav\s*\{/i.test(css) && /\.js\s+\.site-nav/i.test(css), 'Nawigacja bez JavaScriptu nie ma jawnego fallbacku.');
check(/export function initNavigation/i.test(app), 'Logika nawigacji nie eksportuje initNavigation.');
check(/export function initReveal/i.test(app), 'Logika animacji nie eksportuje initReveal.');
check(/initNavigation\(document\)/i.test(main) && /initReveal\(document\)/i.test(main), 'Interakcje nie są inicjalizowane.');
check(!/<script[^>]+src="https?:\/\//i.test(html), 'Strona ładuje zewnętrzny skrypt.');
check(/<script[^>]+src="\/theme-init\.js"/i.test(html), 'Brakuje skryptu ustawiającego motyw przed renderem (zgodnego z CSP).');
check(!/<link[^>]+href="https?:\/\/[^\"]+\.css/i.test(html), 'Strona ładuje zewnętrzny arkusz stylów.');
check(!/document\.cookie|localStorage|sessionStorage|gtag\(|googletagmanager|facebook\.com\/tr|clarity\(|hotjar|matomo|mixpanel/i.test(`${html}\n${app}\n${main}`), 'Strona zawiera mechanizm cookies, pamięci przeglądarki lub tracker bez obsługi zgody.');
check(/Header always set Content-Security-Policy/i.test(securityHeaders), 'Brakuje nagłówka Content-Security-Policy w .htaccess.');
check(/form-action 'self'/i.test(securityHeaders), 'CSP nie ogranicza miejsca wysyłki formularza.');
check(/frame-ancestors 'none'/i.test(securityHeaders), 'CSP nie blokuje osadzania strony w ramkach.');
check(/Header always set X-Content-Type-Options "nosniff"/i.test(securityHeaders), 'Brakuje nagłówka nosniff.');
check(/Header always set Strict-Transport-Security "max-age=31536000"/i.test(securityHeaders), 'Brakuje HSTS.');
check(/Header always set Permissions-Policy/i.test(securityHeaders), 'Brakuje polityki uprawnień przeglądarki.');
check(/ErrorDocument 404 \/404\.html/i.test(securityHeaders), '.htaccess nie kieruje błędu 404 na własną stronę.');
check(!/<style(?:\s|>)/i.test(`${thanks}\n${privacy}`), 'Strony pomocnicze zawierają styl inline blokowany przez CSP.');
check(/static-pages\.css/i.test(thanks) && /static-pages\.css/i.test(privacy) && staticCss.length > 500, 'Strony pomocnicze nie korzystają ze wspólnego arkusza zgodnego z CSP.');
check(/ODBIORCA\s*=\s*'mikolajoczkowski42@gmail\.com'/i.test(contactBackend), 'Backend formularza nie wysyła zgłoszeń na właściwy adres.');
check(/\$_POST\['bot-field'\]/i.test(contactBackend), 'Backend formularza nie sprawdza honeypota bot-field.');
check(/LIMIT_FIRMA_MIN = 2/.test(contactBackend) && /LIMIT_FIRMA_MAX = 120/.test(contactBackend) && /LIMIT_EMAIL_MAX = 254/.test(contactBackend) && /LIMIT_WIADOMOSC_MIN = 20/.test(contactBackend) && /LIMIT_WIADOMOSC_MAX = 3000/.test(contactBackend), 'Backend formularza nie powtarza limitów pól z HTML.');
check(/FILTER_VALIDATE_EMAIL/.test(contactBackend), 'Backend formularza nie waliduje adresu e-mail po stronie serwera.');
check(/303/.test(contactBackend) && /\/dziekuje\.html/.test(contactBackend), 'Backend formularza nie przekierowuje 303 na stronę podziękowania.');
check(/dirname\(__DIR__\)\s*\.\s*'\/kontakt\.config\.php'/.test(contactBackend), 'Backend formularza nie czyta konfiguracji SMTP spoza katalogu publicznego.');
check(/isSMTP\(\)/.test(contactBackend) && /PHPMailer/.test(contactBackend), 'Backend formularza nie wysyła przez PHPMailer i uwierzytelniony SMTP.');
check(!/smtp_pass'\s*=>\s*'(?!TUTAJ)[^']+'/i.test(contactBackend), 'Backend formularza zawiera zapisane na stałe hasło SMTP.');

for (const phrase of banned) {
  check(!html.toLocaleLowerCase('pl').includes(phrase), `Niedozwolony ogólnik lub niepotwierdzona obietnica: „${phrase}”.`);
}

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
for (const [, target] of html.matchAll(/href="#([\w-]+)"/g)) {
  check(ids.has(target), `Odnośnik „#${target}” nie ma celu na stronie.`);
}

check(/Allow:\s*\//i.test(robots) && !/Disallow:\s*\//i.test(robots), 'robots.txt nie zezwala na indeksowanie strony produkcyjnej.');
check(new RegExp(`Sitemap:\\s*${productionUrl}sitemap\\.xml`, 'i').test(robots), 'robots.txt nie wskazuje produkcyjnej sitemapy.');
check(new RegExp(`<loc>${productionUrl}</loc>`, 'i').test(sitemap), 'Sitemap nie wskazuje strony produkcyjnej.');
check(count(sitemap, /<url>/gi) === 1, 'Sitemap powinna zawierać wyłącznie indeksowaną stronę główną.');
check(/noindex,nofollow/i.test(thanks), 'Strona podziękowania musi mieć noindex,nofollow.');
check(/noindex,nofollow/i.test(notFound) && /Błąd 404/i.test(notFound), 'Własna strona 404 nie ma noindex lub prawidłowej treści.');
check(!/nieoficjalny prototyp/i.test(thanks), 'Strona podziękowania nadal opisuje formularz jako prototyp.');
check(count(`${thanks}\n${notFound}\n${privacy}`, /src="\/assets\/logo-mark\.png"/gi) === 3, 'Strony pomocnicze nie korzystają z aktualnego znaku marki.');
check(!/\/(?:logo|favicon)\.svg/i.test(`${html}\n${thanks}\n${notFound}\n${privacy}`), 'Publikowany HTML nadal odwołuje się do starego logo.');
check(/Mikołaj Oczkowski/i.test(privacy) && /mikolajoczkowski42@gmail\.com/i.test(privacy), 'Polityka prywatności nie zawiera danych administratora.');
check(/Hostinger/i.test(privacy) && /podmiotem przetwarzającym/i.test(privacy), 'Polityka prywatności nie opisuje przetwarzania formularza na serwerze Hostinger.');
check(!/Netlify/i.test(privacy), 'Polityka prywatności nadal odwołuje się do Netlify.');
check(/imię lub nazwę firmy/i.test(privacy), 'Polityka prywatności nie opisuje pola imienia lub nazwy firmy zgodnie z formularzem.');
check(/nie używa plików cookies/i.test(privacy) && /narzędzi analitycznych/i.test(privacy), 'Polityka prywatności nie opisuje braku cookies i analityki.');
check(!/\[[^\]]+\]/.test(`${thanks}\n${notFound}\n${privacy}\n${og}`), 'W publikowanych plikach pomocniczych pozostał placeholder w nawiasach kwadratowych.');
check(/## 1\. Decyzje i dane właściciela/i.test(launchTodo) && /## 4\. Migracja formularza/i.test(launchTodo) && /## 7\. Kontrola po publikacji/i.test(launchTodo) && /## 8\. Bezpieczeństwo i dane po publikacji/i.test(launchTodo), 'Lista uruchomienia i zgodności nie zawiera wszystkich wymaganych etapów.');
check(!/- \[x\]/i.test(launchTodo), 'Lista zadań zawiera ukończone pozycje zamiast wyłącznie zadań pozostałych.');
check(/## 1\. Dane blokujące publikację/i.test(missingData), 'Plik danych nie oddziela braków blokujących publikację.');
check(/## 2\. Dane opcjonalne na później/i.test(missingData), 'Plik danych nie oddziela informacji opcjonalnych.');
check(/## 3\. Co zaktualizować po otrzymaniu odpowiedzi/i.test(missingData), 'Plik danych nie wskazuje wpływu odpowiedzi na pliki.');
check(!/- \[x\]/i.test(missingData), 'Plik danych do uzupełnienia zawiera ukończone pozycje.');
check(/## Definicja ukończenia/i.test(missingData), 'Plik danych nie zawiera definicji ukończenia.');

for (const file of [
  'public/assets/logo-mark.png',
  'public/assets/logo-web-design.png',
  'public/.htaccess',
  'public/kontakt.php',
  'public/static-pages.css',
  'public/robots.txt',
  'public/sitemap.xml',
  'public/theme-init.js',
  'public/dziekuje.html',
  'public/404.html',
  'public/polityka-prywatnosci.html',
  'public/assets/personal-hero.svg',
  'public/assets/og-card.svg',
  'public/assets/og-card.png',
  'scripts/check-powershell.ps1',
  'kontakt.config.example.php',
  'DANE-DO-UZUPELNIENIA.md',
  'URUCHOMIENIE-I-ZGODNOSC-TODO.md',
  'README.md',
]) {
  try {
    await access(path.join(root, file));
  } catch {
    failures.push(`Brakuje wymaganego pliku: ${file}.`);
  }
}

if (failures.length) {
  console.error(`Walidacja nieudana (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Walidacja treści i struktury: OK');
console.log('- produkcyjne SEO, sitemap, robots i brak placeholderów: OK');
console.log('- 3 usługi, co najmniej 4 pytania, polityka prywatności i backend PHP formularza: OK');
console.log('- odbiorca e-mail, limity pól, honeypot i nagłówki bezpieczeństwa w .htaccess: OK');
console.log('- kontrast, fallback bez JS, reduced-motion i dostępna nawigacja: OK');
console.log('- brak cookies, pamięci przeglądarki, trackerów i zewnętrznych zasobów: OK');
