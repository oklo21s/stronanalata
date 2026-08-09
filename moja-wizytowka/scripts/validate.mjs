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

const [html, offer, works, css, app, main, robots, sitemap, thanks, notFound, privacy, og, ogPng, securityHeaders, staticCss, contactBackend, viteConfig] = await Promise.all([
  read('index.html'),
  read('oferta/index.html'),
  read('realizacje/index.html'),
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
  read('vite.config.js'),
]);

// Strony indeksowane: każda musi samodzielnie spełniać wymagania SEO i CSP.
const pages = [
  { name: 'strona główna', file: 'index.html', source: html, url: productionUrl },
  { name: 'oferta', file: 'oferta/index.html', source: offer, url: `${productionUrl}oferta/` },
  { name: 'realizacje', file: 'realizacje/index.html', source: works, url: `${productionUrl}realizacje/` },
];

const banned = [
  'najwyższa jakość',
  'indywidualne podejście',
  'kompleksowe rozwiązania',
  'innowacyjny',
  'nowy wymiar',
  'wieloletnie doświadczenie',
  'setki klientów',
];

// --- Wymagania wspólne dla każdej indeksowanej strony ---
for (const page of pages) {
  const where = `[${page.name}]`;
  check(count(page.source, /<h1(?:\s|>)/gi) === 1, `${where} Strona musi mieć dokładnie jeden nagłówek h1.`);
  check(/<html\s+lang="pl"/i.test(page.source), `${where} Brakuje języka dokumentu lang="pl".`);
  check(/<main\s+id="main"/i.test(page.source), `${where} Brakuje semantycznego elementu main.`);
  check(/<meta\s+name="description"\s+content="[^"]{60,}"/i.test(page.source), `${where} Brakuje meta description albo jest zbyt krótka.`);
  check(/<meta\s+name="robots"\s+content="index,follow"/i.test(page.source), `${where} Strona produkcyjna nie ma index,follow.`);
  check(new RegExp(`<link\\s+rel="canonical"\\s+href="${page.url}"`, 'i').test(page.source), `${where} Canonical nie wskazuje własnego adresu produkcyjnego.`);
  check(new RegExp(`<meta\\s+property="og:url"\\s+content="${page.url}"`, 'i').test(page.source), `${where} og:url nie wskazuje własnego adresu produkcyjnego.`);
  check(/class="skip-link"/i.test(page.source), `${where} Brakuje linku pomijającego nawigację.`);
  check(/<script[^>]+src="\/theme-init\.js"/i.test(page.source), `${where} Brakuje skryptu ustawiającego motyw przed renderem.`);
  check(count(page.source, /class="brand__mark"[^>]+src="\/assets\/logo-mark\.png"/gi) === 2, `${where} Nagłówek i stopka nie korzystają z aktualnego znaku marki.`);
  check(!/<script[^>]+src="https?:\/\//i.test(page.source), `${where} Strona ładuje zewnętrzny skrypt.`);
  check(!/<link[^>]+href="https?:\/\/[^"]+\.css/i.test(page.source), `${where} Strona ładuje zewnętrzny arkusz stylów.`);
  check(!/<style(?:\s|>)/i.test(page.source), `${where} Styl inline jest blokowany przez CSP.`);
  check(!/\[[^\]]+\]/.test(page.source), `${where} W publikowanym HTML pozostał placeholder w nawiasach kwadratowych.`);
  check(new RegExp(`property="og:image"\\s+content="${productionUrl}assets/og-card\\.png"`, 'i').test(page.source), `${where} Open Graph nie wskazuje bezwzględnego adresu obrazu PNG.`);

  const pageIds = new Set([...page.source.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, target] of page.source.matchAll(/href="#([\w-]+)"/g)) {
    check(pageIds.has(target), `${where} Odnośnik „#${target}” nie ma celu na stronie.`);
  }
}

// --- Wymagania tylko dla strony głównej ---
check(/<link\s+rel="icon"[^>]+href="\/assets\/logo-mark\.png"[^>]+type="image\/png"/i.test(html), 'Favicon nie korzysta z aktualnego znaku marki.');
check(count(html, /src="\/assets\/logo-web-design\.png"/gi) === 1, 'Pełne logo WEB DESIGN nie zostało osadzone dokładnie raz.');
check(!/nieoficjalny prototyp/i.test(html), 'Baner nieoficjalnego prototypu nie został usunięty.');
check(/Mikołaj Oczkowski/i.test(html), 'Brakuje potwierdzonego imienia i nazwiska.');
check(/href="mailto:mikolajoczkowski42@gmail\.com"/i.test(html), 'Brakuje prawidłowego linku mailto:.');
check(/href="tel:\+48452448277"/i.test(html), 'Brakuje klikalnego linku tel: do potwierdzonego numeru telefonu.');
check(count(html, /href="tel:\+48452448277"/gi) === 2, 'Telefon powinien być klikalny dokładnie w Kontakcie i w stopce.');

check(/<form[^>]+action="\/kontakt\.php"/i.test(html), 'Formularz nie wysyła danych do backendu /kontakt.php.');
check(/<form[^>]+method="POST"/i.test(html), 'Formularz nie używa metody POST.');
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

check(/prefers-reduced-motion:\s*reduce/i.test(css), 'Brakuje obsługi prefers-reduced-motion.');
check(/--focus:\s*#d86100/i.test(css), 'Brakuje kontrastowego koloru fokusu dla jasnych i ciemnych teł.');
check(/\.button--primary\s*\{[^}]*color:\s*var\(--ink\)/is.test(css), 'Główny przycisk nadal używa zbyt jasnego tekstu na pomarańczowym tle.');
check(/\.contact\s*\{[^}]*background:\s*var\(--accent-dark\)/is.test(css), 'Sekcja kontaktowa nadal ma zbyt jasne tło dla białego tekstu.');
check(/\.contact\s+:focus-visible\s*\{[^}]*outline-color:\s*var\(--surface\)/is.test(css), 'Sekcja kontaktowa nie ma widocznego fokusu.');
check(/\.site-nav\s*\{/i.test(css) && /\.js\s+\.site-nav/i.test(css), 'Nawigacja bez JavaScriptu nie ma jawnego fallbacku.');
check(/export function initNavigation/i.test(app), 'Logika nawigacji nie eksportuje initNavigation.');
check(/export function initReveal/i.test(app), 'Logika animacji nie eksportuje initReveal.');
check(/initNavigation\(document\)/i.test(main) && /initReveal\(document\)/i.test(main), 'Interakcje nie są inicjalizowane.');
check(!/document\.cookie|localStorage|sessionStorage|gtag\(|googletagmanager|facebook\.com\/tr|clarity\(|hotjar|matomo|mixpanel/i.test(`${html}\n${offer}\n${works}\n${app}\n${main}`), 'Strona zawiera mechanizm cookies, pamięci przeglądarki lub tracker bez obsługi zgody.');
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

for (const page of pages) {
  for (const phrase of banned) {
    check(!page.source.toLocaleLowerCase('pl').includes(phrase), `[${page.name}] Niedozwolony ogólnik lub niepotwierdzona obietnica: „${phrase}”.`);
  }
}

// --- Podstrony sprzedażowe ---
check(/appType:\s*'mpa'/.test(viteConfig), 'Vite nie jest w trybie wielostronicowym (appType: mpa).');
check(/oferta\/index\.html/.test(viteConfig) && /realizacje\/index\.html/.test(viteConfig), 'Konfiguracja Vite nie buduje obu podstron jako osobnych wejść.');
check(!/RewriteRule \^\([^)]*\b(oferta|realizacje)\b/i.test(securityHeaders), '.htaccess przekierowuje /oferta lub /realizacje na index.html zamiast serwować własną podstronę.');

check(count(offer, /<article class="package/gi) === 3, 'Strona oferty musi opisywać trzy zakresy pracy.');
check(count(offer, /class="tick-list"/gi) >= 3, 'Każdy zakres na stronie oferty musi wypisywać, co wchodzi w cenę.');
check(/class="cross-list"/.test(offer), 'Strona oferty nie wypisuje wprost, czego zakres nie obejmuje.');
check(/od 600 zł/.test(offer), 'Strona oferty nie zawiera potwierdzonej ceny wejściowej.');
check(!/\d[\d\s]*(?:–|-)\s*\d[\d\s]*\s*zł/.test(offer), 'Strona oferty zawiera widełki cenowe, których właściciel nie potwierdził.');
check(/3 do 21 dni/.test(offer), 'Strona oferty nie podaje potwierdzonego terminu realizacji.');
check(/kupujesz na własne konto|na własne konto/i.test(offer), 'Strona oferty nie wyjaśnia, że domena i hosting są kupowane na konto klienta.');
check(count(offer, /<details class="faq-item"/gi) >= 4, 'Strona oferty musi zawierać co najmniej cztery pytania.');

const demoSlugs = ['buddem', 'buddem-bez-animacji', 'krojnia', 'muzeum', 'muzeum-plakat', 'glow-room', 'drivenow', 'ostoja', 'meridian', 'perspektywa', 'piwonia', 'osada-pod-grania', 'puls', 'kwartal-lipowy'];
for (const slug of demoSlugs) {
  check(new RegExp(`href="${productionUrl}${slug}"`).test(works), `Galeria realizacji nie linkuje do dema „${slug}”.`);
}
check(count(works, /<article class="project-card"/gi) === demoSlugs.length, `Galeria realizacji musi zawierać dokładnie ${demoSlugs.length} kart.`);
check(count(works, /class="project-card__story"/gi) === demoSlugs.length, 'Każda realizacja musi opisywać zamysł, decyzję i efekt.');
check(/marka fikcyjna/i.test(works) && /class="disclaimer"/.test(works), 'Galeria realizacji nie zaznacza wprost, że wszystkie marki są zmyślone.');
check(/href="\/realizacje\/"/.test(html) && /href="\/oferta\/"/.test(html), 'Strona główna nie prowadzi do obu podstron.');
check(!/href="\/uslugi"|href="\/realizacje"(?!\/)/.test(`${html}\n${offer}\n${works}`), 'W nawigacji pozostał stary adres sekcji zamiast adresu podstrony.');

check(/Allow:\s*\//i.test(robots) && !/Disallow:\s*\//i.test(robots), 'robots.txt nie zezwala na indeksowanie strony produkcyjnej.');
check(new RegExp(`Sitemap:\\s*${productionUrl}sitemap\\.xml`, 'i').test(robots), 'robots.txt nie wskazuje produkcyjnej sitemapy.');
for (const page of pages) {
  check(sitemap.includes(`<loc>${page.url}</loc>`), `Sitemap nie wskazuje strony „${page.name}”.`);
}
check(count(sitemap, /<url>/gi) === pages.length, `Sitemap powinna zawierać dokładnie ${pages.length} indeksowane adresy.`);
check(/noindex,nofollow/i.test(thanks), 'Strona podziękowania musi mieć noindex,nofollow.');
check(/noindex,nofollow/i.test(notFound) && /Błąd 404/i.test(notFound), 'Własna strona 404 nie ma noindex lub prawidłowej treści.');
check(!/nieoficjalny prototyp/i.test(thanks), 'Strona podziękowania nadal opisuje formularz jako prototyp.');
check(count(`${thanks}\n${notFound}\n${privacy}`, /src="\/assets\/logo-mark\.png"/gi) === 3, 'Strony pomocnicze nie korzystają z aktualnego znaku marki.');
check(!/\/(?:logo|favicon)\.svg/i.test(`${html}\n${thanks}\n${notFound}\n${privacy}`), 'Publikowany HTML nadal odwołuje się do starego logo.');
check(/Mikołaj Oczkowski/i.test(privacy) && /mikolajoczkowski42@gmail\.com/i.test(privacy), 'Polityka prywatności nie zawiera danych administratora.');
check(/Hostinger/i.test(privacy) && /podmiotem przetwarzającym/i.test(privacy), 'Polityka prywatności nie opisuje przetwarzania formularza na serwerze Hostinger.');
check(/imię lub nazwę firmy/i.test(privacy), 'Polityka prywatności nie opisuje pola imienia lub nazwy firmy zgodnie z formularzem.');
check(/nie używa plików cookies/i.test(privacy) && /narzędzi analitycznych/i.test(privacy), 'Polityka prywatności nie opisuje braku cookies i analityki.');
check(!/\[[^\]]+\]/.test(`${thanks}\n${notFound}\n${privacy}\n${og}`), 'W publikowanych plikach pomocniczych pozostał placeholder w nawiasach kwadratowych.');

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
  'public/assets/project-buddem.svg',
  'public/assets/project-buddem-static.svg',
  'public/assets/project-krojnia.svg',
  'public/assets/project-muzeum.svg',
  'public/assets/project-muzeum-plakat.svg',
  'public/assets/project-glow-room.svg',
  'public/assets/project-drivenow.svg',
  'public/assets/project-ostoja.svg',
  'public/assets/project-meridian.svg',
  'public/assets/project-perspektywa.svg',
  'oferta/index.html',
  'realizacje/index.html',
  'vite.config.js',
  'scripts/check-powershell.ps1',
  'kontakt.config.example.php',
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
console.log(`- ${pages.length} indeksowane strony: własny canonical, og:url, opis i jeden h1: OK`);
console.log('- oferta: 3 zakresy z listą wykluczeń, tylko potwierdzone liczby: OK');
console.log(`- realizacje: ${demoSlugs.length} dem, każde z opisem decyzji i oznaczeniem marki fikcyjnej: OK`);
console.log('- produkcyjne SEO, sitemap, robots i brak placeholderów: OK');
console.log('- 3 usługi, co najmniej 4 pytania, polityka prywatności i backend PHP formularza: OK');
console.log('- odbiorca e-mail, limity pól, honeypot i nagłówki bezpieczeństwa w .htaccess: OK');
console.log('- kontrast, fallback bez JS, reduced-motion i dostępna nawigacja: OK');
console.log('- brak cookies, pamięci przeglądarki, trackerów i zewnętrznych zasobów: OK');
