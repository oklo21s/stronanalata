import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { makeVariant } from "./variant.mjs";

const projectRoot = resolve(import.meta.dirname, "..");
const errors = [];

// Obie wersje strony przechodzą ten sam zestaw reguł. Różnią się wyłącznie
// obecnością nakładki animacji — pilnuje tego osobna reguła na końcu.
const pages = ["index.html", "bez-intro.html"];

const requiredFacts = [
  "BudDem",
  "Projekt demonstracyjny",
  "marka fikcyjna",
  "Dane przykładowe",
  "buddem.example",
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

const summaries = [];

for (const page of pages) {
  const pagePath = resolve(projectRoot, page);

  if (!existsSync(pagePath)) {
    errors.push(`Brak pliku strony: ${page} — uruchom node scripts/build-variant.mjs`);
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

  for (const match of matches(/href="#([^"]+)"/g)) {
    if (!ids.includes(match[1])) fail(`link prowadzi do brakującego ID: #${match[1]}`);
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
    if (source?.startsWith("./")) {
      const publicPath = resolve(projectRoot, "public", source.slice(2));
      if (!existsSync(publicPath)) fail(`brak pliku obrazu: ${source}`);
    }
  }

  // Marka jest fikcyjna: te oznaczenia muszą zostać na obu stronach, żeby nikt
  // nie wziął dema za wizytówkę istniejącej firmy.
  for (const fact of requiredFacts) {
    if (!html.includes(fact)) fail(`brak wymaganego faktu lub oznaczenia: ${fact}`);
  }

  const lowered = html.toLocaleLowerCase("pl");
  for (const phrase of prohibitedPhrases) {
    if (lowered.includes(phrase)) fail(`znaleziono ogólnik z listy anty-slop: „${phrase}”`);
  }

  // Bezpieczeństwo portfolio: demo nie może wybierać żadnego numeru ani
  // prowadzić do cudzego serwisu, bo marka jest zmyślona i każdy taki cel
  // byłby przypadkowy.
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

  const counters = matches(/data-count-to="/g).length;
  const areaCards = matches(/class="area-card"/g).length;
  if (counters !== 8) fail(`oczekiwano 8 liczników, znaleziono ${counters}`);
  if (areaCards !== 6) fail(`oczekiwano 6 kart obszarów, znaleziono ${areaCards}`);

  summaries.push({ page, ids: ids.length, counters, areaCards });
}

// Jedyna dozwolona różnica między wersjami.
const withIntro = readFileSync(resolve(projectRoot, "index.html"), "utf8");
const withoutIntro = existsSync(resolve(projectRoot, "bez-intro.html"))
  ? readFileSync(resolve(projectRoot, "bez-intro.html"), "utf8")
  : "";

if (!withIntro.includes("data-intro")) {
  errors.push("index.html: zniknęła nakładka animacji wejścia");
}
if (withoutIntro.includes("data-intro")) {
  errors.push("bez-intro.html: została nakładka animacji wejścia");
}

// Wariant musi być dokładnie tym, co wyprodukowałby generator z bieżącego
// index.html — inaczej ktoś zmienił treść i zapomniał go przegenerować.
const expected = makeVariant(withIntro);

if (expected.problems.length) {
  errors.push(`nie da się odtworzyć wariantu z index.html: ${expected.problems.join("; ")}`);
} else if (expected.variant !== withoutIntro) {
  errors.push(
    "bez-intro.html rozjechał się z index.html — uruchom node scripts/build-variant.mjs",
  );
}

if (errors.length) {
  console.error("Walidacja nieudana:\n- " + errors.join("\n- "));
  process.exit(1);
}

for (const summary of summaries) {
  console.log(
    `Walidacja OK — ${summary.page}: 1 h1, ${summary.ids} unikalnych ID, `
    + `${summary.areaCards} otwartych kart, ${summary.counters} liczników, `
    + "brak linków tel: i zewnętrznych, test anty-slop.",
  );
}
console.log("Różnica między wersjami ogranicza się do nakładki animacji wejścia.");
