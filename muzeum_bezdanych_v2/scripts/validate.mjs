import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const errors = [];

// Strona wielopodstronowa: ten sam zestaw reguł przechodzi każda z sześciu
// podstron. Marka jest fikcyjna, więc oznaczenia i zakaz prawdziwych danych
// muszą obowiązywać wszędzie, nie tylko na stronie głównej.
const pages = [
  "index.html",
  "wystawy.html",
  "wydarzenia.html",
  "kolekcje.html",
  "zwiedzanie.html",
  "kontakt.html",
];

const requiredFacts = [
  "Muzeum Miasta Lipowo",
  "Projekt demonstracyjny",
  "marka fikcyjna",
  "Dane przykładowe",
  "muzeumlipowo.example",
];

const prohibitedPhrases = [
  "najwyższa jakość",
  "indywidualne podejście",
  "kompleksowe rozwiązania",
  "innowacyjny",
  "nowy wymiar",
  "w dzisiejszym świecie",
  "lider rynku",
  "zmieniamy świat",
  "dedykowane rozwiązania",
  "przekraczamy oczekiwania",
];

// Istnienie lokalnego celu: pliki podstron leżą w katalogu głównym, a zasoby
// (obrazy, favicon) w public/.
function localExists(relPath) {
  const clean = relPath.replace(/^\.\//, "");
  return existsSync(resolve(projectRoot, clean)) || existsSync(resolve(projectRoot, "public", clean));
}

let hoverTiles = 0;
let plainTiles = 0;
const summaries = [];

for (const page of pages) {
  const pagePath = resolve(projectRoot, page);

  if (!existsSync(pagePath)) {
    errors.push(`Brak pliku strony: ${page}`);
    continue;
  }

  const html = readFileSync(pagePath, "utf8");
  const fail = (message) => errors.push(`${page}: ${message}`);
  const matches = (pattern) => [...html.matchAll(pattern)];

  const ids = matches(/\sid="([^"]+)"/g).map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) {
    fail(`powtórzone identyfikatory: ${[...new Set(duplicateIds)].join(", ")}`);
  }

  // Kotwice w obrębie strony (href="#id") muszą trafiać w istniejące ID.
  for (const match of matches(/href="#([^"]+)"/g)) {
    if (!ids.includes(match[1])) fail(`link prowadzi do brakującego ID: #${match[1]}`);
  }

  // Lokalne linki do innych podstron i zasobów (href/src="./...") muszą istnieć.
  for (const match of matches(/(?:href|src)="(\.\/[^":]+?)(#[^"]*)?"/g)) {
    if (!localExists(match[1])) fail(`lokalny cel nie istnieje: ${match[1]}`);
  }

  for (const match of matches(/aria-(?:controls|labelledby)="([^"]+)"/g)) {
    for (const referencedId of match[1].split(/\s+/)) {
      if (!ids.includes(referencedId)) fail(`ARIA wskazuje brakujące ID: ${referencedId}`);
    }
  }

  const h1Count = matches(/<h1(?:\s|>)/g).length;
  if (h1Count !== 1) fail(`oczekiwano jednego h1, znaleziono: ${h1Count}`);

  for (const match of matches(/<a\b([^>]*)target="_blank"([^>]*)>/g)) {
    const attributes = `${match[1]} ${match[2]}`;
    if (!/rel="[^"]*noopener[^"]*"/.test(attributes)) {
      fail(`link z target="_blank" bez rel="noopener": ${match[0]}`);
    }
  }

  for (const match of matches(/<img\b([^>]*)>/g)) {
    const attributes = match[1];
    const source = attributes.match(/src="([^"]+)"/)?.[1];
    if (!/\salt="[^"]*"/.test(` ${attributes}`)) {
      fail(`obraz bez atrybutu alt: ${source ?? "nieznane źródło"}`);
    }
    if (!/\swidth="\d+"/.test(` ${attributes}`) || !/\sheight="\d+"/.test(` ${attributes}`)) {
      fail(`obraz bez stałych wymiarów: ${source ?? "nieznane źródło"}`);
    }
    if (source?.startsWith("./") && !localExists(source)) {
      fail(`brak pliku obrazu: ${source}`);
    }
  }

  // Marka jest fikcyjna: oznaczenia muszą zostać na KAŻDEJ podstronie.
  for (const fact of requiredFacts) {
    if (!html.includes(fact)) fail(`brak wymaganego faktu lub oznaczenia: ${fact}`);
  }

  const lowered = html.toLocaleLowerCase("pl");
  for (const phrase of prohibitedPhrases) {
    if (lowered.includes(phrase)) fail(`znaleziono ogólnik z listy anty-slop: „${phrase}”`);
  }

  // Bezpieczeństwo portfolio: żadnego wybieralnego numeru ani odwołania do
  // cudzego serwisu — marka jest zmyślona, więc każdy taki cel byłby przypadkowy.
  const phoneLinks = matches(/href="tel:[^"]*"/g);
  if (phoneLinks.length) {
    fail(`marka fikcyjna nie może mieć działających linków tel: (${phoneLinks.length})`);
  }

  const externalLinks = matches(/(?:href|src)="(https?:\/\/[^"]+)"/g).map((match) => match[1]);
  if (externalLinks.length) {
    fail(`wykryto odwołanie zewnętrzne: ${[...new Set(externalLinks)].join(", ")}`);
  }

  const phoneShaped = matches(/(?:\+48[\s-]?)?\b\d{3}[\s-]\d{3}[\s-]\d{3}\b/g).map((m) => m[0]);
  if (phoneShaped.length) {
    fail(`ciąg wyglądający jak numer telefonu: ${[...new Set(phoneShaped)].join(", ")}`);
  }

  // Wersja bez animacji wejścia — nakładka intro nie może się pojawić.
  if (/data-intro|intro-overlay|intro-skip/.test(html)) {
    fail("wykryto ślad nakładki animacji wejścia (ta wersja jej nie ma)");
  }

  // Kafelki z ruchem po najechaniu: zliczamy globalnie, żeby potwierdzić, że
  // CZĘŚĆ kafelków ma efekt, a CZĘŚĆ nie (wymaganie „nie na wszystkich”).
  for (const match of matches(/class="([^"]*\btile\b[^"]*)"/g)) {
    const tokens = match[1].split(/\s+/);
    if (tokens.includes("tile--hover")) hoverTiles += 1;
    else if (tokens.includes("tile")) plainTiles += 1;
  }

  summaries.push({ page, ids: ids.length, h1: h1Count });
}

// --- Reguły wspólne dla całej strony (nie per-podstrona) ---

if (hoverTiles === 0) {
  errors.push("brak kafelków z efektem po najechaniu (klasa .tile--hover)");
}
if (plainTiles === 0) {
  errors.push("brak zwykłych kafelków bez efektu — efekt ma dotyczyć tylko części");
}

const styles = readFileSync(resolve(projectRoot, "src/styles.css"), "utf8");
const appSource = readFileSync(resolve(projectRoot, "src/app.js"), "utf8");

// Brak @keyframes = nic nie animuje się samo z siebie przy wczytaniu strony.
const keyframes = [...styles.matchAll(/@keyframes\b/g)].length;
if (keyframes !== 0) {
  errors.push(`styles.css: znaleziono ${keyframes} reguł @keyframes — strona nie powinna nic animować samoczynnie`);
}
if (!/\.tile--hover:hover/.test(styles)) {
  errors.push("styles.css: brak reguły .tile--hover:hover — efekt po najechaniu zniknął");
}
if (!/prefers-reduced-motion/.test(styles)) {
  errors.push("styles.css: brak osłony prefers-reduced-motion dla efektu najechania");
}
if (/initIntro|intro-active|data-intro|sessionStorage/.test(appSource)) {
  errors.push("src/app.js: został ślad kodu animacji wejścia / trwałego stanu sesji");
}

if (errors.length) {
  console.error("Walidacja nieudana:\n- " + errors.join("\n- "));
  process.exit(1);
}

for (const summary of summaries) {
  console.log(`Walidacja OK — ${summary.page}: ${summary.h1} h1, ${summary.ids} unikalnych ID.`);
}
console.log(
  `Kafelki z ruchem po najechaniu: ${hoverTiles}; kafelki nieruchome: ${plainTiles}. `
  + "Brak linków tel: i zewnętrznych, brak @keyframes, brak nakładki intro.",
);
