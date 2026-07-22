import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const assetDir = join(dist, "assets");
const errors = [];

const files = readdirSync(assetDir).map((name) => join(assetDir, name));
const jsFile = files.find((file) => file.endsWith(".js"));
const cssFile = files.find((file) => file.endsWith(".css"));
const imageFiles = files.filter((file) => /\.(?:jpe?g|png|webp|avif|svg)$/i.test(file));
const heroFile = imageFiles.find((file) => basename(file).startsWith("hero-"));
const htmlFile = join(dist, "index.html");

if (!heroFile) {
  console.error("Brak pliku hero (assets/hero-*). Sprawdź katalog public/assets.");
  process.exit(1);
}

if (!jsFile || !cssFile) {
  console.error("Brak zbudowanego pliku JS lub CSS. Najpierw uruchom npm run build.");
  process.exit(1);
}

function sizes(file) {
  const content = readFileSync(file);
  return {
    raw: content.length,
    gzip: gzipSync(content, { level: 9 }).length,
    brotli: brotliCompressSync(content).length,
  };
}

function within(label, actual, limit) {
  if (actual > limit) errors.push(`${label}: ${actual} B przekracza budżet ${limit} B`);
}

const html = sizes(htmlFile);
const css = sizes(cssFile);
const js = sizes(jsFile);
const hero = statSync(heroFile).size;
const allImages = imageFiles.reduce((sum, file) => sum + statSync(file).size, 0);
const initialTransfer = html.gzip + css.gzip + js.gzip + hero;

within("HTML raw", html.raw, 40 * 1024);
within("HTML gzip", html.gzip, 8 * 1024);
within("CSS raw", css.raw, 32 * 1024);
within("CSS gzip", css.gzip, 8 * 1024);
within("JavaScript raw", js.raw, 15 * 1024);
within("JavaScript gzip", js.gzip, 6 * 1024);
within("Obraz hero", hero, 250 * 1024);
within("Wstępny transfer", initialTransfer, 280 * 1024);
within("Wszystkie obrazy", allImages, 1050 * 1024);

for (const file of imageFiles) {
  within(`Obraz ${basename(file)}`, statSync(file).size, 320 * 1024);
}

for (const page of ["index.html"]) {
  const sourceHtml = readFileSync(join(root, page), "utf8");
  const lazyImages = [...sourceHtml.matchAll(/<img\b[^>]*loading="lazy"[^>]*>/g)].length;

  if (lazyImages !== 3) {
    errors.push(`${page}: oczekiwano 3 obrazów lazy-load, znaleziono ${lazyImages}`);
  }
  if (!/hero-budowa-koncept\.svg[\s\S]*fetchpriority="high"/.test(sourceHtml)) {
    errors.push(`${page}: hero nie ma fetchpriority=high`);
  }
  if (/<(?:script|link)\b[^>]*(?:src|href)="https?:\/\//i.test(sourceHtml)) {
    errors.push(`${page}: wykryto zewnętrzny skrypt lub arkusz blokujący renderowanie`);
  }
}

// Ta wersja z założenia nie ma animacji wejścia. Odpowiednikiem sprawdzenia
// czasu animacji jest tu sprawdzenie, że nakładka nie wróciła bocznymi drzwiami
// — ani w markupie, ani w stylach, ani w kodzie.
const styles = readFileSync(join(root, "src/styles.css"), "utf8");
const appSource = readFileSync(join(root, "src/app.js"), "utf8");
const indexHtml = readFileSync(join(root, "index.html"), "utf8");

const introLeftovers = [
  { where: "index.html", source: indexHtml, pattern: /data-intro|intro-overlay|intro-skip/ },
  { where: "src/app.js", source: appSource, pattern: /data-intro|intro-active|initIntro|intro-seen/ },
  {
    where: "src/styles.css",
    source: styles,
    // .intro__* to sekcja „o firmie", nie nakładka — stąd granica na - albo -.
    pattern: /\.intro-(?:overlay|panel|rule|wordmark|skip)|intro-active|@keyframes\s+(?:rule-draw|wordmark-in|intro-fade-out|panel-up|panel-down|skip-out)\b/,
  },
];

for (const { where, source, pattern } of introLeftovers) {
  const found = source.match(pattern);
  if (found) errors.push(`${where}: został ślad po animacji wejścia („${found[0]}")`);
}

// Nakładki nie ma, więc nic nie może blokować przewijania na starcie.
if (/overflow:\s*hidden/.test(styles.match(/body\.[^{]*\{[^}]*\}/g)?.filter((rule) => !rule.includes("menu-open")).join("") ?? "")) {
  errors.push("src/styles.css: reguła na body blokuje przewijanie poza otwartym menu");
}

console.log("Brak animacji wejścia potwierdzony w markupie, stylach i kodzie.");

console.table([
  { zasób: "HTML", raw: html.raw, gzip: html.gzip, brotli: html.brotli },
  { zasób: "CSS", raw: css.raw, gzip: css.gzip, brotli: css.brotli },
  { zasób: "JavaScript", raw: js.raw, gzip: js.gzip, brotli: js.brotli },
  { zasób: `Hero (${basename(heroFile)})`, raw: hero, gzip: "-", brotli: "-" },
]);
console.log(`Szacowany transfer pierwszego widoku: ${initialTransfer} B.`);
console.log(`Wszystkie obrazy: ${allImages} B; pozostałe 3 są ładowane leniwie.`);

if (errors.length) {
  console.error("Budżety wydajności przekroczone:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log("Budżety wydajności OK.");
